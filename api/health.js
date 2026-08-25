export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    app: "english-kids",
    dbConfigured: Boolean(process.env.MONGODB_URI),
  });
}
