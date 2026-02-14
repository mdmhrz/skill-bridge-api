export type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: 'asc' | 'desc' | string;
    sortBy?: string;
};
export type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};
declare const paginationSortingHelper: (options?: IOptions, defaultSortBy?: string) => IOptionsResult;
export default paginationSortingHelper;
//# sourceMappingURL=paginationSortingHelper.d.ts.map