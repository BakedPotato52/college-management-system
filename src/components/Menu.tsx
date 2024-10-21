import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import menuItems from "./menuItems";
import { LucideIcon } from "lucide-react";

export default async function Menu() {
  const user = await currentUser();
  const role = user?.publicMetadata.role as "admin" | "teacher" | "student" | "parent";

  return (
    <nav className="mt-4 text-sm text-black" aria-label="Main Navigation">
      {menuItems.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="sr-only lg:not-sr-only text-gray-400 font-light mb-2 px-3">
            {section.title}
          </h2>
          <ul className="flex flex-col gap-1">
            {section.items
              .filter((item) => item.visible.includes(role))
              .map((item) => {
                const IconComponent = item.icon as LucideIcon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 px-3 rounded-md hover:bg-lamaSkyLight transition-colors duration-200"
                      aria-label={item.label}
                    >
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}