import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  stripePriceId?: string;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: [
      'Read Bible (KJV)',
      'Basic search',
      'Prayer journal (10 entries)',
      'Community access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    features: [
      'Multiple Bible versions',
      'AI Bible Guide (unlimited)',
      'Advanced search & study tools',
      'Unlimited prayer journal',
      'Audio Bible',
      'Premium reading plans',
      'Export & backup'
    ]
  },
  {
    id: 'family',
    name: 'Family',
    price: 19.99,
    currency: 'USD',
    features: [
      'Everything in Premium',
      'Up to 6 family members',
      'Family prayer circles',
      'Parental controls',
      'Kids mode',
      'Family reading plans'
    ]
  }
];

export class StripeAPI {
  async getUserSubscription(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createCheckoutSession(priceId: string, tier: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        priceId,
        tier,
        userId: user.id,
        userEmail: user.email
      }
    });

    if (error) throw error;
    return data.url;
  }

  async createPortalSession(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-portal', {
      body: { userId: user.id }
    });

    if (error) throw error;
    return data.url;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
  }

  getFeatureAvailability(userTier: string, feature: string): boolean {
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === userTier);
    return tier?.features.includes(feature) || false;
  }

  getTierByName(tierName: string): SubscriptionTier | null {
    return SUBSCRIPTION_TIERS.find(t => t.name.toLowerCase() === tierName.toLowerCase()) || null;
  }
}

export const stripeAPI = new StripeAPI();