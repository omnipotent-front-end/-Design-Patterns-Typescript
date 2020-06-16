
亦称： 动作、­ 事务、­Action、­Transaction、­Command

意图
--

**命令**是一种行为设计模式，它可将请求转换为一个包含与请求相关的所有信息的独立对象。该转换让你能根据不同的请求将方法参数化，延迟请求执行或将其放入队列中，且能实现可撤销操作。

![](2020-04-26-13-30-21.png)

问题
--

假如你正在开发一款新的文字编辑器，当前的任务是创建一个包含多个按钮的工具栏，并让每个按钮对应编辑器的不同操作。你创建了一个非常简洁的`按钮`类，它不仅可以用于生成工具栏上的按钮，还可用于生成各种对话框的通用按钮。

![](2020-04-26-13-31-39.png)

应用中的所有按钮都可以继承相同的类

尽管所有按钮看上去都很相似，但它们可以完成不同的操作（打开、保存、打印和应用等）。你会在哪里放置这些按钮的点击处理代码呢？最简单的解决方案是在使用按钮的每个地方都创建大量的子类。这些子类中包含按钮点击后必须执行的代码。

![](2020-04-26-13-31-56.png)

大量的按钮子类。没关系的。

你很快就意识到这种方式有严重缺陷。首先，你创建了大量的子类，当每次修改基类`按钮`时，你都有可能需要修改所有子类的代码。简单来说，GUI 代码以一种拙劣的方式依赖于业务逻辑中的不稳定代码。

![](2020-04-26-13-32-08.png)

多个类实现同一功能。

还有一个部分最难办。复制 / 粘贴文字等操作可能会在多个地方被调用。例如用户可以点击工具栏上小小的 “复制” 按钮，或者通过上下文菜单复制一些内容，又或者直接使用键盘上的`Ctrl+C`。

我们的程序最初只有工具栏，因此可以使用按钮子类来实现各种不同的操作。换句话来说，`CopyButton`（复制按钮）子类中包含复制文字的代码是可行的。在实现了上下文菜单、快捷方式和其他功能后，你要么需要将操作代码复制进许多个类中，要么需要让菜单依赖于按钮，而后者是更糟糕的选择。

解决方案
----

优秀的软件设计通常会将关注点进行分离，而这往往会导致软件的分层。最常见的例子：一层负责用户图像界面；另一层负责业务逻辑。GUI 层负责在屏幕上渲染美观的图形，捕获所有输入并显示用户和程序工作的结果。当需要完成一些重要内容时（比如计算月球轨道或撰写年度报告），GUI 层则会将工作委派给业务逻辑底层。

这在代码中看上去就像这样：一个 GUI 对象传递一些参数来调用一个业务逻辑对象。这个过程通常被描述为一个对象发送​_请求_​给另一个对象。

![](2020-04-26-13-34-04.png)

GUI 层可以直接访问业务逻辑层。

命令模式建议 GUI 对象不要直接提交这些请求。你应该将请求的所有细节（例如调用的对象、方法名称和参数列表）抽取出来组成​_命令_​类，该类中仅包含一个用于触发请求的方法。

命令对象负责连接不同的 GUI 和业务逻辑对象。此后，GUI 对象无需了解业务逻辑对象是否获得了请求，也无需了解其对请求进行处理的方式。GUI 对象触发命令即可，命令对象会自行处理所有细节工作。

![](2020-04-26-13-34-17.png)

通过命令访问业务逻辑层。

下一步是让所有命令实现相同的接口。该接口通常只有一个没有任何参数的执行方法，让你能在不和具体命令类耦合的情况下使用同一请求发送者执行不同命令。此外还有额外的好处，现在你能在运行时切换连接至发送者的命令对象，以此改变发送者的行为。

你可能会注意到遗漏的一块拼图——请求的参数。GUI 对象可以给业务层对象提供一些参数。但执行命令方法没有任何参数，所以我们如何将请求的详情发送给接收者呢？答案是：1. 使用数据对命令进行预先配置，或者 2. 能够自行获取数据。

![](2020-04-26-13-34-50.png)

GUI 对象将命令委派给命令对象。

让我们回到文本编辑器。应用命令模式后，我们不再需要任何按钮子类来实现点击行为。我们只需在`按钮`（Button）基类中添加一个成员变量来存储对于命令对象的引用，并在点击后执行该命令即可。

