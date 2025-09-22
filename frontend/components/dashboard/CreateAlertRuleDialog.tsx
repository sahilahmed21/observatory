'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/app/lib/api';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

// 1. Define the schema
const formSchema = z.object({
    name: z.string().min(3, { message: 'Rule name is required.' }),
    metric: z.enum(['latency', 'status_code']),
    operator: z.enum(['>', '<', '==']),
    threshold: z.coerce.number().int().positive("Threshold must be a positive number."),
    endpointFilter: z.string().optional(),
});

// 2. Create an explicit TypeScript type from the schema
type AlertFormValues = z.infer<typeof formSchema>;

export const CreateAlertRuleDialog = ({ projectId }: { projectId: string }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    // 3. Use useForm without explicit generic typing to let TypeScript infer
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            metric: 'latency',
            operator: '>',
            endpointFilter: '',
            threshold: 100,
        },
    });

    const createRuleMutation = useMutation({
        mutationFn: (values: AlertFormValues) =>
            api.post(`/projects/${projectId}/alerts`, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alertRules', projectId] });
            setOpen(false);
            form.reset();
        },
    });

    // 4. Use SubmitHandler type for better compatibility
    const onSubmit: SubmitHandler<AlertFormValues> = (values) => {
        createRuleMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Alert Rule
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Alert Rule</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rule Name</FormLabel>
                                <FormControl><Input placeholder="e.g., High Latency on Users API" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="metric" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Metric</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a metric" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="latency">Latency (ms)</SelectItem>
                                        <SelectItem value="status_code">Status Code</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex gap-2">
                            <FormField name="operator" control={form.control} render={({ field }) => (
                                <FormItem className="w-1/3">
                                    <FormLabel>Operator</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value=">">{'>'} (Greater Than)</SelectItem>
                                            <SelectItem value="<">{'<'} (Less Than)</SelectItem>
                                            <SelectItem value="==">{'=='} (Equal To)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="threshold" control={form.control} render={({ field }) => (
                                <FormItem className="w-2/3">
                                    <FormLabel>Threshold</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 500" {...field} value={field.value?.toString() || ''} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField name="endpointFilter" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endpoint (Optional)</FormLabel>
                                <FormControl><Input placeholder="/api/users (leave blank for all)" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={createRuleMutation.isPending} className="w-full">
                            {createRuleMutation.isPending ? 'Creating...' : 'Create Rule'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};