// d单例类会对`getInstance（获取实例）`方法进行定义以让客户端在程序各处
// 都能访问相同的实例。
class Singleton {
  // 保存单例实例的成员变量必须被声明为静态类型。
  private static instance: Singleton;

  // 单例的构造函数必须永远是私有类型，以防止使用`new`运算符直接调用构
  // 造方法。
  private constructor() {}

  // 用于控制对单例实例的访问权限的静态方法。
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  // 最后，任何单例都必须定义一些可在其实例上执行的业务逻辑。
  public someBusinessLogic() {
    // ...
  }
}

/**
 * The client code.
 */
function clientSingleton() {
  const s1 = Singleton.getInstance();
  const s2 = Singleton.getInstance();

  if (s1 === s2) {
    console.log("Singleton works, both variables contain the same instance.");
  } else {
    console.log("Singleton failed, variables contain different instances.");
  }
}

clientSingleton();
//Singleton works, both variables contain the same instance.
