'use client';
import { Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const chartConfig = {
    '2xx': { label: 'Success', color: 'hsl(var(--chart-1))' },
    '4xx': { label: 'Client Error', color: 'hsl(var(--chart-3))' },
    '5xx': { label: 'Server Error', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

export const StatusCodePieChart = ({ data }: { data: any }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value, fill: `var(--color-${name})` }));
    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="value" nameKey="name" />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
            </PieChart>
        </ChartContainer>
    );
};