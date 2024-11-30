export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  next_auth: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          oauth_token: string | null
          oauth_token_secret: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string | null
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId?: string | null
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string | null
        }
        Insert: {
          expires: string
          id?: string
          sessionToken: string
          userId?: string | null
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active_chat_id: string | null
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          is_admin: boolean | null
          name: string | null
          password: string | null
          salt: string | null
          username: string | null
        }
        Insert: {
          active_chat_id?: string | null
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          is_admin?: boolean | null
          name?: string | null
          password?: string | null
          salt?: string | null
          username?: string | null
        }
        Update: {
          active_chat_id?: string | null
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          is_admin?: boolean | null
          name?: string | null
          password?: string | null
          salt?: string | null
          username?: string | null
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string | null
          token: string
        }
        Insert: {
          expires: string
          identifier?: string | null
          token: string
        }
        Update: {
          expires?: string
          identifier?: string | null
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      chats: {
        Row: {
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          id: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          created_by: string
          essay_id: string
          id: string
        }
        Insert: {
          content: string
          created_at: string
          created_by: string
          essay_id: string
          id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          essay_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_essay_id_fkey"
            columns: ["essay_id"]
            isOneToOne: false
            referencedRelation: "essays"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          content: string | null
          document_id: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          file_last_modified: number
          file_size: number
          file_type: string
          full_path: string | null
          id: string
          name: string | null
          path: string | null
        }
        Insert: {
          file_last_modified: number
          file_size: number
          file_type: string
          full_path?: string | null
          id: string
          name?: string | null
          path?: string | null
        }
        Update: {
          file_last_modified?: number
          file_size?: number
          file_type?: string
          full_path?: string | null
          id?: string
          name?: string | null
          path?: string | null
        }
        Relationships: []
      }
      essay_history: {
        Row: {
          body: string
          conclusion: string
          created_at: string
          essay_id: string
          id: number
          introduction: string
          title: string
        }
        Insert: {
          body: string
          conclusion: string
          created_at?: string
          essay_id: string
          id?: number
          introduction: string
          title: string
        }
        Update: {
          body?: string
          conclusion?: string
          created_at?: string
          essay_id?: string
          id?: number
          introduction?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "essay_history_essay_id_fkey"
            columns: ["essay_id"]
            isOneToOne: false
            referencedRelation: "essays"
            referencedColumns: ["id"]
          },
        ]
      }
      essays: {
        Row: {
          body: string
          conclusion: string
          created_at: string
          created_by: string
          deleted_at: string | null
          id: string
          introduction: string
          title: string
          updated_at: string
          video_id: string
        }
        Insert: {
          body: string
          conclusion: string
          created_at: string
          created_by: string
          deleted_at?: string | null
          id: string
          introduction: string
          title: string
          updated_at: string
          video_id: string
        }
        Update: {
          body?: string
          conclusion?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          id?: string
          introduction?: string
          title?: string
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "essays_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string
          created_by: string
          essay_id: string
          id: string
          score: number
        }
        Insert: {
          created_at: string
          created_by: string
          essay_id: string
          id: string
          score: number
        }
        Update: {
          created_at?: string
          created_by?: string
          essay_id?: string
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_essay_id_fkey"
            columns: ["essay_id"]
            isOneToOne: false
            referencedRelation: "essays"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          audio_file_full_path: string | null
          audio_file_path: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          file_last_modified: number
          file_size: number
          file_type: string
          full_path: string | null
          id: string
          name: string | null
          original_transcribe_text: string | null
          path: string | null
          tags: string[] | null
          transcribe_text: string | null
        }
        Insert: {
          audio_file_full_path?: string | null
          audio_file_path?: string | null
          created_at: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          file_last_modified: number
          file_size: number
          file_type: string
          full_path?: string | null
          id: string
          name?: string | null
          original_transcribe_text?: string | null
          path?: string | null
          tags?: string[] | null
          transcribe_text?: string | null
        }
        Update: {
          audio_file_full_path?: string | null
          audio_file_path?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          file_last_modified?: number
          file_size?: number
          file_type?: string
          full_path?: string | null
          id?: string
          name?: string | null
          original_transcribe_text?: string | null
          path?: string | null
          tags?: string[] | null
          transcribe_text?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_document_chunks: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          embedding: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
