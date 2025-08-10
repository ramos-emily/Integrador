// /api/ranking.js

let playersResults = [];

export default function handler(req, res) {
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

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Método ${req.method} não permitido`);
}
