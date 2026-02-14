const paginationSortingHelper = (options = {}, defaultSortBy = 'createdAt') => {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.max(1, Number(options.limit ?? 10));
    const skip = (page - 1) * limit;
    let sortOrder = 'desc';
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
//# sourceMappingURL=paginationSortingHelper.js.map