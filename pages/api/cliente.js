/**
 * GET /api/cliente?id=X
 * Lê dados do Google Sheets e retorna dados do cliente.
 */
export default async function handler(req, res) {
  const { id } = req.query;
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const apiKey  = process.env.GOOGLE_API_KEY;

  if (!sheetId || !apiKey) {
    return res.status(500).json({ error: 'Variáveis GOOGLE_SHEETS_ID e GOOGLE_API_KEY não configuradas.' });
  }

  try {
    const range = encodeURIComponent('Clientes!A1:Z100');
    const url   = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const resp  = await fetch(url);

    if (!resp.ok) {
      const err = await resp.json();
      return res.status(502).json({ error: 'Erro ao acessar Google Sheets', details: err });
    }

    const { values } = await resp.json();
    if (!values || values.length < 2) {
      return res.status(404).json({ error: 'Planilha vazia.' });
    }

    const headers  = values[0];
    const clientes = values.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
      return obj;
    });

    if (id) {
      const cliente = clientes.find((c) => String(c.id ?? c.ID) === String(id));
      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado.' });
      return res.status(200).json(cliente);
    }

    return res.status(200).json(clientes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
}
