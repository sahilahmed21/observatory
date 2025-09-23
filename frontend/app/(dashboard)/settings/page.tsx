'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import withAuth from '@/components/auth/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateAlertRuleDialog } from '@/components/dashboard/CreateAlertRuleDialog';

// 1. Define the shape of the Project and AlertRule data
interface Project {
    id: string;
    name: string;
}

interface AlertRule {
    id: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    endpointFilter: string | null;
}

const AlertsPage = () => {
    // 2. Tell useQuery to expect an array of Project objects
    const { data: projects } = useQuery<Project[]>({ queryKey: ['projects'], queryFn: () => api.get('/projects').then(res => res.data) });
    const projectId = projects?.[0]?.id;

    // 3. Tell useQuery to expect an array of AlertRule objects
    const { data: rules, isLoading } = useQuery<AlertRule[]>({
        queryKey: ['alertRules', projectId],
        queryFn: () => api.get(`/projects/${projectId}/alerts`).then(res => res.data),
        enabled: !!projectId,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Alert Rules</h1>
                {projectId && <CreateAlertRuleDialog projectId={projectId} />}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Configured Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Condition</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow><TableCell colSpan={2}>Loading rules...</TableCell></TableRow>
                            )}
                            {rules?.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell>{rule.name}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {`WHEN ${rule.metric} ${rule.operator} ${rule.threshold} ON ${rule.endpointFilter || '*'}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(AlertsPage);