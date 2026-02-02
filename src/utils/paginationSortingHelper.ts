export type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: 'asc' | 'desc' | string;
    sortBy?: string;
}

export type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

const paginationSortingHelper = (options: IOptions = {}, defaultSortBy = 'createdAt'): IOptionsResult => {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.max(1, Number(options.limit ?? 10));
    const skip = (page - 1) * limit;

    let sortOrder: 'asc' | 'desc' = 'desc';
    if ((options.sortOrder || '').toLowerCase() === 'asc') {
        sortOrder = 'asc';
    }

    const sortBy = options.sortBy || defaultSortBy;

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};

export default paginationSortingHelper;
