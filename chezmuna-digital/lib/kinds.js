export const KINDS = {
  project: { label: 'Portfolio', fields: [['name', 'Project name'], ['client', 'Client'], ['sector', 'Sector'], ['challenge', 'Challenge', 'area'], ['result', 'Result', 'area'], ['image', 'Project image (screenshot or photo)', 'image']] },
  post: { label: 'Blog', fields: [['title', 'Title'], ['slug', 'Web address slug (optional)'], ['excerpt', 'Summary', 'area'], ['body', 'Article (blank line between paragraphs)', 'area'], ['image', 'Cover image', 'image'], ['published', 'Published', 'check']] },
};
export const GROUPS = [
  ['base', 'Starting price by project type (₦)', ['base']],
  ['size', 'User-size multipliers (1.25 = 25% more)', ['size']],
  ['f_portal', 'Portal features (₦ each)', ['feat', 'portal']],
  ['f_app', 'Business platform features (₦ each)', ['feat', 'app']],
  ['f_site', 'Website and automation features (₦ each)', ['feat', 'site']],
  ['integ', 'Integrations (₦ each)', ['integ']],
];
export const getPath = (o, p) => p.reduce((a, k) => a[k], o);
export const setPath = (o, p, v) => { const l = p.slice(0, -1).reduce((a, k) => (a[k] ??= {}), o); l[p[p.length - 1]] = v; };
export const toLines = o => Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n');
export const fromLines = t => Object.fromEntries(t.split('\n').filter(l => l.includes(':')).map(l => { const i = l.lastIndexOf(':'); return [l.slice(0, i).trim(), Number(l.slice(i + 1))]; }).filter(([k, v]) => k && !isNaN(v)));
export const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const SITE_FIELDS = [['heroTitle', 'Hero headline'], ['heroText', 'Hero text', 'area'], ['heroImage', 'Hero image', 'image'], ['ctaText', 'Main button text'], ['email', 'Contact email'], ['phone', 'Phone or WhatsApp'], ['location', 'Location']];
