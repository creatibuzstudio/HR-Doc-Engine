import React from "react";
import Image from "next/image";

interface LogoProps {
  light?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CreatibuzLogo({ className = "", size = "md" }: LogoProps) {
  const widthClass = size === "sm" ? "w-28" : size === "lg" ? "w-55" : "w-36";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/creatibuz-logo.png"
        alt="Creatibuz Studio"
        width={160}
        height={40}
        priority
        className={`${widthClass} h-auto object-contain`}
      />
    </div>
  );
}

export { CreatibuzLogo as Logo, CreatibuzLogo as JevxoLogo };
