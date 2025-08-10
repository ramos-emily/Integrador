import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let playersResults = [];

app.post("/ranking", (req, res) => {
  const { name, score, time } = req.body;
  if (!name || score === undefined || time === undefined) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  playersResults.push({ name, score, time });
  playersResults.sort((a, b) => b.score - a.score);
  playersResults = playersResults.slice(0, 10);

  res.json({ message: "Salvo com sucesso", playersResults });
});

app.get("/ranking", (req, res) => {
  res.json({ playersResults });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API rodando na porta ${port}`));
