import { NextResponse } from "next/server";
import { findAgreementById } from "@/lib/agreementStore";

export const dynamic = "force-dynamic";

/**
 * GET /api/offers/[id]/pdf
 * Streams the stored PDF (letterPDFdata) directly from MongoDB Atlas as application/pdf.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const agreement = await findAgreementById(id);

    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found." },
        { status: 404 },
      );
    }

    const pdfBase64 = agreement.letterPDFdata as string | undefined;

    if (!pdfBase64) {
      return NextResponse.json(
        {
          error:
            "No PDF document is currently stored for this agreement. It may still be pending signature.",
        },
        { status: 404 },
      );
    }

    const cleanBase64 = pdfBase64.replace(
      /^data:application\/pdf(?:;filename=[^;]+)?;base64,/,
      "",
    );
    const pdfBuffer = Buffer.from(cleanBase64, "base64");

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${id}.pdf"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error serving PDF from MongoDB:", err);
    return NextResponse.json(
      { error: "Failed to retrieve PDF from database." },
      { status: 500 },
    );
  }
}
