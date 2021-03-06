
亦称： 命令链、­CoR、­Chain of Command、­Chain of Responsibility

意图
--

**职责链**是一种行为设计模式，允许你将请求沿着处理者链进行发送。收到请求后，每个处理者均可对请求进行处理，或将其传递给链上的下个处理者。

![](2020-04-26-10-21-46.png)

问题
--

假如你正在开发一个在线订购系统。你希望对系统访问进行限制，只允许认证用户创建订单。此外，拥有管理权限的用户也拥有所有订单的完全访问权限。

简单规划后，你会意识到这些检查必须依次进行。只要接收到包含用户凭据的请求，应用程序就可尝试对进入系统的用户进行认证。但如果由于用户凭据不正确而导致认证失败，那就没有必要进行后续检查了。

![](2020-04-26-10-22-11.png)

请求必须经过一系列检查后才能由订购系统来处理。

在接下来的几个月里，你实现了后续的几个检查步骤。

*   一位同事认为直接将原始数据传递给订购系统存在安全隐患。因此你新增了额外的验证步骤来清理请求中的数据。
    
*   过了一段时间，有人注意到系统无法抵御暴力密码破解方式的攻击。为了防范这种情况，你立刻添加了一个检查步骤来过滤来自同一 IP 地址的重复错误请求。
    
*   又有人提议你可以对包含同样数据的重复请求返回缓存中的结果，从而提高系统响应速度。因此，你新增了一个检查步骤，确保只有没有满足条件的缓存结果时请求才能通过并被发送给系统。
    

