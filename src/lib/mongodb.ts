import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

function resolveDbName(uri: string): string {
  if (process.env.MONGODB_DB_NAME) {
    return process.env.MONGODB_DB_NAME;
  }
  try {
    const parsed = new URL(uri);
    const path = parsed.pathname.replace(/^\//, "");
    if (path) return decodeURIComponent(path);
  } catch {
    const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
    if (match && match[1]) return match[1];
  }
  return "HR-Doc-Engine_CBS";
}

async function dbConnect() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.conn && cached.conn.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const targetDb = resolveDbName(mongodbUri);
    const opts = {
      bufferCommands: false,
      dbName: targetDb,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(mongodbUri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset so the next request retries the connection
    cached.conn = null;
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
