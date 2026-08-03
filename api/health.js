/* Vercel serverless function → GET /api/health

   The contact form does not go through here: Web3Forms rejects server-side
   submissions on the free plan, so the browser posts to them directly. */
export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    service: 'vino-portfolio-api',
    runtime: 'vercel',
  });
}
