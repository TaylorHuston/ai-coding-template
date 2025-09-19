# SOLID Principles - Open/Closed Principle (OCP)

# ❌ OCP violation: Modifying existing code for new features
class PaymentProcessor:
    def process_payment(self, payment_type, amount):
        if payment_type == "credit_card":
            return self._process_credit_card(amount)
        elif payment_type == "paypal":
            return self._process_paypal(amount)
        elif payment_type == "bitcoin":  # New requirement: modify existing code
            return self._process_bitcoin(amount)
        else:
            raise ValueError("Unsupported payment type")

# ✅ OCP compliance: Extension without modification
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount: float) -> bool:
        pass

class CreditCardProcessor(PaymentProcessor):
    def process(self, amount: float) -> bool:
        return self._charge_credit_card(amount)

class PayPalProcessor(PaymentProcessor):
    def process(self, amount: float) -> bool:
        return self._charge_paypal(amount)

class BitcoinProcessor(PaymentProcessor):  # New feature: pure extension
    def process(self, amount: float) -> bool:
        return self._charge_bitcoin(amount)

class PaymentService:
    def __init__(self):
        self.processors = {}

    def register_processor(self, name: str, processor: PaymentProcessor):
        self.processors[name] = processor

    def process_payment(self, payment_type: str, amount: float) -> bool:
        if payment_type not in self.processors:
            raise ValueError(f"Unsupported payment type: {payment_type}")
        return self.processors[payment_type].process(amount)