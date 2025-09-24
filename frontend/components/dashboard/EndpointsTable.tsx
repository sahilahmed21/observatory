'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const EndpointsTable = ({ data }: { data: any[] }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead className="text-right">Avg. Latency</TableHead>
                    <TableHead className="text-right">Error Rate</TableHead>
                    <TableHead className="text-right">Requests</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((endpoint) => (
                    <TableRow key={endpoint.endpoint}>
                        <TableCell className="font-mono">{endpoint.endpoint}</TableCell>
                        <TableCell className="text-right">{endpoint.avgLatency.toFixed(0)} ms</TableCell>
                        <TableCell className="text-right">{endpoint.errorRate.toFixed(1)}%</TableCell>
                        <TableCell className="text-right">{endpoint.requests}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
