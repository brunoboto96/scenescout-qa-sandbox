// GET /api/archived: seeded defect. It always answers 500, and the archived
// page shows an empty table without telling the user anything went wrong.
export function onRequestGet() {
  return Response.json({ error: "archive store unavailable" }, { status: 500 });
}
