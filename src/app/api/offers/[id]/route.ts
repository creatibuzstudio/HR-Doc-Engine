import { NextResponse } from "next/server";
import { findAgreementById, deleteAgreement } from "../../../../lib/agreementStore";
import { getSession } from "../../../../lib/auth";
import { verifyDeletePin } from "../../../../lib/security/deletePin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agreement = await findAgreementById(id);

    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
    }

    return NextResponse.json(agreement);
  } catch (err: unknown) {
    console.error("[Next.js API] Error retrieving agreement:", err);
    return NextResponse.json({ error: "Failed to retrieve agreement." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Enforce Founder session check
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    let pin = "";
    let bodyAgreementId = "";
    try {
      const body = await request.json();
      pin = body?.pin || "";
      bodyAgreementId = body?.agreementId || "";
    } catch {}

    const targetId = (bodyAgreementId || id || "").trim();
    if (!targetId) {
      return NextResponse.json(
        { error: "Agreement ID is required." },
        { status: 400 }
      );
    }

    // 2. Anti-brute force and cryptographic PIN verification
    const clientIdentifier =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      session.email ||
      "admin-session";

    const pinVerification = await verifyDeletePin(pin, clientIdentifier);
    if (!pinVerification.valid) {
      return NextResponse.json(
        { error: pinVerification.error || "Forbidden: Invalid security PIN." },
        { status: 403 }
      );
    }

    // 3. Perform resilient deletion across all schemas and file cache
    const success = await deleteAgreement(targetId);
    if (!success) {
      return NextResponse.json(
        { error: "Agreement not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Agreement deleted successfully.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error deleting agreement:", err);
    return NextResponse.json(
      { error: "Failed to delete agreement." },
      { status: 500 }
    );
  }
}

