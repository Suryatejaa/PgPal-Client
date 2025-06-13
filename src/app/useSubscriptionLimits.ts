import { useMemo } from 'react';
import { useAppSelector } from './hooks';

interface PlanLimits {
  maxProperties: number;
  maxRoomsPerProperty: number;
  maxBedsPerProperty: number;
  maxImagesPerProperty: number;
  maxReviewsDisplayed: number;
  trialDays?: number;
  restrictions?: string[];
  features: string[];
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxProperties: 1,
    maxRoomsPerProperty: 4,
    maxBedsPerProperty: 10,
    maxImagesPerProperty: 5,
    maxReviewsDisplayed: 10,
    features: ['add_property', 'basic_management', 'basic_notifications', 'view_reviews'],
    restrictions: ['no_analytics', 'no_bulk_operations', 'no_advanced_search', 'no_amenity_management']
},
trial: {
    maxProperties: 2,
    maxRoomsPerProperty: 12,
    maxBedsPerProperty: 25,
    maxImagesPerProperty: 10,
    maxReviewsDisplayed: 25,
    features: ['add_property', 'basic_management', 'basic_notifications', 'basic_analytics', 'view_reviews', 'manage_amenities'],
    restrictions: ['no_bulk_operations', 'no_advanced_notifications', 'no_advanced_search'],
    trialDays: 30
},
starter: {
    maxProperties: 5,
    maxRoomsPerProperty: 24,
    maxBedsPerProperty: 70,
    maxImagesPerProperty: 20,
    maxReviewsDisplayed: 50,
    features: ['add_property', 'basic_management', 'notifications', 'analytics', 'tenant_management', 'view_reviews', 'manage_amenities', 'manage_rules', 'advanced_search'],
    restrictions: ['limited_bulk_operations']
},
professional: {
    maxProperties: -1, // unlimited
    maxRoomsPerProperty: -1, // unlimited
    maxBedsPerProperty: -1, // unlimited
    maxImagesPerProperty: -1, // unlimited
    maxReviewsDisplayed: -1, // unlimited
    features: ['all_features'],
    restrictions: []
}
};

export default function useSubscriptionLimits() {
  const user = useAppSelector((state) => state.auth.user);
    
  const currentPlan = user?.currentPlan || 'trial';
  const limits = PLAN_LIMITS[currentPlan];
  
  const isUnlimited = (limit: number) => limit === -1;
  
  const checkLimit = useMemo(() => ({
    canAddProperty: (currentCount: number) => {
      if (isUnlimited(limits.maxProperties)) return true;
      return currentCount < limits.maxProperties;
    },
    canAddRoom: (currentRooms: number) => {
      if (isUnlimited(limits.maxRoomsPerProperty)) return true;
      return currentRooms < limits.maxRoomsPerProperty;
    },
    canAddTenant: (currentTenants: number) => {
      if (isUnlimited(limits.maxBedsPerProperty)) return true;
      return currentTenants < limits.maxBedsPerProperty;
    },
    hasFeature: (feature: string) => limits.features.includes(feature) || limits.features.includes('all_features'),
    getLimitMessage: (type: 'property' | 'room' | 'tenant') => {
      const limitMap = {
        property: isUnlimited(limits.maxProperties) 
          ? 'You have unlimited properties' 
          : `Upgrade to add more properties (limit: ${limits.maxProperties})`,
        room: isUnlimited(limits.maxRoomsPerProperty)
          ? 'You have unlimited rooms per property'
          : `Upgrade to add more rooms (limit: ${limits.maxRoomsPerProperty})`,
        tenant: isUnlimited(limits.maxBedsPerProperty)
          ? 'You have unlimited tenants'
          : `Upgrade to add more tenants (limit: ${limits.maxBedsPerProperty})`
      };
      return limitMap[type];
    }
  }), [limits]);

  return {
    currentPlan,
    limits,
    isUnlimited,
    ...checkLimit
  };
}