"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function LombaCarousel({ competitions }: { competitions: any[] }) {
  // Using embla for robust infinite looping and centered alignment
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      dragFree: false
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group max-w-full px-2 sm:px-8">
      {/* Scroll Left Button */}
      <button 
        onClick={scrollPrev}
        aria-label="Scroll Left"
        className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#B91C1C] hover:border-[#B91C1C] hover:scale-110 transition-all focus:outline-none"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Embla Viewport */}
      <div className="overflow-hidden py-8 -my-8" ref={emblaRef}>
        {/* Embla Container */}
        <div className="flex touch-pan-y py-4 -ml-4">
          {competitions.map((lomba, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <div 
                // Embla needs min-w-0 on flex children, and we add padding-left for the gap
                className="flex-[0_0_280px] sm:flex-[0_0_320px] min-w-0 pl-4 flex items-center justify-center"
                key={lomba._id + idx}
              >
                <div 
                  className={`bg-white border-[0.5px] rounded-[12px] overflow-hidden flex flex-col transition-all duration-500 ease-out h-[320px] w-full ${
                    isActive 
                      ? "scale-110 shadow-[0_10px_30px_rgba(185,28,28,0.15)] border-[#B91C1C] z-10" 
                      : "scale-90 opacity-50 blur-[3px] border-[#E5E7EB] z-0 hover:opacity-80"
                  }`}
                >
                  <div className="h-[160px] bg-[#FEF2F2] flex items-center justify-center relative overflow-hidden shrink-0">
                    {lomba.image ? (
                      <Image src={lomba.image} alt={lomba.name} fill className="object-cover" />
                    ) : (
                      <div className="text-[#B91C1C] opacity-50 font-medium text-sm">Tanpa Gambar</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className={`text-[16px] font-[600] mb-2 line-clamp-1 ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                      {lomba.name}
                    </h3>
                    {lomba.description ? (
                      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
                        {lomba.description}
                      </p>
                    ) : (
                      <p className="text-[13px] text-gray-400 italic">
                        Tidak ada deskripsi
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Right Button */}
      <button 
        onClick={scrollNext}
        aria-label="Scroll Right"
        className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#B91C1C] hover:border-[#B91C1C] hover:scale-110 transition-all focus:outline-none"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}
