import sqlite3
import pandas as pd
import openpyxl

def setup_database(excel_file_path, database_file_path):

    df = pd.read_excel(excel_file_path)
    conn = sqlite3.connect(database_file_path)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS data_table (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Description TEXT,
        Unit TEXT,
        Attributes TEXT,
        Label TEXT,
        [2010] REAL,
        [2011] REAL,
        [2012] REAL,
        [2013] REAL,
        [2014] REAL,
        [2015] REAL,
        [2016] REAL,
        [2017] REAL,
        [2018] REAL,
        [2019] REAL,
        [2020] REAL,
        Normalized_Data TEXT,
        Cluster INTEGER
    )
    """)

    df.to_sql("data_table", conn, if_exists="replace", index=False)

    conn.commit()
    conn.close()

    print("Database setup complete and data uploaded successfully.")

excel_file = "data/data.xlsx"
database_file = "data_database.db"
setup_database(excel_file, database_file)