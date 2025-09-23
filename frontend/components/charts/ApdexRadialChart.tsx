'use client';

import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Define a more complete chart config with colors for each state
const chartConfig = {
    score: {
        label: 'Apdex Score',
    },
    excellent: {
        label: "Excellent",
        color: "hsl(var(--chart-2))", // Green
    },
    good: {
        label: "Good",
        color: "hsl(var(--chart-1))", // Blue
    },
    fair: {
        label: "Fair",
        color: "hsl(var(--chart-3))", // Orange
    },
    poor: {
        label: "Poor",
        color: "hsl(var(--chart-5))", // Red
    },
} satisfies ChartConfig;

export const ApdexRadialChart = ({
    score,
    previousScore = null,
    period = "month"
}: {
    score: number;
    previousScore?: number | null;
    period?: string;
}) => {
    // Determine the color and label based on the Apdex score
    const getScoreStyle = (s: number) => {
        if (s >= 0.94) return chartConfig.excellent;
        if (s >= 0.85) return chartConfig.good;
        if (s >= 0.70) return chartConfig.fair;
        return chartConfig.poor;
    };

    const { color: scoreColor, label: scoreLabel } = getScoreStyle(score);

    const chartData = [{
        name: 'apdex',
        score: score * 100, // Convert score to a percentage for the chart domain
        fill: scoreColor
    }];

    // Calculate trend if previous score is available
    const trend = previousScore ? ((score - previousScore) / previousScore) * 100 : null;
    const isPositiveTrend = trend !== null && trend > 0;
    const isNegativeTrend = trend !== null && trend < 0;

    return (
        <Card >
            <CardHeader className="items-center pb-0">
                <CardTitle>Apdex Score</CardTitle>
                <CardDescription>Overall User Satisfaction</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        // FIX 1: Set angles to create a top semi-circle gauge
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={130} // Adjusted for a thicker bar
                        barSize={20}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            {/* FIX 2: Improved label styling for better visibility */}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {score.toFixed(2)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-lg"
                                                >
                                                    Score
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="score"
                            // FIX 3: Add the background to create the track effect
                            background={{ fill: "hsl(var(--muted))" }}
                            cornerRadius={10}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {trend !== null && (
                    <div className="flex items-center gap-2 font-medium leading-none">
                        {isPositiveTrend && <TrendingUp className="h-4 w-4" />}
                        {isNegativeTrend && <TrendingDown className="h-4 w-4 text-destructive" />}
                        <span className={isNegativeTrend ? "text-destructive" : ""}>
                            {Math.abs(trend).toFixed(1)}% {isPositiveTrend ? 'up' : 'down'} vs. last {period}
                        </span>
                    </div>
                )}
                <div className="leading-none text-muted-foreground">
                    {scoreLabel} user satisfaction
                </div>
            </CardFooter>
        </Card>
    );
};