"use client";

import * as React from "react";

import Link from "next/link";

import { Baby, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { RoomDetails } from "./_components/room-details";

export default function RoomsPage() {
  const [activeTab, setActiveTab] = React.useState<"babies" | "toddlers" | "preschool">("babies");

  const tabs = [
    { key: "babies", label: "Babies Room", age: "3m - 2y" },
    { key: "toddlers", label: "Toddlers Room", age: "2y - 3y" },
    { key: "preschool", label: "Preschool Room", age: "3y - 5y" },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary-foreground px-4 py-1.5 text-xs font-semibold mb-4">
              <Baby className="h-4.5 w-4.5 text-primary stroke-[2.5]" />
              Tailored Classroom Care
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Explore Our Nursery Rooms
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Select a room below to discover our age-appropriate learning goals, staffing ratios, custom classroom
              environments, and detailed daily routines.
            </p>
          </div>
        </section>

        {/* Interactive Selector Tabs */}
        <section className="py-8 bg-card border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <Button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    variant={isActive ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 h-auto text-sm font-semibold border-2 transition-all duration-200 ${
                      isActive
                        ? "shadow-md scale-105"
                        : "hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="mr-2">{tab.label}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-neutral-100 text-muted-foreground"
                      }`}
                    >
                      {tab.age}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Room details rendering area */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RoomDetails roomKey={activeTab} />
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
