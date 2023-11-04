export const calculatePaginationPages = (allElements: number, limit: number) =>
	Math.ceil(allElements / limit) < limit ? 0 : Math.ceil(allElements / limit);