你需要为每个可能的操作实现一系列命令类，并且根据按钮所需行为将命令和按钮连接起来。

其他菜单、快捷方式或整个对话框等 GUI 元素都可以通过相同方式来实现。当用户与 GUI 元素交互时，与其连接的命令将会被执行。现在你很可能已经猜到了，与相同操作相关的元素将会被连接到相同的命令，从而避免了重复代码。

最后，命令成为了减少 GUI 和业务逻辑层之间耦合的中间层。而这仅仅是命令模式所提供的一小部分好处！

真实世界类比
------

![](2020-04-26-13-35-16.png)

在餐厅里点餐。

在市中心逛了很久的街后，你找到了一家不错的餐厅，坐在了临窗的座位上。一名友善的服务员走近你，迅速记下你点的食物，写在一张纸上。服务员来到厨房，把订单贴在墙上。过了一段时间，厨师拿到了订单，他根据订单来准备食物。厨师将做好的食物和订单一起放在托盘上。服务员看到托盘后对订单进行检查，确保所有食物都是你要的，然后将食物放到了你的桌上。

那张纸就是一个命令，它在厨师开始烹饪前一直位于队列中。命令中则包含与烹饪这些食物相关的所有信息。厨师能够根据它马上开始烹饪，而无需跑来直接和你确认订单详情。

结构
--

1.  **发送者**（Sender）——亦称 “触发者”（Invoker）——类负责对请求进行初始化，其中必须包含一个成员变量来存储对于命令对象的引用。发送者触发命令，而不向接收者直接发送请求。注意，发送者并不负责创建命令对象：它通常会通过构造方法从客户端处获得预先生成的命令。
    
2.  **命令**（Command）接口通常仅声明一个执行命令的方法。
    
3.  **具体命令**（Concrete Commands）会实现各种类型的请求。具体命令自身并不完成工作，而是会将调用委派给一个业务逻辑对象。但为了简化代码，这些类可以进行合并。
    
    接收对象执行方法所需的参数可以声明为具体命令的成员变量。你可以将命令对象设为不可变，仅允许通过构造函数对这些成员变量进行初始化。
    
4.  **接收者**（Receiver）类包含部分业务逻辑。几乎任何对象都可以作为接收者。绝大部分命令只处理如何将请求传递到接收者的细节，接收者自己会完成实际的工作。
    
5.  **客户端**（Client）会创建并配置具体的命令对象。客户端必须将包括接收者实体在内的所有请求参数传递给命令的构造函数。此后，生成的命令就可以与一个或多个发送者相关联了。
    

伪代码
---

在本例中，**命令**模式会记录已执行操作的历史记录，以在需要时撤销操作。

![](2020-04-26-13-35-53.png)

文本编辑器中的可撤销操作。

有些命令会改变编辑器的状态（例如剪切和粘贴），它们可在执行相关操作前对编辑器的状态进行备份。命令执行后会和当前点备份的编辑器状态一起被放入命令历史（命令对象栈）。此后，如果用户需要进行回滚操作，程序可从历史记录中取出最近的命令，读取相应的编辑器状态备份，然后进行恢复。

客户端代码（GUI 元素和命令历史等）没有和具体命令类相耦合，因为它通过命令接口来使用命令。这使得你能在无需修改已有代码的情况下在程序中增加新的命令。

