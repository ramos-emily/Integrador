let playersResults = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, score, time } = req.body;
    if (!name || score === undefined || time === undefined) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    playersResults.push({ name, score, time });
    playersResults.sort((a, b) => b.score - a.score);
    playersResults = playersResults.slice(0, 10);

    return res.status(200).json({ message: "Salvo com sucesso", playersResults });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ playersResults });
  }

  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).end(`Método ${req.method} não permitido`);
}
