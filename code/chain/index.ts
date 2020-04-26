// 处理者接口声明了一个创建处理者链的方法。还声明了一个执行请求的方法。
interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: string): string;
}

// "基础处理者"，简单组件的基础类。
abstract class AbstractHandler implements Handler {
  private nextHandler: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Returning a handler from here will let us link handlers in a
    // convenient way like this:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }

  public handle(request: string): string {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }
}

//"具体处理者"
class MonkeyHandler extends AbstractHandler {
  public handle(request: string): string {
    if (request === "Banana") {
      return `Monkey: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}
//"具体处理者"
class SquirrelHandler extends AbstractHandler {
  public handle(request: string): string {
    if (request === "Nut") {
      return `Squirrel: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}
//"具体处理者"
class DogHandler extends AbstractHandler {
  public handle(request: string): string {
    if (request === "MeatBall") {
      return `Dog: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}

/**
 * The client code is usually suited to work with a single handler. In most
 * cases, it is not even aware that the handler is part of a chain.
 */
function clientCodeChain(handler: Handler) {
  const foods = ["Nut", "Banana", "Cup of coffee"];

  for (const food of foods) {
    console.log(`Client: Who wants a ${food}?`);

    const result = handler.handle(food);
    if (result) {
      console.log(`  ${result}`);
    } else {
      console.log(`  ${food} was left untouched.`);
    }
  }
}

/**
 * The other part of the client code constructs the actual chain.
 */
const monkey = new MonkeyHandler();
const squirrel = new SquirrelHandler();
const dog = new DogHandler();
//对职责链进行顺序组合  
monkey.setNext(squirrel).setNext(dog);

/**
 * The client should be able to send a request to any handler, not just the
 * first one in the chain.
 */
console.log("Chain: Monkey > Squirrel > Dog\n");
clientCodeChain(monkey);
console.log("");
//这里链中没有了monky的处理逻辑
console.log("Subchain: Squirrel > Dog\n");
clientCodeChain(squirrel);



// Chain: Monkey > Squirrel > Dog

// Client: Who wants a Nut?
//   Squirrel: I'll eat the Nut.
// Client: Who wants a Banana?
//   Monkey: I'll eat the Banana.
// Client: Who wants a Cup of coffee?
//   Cup of coffee was left untouched.

// Subchain: Squirrel > Dog

// Client: Who wants a Nut?
//   Squirrel: I'll eat the Nut.
// Client: Who wants a Banana?
//   Banana was left untouched.
// Client: Who wants a Cup of coffee?
//   Cup of coffee was left untouched.