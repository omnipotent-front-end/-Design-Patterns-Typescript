
亦称： 缓存、 Cache、 Flyweight

意图
--

**享元模式**是一种结构型设计模式， 它摒弃了在每个对象中保存所有数据的方式， 通过**共享多个对象所共有的相同状态**， 让你能在有限的内存容量中载入更多对象。

![](2020-04-26-09-24-53.png)

问题
--

假如你希望在长时间工作后放松一下， 所以开发了一款简单的游戏： 玩家们在地图上移动并相互射击。 你决定实现一个真实的粒子系统， 并将其作为游戏的特色。 大量的子弹、 导弹和爆炸弹片会在整个地图上穿行， 为玩家提供紧张刺激的游戏体验。

开发完成后， 你推送提交了最新版本的程序， 并在编译游戏后将其发送给了一个朋友进行测试。 尽管该游戏在你的电脑上完美运行， 但是你的朋友却无法长时间进行游戏： 游戏总是会在他的电脑上运行几分钟后崩溃。 在研究了几个小时的调试消息记录后， 你发现导致游戏崩溃的原因是内存容量不足。 朋友的设备性能远比不上你的电脑， 因此游戏运行在他的电脑上时很快就会出现问题。

真正的问题与粒子系统有关。 每个粒子 （一颗子弹、 一枚导弹或一块弹片） 都由包含完整数据的独立对象来表示。 当玩家在游戏中鏖战进入高潮后的某一时刻， 游戏将无法在剩余内存中载入新建粒子， 于是程序就崩溃了。

![](2020-04-26-09-25-25.png)

解决方案
----

仔细观察 `粒子`Particle 类， 你可能会注意到颜色 （color） 和精灵图 （sprite） 这两个成员变量所消耗的内存要比其他变量多得多。 更糟糕的是， 对于所有的粒子来说， 这两个成员变量所存储的数据几乎完全一样 （比如所有子弹的颜色和精灵图都一样）。

![](2020-04-26-09-28-30.png)

每个粒子的另一些状态 （坐标、 移动矢量和速度） 则是不同的。 因为这些成员变量的数值会不断变化。 这些数据代表粒子在存续期间不断变化的情景， 但每个粒子的颜色和精灵图则会保持不变。

对象的**常量数据通常被称为_内在状态_**， 其位于对象中， 其他对象**只能读取但不能修改其数值**。 而对象的其他状态常常能被其他对象 “从外部” 改变， 因此**被称为_外在状态_**。

享元模式建议**不在对象中存储外在状态**， 而是将其传递给依赖于它的一个特殊方法。 程序只在对象中保存内在状态， 以方便在不同情景下重用。 这些对象的区别仅在于其内在状态 （与外在状态相比， 内在状态的变体要少很多）， 因此你所需的对象数量会大大削减。

![](2020-04-26-09-27-25.png)

让我们回到游戏中。 假如能从粒子类中抽出外在状态， 那么我们只需三个不同的对象 （子弹、 导弹和弹片） 就能表示游戏中的所有粒子。 你现在很可能已经猜到了， 我们将这样一个**仅存储内在状态的对象称为享元**。

#### 外在状态存储

那么外在状态会被移动到什么地方呢？ 总得有类来存储它们， 对不对？ 在大部分情况中， 它们会被移动到容器对象中， 也就是我们应用享元模式前的聚合对象中。

在我们的例子中， 容器对象就是主要的 `游戏`Game 对象， 其会将所有粒子存储在名为 `粒子`particles 的成员变量中。 为了能将外在状态移动到这个类中， 你需要创建多个数组成员变量来存储每个粒子的坐标、 方向矢量和速度。 除此之外， 你还需要另一个数组来存储指向代表粒子的特定享元的引用。 这些数组必须保持同步， 这样你才能够使用同一索引来获取关于某个粒子的所有数据。
![](2020-04-26-09-30-04.png)

更优雅的解决方案是创建独立的情景类来存储外在状态和对享元对象的引用。 在该方法中， 容器类只需包含一个数组。

稍等！ 这样的话情景对象数量不是会和不采用该模式时的对象数量一样多吗？ 的确如此， 但这些对象要比之前小很多。 消耗内存最多的成员变量已经被移动到很少的几个享元对象中了。 现在， 一个享元大对象会被上千个情境小对象复用， 因此无需再重复存储数千个大对象的数据。

