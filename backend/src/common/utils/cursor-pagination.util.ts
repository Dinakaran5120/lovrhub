/**
 * Cursor-based pagination utilities.
 *
 * The cursor is a base64-encoded string that represents the current offset.
 * Using a numeric offset keeps the implementation simple and compatible with
 * Prisma's skip/take pattern while still hiding the raw number from clients.
 */

/**
 * Encode a numeric offset into an opaque cursor string.
 */
export function encodeCursor(offset: number): string {
  return Buffer.from(String(offset), 'utf8').toString('base64');
}

/**
 * Decode an opaque cursor string back to a numeric offset.
 * Returns 0 if the cursor is missing, empty, or cannot be parsed.
 */
export function decodeCursor(cursor: string): number {
  if (!cursor || cursor.trim().length === 0) {
    return 0;
  }

  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    const offset = parseInt(decoded, 10);

    if (Number.isNaN(offset) || offset < 0) {
      return 0;
    }

    return offset;
  } catch {
    return 0;
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

/**
 * Wrap a page of items in a standardised paginated envelope.
 *
 * @param items   - The items for the current page (length <= limit)
 * @param total   - Total number of matching records across all pages
 * @param limit   - Page size that was requested
 * @param offset  - The offset used to fetch this page
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  limit: number,
  offset: number,
): PaginatedResponse<T> {
  const nextOffset = offset + items.length;
  const hasMore = nextOffset < total;

  return {
    data: items,
    nextCursor: hasMore ? encodeCursor(nextOffset) : null,
    hasMore,
    total,
  };
}
