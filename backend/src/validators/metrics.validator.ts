import { z } from 'zod';

export const ingestMetricsSchema = z.object({
    body: z.array(z.object({
        endpoint: z.string(),
        responseTime: z.number().int().nonnegative(),
        statusCode: z.number().int(),
    })).min(1),
});