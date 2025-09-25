
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import withAuth from '@/components/auth/withAuth';
import { CreateProjectDialog } from '@/components/dashboard/CreateProjectDialog';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { CheckCircle, Timer, BarChart, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Updated Project type to include the apiKeys array
interface Project {
    id: string;
    name: string;
    apiKeys: { key: string }[];
    avgLatency: number;
    successRate: number;
    totalRequests: number;
}

const DashboardPage = () => {
    const { data: projects, isLoading, isError } = useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: () => api.get('/projects').then(res => res.data),
    });

    // A dedicated component for our new, data-rich project card
    const ProjectCard = ({ project }: { project: Project }) => {
        const [copied, setCopied] = useState(false);
        const apiKey = project.apiKeys?.[0]?.key;

        const handleCopy = () => {
            if (apiKey) {
                navigator.clipboard.writeText(apiKey);
                setCopied(true);
                toast.success("API Key copied to clipboard!");
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            }
        }

        return (
            <BackgroundGradient
                className="rounded-[22px] p-4 sm:p-6 bg-zinc-900 h-full"
                containerClassName="h-full"
            >
                <div className="flex flex-col h-full">
                    <Link href={`/projects/${project.id}`} className="group">
                        <p className="text-lg sm:text-xl font-medium text-white group-hover:underline">
                            {project.name}
                        </p>
                        <p className="text-sm text-neutral-400 mt-1">
                            Click to view performance dashboard
                        </p>
                    </Link>

                    {/* API Key Section - THIS IS THE FIX */}
                    <div className="my-4">
                        <p className="text-xs text-neutral-400 mb-1">API Key</p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted p-2 rounded-md font-mono break-all block w-full">
                                {apiKey || 'No key found'}
                            </code>
                            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!apiKey}>
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Live Stats Section */}
                    <div className="mt-auto pt-4 flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-neutral-300">
                                <Timer className="h-4 w-4 text-yellow-400" />
                                <span>{project.avgLatency.toFixed(0)} ms</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-300">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>{project.successRate.toFixed(1)}% Success</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{project.totalRequests}</p>
                            <p className="text-xs text-neutral-400">requests/24h</p>
                        </div>
                    </div>
                </div>
            </BackgroundGradient>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <CreateProjectDialog />
            </div>

            {isLoading && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-[14rem] rounded-[22px]" />
                    <Skeleton className="h-[14rem] rounded-[22px]" />
                    <Skeleton className="h-[14rem] rounded-[22px]" />
                </div>
            )}

            {isError && <p className="text-destructive">Failed to load projects. Please try again.</p>}

            {!isLoading && !isError && projects && projects.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
                </div>
            )}

            {!isLoading && !isError && projects?.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 mt-8">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold">Welcome to Axon</h2>
                    <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                        Get started by creating your first project to monitor.
                    </p>
                    <CreateProjectDialog />
                </div>
            )}
        </div>
    );
};

export default withAuth(DashboardPage);