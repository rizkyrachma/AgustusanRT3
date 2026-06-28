"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function FadeIn({ children, delay = 0, direction = "up" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold: 0.1 } // trigger when 10% visible
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  let translateClass = "";
  if (!isVisible) {
    switch (direction) {
      case "up":
        translateClass = "translate-y-8";
        break;
      case "down":
        translateClass = "-translate-y-8";
        break;
      case "left":
        translateClass = "translate-x-8";
        break;
      case "right":
        translateClass = "-translate-x-8";
        break;
    }
  }

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 " + translateClass
      }`}
      style={{ transitionDelay: delay + "ms" }}
    >
      {children}
    </div>
  );
}
