import { Suspense } from 'react'
import Navbar from "@/components/Navbar"
import MenuWrapper from '@/components/MenuWrapper'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background select-none ">
      {/* Sidebar */}

      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-md"></div>}>
        <aside>
          <MenuWrapper />
        </aside>
      </Suspense>

      {/* Main Content */}
      <main className="w-full max-sm:w-full lg:w-[84%] xl:w-[86%] bg-background overflow-scroll flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}