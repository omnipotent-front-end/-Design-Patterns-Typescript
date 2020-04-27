// 上下文（Context）维护指向具体策略的引用，且仅通过策略接口与该对象进行交流。
class Context {
  /**
   * @type {Strategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private strategy: Strategy;

  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  // 上下文在运行时可以更改策略
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  //代理了策略的具体业务逻辑
  public doSomeBusinessLogic(): void {
    // ...

    console.log(
      "Context: Sorting data using the strategy (not sure how it'll do it)"
    );
    const result = this.strategy.doAlgorithm(["a", "b", "c", "d", "e"]);
    console.log(result.join(","));

    // ...
  }
}

// 策略（Strategy）接口是所有具体策略的通用接口，
// 它声明了一个上下文用于执行策略的方法
interface Strategy {
  doAlgorithm(data: string[]): string[];
}

// 具体策略实现具体的逻辑
class ConcreteStrategyA implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.sort();
  }
}

class ConcreteStrategyB implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.reverse();
  }
}

/**
 * The client code picks a concrete strategy and passes it to the context. The
 * client should be aware of the differences between strategies in order to make
 * the right choice.
 */
// 初始化策略为A
const context = new Context(new ConcreteStrategyA());
console.log("Client: Strategy is set to normal sorting.");
context.doSomeBusinessLogic();

console.log("");

console.log("Client: Strategy is set to reverse sorting.");
// 动态修改策略为B
context.setStrategy(new ConcreteStrategyB());
context.doSomeBusinessLogic();

// Client: Strategy is set to normal sorting.
// Context: Sorting data using the strategy (not sure how it'll do it)
// a,b,c,d,e

// Client: Strategy is set to reverse sorting.
// Context: Sorting data using the strategy (not sure how it'll do it)
// e,d,c,b,a
