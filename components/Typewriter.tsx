"use client";
import React, { useState, useEffect } from "react";

export default function Typewriter({ text, delay = 50, className = "" }: { text: string; delay?: number; className?: string }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={className}>
      {currentText}
      <span className={`inline-block w-[2px] h-[1em] bg-current align-middle ml-[2px] ${currentIndex < text.length ? 'animate-pulse' : 'animate-pulse opacity-50'}`}></span>
    </span>
  );
}
