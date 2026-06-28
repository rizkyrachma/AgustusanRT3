"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";

type Member = {
  _id: string;
  name: string;
  role: string;
  photo?: string;
};

interface OrgChartProps {
  committee: Member[];
}

export default function OrgChart({ committee }: OrgChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<
    { id: string; d: string }[]
  >([]);

  // Group members
  const level1 = committee.filter(
    (c) =>
      c.role.toLowerCase().includes("ketua") &&
      !c.role.toLowerCase().includes("wakil")
  );
  const level2 = committee.filter(
    (c) =>
      c.role.toLowerCase().includes("wakil") ||
      c.role.toLowerCase().includes("sekretaris") ||
      c.role.toLowerCase().includes("bendahara")
  );
  const level3 = committee.filter(
    (c) => !level1.includes(c) && !level2.includes(c)
  );

  // Redraw lines
  const drawLines = () => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const newLines: { id: string; d: string }[] = [];

    const getCenter = (el: Element | null) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - container.left,
        y: rect.top + rect.height / 2 - container.top,
        top: rect.top - container.top,
        bottom: rect.bottom - container.top,
      };
    };

    // Connect Level 1 to Level 2
    level1.forEach((parent) => {
      const parentEl = document.getElementById(`node-${parent._id}`);
      const parentPos = getCenter(parentEl);
      if (!parentPos) return;

      level2.forEach((child) => {
        const childEl = document.getElementById(`node-${child._id}`);
        const childPos = getCenter(childEl);
        if (!childPos) return;

        const midY = parentPos.bottom + (childPos.top - parentPos.bottom) / 2;
        const d = `M ${parentPos.x} ${parentPos.bottom} L ${parentPos.x} ${midY} L ${childPos.x} ${midY} L ${childPos.x} ${childPos.top}`;
        newLines.push({ id: `${parent._id}-${child._id}`, d });
      });
    });

    // Connect Level 2 to Level 3 (simple approach: connect all level 2 to all level 3 based on some logic, or just a shared line)
    // To keep it simple, we connect from the center of level 2 row to level 3
    if (level2.length > 0 && level3.length > 0) {
      // Find the middle of level 2 row
      let level2BottomY = 0;
      let level2Xs: number[] = [];
      level2.forEach((p) => {
        const el = document.getElementById(`node-${p._id}`);
        const pos = getCenter(el);
        if (pos) {
          level2BottomY = Math.max(level2BottomY, pos.bottom);
          level2Xs.push(pos.x);
        }
      });
      
      const midX = level2Xs.reduce((a, b) => a + b, 0) / (level2Xs.length || 1);

      // Create a hub line going down from midX
      level3.forEach((child) => {
        const childEl = document.getElementById(`node-${child._id}`);
        const childPos = getCenter(childEl);
        if (!childPos) return;

        const midY = level2BottomY + (childPos.top - level2BottomY) / 2;
        // From midX of Level 2 down to midY, then to childX, then to childTop
        const d = `M ${midX} ${level2BottomY} L ${midX} ${midY} L ${childPos.x} ${midY} L ${childPos.x} ${childPos.top}`;
        newLines.push({ id: `hub-${child._id}`, d });
      });
    }

    setLines(newLines);
  };

  useLayoutEffect(() => {
    drawLines();
    window.addEventListener("resize", drawLines);
    return () => window.removeEventListener("resize", drawLines);
  }, [committee]);

  const MemberCard = ({ member, level }: { member: Member; level: number }) => {
    const initials = member.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    let cardClasses = "bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] p-[14px_16px] text-center min-w-[130px] z-10 transition-colors duration-200 hover:border-[#B91C1C] ";
    let avatarClasses = "w-[38px] h-[38px] rounded-full mx-auto mb-[5px] flex items-center justify-center text-[12px] font-semibold border-[1.5px] overflow-hidden ";
    let badgeClasses = "inline-block text-[9px] font-medium tracking-[0.08em] uppercase px-2 py-[2px] rounded-full border-[0.5px] ";

    if (level === 1) {
      cardClasses += "border-t-[3px] border-t-[#B91C1C]";
      avatarClasses += "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]";
      badgeClasses += "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]";
    } else if (level === 2) {
      cardClasses += "border-t-[3px] border-t-[#D85A30]";
      avatarClasses += "bg-[#FFF5F0] text-[#993C1D] border-[#F0997B]";
      badgeClasses += "bg-[#FFF5F0] text-[#7C2D12] border-[#FDBA74]";
    } else {
      cardClasses += "border-t-[2px] border-t-border-color";
      avatarClasses += "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]";
      badgeClasses += "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]";
    }

    return (
      <div id={`node-${member._id}`} className={cardClasses}>
        <div className={avatarClasses}>
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              width={38}
              height={38}
              className="object-cover w-full h-full"
            />
          ) : (
            initials
          )}
        </div>
        <div className="text-[12px] font-semibold text-gray-900 mb-[5px]">
          {member.name}
        </div>
        <div className={badgeClasses}>{member.role}</div>
      </div>
    );
  };

  return (
    <div className="relative w-full py-8" ref={containerRef}>
      {/* SVG lines overlay */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{ minHeight: "100%" }}
      >
        {lines.map((line) => (
          <path
            key={line.id}
            d={line.d}
            stroke="var(--color-border-color)"
            strokeWidth="0.5"
            fill="none"
          />
        ))}
      </svg>

      {/* Level 1 */}
      {level1.length > 0 && (
        <div className="flex justify-center gap-6 mb-10">
          {level1.map((member) => (
            <MemberCard key={member._id} member={member} level={1} />
          ))}
        </div>
      )}

      {/* Level 2 */}
      {level2.length > 0 && (
        <div className="flex justify-center flex-wrap gap-6 mb-10">
          {level2.map((member) => (
            <MemberCard key={member._id} member={member} level={2} />
          ))}
        </div>
      )}

      {/* Level 3 */}
      {level3.length > 0 && (
        <div className="flex justify-center flex-wrap gap-6">
          {level3.map((member) => (
            <MemberCard key={member._id} member={member} level={3} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-[20px] mt-[28px]">
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full bg-[#B91C1C]" />
          <span className="text-[11px] text-[#374151]">Pimpinan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full bg-[#D85A30]" />
          <span className="text-[11px] text-[#374151]">Koordinator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full bg-border-color" />
          <span className="text-[11px] text-[#374151]">Anggota</span>
        </div>
      </div>
    </div>
  );
}
