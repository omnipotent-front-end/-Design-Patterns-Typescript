// 组件接口会声明组合中简单和复杂对象的通用操作。
abstract class Component {
  protected parent: Component;

  //提供对父类组件的set和get
  public setParent(parent: Component) {
    this.parent = parent;
  }

  public getParent(): Component {
    return this.parent;
  }

  //继承的增加和删除
  public add(component: Component): void {}

  public remove(component: Component): void {}

  public isComposite(): boolean {
    return false;
  }

  // 一些操作
  public abstract operation(): string;
}

// 叶节点类代表组合的终端对象。叶节点对象中不能包含任何子对象。叶节点对象
// 通常会完成实际的工作，组合对象则仅会将工作委派给自己的子部件。
class Leaf extends Component {
  public operation(): string {
    return "Leaf";
  }
}

// 组合类表示可能包含子项目的复杂组件。组合对象通常会将实际工作委派给子项
// 目，然后“汇总”结果。
class Composite extends Component {
  protected children: Component[] = [];

  // 组合对象可在其项目列表中添加或移除其他组件（简单的或复杂的皆可）。
  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: Component): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);

    component.setParent(null);
  }

  public isComposite(): boolean {
    return true;
  }

  // 组合会以特定的方式执行其主要逻辑。它会递归遍历所有子项目，并收集和
  // 汇总其结果。由于组合的子项目也会将调用传递给自己的子项目，以此类推，
  // 最后组合将会完成整个对象树的遍历工作。
  public operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }

    return `Branch(${results.join("+")})`;
  }
}

// 客户端代码会通过基础接口与所有组件进行交互。这样一来，客户端代码便可同
// 时支持简单叶节点组件和复杂组件。
function clientComposite(component: Component) {
  // ...

  console.log(`RESULT: ${component.operation()}`);

  // ...
}

/**
 * This way the client code can support the simple leaf components...
 */
const simple = new Leaf();
console.log("Client: I've got a simple component:");
clientComposite(simple);
console.log("");

/**
 * ...as well as the complex composites.
 */
const tree = new Composite();
const branch1 = new Composite();
branch1.add(new Leaf());
branch1.add(new Leaf());
const branch2 = new Composite();
branch2.add(new Leaf());
tree.add(branch1);
tree.add(branch2);
console.log("Client: Now I've got a composite tree:");
clientComposite(tree);
console.log("");

/**
 * Thanks to the fact that the child-management operations are declared in the
 * base Component class, the client code can work with any component, simple or
 * complex, without depending on their concrete classes.
 */
function clientCode2(component1: Component, component2: Component) {
  // ...

  if (component1.isComposite()) {
    component1.add(component2);
  }
  console.log(`RESULT: ${component1.operation()}`);

  // ...
}

console.log(
  "Client: I don't need to check the components classes even when managing the tree:"
);
clientCode2(tree, simple);

// Client: I've got a simple component:
// RESULT: Leaf

// Client: Now I've got a composite tree:
// RESULT: Branch(Branch(Leaf+Leaf)+Branch(Leaf))

// Client: I don't need to check the components classes even when managing the tree:
// RESULT: Branch(Branch(Leaf+Leaf)+Branch(Leaf)+Leaf)
