export const Status = {
	Success: 200,
	Error: 500,
	NotFound: 404,
	Duplicated: 400,
	Unauthorized: 401,
} as const;

export type Status = (typeof Status)[keyof typeof Status];
