import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, DROPDOWN_LIMIT } from '../constants/pagination.constants';
import { PaginationQuery, PaginationMeta } from '../types/pagination.types';

export function buildPagination(query: PaginationQuery) {
    const isAll = query.all === true || query.all === ('true' as any);
    const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
    const limit = isAll
        ? DROPDOWN_LIMIT
        : Math.min(Number(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const offset = (page - 1) * limit;
    return { page, limit, offset, isAll };
}

export function buildPaginationMeta(
    page: number,
    limit: number,
    total: number,
): PaginationMeta {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
