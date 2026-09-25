export function validateGardenLayout(layout) {
  const errors = [];

  if (!layout.player) {
    errors.push("Falta la posición de player");
  }
  if (!layout.rabbit) {
    errors.push("Falta la posición de rabbit");
  }
  if (!Array.isArray(layout.flowers) || layout.flowers.length !== 10) {
    errors.push("El jardín debe contener exactamente 10 flores");
  }

  const ids = (layout.flowers || []).map((flower) => flower.id);
  if (new Set(ids).size !== ids.length) {
    errors.push("Los ids de flores deben ser únicos");
  }
  if (JSON.stringify(layout).toLowerCase().includes("carrot")) {
    errors.push("El jardín no puede contener zanahorias");
  }

  return errors;
}
