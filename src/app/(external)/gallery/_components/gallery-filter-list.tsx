"use client";

import * as React from "react";
import { Eye, Layers, Compass, Calendar, X } from "lucide-react";

interface GalleryFilterListProps {
  initialMedia: any[];
}

export function GalleryFilterList({ initialMedia }: GalleryFilterListProps) {
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Photos", icon: Layers },
    { id: "classrooms", label: "Classrooms", icon: Compass },
    { id: "activities", label: "Activities", icon: Eye },
    { id: "events", label: "Events", icon: Calendar },
  ];

  const filteredMedia = activeTab === "all" 
    ? initialMedia 
    : initialMedia.filter((m) => m.category === activeTab);

  return (
    <div className="space-y-12">
      {/* Category Tab Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground border"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of media items */}
      {filteredMedia.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No media items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer bg-card rounded-3xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setSelectedImage(item.media_url)}
            >
              {/* Photo box */}
              <div className="aspect-video overflow-hidden bg-neutral-100 relative">
                <img 
                  src={item.media_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary shadow">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Title box */}
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {item.category}
                </span>
                <h3 className="font-bold text-foreground text-sm mt-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Popout Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            type="button"
            className="absolute top-4 right-4 text-white hover:text-neutral-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
