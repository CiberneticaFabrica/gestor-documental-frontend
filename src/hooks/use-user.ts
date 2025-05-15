export function useUser() {
  return {
    requestPasswordReset: async () => {
      // Mock: simula una llamada a API
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    updatePassword: async (currentPassword: string, newPassword: string) => {
      // Mock: simula una llamada a API
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
  };
} 