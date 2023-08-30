import json
import os
import pyodbc 
import requests
import sys

def writeFile(path, text):
    f = open(path, "x")
    f.write(text)
    f.close()

ticker = sys.argv[1]

# Load the raw data data
income_statement_json = ''
balance_sheet_json = ''
cash_flow_json = ''

income_statement_path = f"Data/{ticker}/INCOME_STATEMENT.json"
balance_sheet_path = f"Data/{ticker}/BALANCE_SHEET.json"
cash_flow_path = f"Data/{ticker}/CASH_FLOW.json"
if os.path.exists(f"Data/{ticker}"):
    print("Reading data from local files")
    income_statement_json = open(income_statement_path).read()
    balance_sheet_json = open(balance_sheet_path).read()
    cash_flow_json = open(cash_flow_path).read()
else:
    print("Reading data from api")
    income_statement_json = requests.get(f"https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol={ticker}&apikey=O8E15B1FYHPROPOA").text
    balance_sheet_json = requests.get(f"https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol={ticker}&apikey=O8E15B1FYHPROPOA").text
    cash_flow_json = requests.get(f"https://www.alphavantage.co/query?function=CASH_FLOW&symbol=IBM&apikey=O8E15B1FYHPROPOA").text
    print("Writing api data to files")
    os.mkdir(f"Data/{ticker}")
    writeFile(income_statement_path, income_statement_json)
    writeFile(balance_sheet_path, balance_sheet_json)
    writeFile(cash_flow_path, cash_flow_json)

# Parse the JSON
income_statment_data = json.loads(income_statement_json)
balance_sheet_data = json.loads(balance_sheet_json)
cash_flow_data = json.loads(cash_flow_json)

records = []

for idx in range(len(income_statment_data["annualReports"])):

    # Extract relevant financial data
    income_statement_report = income_statment_data["annualReports"][idx]
    balance_sheet_report = balance_sheet_data["annualReports"][idx]
    cash_flow_report = cash_flow_data["annualReports"][idx]

    print(f"Building ratios for fiscal date ending {income_statement_report['fiscalDateEnding']}")

    total_revenue = float(income_statement_report["totalRevenue"])
    gross_profit = float(income_statement_report["grossProfit"])
    operating_income = float(income_statement_report["operatingIncome"])
    net_income = float(income_statement_report["netIncome"])
    total_assets = float(balance_sheet_report["totalAssets"])
    total_liabilities = float(balance_sheet_report["totalLiabilities"])
    total_equity = float(balance_sheet_report["totalShareholderEquity"])
    operating_cashflow = float(cash_flow_report["operatingCashflow"])
    capital_expenditures = float(cash_flow_report["capitalExpenditures"])
    cashflow_from_investment = float(cash_flow_report["cashflowFromInvestment"])
    cashflow_from_financing = float(cash_flow_report["cashflowFromFinancing"])
    dividend_payout = float(cash_flow_report["dividendPayout"])
    proceeds_from_debt_issuance = float(cash_flow_report["proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet"])
    inventory = float(balance_sheet_report["inventory"]) if balance_sheet_report["inventory"] != "None" else 0
    total_outstanding_shares = float(balance_sheet_report["commonStockSharesOutstanding"])
    interest_expense = float(income_statement_report["interestExpense"])
    ebit = float(income_statement_report["ebit"])

    # Calculate financial ratios
    earnings_per_share = net_income/total_outstanding_shares if total_outstanding_shares != 0 else 0
    current_ratio = total_assets / total_liabilities if total_liabilities != 0 else 0
    quick_ratio = (total_assets - inventory) / total_liabilities if total_liabilities != 0 else 0
    debt_to_equity_ratio = total_liabilities / total_equity if total_equity != 0 else 0
    gross_margin = gross_profit / total_revenue
    net_profit_margin = net_income / total_revenue
    return_on_assets = net_income / total_assets
    return_on_equity = net_income / total_equity
    cashflow_to_debt_ratio = operating_cashflow / total_liabilities if total_liabilities != 0 else 0
    capital_expenditure_ratio = capital_expenditures / total_revenue if total_revenue != 0 else 0
    cashflow_solvency_ratio = (operating_cashflow - capital_expenditures) / total_liabilities if total_liabilities != 0 else 0
    dividend_payout_ratio = dividend_payout / net_income if net_income != 0 else 0
    operating_margin = operating_income / net_income if net_income != 0 else 0
    free_cashflow = operating_cashflow / capital_expenditures if capital_expenditures != 0 else 0
    ocf_to_sales_ratio = operating_cashflow / total_revenue if total_revenue != 0 else 0
    working_capital = total_assets - total_liabilities
    interest_ratio = ebit / interest_expense if interest_expense else 0

    # Print financial ratios and analysis
    print("Financial Risk Analysis for", income_statment_data["symbol"])
    print("------------------------------")
    print("Liquidity and Solvency:")
    print("Current Ratio:", current_ratio)
    print("Quick Ratio:", quick_ratio)
    print("Debt-to-Equity Ratio:", debt_to_equity_ratio)
    print("Cashflow to Debt Ratio:", cashflow_to_debt_ratio)
    print("Interest Ratio:", interest_ratio)
    print("------------------------------")
    print("Profitability and Returns:")
    print("Earnings Per Share:", earnings_per_share)
    print("Gross Margin:", gross_margin)
    print("Net Profit Margin:", net_profit_margin)
    print("Return on Assets:", return_on_assets)
    print("Return on Equity:", return_on_equity)
    print("Operating margin:", operating_margin)
    print("------------------------------")
    print("Cash Flow and Investment:")
    print("Capital Expenditure Ratio:", capital_expenditure_ratio)
    print("Cashflow Solvency Ratio:", cashflow_solvency_ratio)
    print("Dividend Payout Ratio:", dividend_payout_ratio)
    print("Free Cash Flow:", free_cashflow)
    print("OCF to Sales Ratio:", ocf_to_sales_ratio)
    print("------------------------------")
    print("Proceeds from Debt Issuance:", proceeds_from_debt_issuance)
    print("------------------------------")

    records.append({
        "ticker": ticker,
        "fiscal_date_ending": income_statement_report["fiscalDateEnding"],
        "current_ratio": current_ratio,
        "quick_ratio": quick_ratio,
        "debt_to_equity_ratio": debt_to_equity_ratio,
        "cashflow_to_debt_ratio": cashflow_to_debt_ratio,
        "gross_margin": gross_margin,
        "net_profit_margin": net_profit_margin,
        "return_on_assets": return_on_assets,
        "return_on_equity": return_on_equity,
        "capital_expenditure_ratio": capital_expenditure_ratio,
        "cashflow_solvency_ratio": cashflow_solvency_ratio,
        "dividend_payout_ratio": dividend_payout_ratio,
        "proceeds_from_debt_issuance": proceeds_from_debt_issuance,
        "operating_margin": operating_margin,
        "free_cashflow": free_cashflow,
        "earnings_per_share": earnings_per_share,
        "interest_ratio": interest_ratio,
        "ocf_to_sales_ratio": ocf_to_sales_ratio
    })

