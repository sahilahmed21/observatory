import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          Observatory
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          The comprehensive monitoring platform that tracks your API performance in real-time. Gain instant insights into latency, error rates, and bottlenecks before they impact your users.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">
              Sign Up →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}