export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      flashcard_set_categories: {
        Row: {
          category_id: string
          created_at: string | null
          set_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          set_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          set_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_set_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "set_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_set_categories_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_sets: {
        Row: {
          color_theme: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color_theme?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color_theme?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          set_id: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          set_id: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          set_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      set_categories: {
        Row: {
          color: string
          created_at: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      study_progress: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          flashcard_id: string
          id: string
          last_reviewed: string | null
          review_count: number | null
          user_id: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          flashcard_id: string
          id?: string
          last_reviewed?: string | null
          review_count?: number | null
          user_id: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          flashcard_id?: string
          id?: string
          last_reviewed?: string | null
          review_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          accuracy_percentage: number | null
          cards_studied: number
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          set_id: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          cards_studied: number
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          set_id?: string | null
          started_at: string
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          cards_studied?: number
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          set_id?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      study_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_study_date: string | null
          longest_streak: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_study_date?: string | null
          longest_streak?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_study_date?: string | null
          longest_streak?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          set_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          set_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          set_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
