// 原发器中包含了一些可能会随时间变化的重要数据。它还定义了在备忘录中保存
// 自身状态的方法，以及从备忘录中恢复状态的方法。
class Originator {
  // 为了简化，这里使用一个变量来维护状态
  private state: string;

  constructor(state: string) {
    this.state = state;
    console.log(`Originator: My initial state is: ${state}`);
  }

  //具体的操作后，状态进行了变化
  public doSomething(): void {
    console.log("Originator: I'm doing something important.");
    this.state = this.generateRandomString(30);
    console.log(`Originator: and my state has changed to: ${this.state}`);
  }

  private generateRandomString(length: number = 10): string {
    const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return Array.apply(null, { length })
      .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
      .join("");
  }

  /**
   * Saves the current state inside a memento.
   */
  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  /**
   * Restores the Originator's state from a memento object.
   */
  public restore(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Originator: My state has changed to: ${this.state}`);
  }
}

// 备忘录（Memento）是原发器状态快照的值对象（value object）。
// 通常做法是将备忘录设为不可变的，并通过构造函数一次性传递数据。
interface Memento {
  getState(): string;

  getName(): string;

  getDate(): string;
}

// 具体的备忘录是原发器状态快照的值对象
class ConcreteMemento implements Memento {
  private state: string;

  private date: string;

  constructor(state: string) {
    this.state = state;
    this.date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }

  /**
   * The Originator uses this method when restoring its state.
   */
  public getState(): string {
    return this.state;
  }

  /**
   * The rest of the methods are used by the Caretaker to display metadata.
   */
  public getName(): string {
    return `${this.date} / (${this.state.substr(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

// 负责人（Caretaker）仅知道 “何时” 和“为何”捕捉原发器的状态，以及何时恢复状态。
// 负责人通过保存备忘录栈来记录原发器的历史状态。
// 当原发器需要回溯历史状态时，负责人将从栈中获取最顶部的备忘录，
// 并将其传递给原发器的恢复（restoration）方法。
class Caretaker {
  private mementos: Memento[] = [];

  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
  }
  // 进行一次备忘录的备份
  public backup(): void {
    console.log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (!this.mementos.length) {
      return;
    }
    //拿到之前的备忘录
    const memento = this.mementos.pop();

    console.log(`Caretaker: Restoring state to: ${memento.getName()}`);
    //恢复备忘录
    this.originator.restore(memento);
  }

  public showHistory(): void {
    console.log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      console.log(memento.getName());
    }
  }
}

/**
 * Client code.
 */
const originator = new Originator("Super-duper-super-puper-super.");
const caretaker = new Caretaker(originator);

caretaker.backup();
//doSomething修改了状态
originator.doSomething();

caretaker.backup();
originator.doSomething();

caretaker.backup();
originator.doSomething();

console.log("");
caretaker.showHistory();

console.log("\nClient: Now, let's rollback!\n");
caretaker.undo();

console.log("\nClient: Once more!\n");
caretaker.undo();

// Originator: My initial state is: Super-duper-super-puper-super.

// Caretaker: Saving Originator's state...
// Originator: I'm doing something important.
// Originator: and my state has changed to: qXqxgTcLSCeLYdcgElOghOFhPGfMxo

// Caretaker: Saving Originator's state...
// Originator: I'm doing something important.
// Originator: and my state has changed to: iaVCJVryJwWwbipieensfodeMSWvUY

// Caretaker: Saving Originator's state...
// Originator: I'm doing something important.
// Originator: and my state has changed to: oSUxsOCiZEnohBMQEjwnPWJLGnwGmy

// Caretaker: Here's the list of mementos:
// 2019-02-17 15:14:05 / (Super-dup...)
// 2019-02-17 15:14:05 / (qXqxgTcLS...)
// 2019-02-17 15:14:05 / (iaVCJVryJ...)

// Client: Now, let's rollback!

// Caretaker: Restoring state to: 2019-02-17 15:14:05 / (iaVCJVryJ...)
// Originator: My state has changed to: iaVCJVryJwWwbipieensfodeMSWvUY

// Client: Once more!

// Caretaker: Restoring state to: 2019-02-17 15:14:05 / (qXqxgTcLS...)
// Originator: My state has changed to: qXqxgTcLSCeLYdcgElOghOFhPGfMxo
