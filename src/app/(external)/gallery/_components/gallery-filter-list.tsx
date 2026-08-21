"use client";

import * as React from "react";
import Image from "next/image";
import { Calendar, Compass, Eye, Layers, MapPin, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryFilterListProps {
  initialMedia: any[];
}

export function GalleryFilterList({ initialMedia }: GalleryFilterListProps) {
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedImage, setSelectedImage] = React.useState<{ url: string; title: string } | null>(null);

  const categories = [
    { id: "all", label: "All Photos", icon: Layers, emoji: "🌟" },
    { id: "classrooms", label: "Classrooms", icon: Compass, emoji: "🏫" },
    { id: "activities", label: "Activities", icon: Eye, emoji: "🎨" },
    { id: "events", label: "Events", icon: Calendar, emoji: "🎉" },
  ];

  const filteredMedia = activeTab === "all" ? initialMedia : initialMedia.filter((m) => m.category === activeTab);

  return (
    <div className="space-y-10">
      {/* Category Tab Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md scale-105"
                  : "bg-white/90 backdrop-blur-sm text-foreground/80 hover:bg-white hover:text-foreground border border-orange-200"
              }`}
            >
              <span>{cat.emoji}</span>
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of media items */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 max-w-lg mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-orange-200 shadow-sm">
          <Sparkles className="h-10 w-10 text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground mb-2">No photos in this category yet</h3>
          <p className="text-xs text-muted-foreground">
            Our staff frequently upload new classroom and activity photos. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-orange-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              onClick={() => setSelectedImage({ url: item.media_url, title: item.title })}
            >
              {/* Photo box */}
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative border-b border-orange-100">
                <Image
                  src={item.media_url}
                  alt={item.title || "Nursery Gallery Photo"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 90vw, 33vw"
                />
                <div className="absolute inset-0 bg-sky-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-orange-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Eye className="h-6 w-6" />
                  </div>
                </div>

                {/* Branch badge on photo top-left */}
                {item.branch && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-sky-900 text-[10px] font-bold shadow-sm border border-white flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-orange-500" /> {item.branch}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Title & Category box */}
              <div className="p-5 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                    {item.category}
                  </span>
                  <h3 className="font-extrabold text-foreground text-sm mt-0.5">{item.title}</h3>
                </div>
                <span className="text-xs text-orange-500 font-bold group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Popout Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-sky-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/30 rounded-full p-2.5 transition-colors shadow-lg"
            onClick={() => setSelectedImage(null)}
            aria-label="Close photo lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[75vh] aspect-auto rounded-2xl overflow-hidden flex items-center justify-center bg-neutral-900">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl"
              />
            </div>
            {selectedImage.title && (
              <p className="text-center font-bold text-foreground text-sm py-3 px-4">
                🖼️ {selectedImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
