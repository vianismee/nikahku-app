// Generated from NIKAHKU database schema (001_initial_schema.sql)
// To regenerate: npx supabase gen types typescript --project-id xtqkphoybqlsdyqvfcnu > src/lib/supabase/database.types.ts

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
      weddings: {
        Row: {
          id: string;
          user_id: string;
          partner_1_name: string;
          partner_2_name: string;
          wedding_date: string;
          venue_city: string | null;
          status: "planning" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
          partner_email: string | null;
          partner_user_id: string | null;
          partner_status: "pending" | "accepted" | "rejected" | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          partner_1_name: string;
          partner_2_name: string;
          wedding_date: string;
          venue_city?: string | null;
          status?: "planning" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
          partner_email?: string | null;
          partner_user_id?: string | null;
          partner_status?: "pending" | "accepted" | "rejected" | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          partner_1_name?: string;
          partner_2_name?: string;
          wedding_date?: string;
          venue_city?: string | null;
          status?: "planning" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
          partner_email?: string | null;
          partner_user_id?: string | null;
          partner_status?: "pending" | "accepted" | "rejected" | null;
        };
      };
      budgets: {
        Row: {
          id: string;
          wedding_id: string;
          total_amount: number;
          spent_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          total_amount?: number;
          spent_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          total_amount?: number;
          spent_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_allocations: {
        Row: {
          id: string;
          wedding_id: string;
          category_id: string;
          allocated_amount: number;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          category_id: string;
          allocated_amount?: number;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          category_id?: string;
          allocated_amount?: number;
        };
      };
      vendor_categories: {
        Row: {
          id: string;
          wedding_id: string | null;
          name: string;
          icon: string;
          color: string;
          is_default: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id?: string | null;
          name: string;
          icon?: string;
          color?: string;
          is_default?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string | null;
          name?: string;
          icon?: string;
          color?: string;
          is_default?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          wedding_id: string;
          category_id: string;
          name: string;
          contact_phone: string | null;
          contact_wa: string | null;
          email: string | null;
          instagram: string | null;
          website: string | null;
          address: string | null;
          city: string | null;
          rating: number | null;
          status:
            | "shortlisted"
            | "contacted"
            | "negotiating"
            | "booked"
            | "paid_dp"
            | "paid_full"
            | "completed"
            | "cancelled";
          pros: string | null;
          cons: string | null;
          notes: string | null;
          booking_date: string | null;
          selected_package_id: string | null;
          price_deal: number | null;
          dp_amount: number | null;
          dp_paid_date: string | null;
          full_paid_date: string | null;
          payment_deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          category_id: string;
          name: string;
          contact_phone?: string | null;
          contact_wa?: string | null;
          email?: string | null;
          instagram?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          rating?: number | null;
          status?:
            | "shortlisted"
            | "contacted"
            | "negotiating"
            | "booked"
            | "paid_dp"
            | "paid_full"
            | "completed"
            | "cancelled";
          pros?: string | null;
          cons?: string | null;
          notes?: string | null;
          booking_date?: string | null;
          selected_package_id?: string | null;
          price_deal?: number | null;
          dp_amount?: number | null;
          dp_paid_date?: string | null;
          full_paid_date?: string | null;
          payment_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          category_id?: string;
          name?: string;
          contact_phone?: string | null;
          contact_wa?: string | null;
          email?: string | null;
          instagram?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          rating?: number | null;
          status?:
            | "shortlisted"
            | "contacted"
            | "negotiating"
            | "booked"
            | "paid_dp"
            | "paid_full"
            | "completed"
            | "cancelled";
          pros?: string | null;
          cons?: string | null;
          notes?: string | null;
          booking_date?: string | null;
          selected_package_id?: string | null;
          price_deal?: number | null;
          dp_amount?: number | null;
          dp_paid_date?: string | null;
          full_paid_date?: string | null;
          payment_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendor_packages: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          includes: string[] | null;
          excludes: string[] | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description?: string | null;
          price: number;
          includes?: string[] | null;
          excludes?: string[] | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          includes?: string[] | null;
          excludes?: string[] | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      vendor_images: {
        Row: {
          id: string;
          vendor_id: string;
          storage_path: string;
          file_name: string;
          file_size: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          storage_path: string;
          file_name: string;
          file_size?: number | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          storage_path?: string;
          file_name?: string;
          file_size?: number | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          wedding_id: string;
          category: string;
          description: string;
          amount: number;
          expense_date: string;
          vendor_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          category: string;
          description: string;
          amount: number;
          expense_date?: string;
          vendor_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          category?: string;
          description?: string;
          amount?: number;
          expense_date?: string;
          vendor_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      seserahan: {
        Row: {
          id: string;
          wedding_id: string;
          item_name: string;
          category: "mahar" | "seserahan";
          sub_category: string | null;
          brand: string | null;
          price_min: number;
          price_max: number;
          shop_url: string | null;
          shop_platform: string | null;
          purchase_status: "belum_dibeli" | "sudah_dibeli" | "sudah_diterima";
          actual_price: number | null;
          purchase_date: string | null;
          priority: "tinggi" | "sedang" | "rendah";
          sort_order: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          item_name: string;
          category: "mahar" | "seserahan";
          sub_category?: string | null;
          brand?: string | null;
          price_min?: number;
          price_max?: number;
          shop_url?: string | null;
          shop_platform?: string | null;
          purchase_status?: "belum_dibeli" | "sudah_dibeli" | "sudah_diterima";
          actual_price?: number | null;
          purchase_date?: string | null;
          priority?: "tinggi" | "sedang" | "rendah";
          sort_order?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          item_name?: string;
          category?: "mahar" | "seserahan";
          sub_category?: string | null;
          brand?: string | null;
          price_min?: number;
          price_max?: number;
          shop_url?: string | null;
          shop_platform?: string | null;
          purchase_status?: "belum_dibeli" | "sudah_dibeli" | "sudah_diterima";
          actual_price?: number | null;
          purchase_date?: string | null;
          priority?: "tinggi" | "sedang" | "rendah";
          sort_order?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          session_date: string | null;
          time_start: string | null;
          time_end: string | null;
          venue: string | null;
          max_capacity: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          session_date?: string | null;
          time_start?: string | null;
          time_end?: string | null;
          venue?: string | null;
          max_capacity?: number | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          name?: string;
          session_date?: string | null;
          time_start?: string | null;
          time_end?: string | null;
          venue?: string | null;
          max_capacity?: number | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          category: string;
          phone: string | null;
          email: string | null;
          pax_count: number;
          address: string | null;
          rsvp_status:
            | "belum_diundang"
            | "undangan_terkirim"
            | "hadir"
            | "tidak_hadir"
            | "belum_konfirmasi";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          category?: string;
          phone?: string | null;
          email?: string | null;
          pax_count?: number;
          address?: string | null;
          rsvp_status?:
            | "belum_diundang"
            | "undangan_terkirim"
            | "hadir"
            | "tidak_hadir"
            | "belum_konfirmasi";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          name?: string;
          category?: string;
          phone?: string | null;
          email?: string | null;
          pax_count?: number;
          address?: string | null;
          rsvp_status?:
            | "belum_diundang"
            | "undangan_terkirim"
            | "hadir"
            | "tidak_hadir"
            | "belum_konfirmasi";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      guest_sessions: {
        Row: {
          guest_id: string;
          session_id: string;
        };
        Insert: {
          guest_id: string;
          session_id: string;
        };
        Update: {
          guest_id?: string;
          session_id?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          wedding_id: string;
          title: string;
          description: string | null;
          category: string;
          start_date: string | null;
          due_date: string;
          priority: "urgent" | "high" | "medium" | "low";
          status: "todo" | "in_progress" | "done" | "cancelled";
          assignee: string | null;
          vendor_id: string | null;
          column_id: string;
          sort_order: number;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          title: string;
          description?: string | null;
          category?: string;
          start_date?: string | null;
          due_date: string;
          priority?: "urgent" | "high" | "medium" | "low";
          status?: "todo" | "in_progress" | "done" | "cancelled";
          assignee?: string | null;
          vendor_id?: string | null;
          column_id?: string;
          sort_order?: number;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          start_date?: string | null;
          due_date?: string;
          priority?: "urgent" | "high" | "medium" | "low";
          status?: "todo" | "in_progress" | "done" | "cancelled";
          assignee?: string | null;
          vendor_id?: string | null;
          column_id?: string;
          sort_order?: number;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          keys_p256dh: string;
          keys_auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          keys_p256dh: string;
          keys_auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          keys_p256dh?: string;
          keys_auth?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
