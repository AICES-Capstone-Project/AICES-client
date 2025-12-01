import { useEffect, useState } from "react";
import { get } from "../../services/api";

export interface ApiPlan {
  subscriptionId: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  resumeLimit: number;
  hoursLimit: number;
  createdAt: string;
}

export function usePricingPlans() {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await get<{
          subscriptions: ApiPlan[];
          totalPages: number;
          currentPage: number;
          pageSize: number;
        }>("/public/subscriptions", { params: { page: 1, pageSize: 10 } });

        if (!mounted) return;

        // debug: log raw response
        console.debug("usePricingPlans raw response:", res);

        const subscriptions = res?.data?.subscriptions || [];

        setPlans(subscriptions);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        console.error("usePricingPlans error:", err);
        setError(err?.message || "Failed to load plans");
        setPlans([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchPlans();

    return () => {
      mounted = false;
    };
  }, []);

  return { plans, loading, error };
}
