// https://mp.weixin.qq.com/s/ECI3tniwucE2Tpv4eWw7iA
// 订阅
class Subscription {
  // 订阅列表
  _teardowns: Subscription[] = [];
  unsubscribe() {
    this._teardowns.forEach((teardown: Subscription) => {
      teardown.unsubscribe();
    });
  }

  // 订阅可以嵌套
  add(teardown: Subscription) {
    teardown && this._teardowns.push(teardown);
  }
}

interface Observer<T> {
  next(v: T): void;
  error(e: any): void;
  complete(): void;
}

// 订阅者
class Subscriber<T> extends Subscription {
  observer: Observer<T>;
  isStopped = false;
  // 接收一个包含next，eror，complete的对象来初始化Subscriber
  constructor(observer: Observer<T>) {
    super();
    this.observer = observer;
  }

  next(value: T) {
    if (this.observer.next && !this.isStopped) {
      this.observer.next(value);
    }
  }

  error(value: any) {
    this.isStopped = true;
    if (this.observer.error) {
      this.observer.error(value);
    }
  }

  complete() {
    this.isStopped = true;
    if (this.observer.complete) {
      this.observer.complete();
    }
    // 执行完成会自动取消订阅
    this.unsubscribe();
  }
}

// 操作符，从一个Observable转成另一个Observable
type OperatorFn<T> = (v: Observable<T>) => Observable<T>;

// 可观察对象
class Observable<T> {
  _subscribe: (observer: Subscriber<T>) => Subscription;
  constructor(_subscribe: (observer: Subscriber<T>) => any) {
    this._subscribe = _subscribe;
  }
  subscribe(observer: Observer<T>): Subscription {
    const subscriber = new Subscriber(observer);
    subscriber.add(this._subscribe(subscriber));
    return subscriber;
  }

  pipe(...operations: OperatorFn<T>[]): Observable<T> {
    return pipeFromArray(operations)(this);
  }
}

function pipeFromArray<T>(fns: OperatorFn<T>[]) {
  if (!fns.length) {
    return (x: any) => x;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return (source: Observable<T>) => {
    return fns.reduce((target: Observable<T>, fn) => fn(target), source);
  };
}

// https://www.bookstack.cn/read/Learn-RxJS-zh/operators-README.md
// 操作符就是将源Observable转为新Observable，转换的过程就是将源Observable发出的值进行拦截，经过处理后再发出
// 转换
function map<T>(fn: (v: any) => any) {
  return (observable: Observable<T>) =>
    new Observable((subscribe) => {
      return observable.subscribe({
        next(v) {
          subscribe.next(fn(v));
        },
        error(e) {
          subscribe.error(e);
        },
        complete() {
          subscribe.complete();
        },
      });
    });
}
// 过滤
function filter<T>(fn: (v: any) => any) {
  return (observable: Observable<T>) =>
    new Observable((subscribe) => {
      return observable.subscribe({
        next(v) {
          fn(v) && subscribe.next(v);
        },
        error(e) {
          subscribe.error(e);
        },
        complete() {
          subscribe.complete();
        },
      });
    });
}

// 工具
function delay<T>(ms: number) {
  return (observable: Observable<T>) =>
    new Observable((subscribe) => {
      return observable.subscribe({
        next(v) {
          const t = setTimeout(() => {
            clearTimeout(t);
            subscribe.next(v);
          }, ms);
        },
        error(e) {
          subscribe.error(e);
        },
        complete() {
          subscribe.complete();
        },
      });
    });
}

/**测试 */
const source = new Observable<number>((observer) => {
  let i = 0;
  const timer = setInterval(() => {
    observer.next(++i);
  }, 1000);
  return function unsubscribe() {
    clearInterval(timer);
  };
});
const subscription = source
  .pipe(
    map((i) => i * 10),
    delay(4000)
  )
  .subscribe({
    next: (v) => console.log("10倍值：" + v),
    error: (err: any) => console.error(err),
    complete: () => console.log("complete"),
  })
  .add(
    source.pipe(filter((i) => i % 2 == 0)).subscribe({
      next: (v) => console.log("偶数值：" + v),
      error: (err: any) => console.error(err),
      complete: () => console.log("complete"),
    })
  );
