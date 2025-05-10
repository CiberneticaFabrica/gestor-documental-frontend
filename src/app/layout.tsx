import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ConnectivityMonitor from "@/components/ui/connectivity-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestor Documental",
  description: "Sistema de gestión documental",
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
            <Toaster /> 
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

