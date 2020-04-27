// 上下文（Context）保存了对于一个具体状态对象的引用，并会将所有与该状态相关的工作委派给它。
// 上下文通过状态接口与状态对象交互，且会提供一个设置器用于传递新的状态对象。
class Context {
  /**
   * @type {State} A reference to the current state of the Context.
   */
  private state: State;

  constructor(state: State) {
    this.transitionTo(state);
  }

  // 在运行时改变状态
  public transitionTo(state: State): void {
    console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this.state = state;
    this.state.setContext(this);
  }

  // 代理状态的方法
  public request1(): void {
    this.state.handle1();
  }

  public request2(): void {
    this.state.handle2();
  }
}

// 状态（State）接口会声明特定于状态的方法。
// 这些方法应能被其他所有具体状态所理解，因为你不希望某些状态所拥有的方法永远不会被调用。
abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract handle1(): void;

  public abstract handle2(): void;
}

// 具体的状态实现具体的行为逻辑
class ConcreteStateA extends State {
  public handle1(): void {
    console.log("ConcreteStateA handles request1.");
    console.log("ConcreteStateA wants to change the state of the context.");
    // 改变状态为B
    this.context.transitionTo(new ConcreteStateB());
  }

  public handle2(): void {
    console.log("ConcreteStateA handles request2.");
  }
}

class ConcreteStateB extends State {
  public handle1(): void {
    console.log("ConcreteStateB handles request1.");
  }

  public handle2(): void {
    console.log("ConcreteStateB handles request2.");
    console.log("ConcreteStateB wants to change the state of the context.");
    // 改变状态为A
    this.context.transitionTo(new ConcreteStateA());
  }
}

/**
 * The client code.
 */
const context = new Context(new ConcreteStateA());
context.request1();
context.request2();

// Context: Transition to ConcreteStateA.
// ConcreteStateA handles request1.
// ConcreteStateA wants to change the state of the context.
// Context: Transition to ConcreteStateB.
// ConcreteStateB handles request2.
// ConcreteStateB wants to change the state of the context.
// Context: Transition to ConcreteStateA.