```
// The base command class defines the common interface for all
// concrete commands.
abstract class Command is
    protected field app: Application
    protected field editor: Editor
    protected field backup: text

    constructor Command(app: Application, editor: Editor) is
        this.app = app
        this.editor = editor

    // Make a backup of the editor's state.
    method saveBackup() is
        backup = editor.text

    // Restore the editor's state.
    method undo() is
        editor.text = backup

    // The execution method is declared abstract to force all
    // concrete commands to provide their own implementations.
    // The method must return true or false depending on whether
    // the command changes the editor's state.
    abstract method execute()


// The concrete commands go here.
class CopyCommand extends Command is
    // The copy command isn't saved to the history since it
    // doesn't change the editor's state.
    method execute() is
        app.clipboard = editor.getSelection()
        return false

class CutCommand extends Command is
    // The cut command does change the editor's state, therefore
    // it must be saved to the history. And it'll be saved as
    // long as the method returns true.
    method execute() is
        saveBackup()
        app.clipboard = editor.getSelection()
        editor.deleteSelection()
        return true

class PasteCommand extends Command is
    method execute() is
        saveBackup()
        editor.replaceSelection(app.clipboard)
        return true

// The undo operation is also a command.
class UndoCommand extends Command is
    method execute() is
        app.undo()
        return false


// The global command history is just a stack.
class CommandHistory is
    private field history: array of Command

    // Last in...
    method push(c: Command) is
        // Push the command to the end of the history array.

    // ...first out
    method pop():Command is
        // Get the most recent command from the history.


// The editor class has actual text editing operations. It plays
// the role of a receiver: all commands end up delegating
// execution to the editor's methods.
class Editor is
    field text: string

    method getSelection() is
        // Return selected text.

    method deleteSelection() is
        // Delete selected text.

    method replaceSelection(text) is
        // Insert the clipboard's contents at the current
        // position.


// The application class sets up object relations. It acts as a
// sender: when something needs to be done, it creates a command
// object and executes it.
class Application is
    field clipboard: string
    field editors: array of Editors
    field activeEditor: Editor
    field history: CommandHistory

    // The code which assigns commands to UI objects may look
    // like this.
    method createUI() is
        
        copy = function() { executeCommand(
            new CopyCommand(this, activeEditor)) }
        copyButton.setCommand(copy)
        shortcuts.onKeyPress("Ctrl+C", copy)

        cut = function() { executeCommand(
            new CutCommand(this, activeEditor)) }
        cutButton.setCommand(cut)
        shortcuts.onKeyPress("Ctrl+X", cut)

        paste = function() { executeCommand(
            new PasteCommand(this, activeEditor)) }
        pasteButton.setCommand(paste)
        shortcuts.onKeyPress("Ctrl+V", paste)

        undo = function() { executeCommand(
            new UndoCommand(this, activeEditor)) }
        undoButton.setCommand(undo)
        shortcuts.onKeyPress("Ctrl+Z", undo)

    // Execute a command and check whether it has to be added to
    // the history.
    method executeCommand(command) is
        if (command.execute)
            history.push(command)

    // Take the most recent command from the history and run its
    // undo method. Note that we don't know the class of that
    // command. But we don't have to, since the command knows
    // how to undo its own action.
    method undo() is
        command = history.pop()
        if (command != null)
            command.undo()


```

适用性
---

如果你需要通过操作来参数化对象，可使用命令模式。

命令模式可将特定的方法调用转化为独立对象。这一改变也带来了许多有趣的应用：你可以将命令作为方法的参数进行传递、将命令保存在其他对象中，或者在运行时切换已连接的命令等。

举个例子：你正在开发一个 GUI 组件（例如上下文菜单），你希望用户能够配置菜单项，并在点击菜单项时触发操作。

如果你想要将操作放入队列中、操作的执行或者远程执行操作，可使用命令模式。

同其他对象一样，命令也可以实现序列化（序列化的意思是转化为字符串），从而能方便地写入文件或数据库中。一段时间后，该字符串可被恢复成为最初的命令对象。因此，你可以延迟或计划命令的执行。但其功能远不止如此！使用同样的方式，你还可以将命令放入队列、记录命令或者通过网络发送命令。

如果你想要实现操作回滚功能，可使用命令模式。

尽管有很多方法可以实现撤销和恢复功能，但命令模式可能是其中最常用的一种。

为了能够回滚操作，你需要实现已执行操作的历史记录功能。命令历史记录是一种包含所有已执行命令对象及其相关程序状态备份的栈结构。

