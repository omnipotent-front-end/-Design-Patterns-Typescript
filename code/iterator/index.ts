// 迭代器（Iterator）接口声明了遍历集合所需的操作：获取下一个元素、获取当前位置和重新开始迭代等。
interface Iterator<T> {
  // Return the current element.
  current(): any;

  // Return the current element and move forward to next element.
  next(): T;

  // Return the key of the current element.
  key(): number;

  // Checks if current position is valid.
  valid(): boolean;

  // Rewind the Iterator to the first element.
  rewind(): void;
}
//集合接口声明一个或多个方法来获取与集合兼容的迭代器。
//请注意，返回方法的类型必须被声明为迭代器接口，因此具体集合可以返回各种不同种类的迭代器。
interface Aggregator {
  // Retrieve an external iterator.
  getIterator(): Iterator<string>;
}

// 具体迭代器（Concrete Iterators）实现遍历集合的一种特定算法。
// 迭代器对象必须跟踪自身遍历的进度。这使得多个迭代器可以相互独立地遍历同一集合。
class AlphabeticalOrderIterator implements Iterator<string> {
  private collection: WordsCollection;

  // 迭代器对象会独立于其他迭代器来对集合进行遍历。因此它必须保存迭代器
  // 的状态。
  private position: number = 0;

  /**
   * 指示运行方向
   */
  private reverse: boolean = false;

  constructor(collection: WordsCollection, reverse: boolean = false) {
    this.collection = collection;
    this.reverse = reverse;

    if (reverse) {
      this.position = collection.getCount() - 1;
    }
  }

  public rewind() {
    this.position = this.reverse ? this.collection.getCount() - 1 : 0;
  }

  public current(): any {
    return this.collection.getItems()[this.position];
  }

  public key(): number {
    return this.position;
  }

  public next(): any {
    const item = this.collection.getItems()[this.position];
    this.position += this.reverse ? -1 : 1;
    return item;
  }

  public valid(): boolean {
    if (this.reverse) {
      return this.position >= 0;
    }

    return this.position < this.collection.getCount();
  }
}

// 具体集合会在客户端请求迭代器时返回一个特定的具体迭代器类实体
class WordsCollection implements Aggregator {
  private items: string[] = [];

  public getItems(): string[] {
    return this.items;
  }

  public getCount(): number {
    return this.items.length;
  }

  public addItem(item: string): void {
    this.items.push(item);
  }

  public getIterator(): Iterator<string> {
    return new AlphabeticalOrderIterator(this);
  }

  public getReverseIterator(): Iterator<string> {
    return new AlphabeticalOrderIterator(this, true);
  }
}

/**
 * The client code may or may not know about the Concrete Iterator or Collection
 * classes, depending on the level of indirection you want to keep in your
 * program.
 */
const collection = new WordsCollection();
collection.addItem("First");
collection.addItem("Second");
collection.addItem("Third");

const iterator = collection.getIterator();

console.log("Straight traversal:");
while (iterator.valid()) {
  console.log(iterator.next());
}

console.log("");
console.log("Reverse traversal:");
// 得到一个反转的迭代器
const reverseIterator = collection.getReverseIterator();
while (reverseIterator.valid()) {
  console.log(reverseIterator.next());
}

// Straight traversal:
// First
// Second
// Third

// Reverse traversal:
// Third
// Second
// First
