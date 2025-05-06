import 'next-auth';
 

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  }
} 