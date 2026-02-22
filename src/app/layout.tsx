
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FocusProvider } from "@/lib/store";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { AuthGuard } from "@/components/auth-guard";

export const metadata: Metadata = {
  title: 'FocusFlow | Study Smarter',
  description: 'An AI-powered focus and study management dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="google-site-verification"
          content="PASTE_YOUR_GOOGLE_CODE_HERE"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AuthGuard>
            <FocusProvider>
              {children}
              <Toaster />
            </FocusProvider>
          </AuthGuard>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
