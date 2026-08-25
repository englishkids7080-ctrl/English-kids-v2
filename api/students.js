import { getDb } from "./_mongo.js";

/**
 * GET    /api/students        → lista de alumnos
 * POST   /api/students        → crea un alumno { name, age }
 * DELETE /api/students?id=... → borra un alumno y sus puntuaciones
 */
export default async function handler(req, res) {
  try {
    const db = await getDb();
    const students = db.collection("students");
    const scores = db.collection("scores");

    if (req.method === "GET") {
      const list = await students
        .find({})
        .sort({ createdAt: -1 })
        .limit(200)
        .toArray();
      return res.status(200).json({ students: list.map(toStudent) });
    }

    if (req.method === "POST") {
      const name = String(req.body?.name ?? "").trim();
      if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });
      const age = Math.max(0, Math.min(18, parseInt(req.body?.age, 10) || 0));
      const doc = { name, age, createdAt: new Date().toISOString() };
      const result = await students.insertOne(doc);
      return res.status(201).json({ student: { id: String(result.insertedId), ...doc } });
    }

    if (req.method === "DELETE") {
      const id = String(req.query?.id ?? "");
      if (!id) return res.status(400).json({ error: "Falta el parámetro id" });
      const { ObjectId } = await import("mongodb");
      let filter;
      try {
        filter = { _id: new ObjectId(id) };
      } catch {
        filter = { id };
      }
      await students.deleteOne(filter);
      await scores.deleteMany({ studentId: id });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    return res.status(500).json({ error: err.message ?? "Error interno" });
  }
}

function toStudent(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    age: doc.age ?? 0,
    createdAt: doc.createdAt ?? new Date(0).toISOString(),
  };
}
