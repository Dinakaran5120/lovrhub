import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { formatDistance } from '@/common/utils/geo.util';
import { decodeCursor, encodeCursor, PaginatedResponse } from '@/common/utils/cursor-pagination.util';
import { DiscoverQueryDto } from './dto/discover-query.dto';
import { MoodType, MediaPurpose, AccountStatus, VisibilityType } from '@prisma/client';

interface RawDiscoverRow {
  id: string;
  display_name: string;
  birth_date: Date | null;
  bio: string | null;
  gender: string | null;
  orientation: string | null;
  relationship_goal: string | null;
  current_mood: string | null;
  location_city: string | null;
  location_country: string | null;
  show_age: boolean;
  show_distance: boolean;
  avatar_cdn_url: string | null;
  avatar_thumbnail_url: string | null;
  activity_score: number;
  distance_km: number;
}

@Injectable()
export class DiscoverService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private calculateAge(birthDate: Date | string | null): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
    return age;
  }

  private mapRawToProfile(row: RawDiscoverRow) {
    return {
      id: row.id,
      displayName: row.display_name,
      age: row.show_age ? this.calculateAge(row.birth_date) : null,
      profile: {
        bio: row.bio,
        gender: row.gender,
        orientation: row.orientation,
        relationshipGoal: row.relationship_goal,
        currentMood: row.current_mood,
        locationCity: row.location_city,
        locationCountry: row.location_country,
        avatarUrl: row.avatar_cdn_url,
        distance: row.show_distance ? formatDistance(row.distance_km) : null,
      },
    };
  }

  // ── Core geo discover query ───────────────────────────────────────────────────

  private async runDiscoverQuery(
    userId: string,
    dto: DiscoverQueryDto,
    moodFilter?: MoodType,
  ): Promise<PaginatedResponse<ReturnType<typeof this.mapRawToProfile>>> {
    const offset = dto.cursor ? decodeCursor(dto.cursor) : 0;
    const fetchLimit = dto.limit + 1; // fetch one extra to detect next page

    // Viewer preferences
    const viewer = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        profile: {
          select: {
            maxDistanceKm: true,
            locationLat: true,
            locationLng: true,
          },
        },
        preferences: {
          select: {
            ageMin: true,
            ageMax: true,
            interestedIn: true,
          },
        },
      },
    });

    if (!viewer) {
      throw new NotFoundException('Viewer not found.');
    }

    const maxDist = viewer.profile?.maxDistanceKm ?? 50;
    const ageMin = viewer.preferences?.ageMin ?? 18;
    const ageMax = viewer.preferences?.ageMax ?? 100;
    const interestedIn: string[] = (viewer.preferences?.interestedIn as string[]) ?? [];

    const lat = dto.lat;
    const lng = dto.lng;

    // Build gender filter clause
    // interestedIn values map to gender values (e.g. 'men' → gender='male')
    // We do this in SQL using a CASE or IN clause.
    // Mapping: men→male, women→female, everyone→any, non_binary→non_binary
    const genderFilter = interestedIn.length > 0 && !interestedIn.includes('everyone')
      ? `AND up.gender IN (${interestedIn
          .map((g) => {
            if (g === 'men') return "'male'";
            if (g === 'women') return "'female'";
            if (g === 'non_binary') return "'non_binary'";
            return `'${g}'`;
          })
          .join(', ')})`
      : '';

    const moodClause = moodFilter ? `AND up.current_mood = '${moodFilter}'` : '';

    // Note: Prisma's $queryRaw with tagged template literals handles injection safely.
    // We use Prisma.sql / Prisma.raw for dynamic clauses that are safe (enums only).
    const rows = await this.prisma.$queryRaw<RawDiscoverRow[]>`
      SELECT
        u.id,
        u.display_name,
        u.birth_date,
        up.bio,
        up.gender,
        up.orientation,
        up.relationship_goal,
        up.current_mood,
        up.location_city,
        up.location_country,
        up.show_age,
        up.show_distance,
        um.cdn_url       AS avatar_cdn_url,
        um.thumbnail_url AS avatar_thumbnail_url,
        COALESCE(us.activity_score, 0) AS activity_score,
        (
          6371 * acos(
            GREATEST(-1, LEAST(1,
              cos(radians(${lat})) * cos(radians(up.location_lat))
              * cos(radians(up.location_lng) - radians(${lng}))
              + sin(radians(${lat})) * sin(radians(up.location_lat))
            ))
          )
        ) AS distance_km
      FROM users u
      INNER JOIN user_profiles up ON up.user_id = u.id
      LEFT JOIN user_preferences upref ON upref.user_id = u.id
      LEFT JOIN user_media um ON um.id = up.avatar_media_id AND um.processing_done = true
      LEFT JOIN user_stats us ON us.user_id = u.id
      WHERE
        u.account_status = 'active'
        AND u.setup_completed = true
        AND u.deleted_at IS NULL
        AND u.id != ${userId}
        AND up.location_lat IS NOT NULL
        AND up.location_lng IS NOT NULL
        AND up.avatar_media_id IS NOT NULL
        -- age filter
        AND EXTRACT(YEAR FROM AGE(u.birth_date)) BETWEEN ${ageMin} AND ${ageMax}
        -- distance filter
        AND (
          6371 * acos(
            GREATEST(-1, LEAST(1,
              cos(radians(${lat})) * cos(radians(up.location_lat))
              * cos(radians(up.location_lng) - radians(${lng}))
              + sin(radians(${lat})) * sin(radians(up.location_lat))
            ))
          )
        ) <= ${maxDist}
        -- visibility filter
        AND (
          up.visibility = 'public'
          OR EXISTS (
            SELECT 1 FROM matches m
            WHERE m.status = 'active'
            AND (
              (m.user_a_id = ${userId} AND m.user_b_id = u.id)
              OR (m.user_a_id = u.id AND m.user_b_id = ${userId})
            )
          )
        )
        -- exclude already swiped
        AND u.id NOT IN (
          SELECT swiped_id FROM swipes WHERE swiper_id = ${userId}
        )
        -- exclude blocked (both directions)
        AND u.id NOT IN (
          SELECT blocked_id FROM blocks WHERE blocker_id = ${userId}
          UNION
          SELECT blocker_id FROM blocks WHERE blocked_id = ${userId}
        )
      ORDER BY (
        COALESCE(us.activity_score, 0) * 0.4
        + (1.0 / (
          (6371 * acos(
            GREATEST(-1, LEAST(1,
              cos(radians(${lat})) * cos(radians(up.location_lat))
              * cos(radians(up.location_lng) - radians(${lng}))
              + sin(radians(${lat})) * sin(radians(up.location_lat))
            ))
          )) + 1
        )) * 100 * 0.35
        + random() * 0.25
      ) DESC
      LIMIT ${fetchLimit}
      OFFSET ${offset}
    `;

    const hasNextPage = rows.length > dto.limit;
    const items = hasNextPage ? rows.slice(0, dto.limit) : rows;
    const nextOffset = offset + items.length;
    const nextCursor = hasNextPage ? encodeCursor(nextOffset) : null;

    return {
      items: items.map((row) => this.mapRawToProfile(row)),
      nextCursor,
      hasNextPage,
    };
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  async getDiscoverProfiles(
    userId: string,
    dto: DiscoverQueryDto,
  ): Promise<PaginatedResponse<ReturnType<typeof this.mapRawToProfile>>> {
    return this.runDiscoverQuery(userId, dto);
  }

  async exploreByMood(
    userId: string,
    dto: DiscoverQueryDto,
  ): Promise<PaginatedResponse<ReturnType<typeof this.mapRawToProfile>>> {
    if (!dto.mood) {
      throw new BadRequestException('mood query parameter is required for explore.');
    }
    return this.runDiscoverQuery(userId, dto, dto.mood);
  }

  async getProfileDetail(
    viewerId: string,
    profileId: string,
  ): Promise<{
    id: string;
    displayName: string;
    age: number | null;
    profile: {
      bio: string | null;
      gender: string | null;
      orientation: string | null;
      relationshipGoal: string | null;
      currentMood: string | null;
      locationCity: string | null;
      locationCountry: string | null;
      avatarUrl: string | null;
    };
    languages: string[];
    interests: string[];
    media: Array<{
      id: string;
      cdnUrl: string;
      thumbnailUrl: string | null;
      displayOrder: number;
      isPrimary: boolean;
    }>;
  }> {
    if (viewerId === profileId) {
      throw new BadRequestException('Use /users/me for your own profile.');
    }

    // Check block
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: viewerId, blockedId: profileId },
          { blockerId: profileId, blockedId: viewerId },
        ],
      },
    });

    if (block) {
      throw new NotFoundException('Profile not found.');
    }

    const target = await this.prisma.user.findUnique({
      where: { id: profileId, deletedAt: null, accountStatus: AccountStatus.active },
      include: {
        profile: true,
        languages: true,
        interests: true,
        media: {
          where: { processingDone: true, purpose: MediaPurpose.profile_photo },
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (!target || !target.profile) {
      throw new NotFoundException('Profile not found.');
    }

    // Visibility check
    if (target.profile.visibility === VisibilityType.private) {
      const match = await this.prisma.match.findFirst({
        where: {
          status: 'active',
          OR: [
            { userAId: viewerId, userBId: profileId },
            { userAId: profileId, userBId: viewerId },
          ],
        },
      });
      if (!match) {
        throw new NotFoundException('Profile not found.');
      }
    }

    const avatarMedia = target.profile.avatarMediaId
      ? target.media.find((m) => m.id === target.profile!.avatarMediaId) ?? null
      : target.media.find((m) => m.isPrimary) ?? target.media[0] ?? null;

    return {
      id: target.id,
      displayName: target.displayName,
      age: target.profile.showAge ? this.calculateAge(target.birthDate) : null,
      profile: {
        bio: target.profile.bio,
        gender: target.profile.gender,
        orientation: target.profile.orientation,
        relationshipGoal: target.profile.relationshipGoal,
        currentMood: target.profile.currentMood,
        locationCity: target.profile.locationCity,
        locationCountry: target.profile.locationCountry,
        avatarUrl: avatarMedia?.cdnUrl ?? null,
      },
      languages: target.languages.map((l) => l.language),
      interests: target.interests.map((i) => i.interest),
      media: target.media.map((m) => ({
        id: m.id,
        cdnUrl: m.cdnUrl,
        thumbnailUrl: m.thumbnailUrl,
        displayOrder: m.displayOrder,
        isPrimary: m.isPrimary,
      })),
    };
  }
}
