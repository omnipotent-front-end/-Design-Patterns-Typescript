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
