import { createClient } from '@supabase/supabase-js'

// Inicializa o cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || "https://dyohgtppkfaajrcvhxwi.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5b2hndHBwa2ZhYWpyY3ZoeHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5Mjk4NDksImV4cCI6MjA3MDUwNTg0OX0.VpqTveVNn9Dmq7EGYqihUbMYem6wvzb7gC3cLnsfV9o"

console.log("🔍 SUPABASE_URL definida?", !!supabaseUrl)
console.log("🔍 SUPABASE_KEY definida?", !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  try {
    // --- CORS ---
    const allowedOrigins = [
      'https://ets65.vercel.app',
      'http://localhost:3000'
    ]
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // --- POST: Salvar pontuação ---
    if (req.method === 'POST') {
      const { name, score, time } = req.body || {}
      if (!name || typeof name !== 'string' || !score || typeof score !== 'number' || time === undefined) {
        return res.status(400).json({ status: 'error', error: 'Dados inválidos' })
      }

      const { data, error } = await supabase
        .from('rankings')
        .insert([{
          name: name.trim().substring(0, 50),
          score: Math.min(Number(score), 999999),
          time: String(time).substring(0, 20)
        }])
        .select()

      if (error) {
        console.error('Erro ao inserir no Supabase:', error)
        return res.status(500).json({ status: 'error', error: error.message })
      }

      return res.status(200).json({ status: 'success', data: data[0] })
    }

    // --- GET: Obter ranking ---
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Erro ao buscar no Supabase:', error)
        return res.status(500).json({ status: 'error', error: error.message })
      }

      return res.status(200).json({ status: 'success', data: data })
    }

    return res.status(405).json({ status: 'error', error: 'Método não permitido' })
  } catch (err) {
    console.error('Erro global:', err)
    return res.status(500).json({ status: 'error', error: err.message })
  }
}
