'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function FeaturesPage() {
    return (
        <AuroraBackground className="-mt-32">
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <br />
                <br />
                <br />
                <br />
                <br />


                <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                    A Modern Tool for Modern Teams.
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 text-center">
                    Axon provides the deep insights you need, beautifully visualized.
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full mt-8">
                    <WobbleCard
                        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                    >
                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Real-Time Monitoring
                            </h2>
                            <p className="mt-4 text-left text-base/6 text-neutral-200">
                                With our lightweight agent and real-time WebSocket pipeline, you see performance metrics as they happen.
                            </p>
                        </div>
                        <Image
                            src="/realtime-dashboard.png" // Placeholder image
                            width={500}
                            height={500}
                            alt="Real-time dashboard"
                            className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
                        />
                    </WobbleCard>
                    <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Intelligent Alerting.
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                            Our background workers analyze your data streams to catch anomalies before your customers do.
                        </p>
                    </WobbleCard>
                    <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                        <div className="max-w-sm">
                            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Detailed Breakdowns & Analytics
                            </h2>
                            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                                Drill down into performance on a per-endpoint basis with rich visualizations for latency, error rates, and user satisfaction.
                            </p>
                        </div>
                        <Image
                            src="/endpoint-table.png" // Placeholder image
                            width={500}
                            height={500}
                            alt="Endpoint table"
                            className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
                        />
                    </WobbleCard>
                </div>
            </motion.div>
        </AuroraBackground>
    );
}

