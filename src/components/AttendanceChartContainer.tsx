import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import AttendanceChart from "./AttendanceChart"

interface AttendanceData {
  name: string
  present: number
  absent: number
  presentColor: string
  absentColor: string
}

export default async function AttendanceChartContainer() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const lastMonday = new Date(today.setDate(today.getDate() - daysSinceMonday))

  try {
    const resData = await prisma.attendance.findMany({
      where: {
        date: {
          gte: lastMonday,
        },
      },
      select: {
        date: true,
        present: true,
      },
    })

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    const attendanceMap = daysOfWeek.reduce((acc, day) => {
      acc[day] = { present: 0, absent: 0 }
      return acc
    }, {} as Record<string, { present: number; absent: number }>)

    resData.forEach((item) => {
      const itemDate = new Date(item.date)
      const dayOfWeek = itemDate.getDay()

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const dayName = daysOfWeek[dayOfWeek - 1]
        item.present ? attendanceMap[dayName].present++ : attendanceMap[dayName].absent++
      }
    })

    const data: AttendanceData[] = daysOfWeek.map((day) => ({
      name: day,
      present: attendanceMap[day].present,
      absent: attendanceMap[day].absent,
      presentColor: "hsl(217, 91%, 60%)", // Tailwind blue-500
      absentColor: "hsl(0, 84%, 60%)", // Tailwind red-500
    }))

    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Attendance</CardTitle>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <AttendanceChart data={data} />
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Failed to fetch attendance data:", error)
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Failed to load attendance data.</p>
        </CardContent>
      </Card>
    )
  }
}