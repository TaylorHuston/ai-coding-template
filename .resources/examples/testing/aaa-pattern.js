// Example: AAA Pattern (Arrange, Act, Assert)

it('should calculate total price with tax', () => {
  // Arrange
  const items = [
    { price: 10.00, quantity: 2 },
    { price: 5.00, quantity: 1 }
  ];
  const taxRate = 0.08;
  const calculator = new PriceCalculator();

  // Act
  const result = calculator.calculateTotal(items, taxRate);

  // Assert
  expect(result).toEqual({
    subtotal: 25.00,
    tax: 2.00,
    total: 27.00
  });
});

// Good: Clear, descriptive test names
it('should return 404 when user does not exist', () => {});
it('should send welcome email after successful registration', () => {});
it('should retry failed API calls up to 3 times', () => {});

// Bad: Unclear or generic names
it('should work', () => {});
it('test user creation', () => {});
it('handles errors', () => {});