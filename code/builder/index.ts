// 生成器接口声明了创建产品对象不同部件的方法。
interface Builder {
  producePartA(): void;
  producePartB(): void;
  producePartC(): void;
}

// 具体生成器类将遵循生成器接口并提供生成步骤的具体实现。你的程序中可能会
// 有多个以不同方式实现的生成器变体。
class ConcreteBuilder1 implements Builder {
  private product: Product1;

  // 一个新的生成器实例必须包含一个在后续组装过程中使用的空产品对象。
  constructor() {
    this.reset();
  }
  // reset（重置）方法可清除正在生成的对象。
  public reset(): void {
    this.product = new Product1();
  }

  // 所有生成步骤都会与同一个产品实例进行交互。
  public producePartA(): void {
    this.product.parts.push("PartA1");
  }

  public producePartB(): void {
    this.product.parts.push("PartB1");
  }

  public producePartC(): void {
    this.product.parts.push("PartC1");
  }

  // 具体生成器需要自行提供获取结果的方法。这是因为不同类型的生成器可能
  // 会创建不遵循相同接口的、完全不同的产品。所以也就无法在生成器接口中
  // 声明这些方法（至少在静态类型的编程语言中是这样的）。
  //
  // 通常在生成器实例将结果返回给客户端后，它们应该做好生成另一个产品的
  // 准备。因此生成器实例通常会在 `getProduct（获取产品）`方法主体末尾
  // 调用重置方法。但是该行为并不是必需的，你也可让生成器等待客户端明确
  // 调用重置方法后再去处理之前的结果
  public getProduct(): Product1 {
    const result = this.product;
    this.reset();
    return result;
  }
}

// 只有当产品较为复杂且需要详细配置时，使用生成器模式才有意义。
class Product1 {
  public parts: string[] = [];

  public listParts(): void {
    console.log(`Product parts: ${this.parts.join(", ")}\n`);
  }
}

// 主管只负责按照特定顺序执行生成步骤。其在根据特定步骤或配置来生成产品时
// 会很有帮助。由于客户端可以直接控制生成器，所以严格意义上来说，主管类并
// 不是必需的。
class Director {
  private builder: Builder;

  // 主管可同由客户端代码传递给自身的任何生成器实例进行交互。客户端可通
  // 过这种方式改变最新组装完毕的产品的最终类型
  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  // 主管可使用同样的生成步骤创建多个产品变体。
  public buildMinimalViableProduct(): void {
    this.builder.producePartA();
  }

  public buildFullFeaturedProduct(): void {
    this.builder.producePartA();
    this.builder.producePartB();
    this.builder.producePartC();
  }
}

// 客户端代码会创建生成器对象并将其传递给主管，然后执行构造过程。最终结果
// 将需要从生成器对象中获取。
function clientCode(director: Director) {
  const builder = new ConcreteBuilder1();
  director.setBuilder(builder);

  console.log("Standard basic product:");
  director.buildMinimalViableProduct();
  builder.getProduct().listParts();

  console.log("Standard full featured product:");
  director.buildFullFeaturedProduct();
  builder.getProduct().listParts();

  // Remember, the Builder pattern can be used without a Director class.
  console.log("Custom product:");
  builder.producePartA();
  builder.producePartC();
  builder.getProduct().listParts();
}
// 最终产品通常需要从生成器对象中获取，因为主管不知晓具体生成器和
// 产品的存在，也不会对其产生依赖。
const director = new Director();
clientCode(director);

// Standard basic product:
// Product parts: PartA1

// Standard full featured product:
// Product parts: PartA1, PartB1, PartC1

// Custom product:
// Product parts: PartA1, PartC1
