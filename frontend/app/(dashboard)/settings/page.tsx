// app/(dashboard)/settings/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import withAuth from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';

// NOTE: For now, we are just displaying rules. The form to create them
// would be in a separate Dialog component, similar to the Create Project feature.

const AlertsPage = () => {
    // A placeholder projectId - in a real app you'd get this from a context or URL
    const projectId = "your-project-id-here";

    const { data: rules, isLoading } = useQuery({
        queryKey: ['alertRules', projectId],
        queryFn: () => api.get(`/projects/${projectId}/alerts`).then(res => res.data),
        enabled: !!projectId
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Alert Rules</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Alert Rule
                </Button>
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
                            {isLoading ? (
                                <TableRow><TableCell colSpan={2}>Loading rules...</TableCell></TableRow>
                            ) : (
                                rules?.map((rule: any) => (
                                    <TableRow key={rule.id}>
                                        <TableCell>{rule.name}</TableCell>
                                        <TableCell>
                                            {`Alert when ${rule.metric} ${rule.operator} ${rule.threshold}`}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(AlertsPage);