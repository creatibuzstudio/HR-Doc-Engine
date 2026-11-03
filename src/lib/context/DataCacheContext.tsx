"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
import { AgreementSummary } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NextIds {
    agreementId: string;
    partnerId: string;
}

export interface InternOption {
    agreementId: string;
    internId: string;
    fullName: string;
    email: string;
    position: string;
    department: string;
    startDate: string;
    endDate: string;
    performanceGrade: string;
}

interface DataCache {
    agreements: AgreementSummary[] | null;
    nextIds: NextIds | null;
    internsList: InternOption[] | null;
}

interface DataCacheContextValue {
    cache: DataCache;
    /** Call this immediately after a successful login to warm the cache. */
    prefetch: () => Promise<void>;
    /** Refresh only the agreements list (after create/delete). */
    refreshAgreements: () => Promise<void>;
    /** Instantly remove one agreement from the cache (optimistic delete). */
    removeAgreement: (agreementId: string) => void;
    /** Refresh only the interns list (after a certificate is generated). */
    refreshInternsList: () => Promise<void>;
    isPrefetching: boolean;
    prefetchError: string | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DataCacheContext = createContext<DataCacheContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DataCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<DataCache>({
        agreements: null,
        nextIds: null,
        internsList: null,
    });
    const [isPrefetching, setIsPrefetching] = useState(false);
    const [prefetchError, setPrefetchError] = useState<string | null>(null);

    // Guard against double-firing in React StrictMode / concurrent renders
    const prefetchedRef = useRef(false);

    const fetchAgreements = useCallback(async (): Promise<AgreementSummary[]> => {
        const res = await fetch("/api/offers");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to load agreements.");
        }
        return (data.agreements as AgreementSummary[]) || [];
    }, []);

    const fetchNextIds = useCallback(async (): Promise<NextIds> => {
        const res = await fetch("/api/check-id?action=next");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to fetch next IDs.");
        }
        return data as NextIds;
    }, []);

    const fetchInternsList = useCallback(async (): Promise<InternOption[]> => {
        const res = await fetch("/api/offers/interns-list");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to fetch interns list.");
        }
        return (data.internsList as InternOption[]) || [];
    }, []);

    /** Fire requests in parallel right after login with resilient allSettled. */
    const prefetch = useCallback(async () => {
        if (prefetchedRef.current) return; // already done — don't re-fetch
        prefetchedRef.current = true;

        setIsPrefetching(true);
        setPrefetchError(null);

        try {
            const [agreementsRes, nextIdsRes, internsListRes] = await Promise.allSettled([
                fetchAgreements(),
                fetchNextIds(),
                fetchInternsList(),
            ]);

            setCache((prev) => ({
                agreements: agreementsRes.status === "fulfilled" ? agreementsRes.value : prev.agreements,
                nextIds: nextIdsRes.status === "fulfilled" ? nextIdsRes.value : prev.nextIds,
                internsList: internsListRes.status === "fulfilled" ? internsListRes.value : prev.internsList,
            }));

            if (agreementsRes.status === "rejected") {
                setPrefetchError((agreementsRes.reason as Error)?.message ?? "Failed to load agreements.");
            }
        } catch (err: unknown) {
            setPrefetchError((err as Error).message ?? "Prefetch failed.");
            prefetchedRef.current = false; // allow retry on next attempt
        } finally {
            setIsPrefetching(false);
        }
    }, [fetchAgreements, fetchNextIds, fetchInternsList]);

    /** Instantly remove one agreement from the cache (optimistic delete). */
    const removeAgreement = useCallback((agreementId: string) => {
        setCache((prev) => ({
            ...prev,
            agreements: prev.agreements
                ? prev.agreements.filter((a) => a.agreementId !== agreementId)
                : null,
        }));
    }, []);

    /** Targeted refresh — keeps all other cache entries intact. */
    const refreshAgreements = useCallback(async () => {
        try {
            const agreements = await fetchAgreements();
            setCache((prev) => ({ ...prev, agreements }));
            // Allow prefetch to re-run if called again (e.g. after logout/login)
            prefetchedRef.current = false;
        } catch (err: unknown) {
            const msg = (err as Error).message ?? "Refresh failed.";
            setPrefetchError(msg);
            throw err;
        }
    }, [fetchAgreements]);

    /** Refresh interns list after a certificate is issued. */
    const refreshInternsList = useCallback(async () => {
        try {
            const internsList = await fetchInternsList();
            setCache((prev) => ({ ...prev, internsList }));
        } catch (err: unknown) {
            setPrefetchError((err as Error).message ?? "Interns refresh failed.");
        }
    }, [fetchInternsList]);

    return (
        <DataCacheContext.Provider
            value={{ cache, prefetch, refreshAgreements, removeAgreement, refreshInternsList, isPrefetching, prefetchError }}
        >
            {children}
        </DataCacheContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDataCache(): DataCacheContextValue {
    const ctx = useContext(DataCacheContext);
    if (!ctx) {
        throw new Error("useDataCache must be used inside <DataCacheProvider>.");
    }
    return ctx;
}
