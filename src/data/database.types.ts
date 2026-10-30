export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'ops' | 'seller' | 'rider'
export type RiderVehicleType = 'bike' | 'bicycle' | 'van'
export type RiderStatus = 'available' | 'on_delivery' | 'offline'
export type DbOrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string
          phone: string
          status: 'pending_approval' | 'active' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: UserRole
          full_name: string
          phone: string
          status?: 'pending_approval' | 'active' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string
          phone?: string
          status?: 'pending_approval' | 'active' | 'suspended'
          updated_at?: string
        }
      }
      sellers: {
        Row: {
          id: string
          profile_id: string
          business_name: string
          phone: string
          area: string
          address: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          business_name: string
          phone: string
          area?: string
          address?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          business_name?: string
          phone?: string
          area?: string
          address?: string | null
          approved_at?: string | null
          updated_at?: string
        }
      }
      riders: {
        Row: {
          id: string
          profile_id: string
          vehicle_type: RiderVehicleType
          status: RiderStatus
          current_zone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          vehicle_type?: RiderVehicleType
          status?: RiderStatus
          current_zone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          vehicle_type?: RiderVehicleType
          status?: RiderStatus
          current_zone?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          address: string
          area: string
          landmark: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address: string
          area: string
          landmark?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          address?: string | null
          area?: string
          landmark?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          tracking_token: string
          seller_id: string
          customer_id: string
          rider_id: string | null
          status: DbOrderStatus
          product_description: string
          cod_amount_kobo: number
          delivery_fee_kobo: number
          pickup_address: string
          dropoff_address: string
          dropoff_area: string
          dropoff_landmark: string | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          tracking_token?: string
          seller_id: string
          customer_id: string
          rider_id?: string | null
          status?: DbOrderStatus
          product_description: string
          cod_amount_kobo?: number
          delivery_fee_kobo?: number
          pickup_address: string
          dropoff_address: string
          dropoff_area: string
          dropoff_landmark?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          tracking_token?: string
          seller_id?: string
          customer_id?: string
          rider_id?: string | null
          status?: DbOrderStatus
          product_description?: string
          cod_amount_kobo?: number
          delivery_fee_kobo?: number
          pickup_address?: string
          dropoff_address?: string
          dropoff_area?: string
          dropoff_landmark?: string | null
          failure_reason?: string | null
          updated_at?: string
        }
      }
      order_events: {
        Row: {
          id: string
          order_id: string
          from_status: DbOrderStatus | null
          to_status: DbOrderStatus
          actor_id: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          from_status?: DbOrderStatus | null
          to_status: DbOrderStatus
          actor_id?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          from_status?: DbOrderStatus | null
          to_status?: DbOrderStatus
          actor_id?: string | null
          note?: string | null
        }
      }
    }
  }
}
