import { robotsTxt } from '../lib/site';

export const GET = () => new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
