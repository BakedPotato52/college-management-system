import { Suspense } from 'react'
import Navbar from "@/components/Navbar"
import MenuWrapper from '@/components/MenuWrapper'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}

      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-md"></div>}>
        <aside className="w-64">
          <MenuWrapper />
        </aside>
        <main className="flex-1">{children}</main>
      </Suspense>

      {/* Main Content */}
      <main className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}