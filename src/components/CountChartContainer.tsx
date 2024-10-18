import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import CountChart from "./CountChart"

interface StudentCount {
  sex: "MALE" | "FEMALE"
  _count: {
    sex: number
  }
}

export default async function CountChartContainer() {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: {
      sex: true
    },
  })

  const boys = data.find((d) => d.sex === "MALE")?._count.sex || 0
  const girls = data.find((d) => d.sex === "FEMALE")?._count.sex || 0
  const total = boys + girls

  const calculatePercentage = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Students</CardTitle>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <CountChart boys={boys} girls={girls} />
        <div className="flex justify-center gap-8 mt-4">
          {[
            { label: "Boys", count: boys, color: "bg-sky-400" },
            { label: "Girls", count: girls, color: "bg-yellow-400" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 ${color} rounded-full`} />
              <p className="font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">
                {label} ({calculatePercentage(count)}%)
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}