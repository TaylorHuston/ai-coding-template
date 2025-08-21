# Architecture Guide

High-level system design principles and patterns for AI-assisted development.

## Overview

This document outlines architectural patterns and principles that work well with AI coding assistants. These patterns help maintain consistency, enable better AI understanding, and create sustainable codebases.

## Core Architectural Principles

### 1. Clarity Over Cleverness

AI assistants work best with clear, explicit code rather than clever or overly abstracted solutions.

**❌ Avoid:**
```python
# Overly clever, hard for AI to understand
def process(d): return {k: v for k, v in d.items() if callable(getattr(v, 'exec', None))}
```

**✅ Prefer:**
```python
def filter_executable_items(data_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Filter dictionary items that have an 'exec' method."""
    executable_items = {}
    for key, value in data_dict.items():
        if hasattr(value, 'exec') and callable(value.exec):
            executable_items[key] = value
    return executable_items
```

### 2. Explicit Dependencies

Make dependencies clear and traceable for better AI understanding.

**✅ Good Pattern:**
```python
# dependencies.py
from typing import Protocol

class DatabaseInterface(Protocol):
    def save(self, data: dict) -> str: ...
    def find(self, id: str) -> dict: ...

class UserService:
    def __init__(self, db: DatabaseInterface, logger: Logger):
        self.db = db
        self.logger = logger
    
    def create_user(self, user_data: dict) -> str:
        self.logger.info(f"Creating user: {user_data.get('name')}")
        return self.db.save(user_data)
```

### 3. Layered Architecture

Structure code in clear layers that AI can navigate and understand.

```
┌─────────────────────────────────────────┐
│               Presentation              │ ← Controllers, APIs, Views
├─────────────────────────────────────────┤
│              Application                │ ← Services, Use Cases
├─────────────────────────────────────────┤
│                Domain                   │ ← Business Logic, Models
├─────────────────────────────────────────┤
│             Infrastructure              │ ← Database, External APIs
└─────────────────────────────────────────┘
```

## Design Patterns for AI Assistance

### 1. Command Pattern for Complex Operations

Makes complex operations understandable and testable:

```python
from abc import ABC, abstractmethod
from typing import Dict, Any

class Command(ABC):
    @abstractmethod
    def execute(self) -> Any:
        pass
    
    @abstractmethod
    def undo(self) -> Any:
        pass

class CreateUserCommand(Command):
    def __init__(self, user_service: UserService, user_data: Dict[str, Any]):
        self.user_service = user_service
        self.user_data = user_data
        self.created_user_id = None
    
    def execute(self) -> str:
        self.created_user_id = self.user_service.create_user(self.user_data)
        return self.created_user_id
    
    def undo(self) -> None:
        if self.created_user_id:
            self.user_service.delete_user(self.created_user_id)
```

### 2. Strategy Pattern for Algorithm Variants

Clear way to handle different implementations:

```python
from typing import Protocol, List

class SortingStrategy(Protocol):
    def sort(self, data: List[int]) -> List[int]: ...

class QuickSort:
    def sort(self, data: List[int]) -> List[int]:
        if len(data) <= 1:
            return data
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        middle = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return QuickSort().sort(left) + middle + QuickSort().sort(right)

class BubbleSort:
    def sort(self, data: List[int]) -> List[int]:
        sorted_data = data.copy()
        n = len(sorted_data)
        for i in range(n):
            for j in range(0, n - i - 1):
                if sorted_data[j] > sorted_data[j + 1]:
                    sorted_data[j], sorted_data[j + 1] = sorted_data[j + 1], sorted_data[j]
        return sorted_data

class DataProcessor:
    def __init__(self, sorting_strategy: SortingStrategy):
        self.sorting_strategy = sorting_strategy
    
    def process_data(self, data: List[int]) -> List[int]:
        return self.sorting_strategy.sort(data)
```

### 3. Factory Pattern for Object Creation

Clear patterns for creating objects with different configurations:

```python
from enum import Enum
from typing import Dict, Any

class DatabaseType(Enum):
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    SQLITE = "sqlite"

class DatabaseConnectionFactory:
    @staticmethod
    def create_connection(db_type: DatabaseType, config: Dict[str, Any]):
        """Create database connection based on type and configuration."""
        
        if db_type == DatabaseType.POSTGRESQL:
            return PostgreSQLConnection(
                host=config['host'],
                port=config['port'],
                database=config['database'],
                username=config['username'],
                password=config['password']
            )
        elif db_type == DatabaseType.MYSQL:
            return MySQLConnection(
                host=config['host'],
                port=config['port'],
                database=config['database'],
                username=config['username'],
                password=config['password']
            )
        elif db_type == DatabaseType.SQLITE:
            return SQLiteConnection(
                database_path=config['database_path']
            )
        else:
            raise ValueError(f"Unsupported database type: {db_type}")
```

## Code Organization Patterns

### 1. Feature-Based Structure

Organize code by business features rather than technical layers:

```
src/
├── user_management/
│   ├── __init__.py
│   ├── models.py          # User-related models
│   ├── services.py        # User business logic
│   ├── repositories.py    # User data access
│   ├── controllers.py     # User API endpoints
│   └── tests/
│       ├── test_services.py
│       └── test_repositories.py
├── order_processing/
│   ├── __init__.py
│   ├── models.py
│   ├── services.py
│   ├── repositories.py
│   ├── controllers.py
│   └── tests/
└── shared/
    ├── __init__.py
    ├── database.py        # Shared database utilities
    ├── logging.py         # Shared logging configuration
    └── exceptions.py      # Custom exceptions
```

### 2. Clean Interface Definitions

Define clear interfaces that AI can understand and implement:

```python
from typing import Protocol, List, Optional
from datetime import datetime

class UserRepository(Protocol):
    """Repository interface for user data operations."""
    
    def create(self, user_data: dict) -> str:
        """Create a new user and return the user ID."""
        ...
    
    def find_by_id(self, user_id: str) -> Optional[dict]:
        """Find user by ID, return None if not found."""
        ...
    
    def find_by_email(self, email: str) -> Optional[dict]:
        """Find user by email, return None if not found."""
        ...
    
    def update(self, user_id: str, updates: dict) -> bool:
        """Update user data, return True if successful."""
        ...
    
    def delete(self, user_id: str) -> bool:
        """Delete user, return True if successful."""
        ...
    
    def list_active_users(self, limit: int = 100) -> List[dict]:
        """List active users with optional limit."""
        ...
```

### 3. Configuration Management

Centralized, type-safe configuration:

```python
from dataclasses import dataclass
from typing import Optional
import os

@dataclass
class DatabaseConfig:
    host: str
    port: int
    database: str
    username: str
    password: str
    pool_size: int = 10
    timeout: int = 30

@dataclass
class APIConfig:
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    cors_origins: list = None

@dataclass
class AppConfig:
    database: DatabaseConfig
    api: APIConfig
    secret_key: str
    log_level: str = "INFO"

def load_config() -> AppConfig:
    """Load configuration from environment variables."""
    
    database_config = DatabaseConfig(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.getenv("DB_NAME", "myapp"),
        username=os.getenv("DB_USER", "user"),
        password=os.getenv("DB_PASSWORD", "password"),
        pool_size=int(os.getenv("DB_POOL_SIZE", "10")),
        timeout=int(os.getenv("DB_TIMEOUT", "30"))
    )
    
    api_config = APIConfig(
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", "8000")),
        debug=os.getenv("API_DEBUG", "false").lower() == "true",
        cors_origins=os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else []
    )
    
    return AppConfig(
        database=database_config,
        api=api_config,
        secret_key=os.getenv("SECRET_KEY", "dev-secret-key"),
        log_level=os.getenv("LOG_LEVEL", "INFO")
    )
```

## Error Handling Architecture

### 1. Exception Hierarchy

Create clear exception hierarchies:

```python
class AppException(Exception):
    """Base exception for application errors."""
    
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.details = details or {}

class ValidationError(AppException):
    """Raised when input validation fails."""
    pass

class NotFoundError(AppException):
    """Raised when requested resource is not found."""
    pass

class AuthenticationError(AppException):
    """Raised when authentication fails."""
    pass

class AuthorizationError(AppException):
    """Raised when user lacks permission for action."""
    pass

class ExternalServiceError(AppException):
    """Raised when external service call fails."""
    pass
```

