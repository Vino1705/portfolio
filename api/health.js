/* Vercel serverless function → GET /api/health */
export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    service: 'vino-portfolio-api',
    runtime: 'vercel',
    mail: process.env.WEB3FORMS_ACCESS_KEY ? 'configured' : 'not configured',
  });
}
