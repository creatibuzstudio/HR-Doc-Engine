import { redirect } from "next/navigation";

interface PortalPageProps {
  params: Promise<{ id: string }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { id } = await params;
  redirect(`/?candidateView=${encodeURIComponent(id)}`);
}
