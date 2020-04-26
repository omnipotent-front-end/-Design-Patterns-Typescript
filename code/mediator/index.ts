// 中介者接口声明了一个能让组件将各种事件通知给中介者的方法。中介者可对这
// 些事件做出响应并将执行工作传递给其他组件。
interface Mediator {
  notify(sender: object, event: string): void;
}

// 具体中介者类，可解开各个组件之间相互交叉的连接关系，并将其转移到中介者
// 中。
class ConcreteMediator implements Mediator {
  private component1: Component1;

  private component2: Component2;

  constructor(c1: Component1, c2: Component2) {
    this.component1 = c1;
    this.component1.setMediator(this);
    this.component2 = c2;
    this.component2.setMediator(this);
  }
  // 当组件中有事件发生时，它会通知中介者。中介者接收到通知后可自行处理，
  // 也可将请求传递给另一个组件。
  public notify(sender: object, event: string): void {
    if (event === "A") {
      console.log("Mediator reacts on A and triggers following operations:");
      this.component2.doC();
    }

    if (event === "D") {
      console.log("Mediator reacts on D and triggers following operations:");
      this.component1.doB();
      this.component2.doC();
    }
  }
}

// 每个组件都有一个指向中介者的引用，该引用被声明为中介者接口类型。
class BaseComponent {
  protected mediator: Mediator;

  constructor(mediator: Mediator = null) {
    this.mediator = mediator;
  }

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}

/**
 * Concrete Components implement various functionality. They don't depend on
 * other components. They also don't depend on any concrete mediator classes.
 */
class Component1 extends BaseComponent {
  public doA(): void {
    console.log("Component 1 does A.");
    this.mediator.notify(this, "A");
  }

  public doB(): void {
    console.log("Component 1 does B.");
    this.mediator.notify(this, "B");
  }
}

class Component2 extends BaseComponent {
  public doC(): void {
    console.log("Component 2 does C.");
    this.mediator.notify(this, "C");
  }

  public doD(): void {
    console.log("Component 2 does D.");
    this.mediator.notify(this, "D");
  }
}

/**
 * The client code.
 */
const c1 = new Component1();
const c2 = new Component2();
const mediator = new ConcreteMediator(c1, c2);

console.log("Client triggers operation A.");
c1.doA();

console.log("");
console.log("Client triggers operation D.");
c2.doD();

// Client triggers operation A.
// Component 1 does A.
// Mediator reacts on A and triggers following operations:
// Component 2 does C.

// Client triggers operation D.
// Component 2 does D.
// Mediator reacts on D and triggers following operations:
// Component 1 does B.
// Component 2 does C.
