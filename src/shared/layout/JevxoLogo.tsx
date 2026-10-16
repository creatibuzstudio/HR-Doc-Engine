import React from "react";
import Image from "next/image";

interface LogoProps {
  light?: boolean;
  className?: string;
}

export default function CreatibuzLogo({ light = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
        <Image
          src="/creatibuz-logo.png"
          alt="Creatibuz Studio"
          width={32}
          height={32}
          className="w-40 h-full object-cover"
        />
    </div>
  );
}

// Re-export for backward compatibility with existing imports
export const JevxoLogo = CreatibuzLogo;

