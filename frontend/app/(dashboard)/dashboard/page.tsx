'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import withAuth from '@/components/auth/withAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Define the shape of our project data
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

    // Use TanStack Query to fetch, cache, and manage the state of our data
    const { data: projects, isLoading, isError } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    if (isLoading) return <div className="p-8">Loading your projects...</div>;
    if (isError) return <div className="p-8 text-red-500">Failed to load projects.</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects && projects.length > 0 ? (
                    projects.map((project) => (
                        <Card key={project.id}>
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
                    ))
                ) : (
                    <p>You haven't created any projects yet.</p>
                )}
            </div>
        </div>
    );
};

export default withAuth(DashboardPage);