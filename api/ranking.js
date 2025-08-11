import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Configuração CORS
  const allowedOrigins = ['https://ets65.vercel.app', 'http://localhost:3000']
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { name, score, time } = req.body
      
      // Validação melhorada
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Nome inválido" })
      }
      
      const scoreNum = Number(score)
      if (isNaN(scoreNum)) {
        return res.status(400).json({ error: "Pontuação inválida" })
      }

      // Insere e retorna o ranking atualizado
      const { error: insertError } = await supabase
        .from('rankings')
        .insert([{ 
          name: name.trim().substring(0, 50),
          score: Math.min(scoreNum, 999999),
          time: String(time).substring(0, 20)
        }])

      if (insertError) throw insertError

      // Busca ranking atualizado
      const { data: rankings, error: selectError } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)

      if (selectError) throw selectError

      return res.status(200).json({ 
        message: "Pontuação salva com sucesso",
        playersResults: rankings
      })

    } catch (error) {
      console.error('Erro no POST:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)

      if (error) throw error

      return res.status(200).json({ playersResults: data })
    } catch (error) {
      console.error('Erro no GET:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).end(`Método ${req.method} não permitido`)
}