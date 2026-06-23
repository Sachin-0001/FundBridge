from app.database.session import Base
from app.models.user import User
from app.models.business import BusinessProfile
from app.models.bank import BankProfile, BankRequirements
from app.models.application import Application, Match, Document

# Import all models here so Alembic can discover them
