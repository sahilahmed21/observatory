// app/(dashboard)/projects/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import withAuth from '@/components/auth/withAuth';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Timer, AlertCircle, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useWebSocket } from '@/app/hooks/useWebSocket';
interface Metric {
    timestamp: string;
    responseTime: number;
    statusCode: number;
}

const ProjectDetailsPage = () => {
    const params = useParams();
    const projectId = params.id as string;

    const fetchProjectMetrics = async (): Promise<Metric[]> => {
        const response = await api.get(`/projects/${projectId}/metrics?timeframe=24`);
        return response.data;
    };
    useWebSocket(projectId);

    const { data: metrics, isLoading, isError } = useQuery({
        queryKey: ['projectMetrics', projectId],
        queryFn: fetchProjectMetrics,
        enabled: !!projectId,
    });

    // Calculate statistics using useMemo for efficiency
    const stats = useMemo(() => {
        if (!metrics || metrics.length === 0) {
            return { avgLatency: 0, errorRate: 0, successRate: 0 };
        }
        const totalLatency = metrics.reduce((acc, m) => acc + m.responseTime, 0);
        const avgLatency = totalLatency / metrics.length;
        const errorCount = metrics.filter(m => m.statusCode >= 400).length;
        const errorRate = (errorCount / metrics.length) * 100;
        const successRate = 100 - errorRate;
        return { avgLatency, errorRate, successRate };
    }, [metrics]);


    const chartData = metrics?.map((metric) => ({
        name: new Date(metric.timestamp).toLocaleTimeString(),
        responseTime: metric.responseTime,
    }));

    if (isLoading) return <div className="p-8">Loading metrics...</div>;
    if (isError) return <div className="p-8 text-red-500">Failed to load metrics.</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Avg. Latency" value={`${stats.avgLatency.toFixed(0)} ms`} icon={Timer} />
                <StatCard title="Success Rate" value={`${stats.successRate.toFixed(1)}%`} icon={CheckCircle} />
                <StatCard title="Error Rate" value={`${stats.errorRate.toFixed(1)}%`} icon={AlertCircle} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Response Time (Last 24 Hours)</CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData && chartData.length > 0 ? (
                        <TimeSeriesChart data={chartData} />
                    ) : (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                            <p>No metrics recorded in the last 24 hours.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default withAuth(ProjectDetailsPage);