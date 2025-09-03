import { OpenAI } from 'openai'

export async function sendToOpenAI(agentConfig, message) {
  try {
    const openai = new OpenAI({
      apiKey: agentConfig.ai.token
    })

    //cargar tools
    const completion = await openai.chat.completions.create({
      model: agentConfig.ai.model,
      messages: [
        { role: 'system', content: 'Eres un clasificador de mensajes.' },
        { role: 'user', content: message }
      ],
      max_tokens: 20,
      temperature: 0
    })
    const res = completion.choices[0].message
    console.info('Respuesta de IA AutoTag:', res.content)
    return res.content
  } catch (error) {
    console.error('Error al enviar mensaje a OpenAI:', error)
    return null
  }
}
