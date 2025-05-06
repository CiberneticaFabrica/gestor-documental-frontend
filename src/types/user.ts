export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    lastName: string;
    position?: string;
    department?: string;
    isActive: boolean;
    isSuperAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    hasTwoFactorEnabled: boolean;
  }
  
  export interface Group {
    id: string;
    name: string;
    description?: string;
    userCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Role {
    id: string;
    name: string;
    description?: string;
    isBuiltIn: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
  }
  
  export interface UserGroups {
    userId: string;
    groups: {
      id: string;
      name: string;
    }[];
  }
  
  export interface UserRoles {
    userId: string;
    roles: {
      id: string;
      name: string;
    }[];
  }
  
  export interface RolePermissions {
    roleId: string;
    permissions: Permission[];
  }