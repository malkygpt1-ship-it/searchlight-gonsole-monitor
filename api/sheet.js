const SHEET_ID = '2PACX-1vQpGhlw4liRjnPuOJde52Xv2yh_7zvYRJVQq7aT1fXHttSGEnsR62DWy1qLdnjlNMff3vLgKKWbhXGw';
const ALLOWED_GIDS = new Set(['106908487', '1910465866', '1185312213']);

module.exports = async function handler(req, res) {
  const gid = String(req.query.gid || '');

  if (!ALLOWED_GIDS.has(gid)) {
    res.status(400).json({ error: 'Unknown sheet tab' });
    return;
  }

  try {
    const sourceUrl = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${encodeURIComponent(gid)}&single=true&output=csv`;
    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Searchlight-GSC-Monitor/1.0',
        Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8'
      }
    });

    const body = await response.text();

    if (!response.ok) {
      throw new Error(`Google Sheets returned HTTP ${response.status}`);
    }

    if (/^\s*(?:<!doctype html|<html)/i.test(body)) {
      throw new Error('Google Sheets returned HTML instead of CSV');
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(body);
  } catch (error) {
    console.error('Sheet proxy error:', error);
    res.status(502).json({ error: 'Could not load the published Google Sheet tab' });
  }
};
