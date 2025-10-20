import type PagingParams from "../types/paging.types";

export const buildQuery = (params?: PagingParams): string => {
	if (!params) return "";

	const queryParams = new URLSearchParams();

	if (params.page) queryParams.append("page", params.page.toString());
	if (params.pageSize)
		queryParams.append("pageSize", params.pageSize.toString());
	if (params.search) queryParams.append("search", params.search);

	const query = queryParams.toString();
	return query ? `?${query}` : "";
};
