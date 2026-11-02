import { z } from 'zod';
import projectData from '../data/projects.json';
import storyData from '../data/story.json';
import { TAGS, PURPOSE_ORDER, SOURCES, SECTIONS, POINTS, PERSONAS, TECH, SEO, REDIRECTS, UI, SITE, BASE, FETCHED, LANGS, CONTACT, CONTACT_REASONS, type Lang } from '../data/content';
import { ANALYSIS } from '../data/analysis';

const l10n = z.object({ fi: z.string(), en: z.string() });
const projectSchema = z.object({
  id: z.string(), repo: z.string(), name: z.string(), top: z.number(), score: z.number(),
  start: z.string(), last: z.string(), commits: z.number(), techAt: z.string(),
  one: l10n, result: l10n, note: l10n, tags: z.array(z.string()),
  evidence: z.record(z.object({ src: z.string(), q: z.string() })),
  pair: z.string(), agent: z.string(), agentEdits: l10n,
  firstTech: z.object({ fi: z.array(z.string()), en: z.array(z.string()) }), thread: l10n,
  image: z.string(), imageW: z.number(), imageH: z.number(), demoUrl: z.string(), repoUrl: z.string(),
  parts: z.object({ R: z.number(), L: z.number(), D: z.number(), Doc: z.number(), T: z.number(), K: z.number() }),
  review: l10n, recs: z.object({ fi: z.array(z.string()).min(1), en: z.array(z.string()).min(1) }),
});
const laneSchema = z.object({ id: z.string(), group: z.enum(['model', 'aitech', 'tech']), label: l10n, src: z.string(), note: l10n,
  uses: z.array(z.object({ id: z.string(), date: z.string() })).min(1) });
const storySchema = z.object({
  total: z.number(), months: z.array(z.number()).length(21), fetched: z.string(), threads: z.array(z.array(z.string())),
  chapters: z.array(z.object({ n: z.number(), from: z.number(), to: z.number(), period: z.string(), key: z.string(), title: l10n,
    paras: z.object({ fi: z.array(z.string()), en: z.array(z.string()) }), ai: l10n })).length(6),
  milestones: z.array(z.object({ date: z.string(), row: z.number(), label: l10n })),
  others: z.array(z.object({ id: z.string(), repo: z.string(), name: z.string(), start: z.string(), last: z.string(), commits: z.number(), one: l10n, repoUrl: z.string() })),
  lanes: z.array(laneSchema),
});

export const projects = z.array(projectSchema).parse(projectData);
export const story = storySchema.parse(storyData);
const noAnalysis = projects.filter((p) => !ANALYSIS[p.id]).map((p) => p.id);
if (noAnalysis.length) throw new Error('Analyysi puuttuu: ' + noAnalysis.join(', '));
const tagIds = new Set(TAGS.map((t) => t.id));
for (const p of projects) {
  for (const t of p.tags) {
    if (!tagIds.has(t)) throw new Error(`[site] ${p.id}: tuntematon tagi ${t}`);
    if (!p.evidence[t]) throw new Error(`[site] ${p.id}: tagilta ${t} puuttuu lähde`);
  }
}

export const pageUrl = (lang: Lang) => SITE + SEO[lang].path;
export const asset = (file: string) => `${BASE}/images/projects/${file}`;
const mm = (d: string) => `${d.slice(5, 7)}/${d.slice(0, 4)}`;

