// GET /api/items: a fixed list of placeholder widgets.
const ITEMS = [
  { id: 1, name: "Sprocket", colour: "Red", quantity: 12 },
  { id: 2, name: "Flange", colour: "Green", quantity: 4 },
  { id: 3, name: "Grommet", colour: "Blue", quantity: 27 },
];

export function onRequestGet() {
  return Response.json(ITEMS);
}
