import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";
import Link from "next/link";

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
          "min-h-screen bg-dark-300 font-sans antialiased",
          "font-body"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <header className="flex justify-center p-4 bg-dark-400">
            <nav className="flex gap-4 text-white">
              <Link href="/" className="hover:text-green-500">Home</Link>
              <Link href="/?admin=true" className="hover:text-green-500">Admin Login</Link>
              <Link href="/admin" className="hover:text-green-500">Admin Dashboard</Link>
              <Link href="/patients/user1/register" className="hover:text-green-500">Register</Link>
              <Link href="/patients/user1/new-appointment" className="hover:text-green-500">New Appointment</Link>
              <Link href="/reception/add-user" className="hover:text-green-500">Add Patient</Link>
            </nav>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
