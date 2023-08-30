'use strict'

const OpenAI = require('openai');

process.env["OPENAI_API_TYPE"] = "azure"
process.env["OPENAI_API_KEY"] = "87ecb3f61fb14d3abf7b4c4a32b66ef2"
process.env["OPENAI_API_BASE"] = "https://openai-india-hackathon1.openai.azure.com/openai/deployments/GPT-35-turbo/"
process.env["OPENAI_API_VERSION"] = "2023-07-01-preview"



exports.ChatService = function () {
    const openai = new OpenAI({
        apiKey: process.env["OPENAI_API_KEY"],
        baseURL: process.env["OPENAI_API_BASE"],
        defaultQuery: { 'api-version': process.env["OPENAI_API_VERSION"]  },
        defaultHeaders: { 'api-key': process.env["OPENAI_API_KEY"] },
    });

    this.createCompletion = async function (message) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 800,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "None"
          });

        return completion.choices[0].message.content;
    };
}