import { useEffect, useState } from "react";
import { SubscriptionPlan } from "../pages/profile/data/membershipTypes";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/washworld-subscriptions");
        if (!res.ok) {
          if (isMounted) setError("failed");
          return;
        }
        const data: unknown = await res.json();
        if (Array.isArray(data) && isMounted) {
          setSubscriptions(data as SubscriptionPlan[]);
        } else if (isMounted) {
          setError("empty");
        }
      } catch {
        if (isMounted) setError("failed");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { subscriptions, isLoading, error };
}