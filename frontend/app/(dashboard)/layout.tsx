import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen relative">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-slate-950 via-[#0a0f1c] to-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