#### 享元与不可变性

由于享元对象可在不同的情景中使用， 你必须确保其状态不能被修改。 享元类的状态只能由构造函数的参数进行一次性初始化， 它不能对其他对象公开其设置器或公有成员变量。

#### 享元工厂

为了能更方便地访问各种享元， 你可以创建一个工厂方法来管理已有享元对象的缓存池。 工厂方法从客户端处接收目标享元对象的内在状态作为参数， 如果它能在缓存池中找到所需享元， 则将其返回给客户端； 如果没有找到， 它就会新建一个享元， 并将其添加到缓存池中。

你可以选择在程序的不同地方放入该函数。 最简单的选择就是将其放置在享元容器中。 除此之外， 你还可以新建一个工厂类， 或者创建一个静态的工厂方法并将其放入实际的享元类中。

享元模式结构
------

1.  享元模式只是一种优化。 在应用该模式之前， 你要确定程序中存在与大量类似对象同时占用内存相关的内存消耗问题， 并且确保该问题无法使用其他更好的方式来解决。
    
2.  **享元** （Flyweight） 类包含原始对象中部分能在多个对象中共享的状态。 同一享元对象可在许多不同情景中使用。 享元中存储的状态被称为 “内在状态”。 传递给享元方法的状态被称为 “外在状态”。
    
3.  **情景** （Context） 类包含原始对象中各不相同的外在状态。 情景与享元对象组合在一起就能表示原始对象的全部状态。
    
4.  通常情况下， 原始对象的行为会保留在享元类中。 因此调用享元方法必须提供部分外在状态作为参数。 但你也可将行为移动到情景类中， 然后将连入的享元作为单纯的数据对象。
    
5.  **客户端** （Client） 负责计算或存储享元的外在状态。 在客户端看来， 享元是一种可在运行时进行配置的模板对象， 具体的配置方式为向其方法中传入一些情景数据参数。
    
6.  **享元工厂** （Flyweight Factory） 会对已有享元的缓存池进行管理。 有了工厂后， 客户端就无需直接创建享元， 它们只需调用工厂并向其传递目标享元的一些内在状态即可。 工厂会根据参数在之前已创建的享元中进行查找， 如果找到满足条件的享元就将其返回； 如果没有找到就根据参数新建享元。
    

伪代码
---

在本例中， **享元**模式能有效减少在画布上渲染数百万个树状对象时所需的内存。

![](2020-04-26-09-31-06.png)

该模式从主要的 `树`Tree 类中抽取内在状态， 并将其移动到享元类 `树种类`Tree­Type 之中。

最初程序需要在多个对象中存储相同数据， 而现在仅需在几个享元对象中保存数据， 然后在作为情景的 `树`对象中连入享元即可。 客户端代码使用享元工厂创建树对象并封装搜索指定对象的复杂行为， 并能在需要时复用对象。

```
// 享元类包含一个树的部分状态。这些成员变量保存的数值对于特定树而言是唯一
// 的。例如，你在这里找不到树的坐标。但这里有很多树木之间所共有的纹理和颜
// 色。由于这些数据的体积通常非常大，所以如果让每棵树都其进行保存的话将耗
// 费大量内存。因此，我们可将纹理、颜色和其他重复数据导出到一个单独的对象
// 中，然后让众多的单个树对象去引用它。
class TreeType is
    field name
    field color
    field texture
    constructor TreeType(name, color, texture) { ... }
    method draw(canvas, x, y) is
        // 1. 创建特定类型、颜色和纹理的位图。
        // 2. 在画布坐标 (X,Y) 处绘制位图。

// 享元工厂决定是否复用已有享元或者创建一个新的对象。
class TreeFactory is
    static field treeTypes: collection of tree types
    static method getTreeType(name, color, texture) is
        type = treeTypes.find(name, color, texture)
        if (type == null)
            type = new TreeType(name, color, texture)
            treeTypes.add(type)
        return type

// 情景对象包含树状态的外在部分。程序中可以创建数十亿个此类对象，因为它们
// 体积很小：仅有两个整型坐标和一个引用成员变量。
class Tree is
    field x,y
    field type: TreeType
    constructor Tree(x, y, type) { ... }
    method draw(canvas) is
        type.draw(canvas, this.x, this.y)

// 树（Tree）和森林（Forest）类是享元的客户端。如果不打算继续对树类进行开
// 发，你可以将它们合并。
class Forest is
    field trees: collection of Trees

    method plantTree(x, y, name, color, texture) is
        type = TreeFactory.getTreeType(name, color, texture)
        tree = new Tree(x, y, type)
        trees.add(tree)

    method draw(canvas) is
        foreach (tree in trees) do
            tree.draw(canvas)


```

