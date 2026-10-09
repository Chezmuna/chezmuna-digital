export function estimate(c, S) {
  let b = c.base[S.type] || 0;
  (S.feat || []).forEach(f => (b += c.feat[S.type]?.[f] || 0));
  (S.integ || []).forEach(f => (b += c.integ[f] || 0));
  b *= c.size[S.size] || 1;
  if (S.time === 'Under 2 months') b *= 1.15;
  const r = n => Math.round(n / 1e5) * 1e5;
  return [r(b * 0.85), r(b * 1.3)];
}
