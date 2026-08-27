"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Eye, Heart, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const showcaseImages = [
  {
    id: 1,
    src: "/images/image.png",
    title: "Creative Arts & Early Discovery",
    subtitle: "Child-led painting, sensory crafting, and messy discovery sessions.",
    tag: "Sensory & Art",
    emoji: "🎨",
    badgeBg: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
    borderColor: "border-pink-200 hover:border-pink-400",
    tilt: "lg:-rotate-2",
  },
  {
    id: 2,
    src: "/images/image copy.png",
    title: "EYFS Learning & Milestones",
    subtitle: "Interactive story time, phonics, numbers, and keyworker guidance.",
    tag: "EYFS Curriculum",
    emoji: "🌱",
    badgeBg: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white",
    borderColor: "border-sky-200 hover:border-sky-400",
    tilt: "lg:rotate-2",
  },
  {
    id: 3,
    src: "/images/image copy 2.png",
    title: "Outdoor Garden Exploration",
    subtitle: "Secure garden adventures, mud kitchens, and physical play.",
    tag: "Nature & Outdoors",
    emoji: "🌳",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    tilt: "lg:rotate-1",
  },
  {
    id: 4,
    src: "/images/image copy 3.png",
    title: "Warm Nutrition & Social Mealtime",
    subtitle: "Freshly prepared warm lunches, fruit snacks, and table manners.",
    tag: "Healthy Nutrition",
    emoji: "🍎",
    badgeBg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    borderColor: "border-amber-200 hover:border-amber-400",
    tilt: "lg:-rotate-2",
  },
];

export function NurseryShowcase() {
  const [selectedImg, setSelectedImg] = React.useState<(typeof showcaseImages)[0] | null>(null);

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-amber-50/50 via-sky-50/80 to-emerald-50/50">
      {/* Background Decorator Blobs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl -z-10" />

      {/* Floating Animated Emojis */}
      <span aria-hidden="true" className="absolute top-8 left-12 text-4xl pointer-events-none select-none nursery-float opacity-50 hidden sm:block">
        🎈
      </span>
      <span aria-hidden="true" className="absolute bottom-12 right-12 text-4xl pointer-events-none select-none nursery-wiggle opacity-50 hidden sm:block">
        🌟
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-orange-200 text-orange-700 px-4 py-1.5 text-xs font-black shadow-sm">
            <Camera className="h-4 w-4 text-orange-500" />
            Nursery Life Showcase
          </span>

          <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
            Life Inside Bubbly Day Nursery 📸
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
            Explore everyday moments in our classrooms — from hands-on creative crafts and outdoor sensory gardens to nutritious meals and warm milestone celebrations.
          </p>
        </motion.div>

        {/* 4 Images Collage Container with Aligned Positions */}
        <div className="p-4 sm:p-8 rounded-[2.5rem] border-2 border-orange-200/80 bg-white/80 backdrop-blur-md shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {showcaseImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.025, y: -4 }}
                className={`group relative overflow-hidden rounded-3xl border-2 ${item.borderColor} bg-white shadow-md hover:shadow-2xl transition-all duration-300 ${item.tilt}`}
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md ${item.badgeBg}`}>
                      <span>{item.emoji}</span>
                      <span>{item.tag}</span>
                    </span>
                  </div>

                  {/* Hover Quick View Trigger Overlay */}
                  <button
                    type="button"
                    onClick={() => setSelectedImg(item)}
                    className="absolute inset-0 bg-sky-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    aria-label={`View ${item.title}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="h-14 w-14 rounded-full bg-white/95 text-orange-600 flex items-center justify-center shadow-xl backdrop-blur-sm"
                    >
                      <Eye className="h-7 w-7" />
                    </motion.div>
                  </button>
                </div>

                {/* Content Details Below Image */}
                <div className="p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-heading font-black text-xl text-foreground group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-orange-100 flex items-center justify-between text-xs font-bold text-orange-600">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 fill-orange-500 text-orange-500" /> Bubbly Daily Moments
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedImg(item)}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Expand Photo 🔍
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Motion Lightbox Modal for Selected Image */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-sky-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl p-2 sm:p-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedImg(null)}
                className="absolute top-4 right-4 z-20 text-white bg-sky-950/70 hover:bg-sky-950 rounded-full p-2.5 transition-colors shadow-lg"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image Container */}
              <div className="relative w-full max-h-[70vh] aspect-[16/11] rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center">
                <Image
                  src={selectedImg.src}
                  alt={selectedImg.title}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Caption */}
              <div className="w-full text-center py-4 px-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-2 ${selectedImg.badgeBg}`}>
                  {selectedImg.emoji} {selectedImg.tag}
                </span>
                <h3 className="font-heading font-black text-xl text-foreground mb-1">{selectedImg.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto font-medium">{selectedImg.subtitle}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
