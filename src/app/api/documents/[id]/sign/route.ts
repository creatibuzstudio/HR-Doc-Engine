import { NextResponse } from "next/server";
import { signDocument } from "@/core/services/document.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { signatureImg } = await request.json();

    if (!signatureImg) {
      return NextResponse.json(
        { success: false, message: "Signature image is required." },
        { status: 400 }
      );
    }

    const signed = await signDocument(id, signatureImg);
    if (!signed) {
      return NextResponse.json(
        { success: false, message: "Document not found or already executed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document digitally signed and executed successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
