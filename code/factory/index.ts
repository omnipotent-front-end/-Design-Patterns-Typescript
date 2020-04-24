// Creator类声明的工厂方法必须返回一个产品类的对象。创建者的子类通常会提供
// 该方法的实现。
abstract class Creator {
    // 创建者还可提供一些工厂方法的默认实现。
    public abstract factoryMethod(): Product;

    // 请注意，创建者的主要职责并非是创建产品。其中通常会包含一些核心业务
    // 逻辑，这些逻辑依赖于由工厂方法返回的产品对象。子类可通过重写工厂方
    // 法并使其返回不同类型的产品来间接修改业务逻辑。
    public someOperation(): string {
        // 调用工厂方法创建一个产品对象。
        const product = this.factoryMethod();
        // 使用product
        return `Creator: The same creator's code has just worked with ${product.operation()}`;
    }
}

// 具体Creator将重写工厂方法以改变其所返回的产品类型。
class ConcreteCreator1 extends Creator {
    public factoryMethod(): Product {
        return new ConcreteProduct1();
    }
}

class ConcreteCreator2 extends Creator {
    public factoryMethod(): Product {
        return new ConcreteProduct2();
    }
}

// 产品接口中将声明所有具体产品都必须实现的操作。
interface Product {
    operation(): string;
}

// 具体产品需提供产品接口的各种实现。
class ConcreteProduct1 implements Product {
    public operation(): string {
        return '{Result of the ConcreteProduct1}';
    }
}

class ConcreteProduct2 implements Product {
    public operation(): string {
        return '{Result of the ConcreteProduct2}';
    }
}

// 当前客户端代码会与具体创建者的实例进行交互，但是必须通过其基本接口
// 进行。只要客户端通过基本接口与创建者进行交互，你就可将任何创建者子
// 类传递给客户端。
function client(creator: Creator) {
    // ...
    console.log('Client: I\'m not aware of the creator\'s class, but it still works.');
    console.log(creator.someOperation());
    // ...
}


console.log('App: Launched with the ConcreteCreator1.');
client(new ConcreteCreator1());
console.log('');

console.log('App: Launched with the ConcreteCreator2.');
client(new ConcreteCreator2());