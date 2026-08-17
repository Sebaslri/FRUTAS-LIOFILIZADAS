import mysql.connector

try:
    conn = mysql.connector.connect(host="localhost", user="root", password="", database="db_frutas")
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables:")
    for (table_name,) in tables:
        print(f"\n--- Table: {table_name} ---")
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        for col in columns:
            print(col)
except Exception as e:
    print(e)
