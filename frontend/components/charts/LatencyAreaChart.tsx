'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';

const chartConfig = {
    responseTime: { label: 'Response Time', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

export const LatencyAreaChart = ({ data }: { data: any[] }) => {
    const chartData = useMemo(() => data.map(m => ({
        timestamp: m.timestamp,
        responseTime: m.responseTime,
    })), [data]);

    return (
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="fillResponseTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-responseTime)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-responseTime)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="responseTime" type="natural" fill="url(#fillResponseTime)" stroke="var(--color-responseTime)" stackId="a" />
            </AreaChart>
        </ChartContainer>
    );
};