享元模式适用性
-------

仅在程序必须支持大量对象且没有足够的内存容量时使用享元模式。

应用该模式所获的收益大小取决于使用它的方式和情景。 它在下列情况中最有效：

*   程序需要生成数量巨大的相似对象
*   这将耗尽目标设备的所有内存
*   对象中包含可抽取且能在多个对象间共享的重复状态。

实现方式
----

1.  将需要改写为享元的类成员变量拆分为两个部分：
    
    *   内在状态： 包含不变的、 可在许多对象中重复使用的数据的成员变量。
    *   外在状态： 包含每个对象各自不同的情景数据的成员变量
2.  保留类中表示内在状态的成员变量， 并将其属性设置为不可修改。 这些变量仅可在构造函数中获得初始数值。
    
3.  找到所有使用外在状态成员变量的方法， 为在方法中所用的每个成员变量新建一个参数， 并使用该参数代替成员变量。
    
4.  你可以有选择地创建工厂类来管理享元缓存池， 它负责在新建享元时检查已有的享元。 如果选择使用工厂， 客户端就只能通过工厂来请求享元， 它们需要将享元的内在状态作为参数传递给工厂。
    
5.  客户端必须存储和计算外在状态 （情景） 的数值， 因为只有这样才能调用享元对象的方法。 为了使用方便， 外在状态和引用享元的成员变量可以移动到单独的情景类中。
    

享元模式优缺点
-------

*   如果程序中有很多相似对象， 那么你将可以节省大量内存。

*   你可能需要**牺牲执行速度来换取内存**， 因为他人每次调用享元方法时都需要重新计算部分情景数据。
*   代码会变得更加复杂。 团队中的新成员总是会问： ​ “为什么要像这样拆分一个实体的状态？”。

与其他模式的关系
--------

*   你可以使用[享元模式](https://refactoringguru.cn/design-patterns/flyweight)实现[组合模式](https://refactoringguru.cn/design-patterns/composite)树的共享叶节点以节省内存。
    
*   [享元](https://refactoringguru.cn/design-patterns/flyweight)展示了如何生成大量的小型对象， [外观模式](https://refactoringguru.cn/design-patterns/facade)则展示了如何用一个对象来代表整个子系统。
    
*   如果你能将对象的所有共享状态简化为一个享元对象， 那么[享元](https://refactoringguru.cn/design-patterns/flyweight)就和[单例模式](https://refactoringguru.cn/design-patterns/singleton)类似了。 但这两个模式有两个根本性的不同。
    
    1.  只会有一个单例实体， 但是_享元_类可以有多个实体， 各实体的内在状态也可以不同。
    2.  _单例_对象可以是可变的。 享元对象是不可变的。



Typescript实现
-----

Flyweight模式具有一个目的：减少内存占用。如果您的程序不因内存不足而挣扎，那么您可能会暂时忽略此模式。

``` javascript
//"享元"存储了共有的状态，并通过方法接受其他剩余外部状态
class Flyweight {
  private sharedState: any;

  constructor(sharedState: any) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState): void {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`);
  }
}

//“享元工厂”创建和管理享元对象。它确保享元的正确性，并觉得是给外界一个新的还是原来就缓冲过的享元
class FlyweightFactory {
  private flyweights: { [key: string]: Flyweight } = <any>{};

