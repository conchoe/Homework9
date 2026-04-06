export type FieldError = { field: string; message: string };

export function parsePositiveInt(raw: string, label: string): { ok: true; value: number } | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") return { ok: false, error: `${label} is required` };
  if (!/^\d+$/.test(t)) return { ok: false, error: `${label} must be a whole number` };
  const n = parseInt(t, 10);
  if (Number.isNaN(n)) return { ok: false, error: `${label} is invalid` };
  return { ok: true, value: n };
}

export function parsePositiveNumber(raw: string, label: string): { ok: true; value: number } | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") return { ok: false, error: `${label} is required` };
  const n = Number(t);
  if (Number.isNaN(n) || !Number.isFinite(n)) return { ok: false, error: `${label} must be a number` };
  return { ok: true, value: n };
}

export function validateSetRow(reps: string, weight: string, rpe: string): { ok: true; reps: number; weight: number; rpe: number } | { ok: false; error: string } {
  const r = parsePositiveInt(reps, "Reps");
  if (!r.ok) return r;
  if (r.value < 1) return { ok: false, error: "Reps must be at least 1" };

  const w = parsePositiveNumber(weight, "Weight (lbs)");
  if (!w.ok) return w;
  if (w.value < 1) return { ok: false, error: "Weight must be at least 1 lb" };

  const rp = parsePositiveInt(rpe, "RPE");
  if (!rp.ok) return rp;
  if (rp.value < 1 || rp.value > 10) return { ok: false, error: "RPE must be between 1 and 10" };

  return { ok: true, reps: r.value, weight: w.value, rpe: rp.value };
}
