// app/components/charts/TimeSeriesChart.tsx
'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

interface ChartData {
    name: string;
    responseTime: number;
}

// 1. Define the chart's configuration
const chartConfig = {
    responseTime: {
        label: 'Response Time (ms)',
        color: 'hsl(var(--primary))',
    },
} satisfies ChartConfig;

export const TimeSeriesChart = ({ data }: { data: ChartData[] }) => {
    return (
        // 2. Use the new ChartContainer to wrap the chart
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="fillResponseTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-responseTime)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-responseTime)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                    tickFormatter={(value) => `${value}ms`}
                />
                {/* 3. Use the new, pre-styled Tooltip */}
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                    dataKey="responseTime"
                    type="natural"
                    fill="url(#fillResponseTime)"
                    stroke="var(--color-responseTime)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
};