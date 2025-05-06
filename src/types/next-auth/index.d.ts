import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extiende el objeto de sesión por defecto
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  /**
   * Extiende el objeto de usuario que es pasado al callback JWT
   */
  interface User {
    id: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extiende el token JWT
   */
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}