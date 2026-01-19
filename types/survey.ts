export interface SurveyResponse {
  id?: string
  created_at?: string
  initial_range: string
  specific_price?: string | null
  best_feature?: string | null
  improvement_note?: string | null
  agent_email?: string | null
}

export type PriceRange = '$601k–$700k' | '$501k–$600k' | '$401k–$500k'

export type BestFeature = 'Location' | 'Layout' | 'Condition/Updates' | 'Yard/Lot' | 'Price'