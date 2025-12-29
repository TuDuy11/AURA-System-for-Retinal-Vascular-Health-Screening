from infrastructure.databases.mssql import init_mssql
from infrastructure.models.user_model import User_model
from infrastructure.models.roles_model import Role_model

def init_db(app=None):
    init_mssql(app)
