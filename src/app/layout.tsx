import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ConnectivityMonitor from "@/components/ui/connectivity-monitor";
import { Toaster } from 'sonner';
import { ChatWidget } from "@/components/chatbot/ChatWidget";

const inter = Roboto(
  {  weight: ['400', '500', '700'],
    subsets: ["latin"] 
  });

export const metadata: Metadata = {
  title: "FlowCoreX",
  description: "Sistema de gestión documental",
  icons: {
    icon: '/favicon.ico',
  },
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConnectivityMonitor />
            {children}
            <Toaster position="top-right" richColors />
            <ChatWidget />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

