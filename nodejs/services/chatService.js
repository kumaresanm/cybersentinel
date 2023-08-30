'use strict'

const OpenAI = require('openai');
const sql = require('mssql')

exports.ChatService = function () {
    const openai = new OpenAI({
        apiKey: "87ecb3f61fb14d3abf7b4c4a32b66ef2",
        baseURL: "https://openai-india-hackathon1.openai.azure.com/openai/deployments/GPT-35-turbo/",
        defaultQuery: { 'api-version': "2023-07-01-preview"  },
        defaultHeaders: { 'api-key': "87ecb3f61fb14d3abf7b4c4a32b66ef2" },
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

    this.uploadData= async function(jsonData) {
        let pool = await sql.connect({
            user: 'cybersentinel',
            password: 'AvalaraHack2023',
            server: 'cybersentinelpublic.postgres.database.azure.com',
            database: 'cybersentinel'
        });
        
        let result1 = await pool.request()
            .input('input_parameter', sql.Int, value)
            .query('select * from mytable where id = @input_parameter');
    };
}
