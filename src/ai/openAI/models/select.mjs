import { AI_MODELS } from '#enums/openai/models.mjs'
import { gpt4 } from './gpt4.mjs'
import { gpt41 } from './gpt41.mjs'
import { gpt5 } from './gpt5.mjs'

const GPT4 = [AI_MODELS.GPT_4O, AI_MODELS.GPT_4O_MINI]
const GPT41 = [AI_MODELS.GPT_4_41, AI_MODELS.GPT_4_41_MINI, AI_MODELS.GPT_4_41_NANO]
const GPT5 = [AI_MODELS.GPT_5, AI_MODELS.GPT_5_MINI, AI_MODELS.GPT_5_NANO]

export async function select(model) {
  if (GPT4.includes(model)) {
    return gpt4
  } else if (GPT41.includes(model)) {
    return gpt41
  } else if (GPT5.includes(model)) {
    return gpt5
  } else {
    console.error('Invalid model:', model)
    throw new Error('Invalid model')
  }
}
