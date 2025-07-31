export interface SocialMediaContentPack {
  weekNumber: number;
  state: string;
  weeklyPosts: {
    instagram: {
      caption: string;
      characterCount: number;
      hashtags: string[];
    };
    twitter: {
      text: string;
      characterCount: number;
      hashtags: string[];
    };
    facebook: {
      text: string;
      characterCount: number;
      engagementQuestion: string;
    };
    linkedin: {
      text: string;
      characterCount: number;
      businessFocus: string;
    };
  };
  dailyPosts: {
    monday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
    tuesday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
    wednesday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
    thursday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
    friday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
    saturday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
    sunday: { 
      instagram: { caption: string; characterCount: number; hashtags: string[]; };
      twitter: { text: string; characterCount: number; hashtags: string[]; };
    };
  };
  postingSchedule: {
    bestTimes: {
      instagram: string[];
      twitter: string[];
      facebook: string[];
      linkedin: string[];
    };
    recommendations: string[];
  };
}

export interface BeerData {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  description: string;
  tastingNotes: string[];
  awards?: string[];
}

export interface StateData {
  name: string;
  abbreviation: string;
  population: number;
  breweryCount: number;
  famousBreweries: string[];
  signature_beers: BeerData[];
  beer_culture_highlights: string[];
  history: string;
  notable_facts: string[];
}

export interface ContentGenerationConfig {
  tone: 'professional' | 'casual' | 'enthusiastic' | 'educational';
  focus: 'beer_education' | 'brewery_spotlight' | 'cultural_history' | 'community_building';
  includeBrandMentions: boolean;
  maxHashtags: {
    instagram: number;
    twitter: number;
  };
}