import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

/** Cliente cacheado entre invocaciones (patrón recomendado por Vercel/MongoDB). */
export async function getDb() {
  if (!uri) throw new Error("MONGODB_URI no está definida");
  const g = globalThis;
  if (!g._ekClientPromise) {
    const client = new MongoClient(uri);
    g._ekClientPromise = client.connect().then((c) => c);
  }
  const client = await g._ekClientPromise;
  return client.db(process.env.MONGODB_DB || "englishkids");
}
