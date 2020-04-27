// 抽象类 （Abstract­Class） 会声明作为算法步骤的方法，
// 以及依次调用它们的实际模板方法。
//算法步骤可以被声明为 抽象类型， 也可以提供一些默认实现。
abstract class AbstractClass {
  /**
   * The template method defines the skeleton of an algorithm.
   */
  public templateMethod(): void {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }

  /**
   * These operations already have implementations.
   */
  protected baseOperation1(): void {
    console.log("AbstractClass says: I am doing the bulk of the work");
  }

  protected baseOperation2(): void {
    console.log(
      "AbstractClass says: But I let subclasses override some operations"
    );
  }

  protected baseOperation3(): void {
    console.log(
      "AbstractClass says: But I am doing the bulk of the work anyway"
    );
  }

  /**
   * These operations have to be implemented in subclasses.
   */
  protected abstract requiredOperations1(): void;

  protected abstract requiredOperation2(): void;

  /**
   * These are "hooks." Subclasses may override them, but it's not mandatory
   * since the hooks already have default (but empty) implementation. Hooks
   * provide additional extension points in some crucial places of the
   * algorithm.
   */
  protected hook1(): void {}

  protected hook2(): void {}
}

// 具体类 （Concrete­Class） 可以重写所有步骤， 
// 但不能重写模板方法自身。
class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log("ConcreteClass1 says: Implemented Operation1");
  }

  protected requiredOperation2(): void {
    console.log("ConcreteClass1 says: Implemented Operation2");
  }
}

// 具体类 （Concrete­Class） 可以重写所有步骤， 
// 但不能重写模板方法自身。
class ConcreteClass2 extends AbstractClass {
  protected requiredOperations1(): void {
    console.log("ConcreteClass2 says: Implemented Operation1");
  }

  protected requiredOperation2(): void {
    console.log("ConcreteClass2 says: Implemented Operation2");
  }

  protected hook1(): void {
    console.log("ConcreteClass2 says: Overridden Hook1");
  }
}

/**
 * The client code calls the template method to execute the algorithm. Client
 * code does not have to know the concrete class of an object it works with, as
 * long as it works with objects through the interface of their base class.
 */
function clientCode(abstractClass: AbstractClass) {
  // ...
  abstractClass.templateMethod();
  // ...
}

console.log("Same client code can work with different subclasses:");
clientCode(new ConcreteClass1());
console.log("");

console.log("Same client code can work with different subclasses:");
clientCode(new ConcreteClass2());

// Same client code can work with different subclasses:
// AbstractClass says: I am doing the bulk of the work
// ConcreteClass1 says: Implemented Operation1
// AbstractClass says: But I let subclasses override some operations
// ConcreteClass1 says: Implemented Operation2
// AbstractClass says: But I am doing the bulk of the work anyway

// Same client code can work with different subclasses:
// AbstractClass says: I am doing the bulk of the work
// ConcreteClass2 says: Implemented Operation1
// AbstractClass says: But I let subclasses override some operations
// ConcreteClass2 says: Overridden Hook1
// ConcreteClass2 says: Implemented Operation2
// AbstractClass says: But I am doing the bulk of the work anyway
