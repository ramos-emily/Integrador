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
  try {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Handle OPTIONS for CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // POST - Adicionar nova pontuação
    if (req.method === 'POST') {
      // Verifica o corpo da requisição
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: "Corpo da requisição inválido" })
      }

      const { name, score, time } = req.body

      // Validação dos dados
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Nome inválido" })
      }

      if (score === undefined || typeof score !== 'number' || score < 0) {
        return res.status(400).json({ error: "Pontuação inválida" })
      }

      if (time === undefined || (typeof time !== 'string' && typeof time !== 'number')) {
        return res.status(400).json({ error: "Tempo inválido" })
      }

      // Insere no banco de dados
      try {
        const { error } = await supabase
          .from('rankings')
          .insert([{ 
            name: name.trim(), 
            score: Number(score),
            time: String(time)
          }])

        if (error) {
          console.error('Erro no Supabase (insert):', error)
          return res.status(500).json({ 
            error: "Erro ao salvar pontuação",
            details: error.message 
          })
        }

        return res.status(200).json({ 
          message: "Pontuação salva com sucesso",
          saved: { name, score, time }
        })

      } catch (dbError) {
        console.error('Erro no banco de dados:', dbError)
        return res.status(500).json({ 
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
            error: "Erro ao obter ranking",
            details: error.message
          })
        }

        return res.status(200).json({ 
          success: true,
          playersResults: data || []
        })

      } catch (dbError) {
        console.error('Erro no banco de dados:', dbError)
        return res.status(500).json({ 
          error: "Erro interno no servidor",
          details: dbError.message
        })
      }
    }

    // Método não permitido
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    return res.status(405).json({
      error: `Método ${req.method} não permitido`,
      allowed: ['GET', 'POST', 'OPTIONS']
    })

  } catch (globalError) {
    console.error('Erro global no handler:', globalError)
    return res.status(500).json({
      error: "Erro interno no servidor",
      details: globalError.message
    })
  }
}