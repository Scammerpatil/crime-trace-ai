"use client";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import Header from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <title>
          CrimeTrace AI | Intelligent Criminal Investigation Platform
        </title>
        <meta
          name="description"
          content="Crimetrace AI is an intelligent law enforcement platform that combines facial recognition, case tracking, suspect profiling, and AI crime prediction to streamline investigations, enhance public safety, and empower forensic analysts with cutting-edge tools."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Header />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
