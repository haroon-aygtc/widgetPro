// Types
export interface User {
    id: number;
    name: string;
    email: string;
    status: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    permissions?: Permission[];
  }
  
  export interface Role {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
    users_count?: number;
  }
  
  export interface Permission {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    category: string;
    created_at: string;
    updated_at: string;
    roles_count?: number;
    users_count?: number;
  }
  
  export interface UserActivity {
    id: number;
    user_id: number;
    action: string;
    description?: string;
    status: "success" | "failed" | "warning";
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    user?: User;
  }