import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, User, UserPlus, LayoutDashboard, ListOrdered, FileText } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { PatientQueueProvider } from "@/context/PatientQueueContext";

export const metadata: Metadata = {
  title: "CarePulse",
  description: "A healthcare management system for patients and doctors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/icons/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "font-body"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <PatientQueueProvider>
            <SidebarProvider>
              <Sidebar>
                  <SidebarContent className="flex flex-col">
                    <header className="p-4 flex items-center gap-2">
                      <Link href="/" className="font-bold text-xl text-primary">CarePulse</Link>
                    </header>
                    <nav className="flex flex-col gap-2 p-4">
                      <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><Home size={20} /><span>Home</span></Link>
                      <Link href="/?admin=true" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><User size={20} /><span>Admin Login</span></Link>
                      <Link href="/admin" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><LayoutDashboard size={20} /><span>Admin Dashboard</span></Link>
                      <Link href="/patients/user1/register" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><UserPlus size={20} /><span>Register</span></Link>
                      <Link href="/reception/add-user" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><UserPlus size={20} /><span>Add Patient</span></Link>
                      <Link href="/reception/queue" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><ListOrdered size={20} /><span>Patient Queue</span></Link>
                      <Link href="/prescription" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"><FileText size={20} /><span>Prescription</span></Link>
                    </nav>
                  </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <header className="p-4 flex items-center justify-between md:hidden sticky top-0 bg-background z-10 border-b">
                    <Link href="/" className="font-bold text-lg text-primary">CarePulse</Link>
                    <SidebarTrigger />
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </PatientQueueProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
