"use client";
import React from "react";
import Image from "next/image";

export default function DocumentWatermark() {
  return (
    <Image
      src="/creatibuz-symbol.png"
      alt="Creatibuz Studio Watermark"
      width={480}
      height={480}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 pointer-events-none object-contain"
    />
  );
}
