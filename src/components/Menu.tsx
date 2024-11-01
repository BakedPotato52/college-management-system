"use client"

import { useState } from "react"
import Link from "next/link"
import { LucideIcon, MoreHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import menuItems from "./menuItems"
import Image from "next/image"

interface MenuProps {
  role: "admin" | "teacher" | "student"
}

export default function Menu({ role }: MenuProps) {
  const [open, setOpen] = useState(false)

  const visibleItems = menuItems.flatMap(section =>
    section.items.filter(item => item.visible.includes(role))
  )

  const renderMenuItem = (item: typeof visibleItems[0], index: number) => {
    const IconComponent = item.icon as LucideIcon
    return (
      <li key={item.label} className={index >= 3 ? "lg:hidden" : ""}>
        <Link
          href={item.href}
          className="flex flex-col items-center justify-center gap-1 p-2 text-gray-500 hover:bg-lamaSkyLight transition-colors duration-200 rounded-md"
          aria-label={item.label}
          onClick={() => setOpen(false)}
        >
          <IconComponent className="w-6 h-6" aria-hidden="true" />
          <span className="text-xs">{item.label}</span>
        </Link>
      </li>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="max-sm:hidden mt-4 text-sm text-black" aria-label="Main Navigation">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-8"
          aria-label="ICFAI University Home"
        >
          <Image src="/logo.png" className="w-auto h-auto" alt="" width={32} height={32} />
          <span className="hidden lg:block font-bold text-primary">ICFAI University</span>
        </Link>
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-gray-400 font-light mb-2 px-3">
              {section.title}
            </h2>
            <ul className="flex flex-col gap-1">
              {section.items
                .filter((item) => item.visible.includes(role))
                .map((item) => {
                  const IconComponent = item.icon as LucideIcon
                  return (
                    <div className="flex items-center justify-start gap-4 text-gray-500 py-2 px-3 rounded-md w-full  transition-colors duration-300 ease-in-out hover:text-black dark:hover:text-white  hover:animate-out">
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-start gap-4 "
                          aria-label={item.label}
                        >
                          <IconComponent className="w-5 h-5" aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    </div>
                  )
                })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50" aria-label="Mobile Navigation">
        <ul className="flex justify-around items-center h-16">
          {visibleItems.slice(0, 3).map((item, index) => renderMenuItem(item, index))}
          <li>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More options" className="w-full flex h-full">
                  <div className="flex flex-col items-center justify-center gap-1 p-2 text-gray-500 hover:bg-sky-300 transition-colors duration-200 rounded-md">
                    <MoreHorizontal />
                    <span className="text-xs mt-1">More</span>
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <nav aria-label="More Navigation Options">
                  <ul className="grid grid-cols-3 gap-4 pt-4">
                    {visibleItems.slice(3).map((item, index) => renderMenuItem(item, index + 3))}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </nav>
    </>
  )
}