### 2. Centralized Error Handling

Handle errors consistently across the application:

```python
from typing import Dict, Any
import logging
from enum import Enum

class ErrorSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ErrorHandler:
    def __init__(self, logger: logging.Logger):
        self.logger = logger
    
    def handle_error(self, error: Exception, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Handle error and return standardized error response."""
        
        error_response = {
            "error": True,
            "message": str(error),
            "error_type": type(error).__name__,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if isinstance(error, AppException):
            error_response.update({
                "error_code": error.error_code,
                "details": error.details,
                "severity": self._get_error_severity(error)
            })
        
        # Log error with context
        self._log_error(error, error_response, context)
        
        return error_response
    
    def _get_error_severity(self, error: AppException) -> str:
        """Determine error severity based on exception type."""
        severity_mapping = {
            ValidationError: ErrorSeverity.LOW,
            NotFoundError: ErrorSeverity.LOW,
            AuthenticationError: ErrorSeverity.MEDIUM,
            AuthorizationError: ErrorSeverity.MEDIUM,
            ExternalServiceError: ErrorSeverity.HIGH,
        }
        
        return severity_mapping.get(type(error), ErrorSeverity.MEDIUM).value
    
    def _log_error(self, error: Exception, error_response: Dict[str, Any], context: Dict[str, Any]):
        """Log error with appropriate level based on severity."""
        
        log_data = {
            "error_response": error_response,
            "context": context or {},
            "stack_trace": traceback.format_exc()
        }
        
        if error_response.get("severity") == ErrorSeverity.CRITICAL.value:
            self.logger.critical("Critical error occurred", extra=log_data)
        elif error_response.get("severity") == ErrorSeverity.HIGH.value:
            self.logger.error("High severity error occurred", extra=log_data)
        else:
            self.logger.warning("Error occurred", extra=log_data)
```

## Testing Architecture

### 1. Test Organization

Structure tests to mirror your application structure:

```
tests/
├── unit/                    # Fast, isolated unit tests
│   ├── user_management/
│   │   ├── test_services.py
│   │   └── test_models.py
│   └── order_processing/
├── integration/             # Tests with external dependencies
│   ├── test_database.py
│   └── test_api_endpoints.py
├── e2e/                    # End-to-end tests
│   ├── test_user_workflows.py
│   └── test_order_workflows.py
├── fixtures/               # Test data and fixtures
│   ├── user_data.json
│   └── order_data.json
└── conftest.py            # Pytest configuration and fixtures
```

### 2. Test Patterns

Use clear, consistent test patterns:

```python
import pytest
from unittest.mock import Mock, patch
from your_app.user_management.services import UserService
from your_app.user_management.models import User
from your_app.shared.exceptions import ValidationError, NotFoundError

class TestUserService:
    """Test cases for UserService."""
    
    @pytest.fixture
    def mock_user_repository(self):
        """Mock user repository for testing."""
        return Mock()
    
    @pytest.fixture
    def user_service(self, mock_user_repository):
        """Create UserService instance with mocked dependencies."""
        return UserService(repository=mock_user_repository)
    
    @pytest.fixture
    def valid_user_data(self):
        """Valid user data for testing."""
        return {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30
        }
    
    def test_create_user_success(self, user_service, mock_user_repository, valid_user_data):
        """Test successful user creation."""
        # Arrange
        expected_user_id = "user-123"
        mock_user_repository.create.return_value = expected_user_id
        mock_user_repository.find_by_email.return_value = None  # Email not taken
        
        # Act
        result = user_service.create_user(valid_user_data)
        
        # Assert
        assert result == expected_user_id
        mock_user_repository.create.assert_called_once_with(valid_user_data)
        mock_user_repository.find_by_email.assert_called_once_with("john@example.com")
    
    def test_create_user_validation_error(self, user_service):
        """Test user creation with invalid data."""
        # Arrange
        invalid_data = {"name": "", "email": "invalid-email"}
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            user_service.create_user(invalid_data)
        
        assert "Name is required" in str(exc_info.value)
        assert "Invalid email format" in str(exc_info.value)
    
    def test_create_user_duplicate_email(self, user_service, mock_user_repository, valid_user_data):
        """Test user creation with duplicate email."""
        # Arrange
        mock_user_repository.find_by_email.return_value = {"id": "existing-user"}
        
        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            user_service.create_user(valid_user_data)
        
        assert "Email already exists" in str(exc_info.value)
        mock_user_repository.create.assert_not_called()
```