print("Writing data to the Database!")

with pyodbc.connect("Driver={ODBC Driver 17 for SQL Server};Server=cybersentinel.database.windows.netcybersentinel.database.windows.net;Database=cybersentinel;UID=cybersentinel;PWD=AvalaraHack2023") as conn:
    with conn.cursor() as cur:

        for r in records:
            print(f"Writing record for ticker '{r['ticker']}' and period end {r['fiscal_date_ending']}")
            cur.execute(f"""
                BEGIN TRAN
                        
                    UPDATE financial_metrics
                        SET earnings_per_share = {r["earnings_per_share"]},
                            return_on_equity = {r["return_on_equity"]},
                            return_on_assets = {r["return_on_assets"]},
                            debt_to_equity_ratio = {r["debt_to_equity_ratio"]},
                            current_ratio = {r["current_ratio"]},
                            quick_ratio = {r["quick_ratio"]},
                            gross_margin = {r["gross_margin"]},
                            operating_margin = {r["operating_margin"]},
                            net_profit_margin = {r["net_profit_margin"]},
                            free_cash_flow = {r["free_cashflow"]},
                            dividend_payout_ratio = {r["dividend_payout_ratio"]},
                            ocf_to_sales_ratio = {r["ocf_to_sales_ratio"]},
                            capex_to_sales_ratio = {r["capital_expenditure_ratio"]},
                            interest_ratio = {r["interest_ratio"]}
                        WHERE symbol = '{r["ticker"]}' AND fiscaldateending = '{r["fiscal_date_ending"]}'
                    IF (@@ROWCOUNT = 0)
                    BEGIN    
                        INSERT INTO financial_metrics
                            (company_name, earnings_per_share, pe_ratio, pb_ratio, return_on_equity, return_on_assets, debt_to_equity_ratio, current_ratio, quick_ratio, gross_margin,
                                operating_margin, net_profit_margin, free_cash_flow, dividend_yield, dividend_payout_ratio, ocf_to_sales_ratio, inventory_turnover, ar_turnover, 
                                capex_to_sales_ratio, working_capital, market_capitalization, revenue_growth, interest_ratio, symbol, fiscaldateending)
                            VALUES('{r["ticker"]}', {r["earnings_per_share"]}, 0, 0, {r["return_on_equity"]}, {r["return_on_assets"]}, {r["debt_to_equity_ratio"]}, {r["current_ratio"]}, {r["quick_ratio"]}, {r["gross_margin"]}, 
                                {r["operating_margin"]}, {r["net_profit_margin"]}, {r["free_cashflow"]}, 0, {r["dividend_payout_ratio"]}, {r["ocf_to_sales_ratio"]}, 0, 0,
                                {r["capital_expenditure_ratio"]}, 0, 0, 0, {r["interest_ratio"]}, '{r["ticker"]}','{r["fiscal_date_ending"]}')
                    END
                COMMIT
            """)

            conn.commit()

print("Finished!!!")