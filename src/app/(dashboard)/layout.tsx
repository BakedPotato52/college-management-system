import { Suspense } from 'react'
import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar"
import Image from "next/image"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-white border-r border-gray-200">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-8"
          aria-label="ICFAI University Home"
        >
          <Image src="/logo.png" alt="" width={32} height={32} />
          <span className="hidden lg:block font-bold text-primary">ICFAI University</span>
        </Link>
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-md"></div>}>
          <Menu />
        </Suspense>
      </aside>

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