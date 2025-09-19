// SOLID Principles - Interface Segregation Principle (ISP)

// ❌ ISP violation: Fat interface forces unnecessary dependencies
interface WorkerInterface {
    void work();
    void eat();
    void sleep();
    void receivePayment();
    void takeBreak();
    void attendMeeting();
}

class HumanWorker implements WorkerInterface {
    public void work() { /* implementation */ }
    public void eat() { /* implementation */ }
    public void sleep() { /* implementation */ }
    public void receivePayment() { /* implementation */ }
    public void takeBreak() { /* implementation */ }
    public void attendMeeting() { /* implementation */ }
}

class RobotWorker implements WorkerInterface {
    public void work() { /* implementation */ }
    public void eat() { throw new UnsupportedOperationException(); }
    public void sleep() { throw new UnsupportedOperationException(); }
    public void receivePayment() { throw new UnsupportedOperationException(); }
    public void takeBreak() { /* maybe maintenance */ }
    public void attendMeeting() { throw new UnsupportedOperationException(); }
}

// ✅ ISP compliance: Segregated interfaces
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

interface Payable {
    void receivePayment();
}

interface Breakable {
    void takeBreak();
}

interface MeetingAttendable {
    void attendMeeting();
}

class HumanWorker implements Workable, Eatable, Sleepable, Payable, Breakable, MeetingAttendable {
    public void work() { /* implementation */ }
    public void eat() { /* implementation */ }
    public void sleep() { /* implementation */ }
    public void receivePayment() { /* implementation */ }
    public void takeBreak() { /* implementation */ }
    public void attendMeeting() { /* implementation */ }
}

class RobotWorker implements Workable, Breakable {
    public void work() { /* implementation */ }
    public void takeBreak() { /* maintenance implementation */ }
}