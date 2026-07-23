export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      sources: {
        Row: Source;
        Insert: SourceInsert;
        Update: SourceUpdate;
        Relationships: [];
      };
      articles: {
        Row: Article;
        Insert: ArticleInsert;
        Update: ArticleUpdate;
        Relationships: [
          {
            foreignKeyName: "articles_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          }
        ];
      };
      article_analyses: {
        Row: ArticleAnalysis;
        Insert: ArticleAnalysisInsert;
        Update: ArticleAnalysisUpdate;
        Relationships: [
          {
            foreignKeyName: "article_analyses_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: true;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          }
        ];
      };
      logs: {
        Row: Log;
        Insert: LogInsert;
        Update: LogUpdate;
        Relationships: [];
      };
      oxylabs_schedules: {
        Row: OxylabsSchedule;
        Insert: OxylabsScheduleInsert;
        Update: OxylabsScheduleUpdate;
        Relationships: [
          {
            foreignKeyName: "oxylabs_schedules_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          }
        ];
      };
      oxylabs_schedule_runs: {
        Row: OxylabsScheduleRun;
        Insert: OxylabsScheduleRunInsert;
        Update: OxylabsScheduleRunUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export interface Source {
  id: string;
  name: string;
  listing_url: string;
  parser_strategy: string | null;
  active: boolean;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceInsert {
  id?: string;
  name: string;
  listing_url: string;
  parser_strategy?: string | null;
  active?: boolean;
  logo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SourceUpdate {
  id?: string;
  name?: string;
  listing_url?: string;
  parser_strategy?: string | null;
  active?: boolean;
  logo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: string;
  source_id: string | null;
  original_url: string;
  canonical_url: string | null;
  title: string;
  image_url: string;
  published_date: string;
  raw_text: string;
  scraped_at: string;
  analyzed_at: string | null;
}

export interface ArticleInsert {
  id?: string;
  source_id?: string | null;
  original_url: string;
  canonical_url?: string | null;
  title: string;
  image_url: string;
  published_date: string;
  raw_text: string;
  scraped_at?: string;
  analyzed_at?: string | null;
}

export interface ArticleUpdate {
  id?: string;
  source_id?: string | null;
  original_url?: string;
  canonical_url?: string | null;
  title?: string;
  image_url?: string;
  published_date?: string;
  raw_text?: string;
  scraped_at?: string;
  analyzed_at?: string | null;
}

export type SentimentLabel = 'positive' | 'neutral' | 'negative';
export type PoliticalBiasLabel = 'left' | 'center' | 'right' | 'mixed' | 'unclear';

export interface ArticleAnalysis {
  id: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: SentimentLabel | string;
  bias_score: number;
  bias_label: PoliticalBiasLabel | string;
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes: Json;
  loaded_terms: Json;
  disclaimer: string;
  model: string;
  created_at: string;
}

export interface ArticleAnalysisInsert {
  id?: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: SentimentLabel | string;
  bias_score: number;
  bias_label: PoliticalBiasLabel | string;
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes?: Json;
  loaded_terms?: Json;
  disclaimer: string;
  model: string;
  created_at?: string;
}

export interface ArticleAnalysisUpdate {
  id?: string;
  article_id?: string;
  summary?: string;
  sentiment_score?: number;
  sentiment_label?: SentimentLabel | string;
  bias_score?: number;
  bias_label?: PoliticalBiasLabel | string;
  left_percentage?: number;
  center_percentage?: number;
  right_percentage?: number;
  confidence?: number;
  framing_notes?: Json;
  loaded_terms?: Json;
  disclaimer?: string;
  model?: string;
  created_at?: string;
}

export interface Log {
  id: string;
  level: 'info' | 'warn' | 'error' | string;
  message: string;
  details: Json | null;
  created_at: string;
}

export interface LogInsert {
  id?: string;
  level: 'info' | 'warn' | 'error' | string;
  message: string;
  details?: Json | null;
  created_at?: string;
}

export interface LogUpdate {
  id?: string;
  level?: 'info' | 'warn' | 'error' | string;
  message?: string;
  details?: Json | null;
  created_at?: string;
}

export interface OxylabsSchedule {
  id: string;
  source_id: string | null;
  schedule_id: string;
  status: string;
  cron: string | null;
  created_at: string;
  updated_at: string;
}

export interface OxylabsScheduleInsert {
  id?: string;
  source_id?: string | null;
  schedule_id: string;
  status?: string;
  cron?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OxylabsScheduleUpdate {
  id?: string;
  source_id?: string | null;
  schedule_id?: string;
  status?: string;
  cron?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OxylabsScheduleRun {
  id: string;
  schedule_id: string | null;
  job_id: string;
  status: string;
  articles_scraped: number;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface OxylabsScheduleRunInsert {
  id?: string;
  schedule_id?: string | null;
  job_id: string;
  status: string;
  articles_scraped?: number;
  started_at?: string;
  completed_at?: string | null;
  error_message?: string | null;
}

export interface OxylabsScheduleRunUpdate {
  id?: string;
  schedule_id?: string | null;
  job_id?: string;
  status?: string;
  articles_scraped?: number;
  started_at?: string;
  completed_at?: string | null;
  error_message?: string | null;
}

export interface ArticleWithDetails extends Article {
  source?: Source | null;
  analysis?: ArticleAnalysis | null;
}
