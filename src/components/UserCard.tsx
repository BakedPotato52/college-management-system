import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"

type UserType = "admin" | "teacher" | "student" | "parent"

interface UserCardProps {
  type: UserType
}

const modelMap: Record<UserType, any> = {
  admin: prisma.admin,
  teacher: prisma.teacher,
  student: prisma.student,
  parent: prisma.parent,
}

export default async function UserCard({ type }: UserCardProps) {
  const data = await modelMap[type].count()

  return (
    <Card className={`flex-1 min-w-[130px] ${type === "admin" || type === "student" ? "bg-primary" : "bg-secondary"}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)}s
        </CardTitle>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data}</div>
        <Badge variant="outline" className="mt-2">
          2024/25
        </Badge>
      </CardContent>
    </Card>
  )
}