这种方法有两个缺点。首先，程序状态的保存功能并不容易实现，因为部分状态可能是私有的。你可以使用[备忘录](https://refactoringguru.cn/design-patterns/memento)模式来在一定程度上解决这个问题。

其次，备份状态可能会占用大量内存。因此，有时你需要借助另一种实现方式：命令无需恢复原始状态，而是执行反向操作。反向操作也有代价：它可能很难实现，甚至无法实现。

实现方式
----

1.  声明仅有一个执行方法的命令接口。
    
2.  抽取请求并使之成为实现命令接口的具体命令类。每个类都必须有一组成员变量来保存请求参数和对于实际接收者对象的引用。所有这些变量的数值都必须通过命令构造函数进行初始化。
    
3.  找到担任​_发送者_​职责的类。在这些类中添加保存命令的成员变量。发送者只能通过命令接口与其命令进行交互。发送者自身通常并不创建命令对象，而是通过客户端代码获取。
    
4.  修改发送者使其执行命令，而非直接将请求发送给接收者。
    
5.  客户端必须按照以下顺序来初始化对象：
    
    *   创建接收者。
    *   创建命令，如有需要可将其关联至接收者。
    *   创建发送者并将其与特定命令关联。

优缺点
---

*   [单一职责原则]。你可以解耦触发和执行操作的类。
*   [开闭原则]。你可以在不修改已有客户端代码的情况下在程序中创建新的命令。
*   你可以实现撤销和恢复功能。
*   你可以实现操作的延迟执行。
*   你可以将一组简单命令组合成一个复杂命令。

*   代码可能会变得更加复杂，因为你在发送者和接收者之间增加了一个全新的层次。

与其他模式的关系
--------

*   [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)、[命令](https://refactoringguru.cn/design-patterns/command)、[中介者](https://refactoringguru.cn/design-patterns/mediator)和[观察者](https://refactoringguru.cn/design-patterns/observer)用于处理请求发送者和接收者之间的不同连接方式：
    
    *   ​_职责链_​按照顺序将请求动态传递给一系列的潜在接收者，直至其中一名接收者对请求进行处理。
    *   ​_命令_​在发送者和请求者之间建立单向连接。
    *   ​_中介者_​清除了发送者和请求者之间的直接连接，强制它们通过一个中介对象进行间接沟通。
    *   ​_观察者_​允许接收者动态地订阅或取消接收请求。
*   [职责链](https://refactoringguru.cn/design-patterns/chain-of-responsibility)的管理者可以使用[命令](https://refactoringguru.cn/design-patterns/command)模式来实现。在这种情况下，你可以对由请求代表的同一个上下文对象执行许多不同的操作。
    
    还有另外一种实现方式，那就是请求自身就是一个​_命令_​对象。在这种情况下，你可以对由一系列不同上下文连接而成的链执行相同的操作。
    
*   你可以同时使用[命令](https://refactoringguru.cn/design-patterns/command)和[备忘录](https://refactoringguru.cn/design-patterns/memento)来实现 “撤销”。在这种情况下，命令用于对目标对象执行各种不同的操作，备忘录用来保存一条命令执行前该对象的状态。
    
*   [命令](https://refactoringguru.cn/design-patterns/command)和[策略](https://refactoringguru.cn/design-patterns/strategy)看上去很像，因为两者都能通过某些行为来参数化对象。但是，它们的意图有非常大的不同。
    
    *   你可以使用​_命令_​来将任何操作转换为对象。操作的参数将成为对象的成员变量。你可以通过转换来延迟操作的执行、将操作放入队列、保存历史命令或者向远程服务发送命令等。
        
    *   另一方面，​_策略_​通常可用于描述完成某件事的不同方式，让你能够在同一个上下文类中切换算法。
        
*   [原型](https://refactoringguru.cn/design-patterns/prototype)可用于保存[命令](https://refactoringguru.cn/design-patterns/command)的历史记录。
    
*   你可以将[访问者](https://refactoringguru.cn/design-patterns/visitor)视为[命令](https://refactoringguru.cn/design-patterns/command)模式的加强版本，其对象可对不同类的多种对象执行操作。
    



Typescript实现
-----


[代码参考](/code/command/index.ts)

[带撤销功能的命令模式代码参考](/code/command/index2.ts)


Javascript简易实现
-----

[代码参考](/code/command/index.js)


应用场景
-------


### 1、数据状态管理

#### redux
前端库如Redux，其核心就是命令模式运用。[Redux中基本概念](https://omnipotent-front-end.github.io/web/fed.html#redux)中的Store对标命令模式的Receiver。Store 会根据 “reducers” 进行初始化，描述 Store 是如何变化的。这些 reducers 都是一些纯函数，每当被调用的时候都会返回一个新的 state，而不会导致莫名其妙地发生变化。这使得我们的代码具有高度的可预测性以及可测试性。

Redux中的Action对标命令模式中的Commander。Redux中的Dispatch对标命令模式中的Sender。


参考：

[【译】Redux 和 命令模式 | 吕立青的博客](https://blog.jimmylv.info/2016-04-19-redux-and-the-command-pattern/)