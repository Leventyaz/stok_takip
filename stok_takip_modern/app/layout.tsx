import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { AuthProvider } from "@/lib/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stok Takip Sistemi",
  description: "Modern Stok Takip Uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
          }
          
          /* Layout styles */
          .app-container {
            display: flex;
            height: 100vh;
            width: 100vw;
            background-color: #f9fafb;
          }
          
          /* Sidebar styles */
          .sidebar-container { 
            width: 16rem;
            height: 100%;
            background-color: white;
            border-right: 1px solid #e5e7eb;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
          }
          
          /* Main content area */
          .main-content {
            margin-left: 16rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            width: calc(100% - 16rem);
          }
          
          /* Navbar styles */
          .navbar {
            height: 4rem;
            background-color: white;
            border-bottom: 1px solid #e5e7eb;
            width: 100%;
          }
          
          /* Main content styles */
          .main-container {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            background-color: #f3f4f6;
            height: calc(100vh - 4rem);
          }
          
          /* Animation for spinner */
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          /* Auth pages styles */
          .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
          }

          .auth-card {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            width: 100%;
            max-width: 28rem;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="app-container">
            <div className="sidebar-container">
              <Sidebar />
            </div>
            <div className="main-content">
              <div className="navbar">
                <TopNav />
              </div>
              <main className="main-container">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 