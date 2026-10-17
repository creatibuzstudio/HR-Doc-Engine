import { redirect } from "next/navigation";

interface PortalPageProps {
  params: Promise<{ id: string | string[] }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const resolved = await params;
  const rawId = resolved.id;
  const id = Array.isArray(rawId) ? rawId.join("/") : rawId;
  redirect(`/?candidateView=${encodeURIComponent(id)}`);
}
