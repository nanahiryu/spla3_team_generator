export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      group_members: {
        Row: {
          group_id: string
          user_id: string
          uuid: string
        }
        Insert: {
          group_id: string
          user_id: string
          uuid?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          uuid?: string
        }
      }
      groups: {
        Row: {
          name: string | null
          uuid: string
        }
        Insert: {
          name?: string | null
          uuid?: string
        }
        Update: {
          name?: string | null
          uuid?: string
        }
      }
      member_rank: {
        Row: {
          member_id: string
          rank_id: string
          uuid: string
        }
        Insert: {
          member_id: string
          rank_id: string
          uuid?: string
        }
        Update: {
          member_id?: string
          rank_id?: string
          uuid?: string
        }
      }
      ranks: {
        Row: {
          name: string
          rank_color: string
          uuid: string
        }
        Insert: {
          name: string
          rank_color: string
          uuid?: string
        }
        Update: {
          name?: string
          rank_color?: string
          uuid?: string
        }
      }
      team_log_set: {
        Row: {
          created_at: string
          group_id: string
          uuid: string
        }
        Insert: {
          created_at?: string
          group_id: string
          uuid?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          uuid?: string
        }
      }
      team_member_log: {
        Row: {
          member_id: string
          team_id: number
          team_set_id: string
          uuid: string
        }
        Insert: {
          member_id: string
          team_id: number
          team_set_id: string
          uuid?: string
        }
        Update: {
          member_id?: string
          team_id?: number
          team_set_id?: string
          uuid?: string
        }
      }
      users: {
        Row: {
          name: string
          uuid: string
        }
        Insert: {
          name: string
          uuid?: string
        }
        Update: {
          name?: string
          uuid?: string
        }
      }
    }
    Views: {
      group_members_with_ranks: {
        Row: {
          rank_id: string | null
          rank_name: string | null
          user_id: string | null
          user_name: string | null
          uuid: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