  constructor(initialFlyweights: string[][]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Flyweight(state);
    }
  }

  /**
   * Returns a Flyweight's string hash for a given state.
   */
  private getKey(state: string[]): string {
    return state.join("_");
  }

  // 获取一个现有的享元，或是创建并返回一个新的享元对象
  public getFlyweight(sharedState: string[]): Flyweight {
    const key = this.getKey(sharedState);

    if (!(key in this.flyweights)) {
      console.log(
        "FlyweightFactory: Can't find a flyweight, creating new one."
      );
      this.flyweights[key] = new Flyweight(sharedState);
    } else {
      console.log("FlyweightFactory: Reusing existing flyweight.");
    }

    return this.flyweights[key];
  }

  public listFlyweights(): void {
    const count = Object.keys(this.flyweights).length;
    console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
    for (const key in this.flyweights) {
      console.log(key);
    }
  }
}

//客户端代码通常创建一系列享元，通过享元工厂
const factory = new FlyweightFactory([
  ["Chevrolet", "Camaro2018", "pink"],
  ["Mercedes Benz", "C300", "black"],
  ["Mercedes Benz", "C500", "red"],
  ["BMW", "M5", "red"],
  ["BMW", "X6", "white"],
  // ...
]);
factory.listFlyweights();

// ...

function addCarToPoliceDatabase(
  ff: FlyweightFactory,
  plates: string,
  owner: string,
  brand: string,
  model: string,
  color: string
) {
  console.log("\nClient: Adding a car to database.");
  const flyweight = ff.getFlyweight([brand, model, color]);
  // 通过享元的方法，将外部状态传入
  flyweight.operation([plates, owner]);
}
//如果已有则直接返回
addCarToPoliceDatabase(factory, "CL234IR", "James Doe", "BMW", "M5", "red");
//如果没有就重新创建
addCarToPoliceDatabase(factory, "CL234IR", "James Doe", "BMW", "X1", "red");

factory.listFlyweights();

// FlyweightFactory: I have 5 flyweights:
// Chevrolet_Camaro2018_pink
// Mercedes Benz_C300_black
// Mercedes Benz_C500_red
// BMW_M5_red
// BMW_X6_white

// Client: Adding a car to database.
// FlyweightFactory: Reusing existing flyweight.
// Flyweight: Displaying shared (["BMW","M5","red"]) and unique (["CL234IR","James Doe"]) state.

// Client: Adding a car to database.
// FlyweightFactory: Can't find a flyweight, creating new one.
// Flyweight: Displaying shared (["BMW","X1","red"]) and unique (["CL234IR","James Doe"]) state.

// FlyweightFactory: I have 6 flyweights:
// Chevrolet_Camaro2018_pink
// Mercedes Benz_C300_black
// Mercedes Benz_C500_red
// BMW_M5_red
// BMW_X6_white
// BMW_X1_red


```

Javascript简易实现
-----

``` javascript
class Color {
  constructor(name) {
    this.name = name;
  }
}

class colorFactory {
  constructor(name) {
    this.colors = {};
  }
  create(name) {
    let color = this.colors[name];
    if (color) return color;
    this.colors[name] = new Color(name);
    return this.colors[name];
  }
}

export { colorFactory };

```

应用场景
-----

1、游戏等需要大量内存场景

开发一个棋牌游戏(比如象棋)。一个游戏厅中有成千上万个“房间”，每个房 间对应一个棋局。棋局要保存每个棋子的数据，比如:棋子类型(将、相、士、炮等)、棋 子颜色(红方、黑方)、棋子在棋局中的位置。利用这些数据，我们就能显示一个完整的棋 盘给玩家。

为了记录每个房间当前的棋局情况，我们需要给每个房间都创建一个 ChessBoard 棋局对 象。因为游戏大厅中有成千上万的房间(实际上，百万人同时在线的游戏大厅也有很多)， 那保存这么多棋局对象就会消耗大量的内存。

在内存中会有大量的相似对象。这些相似对象的 id、text、color 都是相同的，唯独 positionX、positionY 不同。实 际上，我们可以将棋子的 id、text、color 属性拆分出来，设计成独立的类，并且作为享元 供多个棋盘复用。这样，棋盘只需要记录每个棋子的位置信息就可以了。

2、富文本编辑器性能优化

我们要在内存中表示一个文本文件，只需要记录文字和格式两部分信 息就可以了，其中，格式又包括文字的字体、大小、颜色等信息。

在一个文本文件中，用到的字体格式不会太多，毕竟不大可能有人把每个文字都设置成不同的格式。所以，对于字体格式，我们可以将它设计成享元，让不同的文字共享使用。



