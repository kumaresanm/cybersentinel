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

    this.buildRiskReport = async function(company, industy) {

        const results = await Promise.all([
            this.getCompanyMetrics(company),
            this.getIndustryMetrics(industy)
        ]);
        const companyData = results[0];
        const industryData = results[1];

        const companyMetrics = companyData.map(r => {
            return `
                Financial Metrics for ${r.company_name} (Fiscal Date: ${r.fiscaldateending})
                Gross margin: ${r.gross_margin}
                Net Profit Margin: ${r.net_profit_margin}
                Earnings per share: ${r.earnings_per_share}
                Return on Equity: ${r.return_on_equity}
                Return on Assets: ${r.return_on_assets}
            `;
        });

        const industryMetrics = industryData.map(r => {
            return `
                Industry Metrics for ${r.industry_name})
                Industry Gross margin: ${r.gross_margin}
                Industry Net Profit Margin: ${r.net_profit_margin}
                Industry Earnings per share: ${r.earnings_per_share}
                Industry Return on Equity: ${r.return_on_equity}
                Industry Return on Assets: ${r.return_on_assets}
            `;
        });

        const prompt = `
            Here are the financial rations for the past 5 financial years:

            ${companyMetrics}
            Generate a report for me highlighting the positive metrics, neutral metrics and the red flags for the same. Be precise.
            Based on these average industry metrics provided here:

            ${industryMetrics} 
            and comparing it with the financial metrics of my company {average_metrics_text} tell me where the company stands among it's peers."
        `;
        const riskReport = await this.createCompletion(prompt);
        return riskReport;

    }

    this.getCompanyMetrics = async function(company) {
        let pool = await sql.connect({
            user: 'cybersentinel',
            password: 'AvalaraHack2023',
            server: 'cybersentinel.database.windows.net',
            database: 'cybersentinel'
        });
        
        try {
            let result1 = await pool.request().query(`SELECT * FROM financial_metrics where company_name='${company}'`);
            return result1.recordset;
        }
        finally {
            if(pool) {
                await pool.close();
            }
        }
    };

    this.getIndustryMetrics = async function(industry) {
        let pool = await sql.connect({
            user: 'cybersentinel',
            password: 'AvalaraHack2023',
            server: 'cybersentinel.database.windows.net',
            database: 'cybersentinel'
        });
        
        try {
            let result1 = await pool.request().query(`SELECT * FROM industry_metrics where industry_name='${industry}'`);
            return result1.recordset;
        }
        finally {
            if(pool) {
                await pool.close();
            }
        }
    };
}
