export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_birth_date: string | null
          client_name: string
          client_phone: string
          company_id: string
          created_at: string | null
          date: string
          duration: number
          id: string
          notes: string | null
          price: number
          professional_id: string
          service_id: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          time: string
          updated_at: string | null
        }
        Insert: {
          client_birth_date?: string | null
          client_name: string
          client_phone: string
          company_id: string
          created_at?: string | null
          date: string
          duration: number
          id?: string
          notes?: string | null
          price: number
          professional_id: string
          service_id: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          time: string
          updated_at?: string | null
        }
        Update: {
          client_birth_date?: string | null
          client_name?: string
          client_phone?: string
          company_id?: string
          created_at?: string | null
          date?: string
          duration?: number
          id?: string
          notes?: string | null
          price?: number
          professional_id?: string
          service_id?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          birth_date: string | null
          company_id: string
          created_at: string | null
          email: string | null
          id: string
          last_appointment: string | null
          name: string
          phone: string
          total_appointments: number | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          last_appointment?: string | null
          name: string
          phone: string
          total_appointments?: number | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          last_appointment?: string | null
          name?: string
          phone?: string
          total_appointments?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          appointment_id: string
          created_at: string | null
          date: string
          id: string
          professional_id: string
          status: Database["public"]["Enums"]["commission_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id: string
          created_at?: string | null
          date: string
          id?: string
          professional_id: string
          status?: Database["public"]["Enums"]["commission_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string
          created_at?: string | null
          date?: string
          id?: string
          professional_id?: string
          status?: Database["public"]["Enums"]["commission_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string
          created_at: string | null
          custom_url: string | null
          email: string
          employees: number | null
          id: string
          logo: string | null
          monthly_revenue: number | null
          name: string
          next_payment: string | null
          overdue_days: number | null
          phone: string
          plan: string
          status: Database["public"]["Enums"]["company_status"] | null
          trial_ends_at: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          custom_url?: string | null
          email: string
          employees?: number | null
          id?: string
          logo?: string | null
          monthly_revenue?: number | null
          name: string
          next_payment?: string | null
          overdue_days?: number | null
          phone: string
          plan?: string
          status?: Database["public"]["Enums"]["company_status"] | null
          trial_ends_at?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          custom_url?: string | null
          email?: string
          employees?: number | null
          id?: string
          logo?: string | null
          monthly_revenue?: number | null
          name?: string
          next_payment?: string | null
          overdue_days?: number | null
          phone?: string
          plan?: string
          status?: Database["public"]["Enums"]["company_status"] | null
          trial_ends_at?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          expire_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          expire_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          expire_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          company_id: string
          created_at: string | null
          date: string
          description: string
          id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          company_id: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          company_id?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          company_id: string
          created_at: string | null
          description: string
          due_date: string
          id: string
          status: Database["public"]["Enums"]["invoice_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_config: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: Database["public"]["Enums"]["notification_priority"] | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          max_employees: string
          monthly_price: number
          name: string
          updated_at: string | null
          yearly_price: number
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_employees: string
          monthly_price: number
          name: string
          updated_at?: string | null
          yearly_price: number
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_employees?: string
          monthly_price?: number
          name?: string
          updated_at?: string | null
          yearly_price?: number
        }
        Relationships: []
      }
      professionals: {
        Row: {
          commission: number | null
          company_id: string
          created_at: string | null
          email: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          phone: string | null
          specialties: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          commission?: number | null
          company_id: string
          created_at?: string | null
          email: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          phone?: string | null
          specialties?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          commission?: number | null
          company_id?: string
          created_at?: string | null
          email?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string | null
          specialties?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professionals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          company_id: string | null
          created_at: string | null
          id: string
          must_change_password: boolean | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          company_id?: string | null
          created_at?: string | null
          id: string
          must_change_password?: boolean | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          must_change_password?: boolean | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          duration: number
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      working_hours: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          professional_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          professional_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          professional_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "working_hours_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      commission_status: "pending" | "paid"
      company_status: "active" | "trial" | "suspended" | "cancelled"
      invoice_status: "pending" | "paid" | "overdue"
      notification_priority: "low" | "medium" | "high"
      notification_type:
        | "appointment"
        | "payment"
        | "system"
        | "company_registered"
        | "payment_overdue"
      user_role: "super_admin" | "company_admin" | "professional"
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
      appointment_status: ["scheduled", "completed", "cancelled", "no_show"],
      commission_status: ["pending", "paid"],
      company_status: ["active", "trial", "suspended", "cancelled"],
      invoice_status: ["pending", "paid", "overdue"],
      notification_priority: ["low", "medium", "high"],
      notification_type: [
        "appointment",
        "payment",
        "system",
        "company_registered",
        "payment_overdue",
      ],
      user_role: ["super_admin", "company_admin", "professional"],
    },
  },
} as const
