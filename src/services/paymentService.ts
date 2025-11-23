import api from "./api";

export const paymentService = {
  async createCheckoutSession(subscriptionId: number) {
    const response = await api.post("/payments/checkout", {
      subscriptionId,
    });
    return response.data;
  },
};
