"use client";

import React from "react";
import { DataCacheProvider } from "@/lib/context/DataCacheContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DataCacheProvider>{children}</DataCacheProvider>;
}
