export interface CreateCompanyRequest {
	name: string;
	description: string;
	address: string;
	website: number;
	logoFile: string;
	documentFiles: boolean;
    documentTypes: boolean;
}