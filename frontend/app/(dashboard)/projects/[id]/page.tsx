'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import withAuth from '@/components/auth/withAuth';
import { LatencyAreaChart } from '@/components/charts/LatencyAreaChart';
import { StatusCodePieChart } from '@/components/charts/StatusCodePieChart';
import { ApdexRadialChart } from '@/components/charts/ApdexRadialChart';
import { EndpointsTable } from '@/components/dashboard/EndpointsTable';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Timer, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-6">
                <Skeleton className="h-80" />
                <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
        </div>
    </div>
);


const ProjectDetailsPage = () => {
    const params = useParams();
    const projectId = params.id as string;

    const fetchProjectData = async () => {
        const [statsRes, metricsRes] = await Promise.all([
            api.get(`/projects/${projectId}/stats?timeframe=24`),
            api.get(`/projects/${projectId}/metrics?timeframe=24`),
        ]);
        return { stats: statsRes.data, metrics: metricsRes.data };
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['projectDashboard', projectId],
        queryFn: fetchProjectData,
        enabled: !!projectId,
    });

    const { stats, metrics } = data || {};

    const successRate = useMemo(() => {
        if (!stats?.statusCodeBreakdown || !metrics?.length) return 100;
        const errorCount = (stats.statusCodeBreakdown['4xx'] || 0) + (stats.statusCodeBreakdown['5xx'] || 0);
        return (1 - (errorCount / metrics.length)) * 100;
    }, [stats, metrics]);

    const avgLatency = useMemo(() => {
        if (!metrics || metrics.length === 0) return 0;
        return metrics.reduce((acc: number, m: any) => acc + m.responseTime, 0) / metrics.length;
    }, [metrics]);

    if (isLoading) return <DashboardSkeleton />;
    if (isError) return <div className="p-8 text-red-500">Failed to load dashboard data.</div>;
    if (!stats || !metrics) return <div className="p-8">No data available for this project yet.</div>;

    return (
        <div className="space-y-5">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Avg. Latency" value={`${avgLatency.toFixed(0)} ms`} icon={Timer} />
                <StatCard title="P95 Latency" value={`${stats.p95?.toFixed(0) || 0} ms`} icon={Timer} />
                <StatCard title="P99 Latency" value={`${stats.p99?.toFixed(0) || 0} ms`} icon={Timer} />
                <StatCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={CheckCircle} />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">

                {/* Left Column */}
                <div className="lg:col-span-3 space-y-5">
                    <Card>
                        <CardHeader><CardTitle>Response Time (Last 24 Hours)</CardTitle></CardHeader>
                        <CardContent className="pl-2">
                            {metrics && metrics.length > 0 ? (
                                <LatencyAreaChart data={metrics} />
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">No time-series data.</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Endpoint Performance</CardTitle></CardHeader>
                        <CardContent>
                            {stats.endpointBreakdown && stats.endpointBreakdown.length > 0 ? (
                                <EndpointsTable data={stats.endpointBreakdown} />
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">No endpoint data.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-4 lg:col-span-1">
                    <ApdexRadialChart score={stats.apdexScore} />
                    <Card>
                        <CardHeader><CardTitle>Status Codes</CardTitle></CardHeader>
                        <CardContent>
                            {stats.statusCodeBreakdown && Object.keys(stats.statusCodeBreakdown).length > 0 ? (
                                <StatusCodePieChart data={stats.statusCodeBreakdown} />
                            ) : (
                                <div className="h-[250px] flex items-center justify-center text-muted-foreground">No status code data.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default withAuth(ProjectDetailsPage);