"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AttendanceData {
  name: string
  present: number
  absent: number
}

interface AttendanceChartProps {
  data: AttendanceData[]
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card className="w-full h-[400px]">
      <ChartContainer
        config={{
          present: {
            label: "Present",
            color: "hsl(var(--warning))",
          },
          absent: {
            label: "Absent",
            color: "hsl(var(--sky))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
            />
            <Bar
              dataKey="present"
              fill="hsl(var(--warning))"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="absent"
              fill="hsl(var(--sky))"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}