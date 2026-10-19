import { NextResponse } from "next/server";

type WashWorldSubscriptionFeature = {
  name?: string;
  enabled?: boolean;
};

type WashWorldSubscription = {
  id?: string;
  name?: string;
  price?: number;
  interval?: string;
  short_description?: string;
  features?: WashWorldSubscriptionFeature[];
};

type NormalizedSubscription = {
  id: string;
  name: string;
  price: number;
  interval: string;
  shortDescription: string;
  features: string[];
};

function normalizeSubscription(
  subscription: WashWorldSubscription,
): NormalizedSubscription | null {
  if (!subscription.id || !subscription.name || typeof subscription.price !== "number") {
    return null;
  }

  const features = Array.isArray(subscription.features)
    ? subscription.features
        .filter((feature) => feature.enabled === true && typeof feature.name === "string")
        .map((feature) => feature.name as string)
    : [];

  return {
    id: subscription.id,
    name: subscription.name,
    price: subscription.price,
    interval: subscription.interval || "month",
    shortDescription: subscription.short_description || "",
    features,
  };
}

export async function GET() {
  try {
    const response = await fetch("https://headless.washworld.dk/wp-json/ww/v1/subscriptions", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Wash World subscriptions" },
        { status: 502 },
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Unexpected Wash World subscriptions response format" },
        { status: 502 },
      );
    }

    const subscriptions = data
      .map((subscription) => normalizeSubscription(subscription as WashWorldSubscription))
      .filter((subscription): subscription is NormalizedSubscription => subscription !== null);

    return NextResponse.json(subscriptions);
  } catch {
    return NextResponse.json(
      { error: "Unable to load Wash World subscriptions" },
      { status: 500 },
    );
  }
}
