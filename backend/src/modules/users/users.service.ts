import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  VisibilityType,
  MoodType,
  MediaPurpose,
  AccountStatus,
  InterestedInType,
} from '@prisma/client';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { calculateDistance, formatDistance } from '@/common/utils/geo.util';

export interface UserMeResponse {
  id: string;
  displayName: string;
  email: string;
  phone: string | null;
  accountStatus: string;
  subscriptionTier: string;
  isVerified: boolean;
  isAdmin: boolean;
  setupCompleted: boolean;
  setupStep: number;
  lastActiveAt: Date | null;
  age: number | null;
  profile: {
    bio: string | null;
    gender: string | null;
    orientation: string | null;
    relationshipGoal: string | null;
    visibility: string;
    currentMood: string | null;
    locationCity: string | null;
    locationCountry: string | null;
    maxDistanceKm: number;
    showDistance: boolean;
    showAge: boolean;
    avatarUrl: string | null;
  } | null;
  preferences: {
    interestedIn: string[];
    ageMin: number;
    ageMax: number;
  } | null;
  languages: string[];
  interests: string[];
  stats: {
    totalMatches: number;
    totalLikesReceived: number;
    totalChats: number;
    profileViews: number;
    activityScore: number;
  } | null;
}

export interface PublicProfileResponse {
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
    distance: string | null;
  };
  languages: string[];
  interests: string[];
  media: Array<{
    id: string;
    cdnUrl: string;
    thumbnailUrl: string | null;
    widthPx: number | null;
    heightPx: number | null;
    displayOrder: number;
    isPrimary: boolean;
  }>;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateAge(birthDate: Date | string | null): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age -= 1;
    }
    return age;
  }

  private validateAge(birthDate: string): void {
    const age = this.calculateAge(birthDate);
    if (age === null || age < 18) {
      throw new BadRequestException('You must be at least 18 years old to use this app.');
    }
  }

  async getMe(userId: string): Promise<UserMeResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        profile: true,
        preferences: true,
        languages: true,
        interests: true,
        stats: true,
        media: {
          where: { processingDone: true },
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const avatarMedia = user.profile?.avatarMediaId
      ? user.media.find((m) => m.id === user.profile!.avatarMediaId) ?? null
      : user.media.find((m) => m.purpose === MediaPurpose.profile_photo && m.isPrimary) ?? null;

    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      accountStatus: user.accountStatus,
      subscriptionTier: user.subscriptionTier,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      setupCompleted: user.setupCompleted,
      setupStep: user.setupStep,
      lastActiveAt: user.lastActiveAt,
      age: this.calculateAge(user.birthDate),
      profile: user.profile
        ? {
            bio: user.profile.bio,
            gender: user.profile.gender,
            orientation: user.profile.orientation,
            relationshipGoal: user.profile.relationshipGoal,
            visibility: user.profile.visibility,
            currentMood: user.profile.currentMood,
            locationCity: user.profile.locationCity,
            locationCountry: user.profile.locationCountry,
            maxDistanceKm: user.profile.maxDistanceKm,
            showDistance: user.profile.showDistance,
            showAge: user.profile.showAge,
            avatarUrl: avatarMedia?.cdnUrl ?? null,
          }
        : null,
      preferences: user.preferences
        ? {
            interestedIn: user.preferences.interestedIn,
            ageMin: user.preferences.ageMin,
            ageMax: user.preferences.ageMax,
          }
        : null,
      languages: user.languages.map((l) => l.language),
      interests: user.interests.map((i) => i.interest),
      stats: user.stats
        ? {
            totalMatches: user.stats.totalMatches,
            totalLikesReceived: user.stats.totalLikesReceived,
            totalChats: user.stats.totalChats,
            profileViews: user.stats.profileViews,
            activityScore: user.stats.activityScore,
          }
        : null,
    };
  }

  async getProfile(
    viewerId: string,
    targetUserId: string,
  ): Promise<PublicProfileResponse> {
    if (viewerId === targetUserId) {
      throw new BadRequestException('Use /users/me for your own profile.');
    }

    // Check blocks in both directions
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: viewerId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: viewerId },
        ],
      },
    });

    if (block) {
      throw new NotFoundException('User not found.');
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId, deletedAt: null, accountStatus: AccountStatus.active },
      include: {
        profile: true,
        languages: true,
        interests: true,
        media: {
          where: {
            processingDone: true,
            purpose: MediaPurpose.profile_photo,
          },
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (!target || !target.profile) {
      throw new NotFoundException('User not found.');
    }

    // Check visibility
    if (target.profile.visibility === VisibilityType.private) {
      const match = await this.prisma.match.findFirst({
        where: {
          status: 'active',
          OR: [
            { userAId: viewerId, userBId: targetUserId },
            { userAId: targetUserId, userBId: viewerId },
          ],
        },
      });
      if (!match) {
        throw new NotFoundException('User not found.');
      }
    }

    // Increment profile views
    await this.prisma.userStat.upsert({
      where: { userId: targetUserId },
      create: {
        userId: targetUserId,
        profileViews: 1,
        totalMatches: 0,
        totalLikesReceived: 0,
        totalChats: 0,
        activityScore: 0,
      },
      update: {
        profileViews: { increment: 1 },
      },
    });

    // Compute distance if showDistance
    let distanceStr: string | null = null;
    if (target.profile.showDistance) {
      const viewerProfile = await this.prisma.userProfile.findUnique({
        where: { userId: viewerId },
        select: { locationLat: true, locationLng: true },
      });
      if (
        viewerProfile?.locationLat != null &&
        viewerProfile?.locationLng != null &&
        target.profile.locationLat != null &&
        target.profile.locationLng != null
      ) {
        const distKm = calculateDistance(
          viewerProfile.locationLat,
          viewerProfile.locationLng,
          target.profile.locationLat,
          target.profile.locationLng,
        );
        distanceStr = formatDistance(distKm);
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
        distance: distanceStr,
      },
      languages: target.languages.map((l) => l.language),
      interests: target.interests.map((i) => i.interest),
      media: target.media.map((m) => ({
        id: m.id,
        cdnUrl: m.cdnUrl,
        thumbnailUrl: m.thumbnailUrl,
        widthPx: m.widthPx,
        heightPx: m.heightPx,
        displayOrder: m.displayOrder,
        isPrimary: m.isPrimary,
      })),
    };
  }

  async updateProfileStep(
    userId: string,
    step: string,
    data: Record<string, any>,
  ): Promise<{ setupStep: number; setupCompleted: boolean }> {
    const stepOrder = [
      'basic',
      'gender',
      'orientation',
      'interested_in',
      'relationship',
      'languages',
      'interests',
      'photo',
    ];
    const stepIndex = stepOrder.indexOf(step);
    if (stepIndex === -1) {
      throw new BadRequestException(`Unknown setup step: ${step}`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { setupStep: true, setupCompleted: true },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    switch (step) {
      case 'basic': {
        const { displayName, birthDate } = data as {
          displayName: string;
          birthDate: string;
        };
        this.validateAge(birthDate);
        await this.prisma.$transaction([
          this.prisma.user.update({
            where: { id: userId },
            data: {
              displayName,
              birthDate: new Date(birthDate),
            },
          }),
          this.prisma.userProfile.upsert({
            where: { userId },
            create: { userId },
            update: {},
          }),
        ]);
        break;
      }

      case 'gender': {
        const { gender } = data as { gender: string };
        await this.prisma.userProfile.upsert({
          where: { userId },
          create: { userId, gender: gender as any },
          update: { gender: gender as any },
        });
        break;
      }

      case 'orientation': {
        const { orientation } = data as { orientation: string };
        await this.prisma.userProfile.upsert({
          where: { userId },
          create: { userId, orientation: orientation as any },
          update: { orientation: orientation as any },
        });
        break;
      }

      case 'interested_in': {
        const { interestedIn } = data as { interestedIn: string[] };
        await this.prisma.userPreference.upsert({
          where: { userId },
          create: { userId, interestedIn: interestedIn as InterestedInType[] },
          update: { interestedIn: interestedIn as InterestedInType[] },
        });
        break;
      }

      case 'relationship': {
        const { relationshipGoal } = data as { relationshipGoal: string };
        await this.prisma.userProfile.upsert({
          where: { userId },
          create: { userId, relationshipGoal: relationshipGoal as any },
          update: { relationshipGoal: relationshipGoal as any },
        });
        break;
      }

      case 'languages': {
        const { languages } = data as { languages: string[] };
        await this.prisma.$transaction([
          this.prisma.userLanguage.deleteMany({ where: { userId } }),
          this.prisma.userLanguage.createMany({
            data: languages.map((language) => ({ userId, language })),
          }),
        ]);
        break;
      }

      case 'interests': {
        const { interests } = data as { interests: string[] };
        await this.prisma.$transaction([
          this.prisma.userInterest.deleteMany({ where: { userId } }),
          this.prisma.userInterest.createMany({
            data: interests.map((interest) => ({ userId, interest })),
          }),
        ]);
        break;
      }

      case 'photo': {
        // Avatar is set via media upload flow; just advance step
        break;
      }

      default:
        throw new BadRequestException(`Unknown setup step: ${step}`);
    }

    const nextStep = stepIndex + 1;
    const isLastStep = stepIndex === stepOrder.length - 1;
    const setupCompleted = isLastStep;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        setupStep: Math.max(user.setupStep, nextStep),
        ...(setupCompleted && { setupCompleted: true }),
      },
      select: { setupStep: true, setupCompleted: true },
    });

    return { setupStep: updated.setupStep, setupCompleted: updated.setupCompleted };
  }

  async updateBio(userId: string, bio?: string): Promise<void> {
    await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, bio: bio ?? null },
      update: { bio: bio ?? null },
    });
  }

  async updateVisibility(userId: string, visibility: VisibilityType): Promise<void> {
    await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, visibility },
      update: { visibility },
    });
  }

  async updateLocation(
    userId: string,
    lat: number,
    lng: number,
    cityHint?: string,
    countryHint?: string,
  ): Promise<void> {
    // In production, reverse-geocode via an external API (e.g. Google Maps, Nominatim).
    // We store coordinates immediately; city/country are optional hints or resolved async.
    await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        locationLat: lat,
        locationLng: lng,
        locationCity: cityHint ?? null,
        locationCountry: countryHint ?? null,
      },
      update: {
        locationLat: lat,
        locationLng: lng,
        ...(cityHint !== undefined && { locationCity: cityHint }),
        ...(countryHint !== undefined && { locationCountry: countryHint }),
      },
    });
  }

  async updateMood(userId: string, mood?: MoodType | null): Promise<void> {
    await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, currentMood: mood ?? null },
      update: { currentMood: mood ?? null },
    });
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto): Promise<void> {
    const profileUpdates: Record<string, any> = {};
    const preferenceUpdates: Record<string, any> = {};

    if (dto.maxDistanceKm !== undefined) profileUpdates.maxDistanceKm = dto.maxDistanceKm;
    if (dto.showAge !== undefined) profileUpdates.showAge = dto.showAge;
    if (dto.showDistance !== undefined) profileUpdates.showDistance = dto.showDistance;
    if (dto.ageMin !== undefined) preferenceUpdates.ageMin = dto.ageMin;
    if (dto.ageMax !== undefined) preferenceUpdates.ageMax = dto.ageMax;

    const ops: Promise<any>[] = [];

    if (Object.keys(profileUpdates).length > 0) {
      ops.push(
        this.prisma.userProfile.upsert({
          where: { userId },
          create: { userId, ...profileUpdates },
          update: profileUpdates,
        }),
      );
    }

    if (Object.keys(preferenceUpdates).length > 0) {
      ops.push(
        this.prisma.userPreference.upsert({
          where: { userId },
          create: { userId, ...preferenceUpdates },
          update: preferenceUpdates,
        }),
      );
    }

    if (ops.length > 0) {
      await Promise.all(ops);
    }
  }

  async setAvatar(userId: string, mediaId: string): Promise<void> {
    const media = await this.prisma.userMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media not found.');
    }

    if (media.userId !== userId) {
      throw new ForbiddenException('This media does not belong to you.');
    }

    if (media.purpose !== MediaPurpose.profile_photo) {
      throw new BadRequestException('Media must have purpose "profile_photo" to be used as an avatar.');
    }

    if (!media.processingDone) {
      throw new BadRequestException('Media upload is still processing. Please try again shortly.');
    }

    await this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, avatarMediaId: mediaId },
      update: { avatarMediaId: mediaId },
    });
  }

  async getBlockedUsers(userId: string): Promise<
    Array<{
      blockId: string;
      blockedAt: Date;
      user: { id: string; displayName: string; avatarUrl: string | null };
    }>
  > {
    const blocks = await this.prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: {
            id: true,
            displayName: true,
            profile: {
              select: {
                avatarMediaId: true,
              },
            },
            media: {
              where: { processingDone: true, purpose: MediaPurpose.profile_photo },
              orderBy: { isPrimary: 'desc' },
              take: 1,
              select: { cdnUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blocks.map((block) => ({
      blockId: block.id,
      blockedAt: block.createdAt,
      user: {
        id: block.blocked.id,
        displayName: block.blocked.displayName,
        avatarUrl: block.blocked.media[0]?.cdnUrl ?? null,
      },
    }));
  }

  async updateLastActive(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });
  }

  async deleteAccount(userId: string): Promise<void> {
    const now = new Date();
    const purgeAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: now,
        accountStatus: AccountStatus.deleted,
        // purgeAt stored as a custom field — add if the Prisma schema has it
        // purgeAt,
      },
    });
  }
}
