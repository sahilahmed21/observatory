// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import ReactPlayer from "react-player";

export default function HomePage() {
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Architecture", link: "#architecture" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Example items for HoverEffect (you can replace these with observatory features)
  const dashboardItems = [
    {
      title: <>
        <PointerHighlight><span>Live API Performance"</span></PointerHighlight>
      </>,
      description:
        "Track latency, error rates, and throughput in real time with WebSocket dashboards and percentile insights (P95/P99).",
      link: "#",
    },
    {
      title: <>
        <PointerHighlight><span>Intelligent Anomaly Detection"</span></PointerHighlight>
      </>,
      description:
        "ML-driven alerts cut through noise, minimize false positives, and surface issues before they impact users.",
      link: "#",
    },
    {
      title: <>
        <PointerHighlight><span>Correlation Analysis"</span></PointerHighlight>
      </>,
      description:
        "Pinpoint root causes by linking frontend slowness directly to backend API bottlenecks with distributed tracing.",
      link: "#",
    },
    {
      title: <>
        <PointerHighlight><span>Business Impact Insights"</span></PointerHighlight>
      </>,
      description:
        "Translate performance issues into measurable effects on revenue, conversions, and user experience.",
      link: "#",
    },
    {
      title: <>
        <PointerHighlight><span>Team Collaboration"</span></PointerHighlight>
      </>,
      description:
        "Investigate incidents together with shared dashboards, real-time updates, and Slack-integrated alerts.",
      link: "#",
    },
    {
      title: <>
        <PointerHighlight><span>Scalable & Affordable"</span></PointerHighlight>
      </>,
      description:
        "Designed for small teams to enterprise scale, offering a freemium model and cost-effective alternative to DataDog/New Relic.",
      link: "#",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative -mt-32">
      {/* Full Page Background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/gradii-1920x1080 (2).png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main */}
      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-28 text-center">
          <div className="container px-4 md:px-6 relative">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl lg:text-7xl text-white drop-shadow-lg">
                <Cover>
                  Monitor APIs in Real-Time.
                </Cover>

                <span className="text-indigo-400">
                  {" "}
                  Fix Issues Before Users Notice.
                </span>
              </h1>

              <p className="text-white/90 md:text-xl drop-shadow-md">
                <strong>Axon</strong> gives engineering teams instant
                visibility into latency, error rates, and business impact —
                powered by ML-based anomaly detection and real-time
                collaboration workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Link href="/register">Get Started </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <Link href="#demo">Watch Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Video Section */}
        <section id="demo" className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <video
                src="/axondemo.mp4"
                width="100%"
                height="100%"
                controls
                loop
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
              loop
            </div>
          </div>
        </section>

        {/* Dashboard Section with Aceternity Components */}
        <section id="dashboard" className="container py-16 md:py-24">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              {/* <Cover>Dashboard Overview</Cover> */}
            </h2>
            <p className="max-w-2xl mx-auto text-white/80 mb-12">
              Your real-time API monitoring dashboard: live metrics, anomaly
              detection, and business impact in one unified view.
            </p>
          </div>

          {/* Hover Effect Cards */}
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={dashboardItems} />
          </div>
        </section>
      </main>
    </div>
  );
}
