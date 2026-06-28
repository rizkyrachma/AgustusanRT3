"use client";
import React, { useState, useEffect } from "react";

export default function Typewriter({ 
  text, 
  delay = 50, 
  loop = true,
  pause = 2000,
  deleteDelay = 25,
  className = "" 
}: { 
  text: string; 
  delay?: number; 
  loop?: boolean;
  pause?: number;
  deleteDelay?: number;
  className?: string 
}) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && currentIndex < text.length) {
      // Mengetik maju
      timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, delay);
    } else if (!isDeleting && currentIndex === text.length && loop) {
      // Selesai mengetik, jeda sebelum mulai menghapus
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pause);
    } else if (isDeleting && currentIndex > 0) {
      // Menghapus mundur
      timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentIndex - 1));
        setCurrentIndex(prev => prev - 1);
      }, deleteDelay);
    } else if (isDeleting && currentIndex === 0) {
      // Selesai menghapus, jeda sebelum mulai mengetik lagi
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, pause / 2);
    }
    
    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, delay, deleteDelay, pause, loop, text]);

  return (
    <span className={className}>
      {currentText}
      <span className="inline-block w-[2px] h-[1em] bg-current align-middle ml-[2px] animate-pulse opacity-80"></span>
    </span>
  );
}
