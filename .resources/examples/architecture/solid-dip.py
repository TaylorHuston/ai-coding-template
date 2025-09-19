# SOLID Principles - Dependency Inversion Principle (DIP)

# ❌ DIP violation: High-level module depends on low-level module
class MySQLDatabase:
    def save_user(self, user_data):
        # MySQL-specific implementation
        return f"Saved to MySQL: {user_data}"

class UserService:
    def __init__(self):
        self.database = MySQLDatabase()  # Tight coupling to concrete class

    def create_user(self, user_data):
        # Business logic
        processed_data = self.process_user_data(user_data)
        return self.database.save_user(processed_data)

# ✅ DIP compliance: Depend on abstractions
from abc import ABC, abstractmethod

class DatabaseInterface(ABC):
    @abstractmethod
    def save_user(self, user_data) -> str:
        pass

class MySQLDatabase(DatabaseInterface):
    def save_user(self, user_data) -> str:
        return f"Saved to MySQL: {user_data}"

class PostgreSQLDatabase(DatabaseInterface):
    def save_user(self, user_data) -> str:
        return f"Saved to PostgreSQL: {user_data}"

class UserService:
    def __init__(self, database: DatabaseInterface):
        self.database = database  # Depends on abstraction

    def create_user(self, user_data):
        processed_data = self.process_user_data(user_data)
        return self.database.save_user(processed_data)

# Dependency injection in action
mysql_db = MySQLDatabase()
postgres_db = PostgreSQLDatabase()

user_service_mysql = UserService(mysql_db)    # Can use either implementation
user_service_postgres = UserService(postgres_db)  # without changing UserService