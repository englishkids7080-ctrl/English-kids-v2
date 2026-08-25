import { getDb } from "./_mongo.js";

/**
 * GET  /api/scores?studentId=... → puntuaciones de un alumno (o todas)
 * POST /api/scores               → guarda una puntuación
 */
export default async function handler(req, res) {
  try {
    const db = await getDb();
    const scores = db.collection("scores");

    if (req.method === "GET") {
      const studentId = req.query?.studentId ? String(req.query.studentId) : null;
      const list = await scores
        .find(studentId ? { studentId } : {})
        .sort({ date: -1 })
        .limit(400)
        .toArray();
      return res.status(200).json({
        scores: list.map((doc) => ({
          id: String(doc._id),
          studentId: doc.studentId,
          mode: doc.mode,
          category: doc.category,
          correct: doc.correct ?? 0,
          total: doc.total ?? 0,
          date: doc.date ?? new Date(0).toISOString(),
        })),
      });
    }

    if (req.method === "POST") {
      const { studentId, mode, category } = req.body ?? {};
      if (!studentId || !mode || !category) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }
      const doc = {
        studentId: String(studentId),
        mode: mode === "memory" ? "memory" : "quiz",
        category: String(category),
        correct: Math.max(0, parseInt(req.body.correct, 10) || 0),
        total: Math.max(1, parseInt(req.body.total, 10) || 1),
        date: new Date().toISOString(),
      };
      const result = await scores.insertOne(doc);
      return res.status(201).json({ score: { id: String(result.insertedId), ...doc } });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    return res.status(500).json({ error: err.message ?? "Error interno" });
  }
}
