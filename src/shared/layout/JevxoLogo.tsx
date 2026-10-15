import React from "react";
import Image from "next/image";

interface LogoProps {
  light?: boolean;
  className?: string;
}

export default function CreatibuzLogo({ light = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-50 h-auto rounded-xl overflow-hidden shrink-0 shadow-sm border border-black/5 bg-[#0D0D0E]">
        <Image
          src="/creatibuz-logo.png"
          alt="Creatibuz Studio"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// Re-export for backward compatibility with existing imports
export const JevxoLogo = CreatibuzLogo;

