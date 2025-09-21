'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { CreateProjectDialog } from '@/components/dashboard/CreateProjectDialog';
import withAuth from '@/components/auth/withAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    apiKeys: { key: string }[];
}

const DashboardPage = () => {
    const fetchProjects = async (): Promise<Project[]> => {
        const response = await api.get('/projects');
        return response.data;
    };

    const { data: projects, isLoading, isError } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    if (isLoading) return <div className="p-8">Loading your projects...</div>;
    if (isError) return <div className="p-8 text-red-500">Failed to load projects.</div>;

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
                <CreateProjectDialog />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects && projects.length > 0 ? (
                    projects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id}>
                            <Card className="hover:border-primary transition-colors cursor-pointer">
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">API Key:</p>
                                    <code className="text-xs bg-muted p-1 rounded font-mono break-all">
                                        {project.apiKeys[0]?.key}
                                    </code>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <p>You haven't created any projects yet.</p>
                )}
            </div>
        </div>
    );
};

export default withAuth(DashboardPage);