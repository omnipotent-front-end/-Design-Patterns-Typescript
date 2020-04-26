
//“服务接口”,“服务”和“代理”都需要遵循该接口
interface Subject {
  request(): void;
}

//“服务”，包含真实的业务逻辑
class RealSubject implements Subject {
  public request(): void {
    console.log("RealSubject: Handling request.");
  }
}

//代理类，对“服务”进行方法增强
class ProxyClass implements Subject {
  private realSubject: RealSubject;

  /**
   * The Proxy maintains a reference to an object of the RealSubject class. It
   * can be either lazy-loaded or passed to the Proxy by the client.
   */
  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  //代理了“服务”的request方法，并进行日志管理
  public request(): void {
    if (this.checkAccess()) {
      this.realSubject.request();
      this.logAccess();
    }
  }

  private checkAccess(): boolean {
    // Some real checks should go here.
    console.log("Proxy: Checking access prior to firing a real request.");

    return true;
  }

  private logAccess(): void {
    console.log("Proxy: Logging the time of request.");
  }
}

/**
 * The client code is supposed to work with all objects (both subjects and
 * proxies) via the Subject interface in order to support both real subjects and
 * proxies. In real life, however, clients mostly work with their real subjects
 * directly. In this case, to implement the pattern more easily, you can extend
 * your proxy from the real subject's class.
 */
function clientCodeProxy(subject: Subject) {
  // ...

  subject.request();

  // ...
}
//正常使用“服务”
console.log("Client: Executing the client code with a real subject:");
const realSubject = new RealSubject();
clientCodeProxy(realSubject);

console.log("");
//将“服务”代理后再使用
console.log("Client: Executing the same client code with a proxy:");
const proxy = new ProxyClass(realSubject);
clientCodeProxy(proxy);


// Client: Executing the client code with a real subject:
// RealSubject: Handling request.

// Client: Executing the same client code with a proxy:
// Proxy: Checking access prior to firing a real request.
// RealSubject: Handling request.
// Proxy: Logging the time of request.