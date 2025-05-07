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
      courses: {
        Row: {
          created_at: string | null
          id: string
          name: string
          semester_number: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          semester_number: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          semester_number?: number
          updated_at?: string | null
        }
        Relationships: []
      }
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
      semester_courses: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          semester_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          semester_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          semester_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "semester_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_courses_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tutoring_available_times: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          start_time: string
          tutoring_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
          tutoring_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
          tutoring_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutoring_available_times_tutoring_id_fkey"
            columns: ["tutoring_id"]
            isOneToOne: false
            referencedRelation: "tutoring_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tutoring_materials: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          size: number | null
          title: string
          tutoring_id: string
          type: string
          updated_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          size?: number | null
          title: string
          tutoring_id: string
          type: string
          updated_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          size?: number | null
          title?: string
          tutoring_id?: string
          type?: string
          updated_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutoring_materials_tutoring_id_fkey"
            columns: ["tutoring_id"]
            isOneToOne: false
            referencedRelation: "tutoring_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutoring_materials_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutoring_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          likes: number | null
          rating: number
          student_id: string
          tutoring_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          likes?: number | null
          rating: number
          student_id: string
          tutoring_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          likes?: number | null
          rating?: number
          student_id?: string
          tutoring_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutoring_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutoring_reviews_tutoring_id_fkey"
            columns: ["tutoring_id"]
            isOneToOne: false
            referencedRelation: "tutoring_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tutoring_sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          price: number
          title: string
          tutor_id: string
          updated_at: string | null
          what_they_will_learn: Json
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          title: string
          tutor_id: string
          updated_at?: string | null
          what_they_will_learn?: Json
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          title?: string
          tutor_id?: string
          updated_at?: string | null
          what_they_will_learn?: Json
        }
        Relationships: [
          {
            foreignKeyName: "tutoring_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutoring_sessions_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
