import { connectDB } from "./connection";

export async function clearLegacyDatabase(): Promise<{
  success: boolean;
  droppedCollections: string[];
  message: string;
}> {
  try {
    const mongooseInstance = await connectDB();
    const db = mongooseInstance.connection.db;

    if (!db) {
      throw new Error("Failed to get database instance from active connection.");
    }

    const collections = await db.listCollections().toArray();
    const legacyTargets = ["docsAgreement", "agreements", "offers", "test"];
    const dropped: string[] = [];

    for (const col of collections) {
      if (legacyTargets.includes(col.name) || col.name.startsWith("test_")) {
        await db.dropCollection(col.name);
        dropped.push(col.name);
      }
    }

    return {
      success: true,
      droppedCollections: dropped,
      message: `Database cleaned successfully. Dropped legacy collections: ${dropped.join(", ") || "None found."}`,
    };
  } catch (error) {
    return {
      success: false,
      droppedCollections: [],
      message: (error as Error).message,
    };
  }
}
