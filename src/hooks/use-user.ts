export function useUser() {
  return {
    requestPasswordReset: async (_email: string) => {
      // Mock: simula una llamada a API
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
  };
} 