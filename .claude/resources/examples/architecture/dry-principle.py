# DRY Principle Examples - Don't Repeat Yourself

# ❌ Logic repetition (not just code duplication)
def validate_email(email):
    if not email or '@' not in email or '.' not in email.split('@')[1]:
        return False
    return True

def validate_admin_email(email):
    if not email or '@' not in email or '.' not in email.split('@')[1]:
        return False
    return email.endswith('@company.com')

# ✅ DRY solution
def validate_email_format(email):
    return email and '@' in email and '.' in email.split('@')[1]

def validate_email(email):
    return validate_email_format(email)

def validate_admin_email(email):
    return validate_email_format(email) and email.endswith('@company.com')

"""
DRY at Different Levels:
1. Code Level: Extract common functions and utilities
2. Data Level: Single source of truth for configuration
3. Logic Level: Centralize business rules
4. Knowledge Level: Documentation and requirements in one place
"""