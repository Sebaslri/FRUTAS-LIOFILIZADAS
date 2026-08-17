import pymysql
import sys

def main():
    print("=== Importador de Base de Datos a TiDB ===")
    host = input("Host (ej. gateway01.us-east-1.prod.aws.tidbcloud.com): ").strip()
    user = input("Usuario (ej. tu_prefijo.root): ").strip()
    password = input("Contraseña: ").strip()
    
    if not host or not user or not password:
        print("Error: Todos los campos son obligatorios.")
        return

    try:
        print("Conectando a TiDB...")
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=4000,
            ssl={'ssl': {'reject_Unauthorized': True}} # TiDB requiere SSL
        )
        cursor = connection.cursor()
        
        print("Conexión exitosa. Leyendo archivo SQL...")
        with open('db_frutas_tidb_final.sql', 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        # Limpiar la base de datos test por completo
        cursor.execute("DROP DATABASE IF EXISTS test;")
        
        # Crear base de datos db_frutas y usarla
        cursor.execute("CREATE DATABASE IF NOT EXISTS db_frutas;")
        cursor.execute("USE db_frutas;")
        
        # Ejecutar múltiples queries
        # Separamos por punto y coma (;) pero cuidando que no rompa strings.
        # Una forma más segura es usar cursor.execute() con la opción de ejecutar multiples sentencias, pero pymysql por defecto no lo hace.
        # Mejor reconectamos con client_flag para multi_statements
        connection.close()
        
        from pymysql.constants import CLIENT
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=4000,
            ssl={'ssl': {'reject_Unauthorized': True}},
            client_flag=CLIENT.MULTI_STATEMENTS
        )
        cursor = connection.cursor()
        cursor.execute("USE db_frutas;")
        
        print("Ejecutando el script (esto puede tardar unos segundos)...")
        cursor.execute(sql_script)
        connection.commit()
        
        print("\n¡ÉXITO! Todas las tablas y datos se han importado correctamente en TiDB.")
        
    except Exception as e:
        print(f"\nOcurrió un error durante la importación: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()

if __name__ == "__main__":
    main()
