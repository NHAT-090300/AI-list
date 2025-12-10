
export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Waitlist' | 'Open Source';

export type Language = 'en' | 'vi' | 'zh' | 'ru' | 'th' | 'ja' | 'ko' | 'fr' | 'de' | 'es';

export interface Tool {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  pricing: PricingType;
  websiteUrl: string;
  features: string[];
  alternatives: string[]; // IDs of alternative tools
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
