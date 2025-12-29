from infrastructure.databases.mssql import init_mssql

def init_db(app=None):
    init_mssql(app)