## Monitoring and Observability

### 1. Structured Logging

Implement consistent, structured logging:

```python
import logging
import json
from typing import Dict, Any
from datetime import datetime

class StructuredLogger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def _log_structured(self, level: str, message: str, extra_data: Dict[str, Any] = None):
        """Log structured data as JSON."""
        
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level.upper(),
            "message": message,
            "logger": self.logger.name
        }
        
        if extra_data:
            log_entry.update(extra_data)
        
        # Log as JSON for structured parsing
        getattr(self.logger, level.lower())(json.dumps(log_entry))
    
    def info(self, message: str, **kwargs):
        self._log_structured("info", message, kwargs)
    
    def error(self, message: str, error: Exception = None, **kwargs):
        extra_data = kwargs.copy()
        if error:
            extra_data.update({
                "error_type": type(error).__name__,
                "error_message": str(error)
            })
        self._log_structured("error", message, extra_data)
    
    def warn(self, message: str, **kwargs):
        self._log_structured("warning", message, kwargs)
```

### 2. Metrics Collection

Simple metrics collection pattern:

```python
from typing import Dict, Any
import time
from functools import wraps

class MetricsCollector:
    def __init__(self):
        self.metrics: Dict[str, Any] = {}
    
    def increment_counter(self, name: str, value: int = 1, tags: Dict[str, str] = None):
        """Increment a counter metric."""
        key = self._build_metric_key(name, tags)
        self.metrics[key] = self.metrics.get(key, 0) + value
    
    def record_timing(self, name: str, duration: float, tags: Dict[str, str] = None):
        """Record a timing metric."""
        key = self._build_metric_key(name, tags)
        if key not in self.metrics:
            self.metrics[key] = []
        self.metrics[key].append(duration)
    
    def time_function(self, metric_name: str, tags: Dict[str, str] = None):
        """Decorator to time function execution."""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                start_time = time.time()
                try:
                    result = func(*args, **kwargs)
                    self.increment_counter(f"{metric_name}_success", tags=tags)
                    return result
                except Exception as e:
                    self.increment_counter(f"{metric_name}_error", tags=tags)
                    raise
                finally:
                    duration = time.time() - start_time
                    self.record_timing(metric_name, duration, tags)
            return wrapper
        return decorator
    
    def _build_metric_key(self, name: str, tags: Dict[str, str] = None) -> str:
        """Build metric key with tags."""
        if not tags:
            return name
        
        tag_string = ",".join([f"{k}={v}" for k, v in sorted(tags.items())])
        return f"{name}[{tag_string}]"
```

## AI-Friendly Architecture Checklist

### Code Structure
- [ ] Clear, explicit naming conventions
- [ ] Consistent file and folder organization
- [ ] Well-defined interfaces and contracts
- [ ] Minimal inheritance hierarchies
- [ ] Clear separation of concerns

### Documentation
- [ ] Comprehensive docstrings for all public methods
- [ ] Type hints for all function parameters and return values
- [ ] Clear README files for each major component
- [ ] Architecture decision records (ADRs) for major choices

### Testing
- [ ] Comprehensive test coverage (>80%)
- [ ] Clear test naming and organization
- [ ] Integration tests for critical paths
- [ ] Test data fixtures and factories

### Error Handling
- [ ] Consistent exception hierarchy
- [ ] Centralized error handling
- [ ] Meaningful error messages
- [ ] Proper logging of errors with context

### Configuration
- [ ] Environment-based configuration
- [ ] Type-safe configuration classes
- [ ] Clear configuration validation
- [ ] Sensible defaults for development

This architecture guide provides a foundation that both humans and AI assistants can work with effectively, ensuring maintainable and scalable code.