from sqlalchemy import Table, Column, Integer, ForeignKey
from infrastructure.databases.base import Base

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
)

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permissions.id"), primary_key=True),
)

#campaign_requests = Table(
 #   "campaign_requests",
  #  Base.metadata,
  #  Column("campaign_id", Integer, ForeignKey("screening_campaigns.id"), primary_key=True),
  #  Column("request_id", Integer, ForeignKey("analysis_requests.id"), primary_key=True),
#)
