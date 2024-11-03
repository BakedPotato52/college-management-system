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
      <main className="w-full max-sm:w-full bg-background overflow-scroll-y flex flex-col">
        <Navbar />
        <div className="flex-1 p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}