export function page(lang: Lang) {
  const ui = UI[lang];
  const label = (id: string) => TAGS.find((t) => t.id === id)!.label[lang];
  const byDim = (p: (typeof projects)[number], dim: string) => p.tags.filter((t) => TAGS.find((x) => x.id === t)!.dim === dim).map(label);
  const top = projects.filter((p) => p.top).sort((a, b) => a.top - b.top);
  const counts = Object.fromEntries(TAGS.map((t) => [t.id, projects.filter((p) => p.tags.includes(t.id)).length]));
  const client = {
    lang, ui, base: BASE, fetched: FETCHED, purposeOrder: PURPOSE_ORDER,
    tags: TAGS.map((t) => ({ id: t.id, dim: t.dim, label: t.label[lang], count: counts[t.id] })),
    sources: Object.fromEntries(Object.entries(SOURCES).map(([k, v]) => [k, v[lang]])),
    projects: projects.map((p) => ({ id: p.id, name: p.name, top: p.top, score: p.score, start: p.start, last: p.last, commits: p.commits, techAt: p.techAt,
      one: p.one[lang], result: p.result[lang], note: p.note[lang], tags: p.tags, evidence: p.evidence, pair: p.pair, agent: p.agent,
      agentEdits: p.agentEdits[lang], firstTech: p.firstTech[lang], thread: p.thread[lang],
      image: p.image ? asset(p.image) : '', imageW: p.imageW, imageH: p.imageH, demo: p.demoUrl, code: p.repoUrl,
      parts: p.parts, review: p.review[lang], recs: p.recs[lang],
      an: { tech: ANALYSIS[p.id].tech[lang], philo: ANALYSIS[p.id].philo[lang], fun: ANALYSIS[p.id].fun[lang] } })),
    story: { total: story.total, months: story.months, threads: story.threads,
      lanes: story.lanes.filter((x) => x.group === 'model').map((x) => ({ id: x.id, group: x.group, label: x.label[lang], src: x.src, note: x.note[lang], uses: x.uses })),
      chapters: story.chapters.map((c) => ({ n: c.n, from: c.from, to: c.to, period: c.period, key: c.key, title: c.title[lang], paras: c.paras[lang], ai: c.ai[lang] })),
      others: story.others.map((o) => ({ id: o.id, name: o.name, start: o.start, last: o.last, commits: o.commits, one: o.one[lang], code: o.repoUrl })) },
    sections: SECTIONS.map((s) => ({ id: s.id, name: s.nav[lang], summary: s.summary[lang], status: s.status === 'new' ? ui.statusNew : ui.statusUpdated })),
    personas: Object.fromEntries(Object.entries(PERSONAS).map(([k, v]) => [k, { name: v.name, role: v.role[lang] }])),
    points: Object.fromEntries([
      ...POINTS.map((pt) => [pt.id, { label: pt.label[lang], lines: pt.lines.map((x) => ({ who: x.who, text: x.text[lang] })) }]),
      // Projektin keskustelu: esittely, tekninen, filosofinen, hauska, heikkous ja ehdotus
      ...projects.map((p) => { const a = ANALYSIS[p.id]; return ['p-' + p.id, { label: p.name, lines: ([
        ['loiste', a.intro], ['hionta', a.tech], ['kirkkaus', a.philo], ['loiste', a.fun], ['kirkkaus', a.critic], ['hionta', a.next]] as const).map(([who, s]) => ({ who, text: s[lang] })) }]; }),
    ]),
    langs: LANGS,
    // Yhteystiedot base64-koodattuina, jotta yksinkertaiset haravat eivät poimi niitä HTML:stä
    contact: { m: CONTACT.email ? btoa(CONTACT.email) : '', w: CONTACT.whatsapp ? btoa(CONTACT.whatsapp) : '' },
    reasons: CONTACT_REASONS.map((r) => ({ id: r.id, label: r.label[lang] })),
    tech: Object.fromEntries(Object.entries(TECH).map(([k, v]) => [k, { title: v.title[lang], technique: v.technique[lang], formula: v.formula[lang], why: v.why[lang] }])),
    redirects: REDIRECTS,
  };
  return { ui, top, byDim, label, counts, client, mm };
}

export function sitemapXml() {
  const alt = (['fi', 'en'] as Lang[]).map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`).join('\n');
  const urls = (['fi', 'en'] as Lang[]).map((l) => `  <url>\n    <loc>${pageUrl(l)}</loc>\n    <lastmod>${FETCHED}</lastmod>\n${alt}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('fi')}"/>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

export function robotsTxt() {
  return `# Ohjeellinen: hakukoneet lukevat robots.txt:n vain domainin juuresta.\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE}${BASE}/sitemap.xml\n`;
}

export function llmsTxt() {
  const top = projects.filter((p) => p.top).sort((a, b) => a.top - b.top);
  const rest = projects.filter((p) => !p.top).sort((a, b) => b.score - a.score);
  const line = (p: (typeof projects)[number]) => `- [${p.name}](${p.demoUrl || p.repoUrl}): ${p.one.en} Source: ${p.repoUrl}`;
  return `# Infinite\n\n> Portfolio of the artist Infinite: ${projects.length} public projects since March 2025, with a top 5 and the story of every project in six chapters. Data fetched ${FETCHED} from GitHub.\n\nPages: ${pageUrl('fi')} (Finnish), ${pageUrl('en')} (English)\n\n## Top 5\n\n${top.map(line).join('\n')}\n\n## Other projects\n\n${rest.map(line).join('\n')}\n\n## Contact\n\n- GitHub: https://github.com/SamppaFIN\n`;
}

export function jsonLd(lang: Lang) {
  const url = pageUrl(lang), person = `${SITE}${BASE}/#person`;
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Infinite', item: pageUrl('fi') }];
  if (lang === 'en') crumbs.push({ '@type': 'ListItem', position: 2, name: 'English', item: url });
  const ordered = [...projects].sort((a, b) => (a.top || 99) - (b.top || 99) || b.score - a.score);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE}${BASE}/#website`, url: pageUrl('fi'), name: 'Infinite', inLanguage: ['fi', 'en'], publisher: { '@id': person } },
      { '@type': 'ProfilePage', '@id': `${url}#profile`, url, name: SEO[lang].title, description: SEO[lang].description, inLanguage: lang,
        dateModified: FETCHED, isPartOf: { '@id': `${SITE}${BASE}/#website` }, mainEntity: { '@id': person } },
      { '@type': 'Person', '@id': person, name: 'Infinite', url: pageUrl('fi'), sameAs: ['https://github.com/SamppaFIN'] },
      { '@type': 'BreadcrumbList', itemListElement: crumbs },
      { '@type': 'ItemList', name: lang === 'fi' ? 'Projektit' : 'Projects', numberOfItems: ordered.length,
        itemListElement: ordered.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: {
          '@type': 'SoftwareSourceCode', name: p.name, description: p.one[lang], codeRepository: p.repoUrl,
          ...(p.demoUrl ? { url: p.demoUrl } : {}), dateCreated: p.start, author: { '@id': person },
          keywords: p.tags.map((t) => TAGS.find((x) => x.id === t)!.label[lang]).join(', ') } })) },
    ],
  };
}
