
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          academic_year: string | null
          avatar: string | null
          bio: string | null
          created_at: string | null
          email: string
          first_name: string
          gender: string
          id: string
          last_name: string
          phone: string | null
          role: string
          semester_number: number
          status: string | null
          tutor_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          first_name: string
          gender: string
          id: string
          last_name: string
          phone?: string | null
          role: string
          semester_number: number
          status?: string | null
          tutor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: string
          semester_number?: number
          status?: string | null
          tutor_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
