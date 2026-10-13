"use client";
import React from "react";
import Image from "next/image";
export default function DocumentWatermark() {
  return (
    <Image
      src="/x-logo.jpg"
      alt="Watermark"
      width={520}
      height={520}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20 pointer-events-none"
    />
  );
}
