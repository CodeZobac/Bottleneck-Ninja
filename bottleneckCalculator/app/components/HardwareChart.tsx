"use client"
import React, { useEffect, useState } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, Chart, type ChartConfig, ChartTooltip, ChartTooltipContent } from "./ui"



const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function HardwareChart(data: { component: string, score: number }[]) {
    return (
    <Card>
      <Card.Header className="items-center">
        <Card.Title>Components Bottleneck Chart</Card.Title>
        <Card.Description>Displaying performance bottlenecks</Card.Description>
      </Card.Header>
      <Card.Content>
        <Chart config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="component" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-revenue)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </Chart>
      </Card.Content>
    </Card>
  )
}
