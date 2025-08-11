import { createClient } from '@supabase/supabase-js'

// Verificação inicial das variáveis de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Erro crítico: Variáveis do Supabase não configuradas!')
  throw new Error('Configuração do Supabase incompleta')
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Verifica a conexão com o Supabase no startup
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .limit(1)
      
    if (error) throw error
    console.log('Conexão com Supabase verificada com sucesso')
  } catch (err) {
    console.error('Falha na conexão com Supabase:', err.message)
    throw new Error('Falha na conexão com o banco de dados')
  }
}

// Executa o teste de conexão quando o módulo é carregado
testSupabaseConnection().catch(err => {
  console.error('Erro durante o teste de conexão:', err)
})

export default async function handler(req, res) {
  // Configuração COMPLETA de CORS - ESSENCIAL PARA FUNCIONAR
  const allowedOrigins = [
    'https://ets65.vercel.app',
    'http://localhost:3000' // Para desenvolvimento local
  ]
  
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Vary', 'Origin') // Importante para cache de CORS

  // Resposta imediata para requisições OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      status: 'success',
      message: 'CORS preflight successful'
    })
  }

  try {
    // POST - Adicionar nova pontuação
    if (req.method === 'POST') {
      // Verifica o corpo da requisição
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ 
          status: 'error',
          error: "Corpo da requisição inválido" 
        })
      }

      const { name, score, time } = req.body

      // Validação dos dados
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ 
          status: 'error',
          error: "Nome inválido - deve ser uma string não vazia" 
        })
      }

      if (score === undefined || typeof score !== 'number' || score < 0) {
        return res.status(400).json({ 
          status: 'error',
          error: "Pontuação inválida - deve ser um número positivo" 
        })
      }

      if (time === undefined || (typeof time !== 'string' && typeof time !== 'number')) {
        return res.status(400).json({ 
          status: 'error',
          error: "Tempo inválido - deve ser string ou número" 
        })
      }

      // Insere no banco de dados
      try {
        const { data, error } = await supabase
          .from('rankings')
          .insert([{ 
            name: name.trim().substring(0, 50), // Limita o tamanho do nome
            score: Math.min(Number(score), 999999), // Limita pontuação máxima
            time: String(time).substring(0, 20) // Limita tamanho do tempo
          }])
          .select()

        if (error) {
          console.error('Erro no Supabase (insert):', error)
          return res.status(500).json({ 
            status: 'error',
            error: "Erro ao salvar pontuação",
            details: error.message 
          })
        }

        return res.status(200).json({ 
          status: 'success',
          message: "Pontuação salva com sucesso",
          data: data[0]
        })

      } catch (dbError) {
        console.error('Erro no banco de dados:', dbError)
        return res.status(500).json({ 
          status: 'error',
          error: "Erro interno no servidor",
          details: dbError.message
        })
      }
    }

    // GET - Obter ranking
    if (req.method === 'GET') {
      try {
        const { data, error } = await supabase
          .from('rankings')
          .select('*')
          .order('score', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Erro no Supabase (select):', error)
          return res.status(500).json({ 
            status: 'error',
            error: "Erro ao obter ranking",
            details: error.message
          })
        }

        return res.status(200).json({ 
          status: 'success',
          data: data || []
        })

      } catch (dbError) {
        console.error('Erro no banco de dados:', dbError)
        return res.status(500).json({ 
          status: 'error',
          error: "Erro interno no servidor",
          details: dbError.message
        })
      }
    }

    // Método não permitido
    return res.status(405).json({
      status: 'error',
      error: `Método ${req.method} não permitido`,
      allowed: ['GET', 'POST', 'OPTIONS']
    })

  } catch (globalError) {
    console.error('Erro global no handler:', globalError)
    return res.status(500).json({
      status: 'error',
      error: "Erro interno no servidor",
      details: process.env.NODE_ENV === 'development' ? globalError.message : undefined
    })
  }
}