![](https://refactoringguru.cn/images/patterns/diagrams/chain-of-responsibility/problem2-zh.png)

代码变得越来越多，也越来越混乱。

检查代码本来就已经混乱不堪，而每次新增功能都会使其更加臃肿。修改某个检查步骤有时会影响其他的检查步骤。最糟糕的是，当你希望复用这些检查步骤来保护其他系统组件时，你只能复制部分代码，因为这些组件只需部分而非全部的检查步骤。

系统会变得让人非常费解，而且其维护成本也会激增。你在艰难地和这些代码共处一段时间后，有一天终于决定对整个系统进行重构。

解决方案
----

与许多其他行为设计模式一样，**职责链**会将特定行为转换为被称作​_处理者_​的独立对象。在上述示例中，每个检查步骤都可被抽取为仅有单个方法的类，并执行检查操作。请求及其数据则会被作为参数传递给该方法。

模式建议你将这些处理者连成一条链。**链上的每个处理者都有一个成员变量来保存对于下一处理者的引用**。除了处理请求外，处理者还负责沿着链传递请求。请求会在链上移动，直至所有处理者都有机会对其进行处理。

最重要的是：处理者可以决定不再沿着链传递请求，这可高效地取消所有后续处理步骤。

在我们的订购系统示例中，处理者会在进行请求处理工作后决定是否继续沿着链传递请求。如果请求中包含正确的数据，所有处理者都将执行自己的主要行为，无论该行为是身份验证还是数据缓存。

![](2020-04-26-10-23-28.png)

处理者依次排列，组成一条链。

不过还有一种稍微不同的方式（也是更经典一种），那就是处理者接收到请求后自行决定是否能够对其进行处理。如果自己能够处理，处理者就不再继续传递请求。因此在这种情况下，每个请求要么最多有一个处理者对其进行处理，要么没有任何处理者对其进行处理。在处理图形用户界面元素栈中的事件时，这种方式非常常见。

例如，当用户点击按钮时，按钮产生的事件将沿着 GUI 元素链进行传递，最开始是按钮的容器（如窗体或面板），直至应用程序主窗口。链上第一个能处理该事件的元素会对其进行处理。此外，该例还有另一个值得我们关注的地方：它表明我们总能从对象树中抽取出链来。

![](2020-04-26-10-23-49.png)

对象树的枝干可以组成一条链。

所有处理者类均实现同一接口是关键所在。每个具体处理者仅关心下一个包含`execute`（执行）方法的处理者。这样一来，你就可以在运行时使用不同的处理者来创建链，而无需将相关代码与处理者的具体类进行耦合。

真实世界类比
------

![](2020-04-26-10-24-01.png)

给技术支持打电话时你可能得应对多名接听人员。

最近，你刚为自己的电脑购买并安装了一个新的硬件设备。身为一名极客，你显然在电脑上安装了多个操作系统，所以你会试着启动所有操作系统来确认其是否支持新的硬件设备。Windows 检测到了该硬件设备并对其进行了自动启用。但是你喜爱的 Linux 系统并不支持新硬件设备。抱着最后一点希望，你决定拨打包装盒上的技术支持电话。

首先你会听到自动回复器的机器合成语音，它提供了针对各种问题的九个常用解决方案，但其中没有一个与你遇到的问题相关。过了一会儿，机器人将你转接到一位人工接听人员处。

这位接听人员同样无法提供任何具体的解决方案。他不断地引用手册中冗长的内容，并不会仔细聆听你的回应。在第 10 次听到 “你是否关闭计算机后重新启动呢？” 这句话后，你要求与一位真正的工程师通话。

最后，接听人员将你的电话转接给了工程师，他或许正缩在某幢办公大楼的阴暗地下室中，坐在他所深爱的服务器机房里，焦躁不安地期待着同一名真人交流。工程师告诉了你新硬件设备驱动程序的下载网址，以及如何在 Linux 系统上进行安装。问题终于解决了！你挂断了电话，满心欢喜。

结构
--

1.  **处理者**（Handler）声明了所有具体处理者的通用接口。该接口通常仅包含单个方法用于请求处理，但有时其还会包含一个设置链上下个处理者的方法。
    
2.  **基础处理者**（Base Handler）是一个可选的类，你可以将所有处理者共用的样本代码放置在其中。
    
    通常情况下，该类中定义了一个保存对于下个处理者引用的成员变量。客户端可通过将处理者传递给上个处理者的构造方法或设定方法来创建链。该类还可以实现默认的处理行为：确定下个处理者存在后再将请求传递给它。
    
3.  **具体处理者**（Concrete Handlers）包含处理请求的实际代码。每个处理者接收到请求后，都必须决定是否进行处理，以及是否沿着链传递请求。
    
    处理者通常是独立且不可变的，需要通过构造方法一次性地获得所有必要地数据。
    
4.  **客户端**（Client）可根据程序逻辑一次性或者动态地生成链。值得注意的是，请求可发送给链上的任意一个处理者，而非必须是第一个处理者。
    

伪代码
---

在本例中，**职责链**模式负责为活动的 GUI 元素显示上下文帮助信息。

![](2020-04-26-10-24-28.png)

GUI 类使用组合模式生成。每个元素都链接到自己的容器元素。你可随时构建从当前元素开始的、遍历其所有容器的元素链。

应用程序的 GUI　通常为对象树结构。例如，负责渲染程序主窗口的`对话框`类就是对象树的根节点。对话框包含`面板`，而面板可能包含其他面板，或是`按钮`和`文本框`等下层元素。

只要给一个简单的组件指定帮助文本，它就可以显示简短的上下文提示。但更复杂的组件可以自定义上下文帮助文本的显示方式，例如显示手册摘录内容或在浏览器中打开一个网页。

![](2020-04-26-10-24-47.png)

帮助请求如何在 GUI 对象中移动。

当用户将鼠标指针移动到某个元素并按下`F1`键时，程序检测到指针下的组件并对其发送帮助请求。该请求不断向上传递到该元素所有的容器，直至某个元素能够显示帮助信息。

```
// 处理者接口声明了一个创建处理者链的方法。还声明了一个执行请求的方法。
interface ComponentWithContextualHelp is
    method showHelp()


// 简单组件的基础类。
abstract class Component implements ComponentWithContextualHelp is
    field tooltipText: string

    // 组件容器在处理者链中作为“下一个”链接。
    protected field container: Container

    // 如果组件设定了帮助文字，那它将会显示提示信息。如果组件没有帮助文字
    // 且其容器存在，那它会将调用传递给容器。
    method showHelp() is
        if (tooltipText != null)
            // 显示提示信息。
        else
            container.showHelp()


// 容器可以将简单组件和其他容器作为其子项目。链关系将在这里建立。该类将从
// 其父类处继承 showHelp（显示帮助）的行为。
abstract class Container extends Component is
    protected field children: array of Component

    method add(child) is
        children.add(child)
        child.container = this


// 原始组件应该能够使用帮助操作的默认实现...
class Button extends Component is
    

// 但复杂组件可能会对默认实现进行重写。如果无法以新的方式来提供帮助文字，
// 那组件总是还能调用基础实现的（参见 Component 类）。
class Panel extends Container is
    field modalHelpText: string

    method showHelp() is
        if (modalHelpText != null)
            // 显示包含帮助文字的模态窗口。
        else
            super.showHelp()

// ...同上...
class Dialog extends Container is
    field wikiPageURL: string

    method showHelp() is
        if (wikiPageURL != null)
            // 打开百科帮助页面。
        else
            super.showHelp()


// 客户端代码。
class Application is
    // 每个程序都能以不同方式对链进行配置。
    method createUI() is
        dialog = new Dialog("预算报告")
        dialog.wikiPageURL = "http://..."
        panel = new Panel(0, 0, 400, 800)
        panel.modalHelpText = "本面板用于..."
        ok = new Button(250, 760, 50, 20, "确认")
        ok.tooltipText = "这是一个确认按钮..."
        cancel = new Button(320, 760, 50, 20, "取消")
        
        panel.add(ok)
        panel.add(cancel)
        dialog.add(panel)

    // 想象这里会发生什么。
    method onF1KeyPress() is
        component = this.getComponentAtMouseCoords()
        component.showHelp()


```

适用性
---

当程序需要使用不同方式处理不同种类请求，而且请求类型和顺序预先未知时，可以使用职责链模式。

该模式能将多个处理者连接成一条链。接收到请求后，它会 “询问” 每个处理者是否能够对其进行处理。这样所有处理者都有机会来处理请求。

当必须按顺序执行多个处理者时，可以使用该模式。

无论你以何种顺序将处理者连接成一条链，所有请求都会严格按照顺序通过链上的处理者。

如果所需处理者及其顺序必须在运行时进行改变，可以使用职责链模式。

如果在处理者类中有对引用成员变量的设定方法，你将能动态地插入和移除处理者，或者改变其顺序。

实现方式
----

1.  声明处理者接口并描述请求处理方法的签名。
    
    确定客户端如何将请求数据传递给该方法。最灵活的方式是将请求转换为对象，然后将其以参数的形式传递给处理函数。
    
2.  为了在具体处理者中消除重复的样本代码，你可以根据处理者接口创建抽象处理者基类。
    
    该类需要有一个成员变量来存储指向链上下个处理者的引用。你可以将其设置为不可变类。但如果你打算在运行时对链进行改变，则需要定义一个设定方法来修改引用成员变量的值。
    
    为了使用方便，你还可以实现处理方法的默认行为。如果还有剩余对象，该方法会将请求传递给下个对象。具体处理者还能够通过调用父对象的方法来使用这一行为。
    
3.  依次创建具体处理者子类并实现其处理方法。每个处理者在接收到请求后都必须做出两个决定：
    
    *   是否自行处理这个请求。
    *   是否将该请求沿着链进行传递。
4.  客户端可以自行组装链，或者从其他对象处获得预先组装好的链。在后一种情况下，你必须实现工厂类以根据配置或环境设置来创建链。
    
5.  客户端可以触发链中的任意处理者，而不仅仅是第一个。请求将通过链进行传递，直至某个处理者拒绝继续传递，或者请求到达链尾。
    
6.  由于链的动态性，客户端需要准备好处理以下情况：
    
    *   链中可能只有单个链接。
    *   部分请求可能无法到达链尾。
    *   其他请求可能直到链尾都未被处理。

优缺点
---

*   你可以控制请求处理的顺序。
*   [单一职责原则]。你可以对发起操作和执行操作的类进行解耦。
*   [开闭原则]。你可以在不更改现有代码的情况下在程序中新增处理者。
*  可能需要牺牲部分性能。

与其他模式的关系
--------

*   [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)、[命令](https://refactoringguru.cn/design-patterns/command)、[中介者](https://refactoringguru.cn/design-patterns/mediator)和[观察者](https://refactoringguru.cn/design-patterns/observer)用于处理请求发送者和接收者之间的不同连接方式：
    
    *   ​_职责链_​按照顺序将请求动态传递给一系列的潜在接收者，直至其中一名接收者对请求进行处理。
    *   ​_命令_​在发送者和请求者之间建立单向连接。
    *   ​_中介者_​清除了发送者和请求者之间的直接连接，强制它们通过一个中介对象进行间接沟通。
    *   ​_观察者_​允许接收者动态地订阅或取消接收请求。
*   [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)通常和[组合](https://refactoringguru.cn/design-patterns/composite)模式结合使用。在这种情况下，叶组件接收到请求后，可以将请求沿包含全体父组件的链一直传递至对象树的底部。
    
*   [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)的管理者可以使用[命令](https://refactoringguru.cn/design-patterns/command)模式来实现。在这种情况下，你可以对由请求代表的同一个上下文对象执行许多不同的操作。
    
    还有另外一种实现方式，那就是请求自身就是一个​_命令_​对象。在这种情况下，你可以对由一系列不同上下文连接而成的链执行相同的操作。
    
*   [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)和[装饰](https://refactoringguru.cn/design-patterns/decorator)模式的类结构非常相似。两者都依赖递归组合将需要执行的操作传递给一系列对象。但是，两者有几点重要的不同之处。
    
    [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)的管理者可以相互独立地执行一切操作，还可以随时停止传递请求。另一方面，各种​_装饰_​可以在遵循基础接口的情况下扩展对象的行为。此外，装饰无法中断请求的传递。
    
Typescript实现
-----


``` javascript
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
```


Javascript简易实现
-----

``` javascript
class ShoppingCart {
  constructor() {
    this.products = [];
  }

  addProduct(p) {
    this.products.push(p);
  }
}

class Discount {
  calc(products) {
    let ndiscount = new NumberDiscount();
    let pdiscount = new PriceDiscount();
    let none = new NoneDiscount();
    ndiscount.setNext(pdiscount);
    pdiscount.setNext(none);
    return ndiscount.exec(products);
  }
}

class NumberDiscount {
  constructor() {
    this.next = null;
  }

  setNext(fn) {
    this.next = fn;
  }

  exec(products) {
    let result = 0;
    if (products.length > 3) result = 0.05;

    return result + this.next.exec(products);
  }
}

class PriceDiscount {
  constructor() {
    this.next = null;
  }

  setNext(fn) {
    this.next = fn;
  }

  exec(products) {
    let result = 0;
    let total = products.reduce((a, b) => a + b);

    if (total >= 500) result = 0.1;

    return result + this.next.exec(products);
  }
}

class NoneDiscount {
  exec() {
    return 0;
  }
}

export { ShoppingCart, Discount };

```


应用场景
------

1、分布执行逻辑

比如说反垃圾系统：

对于支持 UGC(User Generated Content，用户生成内容)的应用(比如论坛)来说， 用户生成的内容(比如，在论坛中发表的帖子)可能会包含一些敏感词(比如涉黄、广告、 反动等词汇)。针对这个应用场景，我们就可以利用职责链模式来过滤这些敏感词，对一种垃圾规则单独指定一个职责，从而在客户端拼接规则。

再比如说处理多个参数的情况。[参考execa](https://github.com/FunnyLiu/execa/blob/readsource/index.js#L102)，针对不同的参数，会分批次对返回的promise逐步增强：

``` js
	const spawnedPromise = getSpawnedPromise(spawned);
	// 这里是一个典型的职责链模式
	// 处理timeout相关的逻辑，
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	// 保证清除子进程相关逻辑
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);
```

每一方法都去增强promise，比如setExitHandler，保证promise在finally阶段杀死子进程：

``` js
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};
```

2、过滤器，拦截器

Servlet Filter 是 Java Servlet 规范中定义的组件，翻译成中文就是过滤器，它可以实现对 HTTP 请求的过滤功能，比如鉴权、限流、记录日志、验证参数等等。因为它是 Servlet 规范的一部分，所以，只要是支持 Servlet 的 Web 容器(比如，Tomcat、Jetty 等)，都支持过滤器功能。

添加一个过滤器，我们只需要定义一个实现 javax.servlet.Filter 接口的过滤器类，并 且将它配置在 web.xml 配置文件中。Web 容器启动的时候，会读取 web.xml 中的配置， 创建过滤器对象。当有请求到来的时候，会先经过过滤器，然后才由 Servlet 来处理。

我们发现，添加过滤器非常方便，不需要修改任何代码，定义一个实现 javax.servlet.Filter 的类，再改改配置就搞定了，完全符合开闭原则。那 Servlet Filter 是如何做到如此好的扩展性的呢?我想你应该已经猜到了，它利用的就是职责链模式。

Spring Interceptor拦截器底层也是基于职责链模式实现的。

著名的前端情况库axios的拦截器也是基于职责链。具体原理参考[axios拦截器原理](https://github.com/FunnyLiu/axios/tree/readsource#%E6%8B%A6%E6%88%AA%E5%99%A8%E7%9B%B8%E5%85%B3%E5%8E%9F%E7%90%86)

3、node框架express、koa中的中间件

node web应用框架中的express、koa的中间件模型本质上也是一种职责链的体现。

详细可以参考：[FunnyLiu/express at readsource](https://github.com/FunnyLiu/express/tree/readsource)，和[FunnyLiu/koa at readsource](https://github.com/FunnyLiu/koa/tree/readsource#koa-compose)。

4、前端数据流框架redux中的中间件

redux的中间件系统也是职责链的一种体现，详细可以参考：[FunnyLiu/redux at readsource](https://github.com/FunnyLiu/redux/tree/readsource#applymiddleware)

5、gulp中对文件的pipe处理流程

使用过gulp的同学应该很好理解责任链，因为gulp本身的文件处理机制便是基于责任链模式设计，使用链式调用，不同的loader负责对文件做不同的处理工作：

``` js
gulp.src(config.jsSrc)
    .pipe(uglify())
    .pipe(gulp.dest(config.dest + '/js'))
    .pipe(size());
```

6、webpack的loader工作原理

参考：[FunnyLiu/webpack at readsource](https://github.com/FunnyLiu/webpack/tree/readsource#loader%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)


由于 Webpack 是运行在 Node.js 之上的，一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数。 这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。

一个最简单的 Loader 的源码如下：


``` js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```

由于 Loader 运行在 Node.js 中，你可以调用任何 Node.js 自带的 API，或者安装第三方模块进行调用：

``` js
const sass = require('node-sass');
module.exports = function(source) {
  return sass(source);
};
```

Loader 就像是一个翻译员，能把源文件经过转化后输出新的结果，并且一个文件还可以链式的经过多个翻译员翻译。

以处理 SCSS 文件为例：

1、SCSS 源代码会先交给 sass-loader 把 SCSS 转换成 CSS；

2、把 sass-loader 输出的 CSS 交给 css-loader 处理，找出 CSS 中依赖的资源、压缩 CSS 等；

3、把 css-loader 输出的 CSS 交给 style-loader 处理，转换成通过脚本加载的 JavaScript 代码；

可以看出以上的处理过程需要有顺序的链式执行，先 sass-loader 再 css-loader 再 style-loader

这就是职责链模式的一种体现。
