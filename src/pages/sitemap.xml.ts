import { sitemapXml } from '../lib/site';

export const GET = () => new Response(sitemapXml(), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
