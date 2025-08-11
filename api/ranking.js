import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    const { name, score, time } = req.body

    if (!name || score === undefined || time === undefined) {
      return res.status(400).json({ error: "Dados incompletos" })
    }

    const { error } = await supabase
      .from('rankings')
      .insert([{ name, score, time }])

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ message: "Salvo com sucesso" })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ playersResults: data })
  }

  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
  res.status(405).end(`Método ${req.method} não permitido`)
}
