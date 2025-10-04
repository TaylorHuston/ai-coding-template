// SOLID Principles - Liskov Substitution Principle (LSP)

// ❌ LSP violation: Subclass changes expected behavior
public class Bird
{
    public virtual void Fly()
    {
        Console.WriteLine("Flying high!");
    }
}

public class Penguin : Bird
{
    public override void Fly()
    {
        throw new NotSupportedException("Penguins can't fly!");
    }
}

// Client code breaks when substituting Penguin for Bird
void MakeBirdFly(Bird bird)
{
    bird.Fly(); // Exception when bird is a Penguin!
}

// ✅ LSP compliance: Proper abstraction hierarchy
public abstract class Bird
{
    public abstract void Move();
}

public class FlyingBird : Bird
{
    public override void Move()
    {
        Fly();
    }

    protected virtual void Fly()
    {
        Console.WriteLine("Flying high!");
    }
}

public class SwimmingBird : Bird
{
    public override void Move()
    {
        Swim();
    }

    protected virtual void Swim()
    {
        Console.WriteLine("Swimming gracefully!");
    }
}

public class Eagle : FlyingBird { }
public class Penguin : SwimmingBird { }

// Client code works with any Bird implementation
void MakeBirdMove(Bird bird)
{
    bird.Move(); // Always works, regardless of implementation
}