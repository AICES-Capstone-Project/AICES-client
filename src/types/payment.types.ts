export interface SetupIntentRequest {
	subscriptionId: number;
}

export interface SetupIntentResponse {
	clientSecret: string;
}

// Payment Status Types
export type PaymentStatus = "Pending" | "Paid" | "Failed";
export type SubscriptionStatus = "Active" | "Canceled" | "Expired" | null;

// Payment List Item
export interface PaymentListItem {
	paymentId: number;
	companyId: number;
	comSubId: number | null;
	paymentStatus: PaymentStatus;
	subscriptionStatus: SubscriptionStatus;
	amount: number;
	currency: string | null;
	subscriptionName: string | null;
	startDate: string | null;
	endDate: string | null;
	transactionTime: string | null;
}

// Transaction Details
export interface Transaction {
	transactionId: number;
	transactionRef: string | null;
	gateway: string;
	amount: number;
	currency: string;
	payerName: string | null;
	bankCode: string | null;
	transactionTime: string;
}

// Company Subscription Details
export interface CompanySubscription {
	subscriptionId: number;
	name: string;
	startDate: string;
	endDate: string;
	status: SubscriptionStatus;
}

// Payment Detail Response
export interface PaymentDetail {
	paymentId: number;
	companyId: number;
	comSubId: number;
	paymentStatus: PaymentStatus;
	invoiceUrl: string;
	transaction: Transaction;
	companySubscription: CompanySubscription;
}

// Legacy type for backward compatibility
export interface PaymentDetails extends PaymentListItem {}

// Component Props
export interface SubscriptionCheckoutProps {
	subscriptionId: number;
	subscriptionName?: string;
	price?: number;
	currency?: string;
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

// Utility Types
export interface PaymentHistoryFilters {
	status?: PaymentStatus;
	subscriptionStatus?: SubscriptionStatus;
	startDate?: string;
	endDate?: string;
}

export interface PaymentSummary {
	totalPayments: number;
	totalAmount: number;
	activeSubscriptions: number;
	pendingPayments: number;
}
