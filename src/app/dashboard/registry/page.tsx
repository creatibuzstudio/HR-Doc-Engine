"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DocumentRegistryItem } from "@/types";
import {
  Search,
  ExternalLink,
  Copy,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

export default function DocumentRegistryPage() {
  const [documents, setDocuments] = useState<DocumentRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch {
      toast.error("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        if (data.success && !ignore) {
          setDocuments(data.documents);
        }
      } catch {
        if (!ignore) toast.error("Failed to fetch documents.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = documents.filter((doc) => {
    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesSearch =
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const copySigningLink = (id: string) => {
    const link = `${window.location.origin}/portal/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Signing link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Document Registry</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Centralized registry for hiring notices, project contracts, and permanent job offers
          </p>
        </div>
        <button
          onClick={fetchDocs}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name or title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-secondary focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "hiring", "contract", "job-offer"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition cursor-pointer shrink-0 ${
                filterType === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {type === "all" ? "All Documents" : type.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs">Loading document records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-xs">No documents match the current criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-color-header uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Document ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Recipient / Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-color-header">
                        {item.type.replace("-", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{item.recipientName}</div>
                      <div className="text-[11px] text-muted-foreground">{item.recipientEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-primary/30 bg-primary/10 text-primary">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copySigningLink(item.id)}
                          title="Copy Portal Link"
                          className="p-1.5 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/portal/${item.id}`}
                          title="Open Candidate Portal"
                          className="p-1.5 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
