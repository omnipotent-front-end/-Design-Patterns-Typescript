/**
 * The Target defines the domain-specific interface used by the client code.
 */
class Target {
  public request(): string {
    return 'Target: The default target\'s behavior.';
  }
}

// 需要被适配的对象
class Adaptee {
  public specificRequest(): string {
    return ".eetpadA eht fo roivaheb laicepS";
  }
}

// 适配器
class Adapter extends Target {
  private adaptee: Adaptee;
  //传入被适配的对象
  constructor(adaptee: Adaptee) {
    super();
    this.adaptee = adaptee;
  }

  public request(): string {
    //调用被适配的对象
    const result = this.adaptee
      .specificRequest()
      .split("")
      .reverse()
      .join("");
    return `Adapter: (TRANSLATED) ${result}`;
  }
}

/**
 * The client code supports all classes that follow the Target interface.
 */
function clientAdapter(target: Target) {
  console.log(target.request());
}

console.log("Client: I can work just fine with the Target objects:");
const target = new Target();
clientAdapter(target);

console.log("");

const adaptee = new Adaptee();
console.log(
  "Client: The Adaptee class has a weird interface. See, I don't understand it:"
);
console.log(`Adaptee: ${adaptee.specificRequest()}`);

console.log("");
//将adaptee适配为和target一致
console.log("Client: But I can work with it via the Adapter:");
const adapter = new Adapter(adaptee);
clientAdapter(adapter);

// Client: I can work just fine with the Target objects:
// Target: The default target's behavior.

// Client: The Adaptee class has a weird interface. See, I don't understand it:
// Adaptee: .eetpadA eht fo roivaheb laicepS

// Client: But I can work with it via the Adapter:
// Adapter: (TRANSLATED) Special behavior of the Adaptee.
