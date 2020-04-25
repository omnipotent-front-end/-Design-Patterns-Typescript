/**
 * Facade类提供了一个简单的接口，可以连接一个或多个
 * 几个子系统。 外立面将客户请求委托给
 * 子系统内的适当对象。 立面也负责
 * 管理其生命周期。 所有这些都使客户免受不必要的影响
 * 子系统的复杂性。
 */
class Facade {
  protected subsystem1: Subsystem1;

  protected subsystem2: Subsystem2;

  /**
   *根据您的应用程序的需求，您可以向Facade提供
   *现有子系统对象或强制Facade自行创建它们。
   */
  constructor(subsystem1: Subsystem1 = null, subsystem2: Subsystem2 = null) {
    this.subsystem1 = subsystem1 || new Subsystem1();
    this.subsystem2 = subsystem2 || new Subsystem2();
  }

  public operation(): string {
    let result = "Facade initializes subsystems:\n";
    result += this.subsystem1.operation1();
    result += this.subsystem2.operation1();
    result += "Facade orders subsystems to perform the action:\n";
    result += this.subsystem1.operationN();
    result += this.subsystem2.operationZ();

    return result;
  }
}

/**
 *子系统可以直接接受来自Facade或客户端的请求。
 *在任何情况下，对于子系统而言，Facade都是另一个客户端，并且不是
 *子系统的一部分。
 */
class Subsystem1 {
  public operation1(): string {
    return "Subsystem1: Ready!\n";
  }

  // ...

  public operationN(): string {
    return "Subsystem1: Go!\n";
  }
}

/**
 * Some facades can work with multiple subsystems at the same time.
 */
class Subsystem2 {
  public operation1(): string {
    return "Subsystem2: Get ready!\n";
  }

  // ...

  public operationZ(): string {
    return "Subsystem2: Fire!";
  }
}


// 应用程序的类并不依赖于复杂框架中成千上万的类。同样，如果你决定更换框架，
// 那只需重写外观类即可。
function clientFacade(facade: Facade) {
  // ...

  console.log(facade.operation());

  // ...
}

/**
 * The client code may have some of the subsystem's objects already created. In
 * this case, it might be worthwhile to initialize the Facade with these objects
 * instead of letting the Facade create new instances.
 */
const subsystem1 = new Subsystem1();
const subsystem2 = new Subsystem2();
const facade = new Facade(subsystem1, subsystem2);
clientFacade(facade);

// Facade initializes subsystems:
// Subsystem1: Ready!
// Subsystem2: Get ready!
// Facade orders subsystems to perform the action:
// Subsystem1: Go!
// Subsystem2: Fire!
