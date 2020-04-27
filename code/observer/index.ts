// 发布者基类包含订阅管理代码和通知方法。
interface Subject {
  state: number;
  // Attach an observer to the subject.
  attach(observer: Observer): void;

  // Detach an observer from the subject.
  detach(observer: Observer): void;

  // Notify all observers about an event.
  notify(): void;
}

// 具体发布者
class ConcreteSubject implements Subject {
  // 为了简化，状态仅为一个数字
  public state: number;

  // 订阅者列表
  private observers: Observer[] = [];

  // 增加订阅者
  public attach(observer: Observer): void {
    console.log("Subject: Attached an observer.");
    this.observers.push(observer);
  }
  // 取消订阅者
  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    this.observers.splice(observerIndex, 1);
    console.log("Subject: Detached an observer.");
  }

  // 通知所有订阅者
  public notify(): void {
    console.log("Subject: Notifying observers...");
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  // 发布者包含具体的业务逻辑，我们也可以从发布者基类中扩
  // 展出该类
  public someBusinessLogic(): void {
    console.log("\nSubject: I'm doing something important.");
    this.state = Math.floor(Math.random() * (10 + 1));

    console.log(`Subject: My state has just changed to: ${this.state}`);
    this.notify();
  }
}

//订阅者接口，声明了通知接口
interface Observer {
  // Receive update from subject.
  update(subject: Subject): void;
}

//具体订阅者（Concrete Subscribers）可以执行一些操作来回应发布者的通知
class ConcreteObserverA implements Observer {
  public update(subject: Subject): void {
    if (subject.state < 3) {
      console.log("ConcreteObserverA: Reacted to the event.");
    }
  }
}

class ConcreteObserverB implements Observer {
  public update(subject: Subject): void {
    if (subject.state === 0 || subject.state >= 2) {
      console.log("ConcreteObserverB: Reacted to the event.");
    }
  }
}

/**
 * The client code.
 */

const subject = new ConcreteSubject();

const observer1 = new ConcreteObserverA();
subject.attach(observer1);

const observer2 = new ConcreteObserverB();
subject.attach(observer2);

subject.someBusinessLogic();
subject.someBusinessLogic();

subject.detach(observer2);

subject.someBusinessLogic();

// Subject: Attached an observer.
// Subject: Attached an observer.

// Subject: I'm doing something important.
// Subject: My state has just changed to: 6
// Subject: Notifying observers...
// ConcreteObserverB: Reacted to the event.

// Subject: I'm doing something important.
// Subject: My state has just changed to: 1
// Subject: Notifying observers...
// ConcreteObserverA: Reacted to the event.
// Subject: Detached an observer.

// Subject: I'm doing something important.
// Subject: My state has just changed to: 5
// Subject: Notifying observers...
