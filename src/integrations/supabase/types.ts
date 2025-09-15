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
      ai_queries: {
        Row: {
          answer_md: string | null
          citations: Json | null
          context_refs: string[] | null
          created_at: string | null
          feedback: string | null
          id: string
          question: string
          rating: number | null
          response_time_ms: number | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          answer_md?: string | null
          citations?: Json | null
          context_refs?: string[] | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          question: string
          rating?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          answer_md?: string | null
          citations?: Json | null
          context_refs?: string[] | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          question?: string
          rating?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      audio_assets: {
        Row: {
          book_code: string | null
          chapter_number: number | null
          created_at: string | null
          description: string | null
          downloadable: boolean | null
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          language: string | null
          narrator: string | null
          premium_only: boolean | null
          source_url: string
          title: string
          type: Database["public"]["Enums"]["audio_type"]
          version_id: string | null
        }
        Insert: {
          book_code?: string | null
          chapter_number?: number | null
          created_at?: string | null
          description?: string | null
          downloadable?: boolean | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          language?: string | null
          narrator?: string | null
          premium_only?: boolean | null
          source_url: string
          title: string
          type: Database["public"]["Enums"]["audio_type"]
          version_id?: string | null
        }
        Update: {
          book_code?: string | null
          chapter_number?: number | null
          created_at?: string | null
          description?: string | null
          downloadable?: boolean | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          language?: string | null
          narrator?: string | null
          premium_only?: boolean | null
          source_url?: string
          title?: string
          type?: Database["public"]["Enums"]["audio_type"]
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_assets_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          points: number | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          points?: number | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          points?: number | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      bible_versions: {
        Row: {
          code: string
          copyright_notice: string | null
          created_at: string | null
          enabled: boolean | null
          id: string
          is_premium: boolean | null
          language: string
          license_type: string
          name: string
          sort_order: number | null
          source: string | null
        }
        Insert: {
          code: string
          copyright_notice?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          is_premium?: boolean | null
          language: string
          license_type: string
          name: string
          sort_order?: number | null
          source?: string | null
        }
        Update: {
          code?: string
          copyright_notice?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          is_premium?: boolean | null
          language?: string
          license_type?: string
          name?: string
          sort_order?: number | null
          source?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          verse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          chapter_count: number
          code: string
          created_at: string | null
          id: string
          name: string
          order_num: number
          testament: string
          version_id: string
        }
        Insert: {
          chapter_count: number
          code: string
          created_at?: string | null
          id?: string
          name: string
          order_num: number
          testament: string
          version_id: string
        }
        Update: {
          chapter_count?: number
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          order_num?: number
          testament?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          number: number
          verse_count: number
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          number: number
          verse_count: number
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          number?: number
          verse_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["group_member_role"] | null
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["group_member_role"] | null
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["group_member_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          invite_code: string | null
          is_premium_only: boolean | null
          member_count: number | null
          name: string
          owner_id: string | null
          updated_at: string | null
          visibility: Database["public"]["Enums"]["group_visibility"] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          is_premium_only?: boolean | null
          member_count?: number | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["group_visibility"] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          is_premium_only?: boolean | null
          member_count?: number | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["group_visibility"] | null
        }
        Relationships: []
      }
      highlights: {
        Row: {
          color: string
          created_at: string | null
          id: string
          user_id: string
          verse_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          user_id: string
          verse_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      life_rules: {
        Row: {
          created_at: string | null
          description: string | null
          evening_practices: Json | null
          id: string
          is_active: boolean | null
          midday_practices: Json | null
          morning_practices: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          evening_practices?: Json | null
          id?: string
          is_active?: boolean | null
          midday_practices?: Json | null
          morning_practices?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          evening_practices?: Json | null
          id?: string
          is_active?: boolean | null
          midday_practices?: Json | null
          morning_practices?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memory_cards: {
        Row: {
          added_at: string | null
          deck_id: string
          id: string
          user_id: string
          verse_ref: string
        }
        Insert: {
          added_at?: string | null
          deck_id: string
          id?: string
          user_id: string
          verse_ref: string
        }
        Update: {
          added_at?: string | null
          deck_id?: string
          id?: string
          user_id?: string
          verse_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_memory_cards_deck_id"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "memory_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_decks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memory_reviews: {
        Row: {
          card_id: string
          created_at: string | null
          due_at: string
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_grade: string | null
          last_reviewed_at: string | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          due_at: string
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_grade?: string | null
          last_reviewed_at?: string | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          due_at?: string
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_grade?: string | null
          last_reviewed_at?: string | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_memory_reviews_card_id"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "memory_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          created_at: string | null
          deleted_at: string | null
          edited_at: string | null
          group_id: string
          id: string
          media_url: string | null
          reply_to: string | null
          type: Database["public"]["Enums"]["message_type"] | null
          user_id: string
          verse_refs: string[] | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          group_id: string
          id?: string
          media_url?: string | null
          reply_to?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          user_id: string
          verse_refs?: string[] | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          group_id?: string
          id?: string
          media_url?: string | null
          reply_to?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          user_id?: string
          verse_refs?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          privacy: string | null
          updated_at: string | null
          user_id: string
          verse_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          privacy?: string | null
          updated_at?: string | null
          user_id: string
          verse_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          privacy?: string | null
          updated_at?: string | null
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_days: {
        Row: {
          created_at: string | null
          day_index: number
          devotion_content: string | null
          estimated_minutes: number | null
          id: string
          passages: string[]
          plan_id: string
          prayer_prompt: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          day_index: number
          devotion_content?: string | null
          estimated_minutes?: number | null
          id?: string
          passages: string[]
          plan_id: string
          prayer_prompt?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          day_index?: number
          devotion_content?: string | null
          estimated_minutes?: number | null
          id?: string
          passages?: string[]
          plan_id?: string
          prayer_prompt?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_enrollments: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          muted: boolean | null
          plan_id: string
          progress_day: number | null
          reminders_enabled: boolean | null
          reminders_time: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          muted?: boolean | null
          plan_id: string
          progress_day?: number | null
          reminders_enabled?: boolean | null
          reminders_time?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          muted?: boolean | null
          plan_id?: string
          progress_day?: number | null
          reminders_enabled?: boolean | null
          reminders_time?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_enrollments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          author: string | null
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_days: number
          id: string
          is_premium: boolean | null
          locale: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_days: number
          id?: string
          is_premium?: boolean | null
          locale?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_premium?: boolean | null
          locale?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      playlists: {
        Row: {
          audio_items: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_items?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_items?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      practice_prompts: {
        Row: {
          created_at: string | null
          id: string
          locale: string | null
          practice_slug: string
          prompt_text: string
          step_index: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          locale?: string | null
          practice_slug: string
          prompt_text: string
          step_index: number
        }
        Update: {
          created_at?: string | null
          id?: string
          locale?: string | null
          practice_slug?: string
          prompt_text?: string
          step_index?: number
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_sec: number | null
          id: string
          notes_md: string | null
          passage_ref: string | null
          practice_slug: string
          started_at: string | null
          step_data: Json | null
          steps_completed: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_sec?: number | null
          id?: string
          notes_md?: string | null
          passage_ref?: string | null
          practice_slug: string
          started_at?: string | null
          step_data?: Json | null
          steps_completed?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_sec?: number | null
          id?: string
          notes_md?: string | null
          passage_ref?: string | null
          practice_slug?: string
          started_at?: string | null
          step_data?: Json | null
          steps_completed?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_practice_sessions_practice_slug"
            columns: ["practice_slug"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["slug"]
          },
        ]
      }
      practices: {
        Row: {
          created_at: string | null
          default_passage: string | null
          description: string | null
          estimated_minutes: number | null
          id: string
          slug: string
          steps: number
          title: string
        }
        Insert: {
          created_at?: string | null
          default_passage?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          slug: string
          steps?: number
          title: string
        }
        Update: {
          created_at?: string | null
          default_passage?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          slug?: string
          steps?: number
          title?: string
        }
        Relationships: []
      }
      prayer_circle_members: {
        Row: {
          circle_id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["group_member_role"] | null
          user_id: string
        }
        Insert: {
          circle_id: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["group_member_role"] | null
          user_id: string
        }
        Update: {
          circle_id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["group_member_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "prayer_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_circles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          invite_code: string | null
          name: string
          owner_id: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["group_visibility"] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          name: string
          owner_id: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["group_visibility"] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          name?: string
          owner_id?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["group_visibility"] | null
        }
        Relationships: []
      }
      prayers: {
        Row: {
          answered_at: string | null
          body: string | null
          created_at: string | null
          id: string
          privacy: string | null
          status: Database["public"]["Enums"]["prayer_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answered_at?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          privacy?: string | null
          status?: Database["public"]["Enums"]["prayer_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answered_at?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          privacy?: string | null
          status?: Database["public"]["Enums"]["prayer_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          denomination_pref: string[] | null
          display_name: string | null
          id: string
          kids_mode: boolean | null
          locale: string | null
          notification_preferences: Json | null
          onboarding_done: boolean | null
          reading_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          denomination_pref?: string[] | null
          display_name?: string | null
          id?: string
          kids_mode?: boolean | null
          locale?: string | null
          notification_preferences?: Json | null
          onboarding_done?: boolean | null
          reading_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          denomination_pref?: string[] | null
          display_name?: string | null
          id?: string
          kids_mode?: boolean | null
          locale?: string | null
          notification_preferences?: Json | null
          onboarding_done?: boolean | null
          reading_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          author: string | null
          content_url: string | null
          created_at: string | null
          id: string
          is_premium: boolean | null
          language: string | null
          license: string | null
          tags: string[] | null
          title: string
          type: string
        }
        Insert: {
          author?: string | null
          content_url?: string | null
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          language?: string | null
          license?: string | null
          tags?: string[] | null
          title: string
          type: string
        }
        Update: {
          author?: string | null
          content_url?: string | null
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          language?: string | null
          license?: string | null
          tags?: string[] | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      rule_completions: {
        Row: {
          completed_at: string | null
          date_iso: string
          id: string
          notes: string | null
          rule_id: string
          time_slot: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          date_iso: string
          id?: string
          notes?: string | null
          rule_id: string
          time_slot: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          date_iso?: string
          id?: string
          notes?: string | null
          rule_id?: string
          time_slot?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rule_completions_rule_id"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "life_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          current_days: number | null
          last_activity_date: string | null
          longest_days: number | null
          streak_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_days?: number | null
          last_activity_date?: string | null
          longest_days?: number | null
          streak_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_days?: number | null
          last_activity_date?: string | null
          longest_days?: number | null
          streak_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          provider: string
          provider_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          provider: string
          provider_subscription_id?: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          provider?: string
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      verses: {
        Row: {
          chapter_id: string
          created_at: string | null
          embedding: string | null
          id: string
          number: number
          text: string
          tokens: unknown | null
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          number: number
          text: string
          tokens?: unknown | null
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          number?: number
          text?: string
          tokens?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      audio_type: "bible" | "sermon" | "podcast" | "music"
      group_member_role: "owner" | "moderator" | "member"
      group_visibility: "public" | "private" | "invite_only"
      message_type: "text" | "verse" | "prayer" | "media"
      prayer_status: "active" | "answered" | "archived"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
        | "trialing"
      subscription_tier: "free" | "premium" | "family"
      user_role: "user" | "moderator" | "admin"
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
    Enums: {
      audio_type: ["bible", "sermon", "podcast", "music"],
      group_member_role: ["owner", "moderator", "member"],
      group_visibility: ["public", "private", "invite_only"],
      message_type: ["text", "verse", "prayer", "media"],
      prayer_status: ["active", "answered", "archived"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "incomplete",
        "trialing",
      ],
      subscription_tier: ["free", "premium", "family"],
      user_role: ["user", "moderator", "admin"],
    },
  },
} as const
