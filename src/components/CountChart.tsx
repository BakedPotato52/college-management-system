"use client"

import { Users } from "lucide-react"
import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CountChartProps {
  boys: number
  girls: number
}

export default function CountChart({ boys, girls }: CountChartProps) {
  const total = boys + girls
  const data = [
    {
      name: "Total",
      count: total,
      fill: "hsl(var(--muted))",
    },
    {
      name: "Girls",
      count: girls,
      fill: "hsl(340 82% 65%)", // Equivalent to bg-pink-400
    },
    {
      name: "Boys",
      count: boys,
      fill: "hsl(199 89% 60%)", // Equivalent to bg-sky-400
    },
  ]

  return (
    <Card className="w-full h-[300px]">
      <ChartContainer
        config={{
          count: {
            label: "Count",
            color: "hsl(var(--foreground))",
          },
        }}
      >
        <div className="relative w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background
                dataKey="count"
                cornerRadius={16}
                label={{ position: "insideStart", fill: "#fff", fontWeight: 600 }}
              />
              <Tooltip content={<ChartTooltipContent />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </div>
      </ChartContainer>
    </Card>
  )
}