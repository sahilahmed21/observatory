// app/components/dashboard/CreateProjectDialog.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/app/lib/api';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(3, { message: 'Project name must be at least 3 characters.' }),
});

export const CreateProjectDialog = () => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '' },
    });

    const createProjectMutation = useMutation({
        mutationFn: (projectName: string) => api.post('/projects', { name: projectName }),
        onSuccess: () => {
            toast.success("Project created successfully!");
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setOpen(false); // Close the dialog
            form.reset(); // Reset the form
        },
        onError: (error) => {
            console.error("Failed to create project", error)
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        createProjectMutation.mutate(values.name);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Awesome API" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={createProjectMutation.isPending}>
                            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};