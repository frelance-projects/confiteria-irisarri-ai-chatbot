export async function gpt41(openai, { aiModel, history, aiMaxTokens, aiTemperature, tools }) {
  const data = {
    model: aiModel,
    input: history,
    max_output_tokens: aiMaxTokens,
    temperature: aiTemperature,
    parallel_tool_calls: false,
    tools,
  }
  const response = await openai.responses.create(data)

  return response
}
