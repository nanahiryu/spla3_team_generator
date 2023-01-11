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
      team_log: {
        Row: {
          created_at: string
          member_id: string
          team_id: string
          uuid: string
        }
        Insert: {
          created_at: string
          member_id: string
          team_id: string
          uuid?: string
        }
        Update: {
          created_at?: string
          member_id?: string
          team_id?: string
          uuid?: string
        }
      }
      teams: {
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
