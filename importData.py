import json
import psycopg2
import os
from pathlib import Path
import pyodbc

def execute_sql_file(conn, cursor, file_path):
    with open(file_path, 'r') as sql_file:
        sql_commands = sql_file.read()
        cursor.execute(sql_commands)
        conn.commit()


fileTypes = ["balance_sheet", "cash_flow", "income_statement"]


directory = Path("scripts/Data")

# Get a list of all subdirectories within the directory
folders = [item.name for item in directory.iterdir() if item.is_dir()]

for folder in folders:

    ticker= folder
    # Read JSON data from a file
    for fileType in fileTypes:
        with open(f'scripts/Data/{ticker}/{fileType}.json', 'r') as json_file:
            data = json.load(json_file)

        # Assuming each JSON object represents a row to be inserted
        table_name = fileType
        insert_statements = []
        insert_statements.append(f"DELETE from {table_name} where symbol = '{ticker}';")
        symbol = ticker
        annual_reports =  data['annualReports']
        for item in annual_reports:
            keys = ', '.join(item)
            values = ', '.join(f"'{item[value].replace('None', '0')}'" for value in item)
            insert_query = f"INSERT INTO {table_name} (symbol, {keys}) VALUES ('{symbol}',{values});"
            insert_statements.append(insert_query)

            # Write the INSERT statements to a file
        with open(f'{table_name}_{symbol}.sql', 'w') as sql_file:
            for query in insert_statements:
                sql_file.write(query + '\n')


        # Connection parameters
        server = 'cybersentinel.database.windows.net'
        database = 'cybersentinel'
        username = 'cybersentinel'
        password = 'AvalaraHack2023'
        driver = 'ODBC Driver 17 for SQL Server'  # This could be different based on your environment
        sql_file_path = f"{table_name}_{symbol}.sql"

        conn = pyodbc.connect(f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}')

        try:
            #create cursor
            cursor = conn.cursor()

            #execute file
            execute_sql_file(conn, cursor, sql_file_path)
            # Delete the file
            os.remove(sql_file_path)
            print(f"{symbol} processed {table_name} successful") 


        except (Exception, psycopg2.Error) as error:
            print("Error:", error)
            conn.rollback()

        finally:
            # Close the cursor and connection
            if conn:
                cursor.close()
                conn.close()





