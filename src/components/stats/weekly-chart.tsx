"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { WeeklyCompletionPoint } from "@/services/stats"

const chartConfig = {
  count: { label: "Tareas completadas", color: "var(--primary)" },
} satisfies ChartConfig

export function WeeklyChart({ data }: { data: WeeklyCompletionPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.3} />
        <XAxis
          dataKey="weekLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={1}
          fontSize={11}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
