import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { AppProvider } from '@/app/providers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[#050505] text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-8 space-y-8">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

