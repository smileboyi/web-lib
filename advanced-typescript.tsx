/**
 * Unions vs Intersection 
 * 
type FullName = { fullName: string };
type Age = { age: number };
// type Union = FullName | Age;
type Union = FullName | Age | (FullName & Age);
type Intersection = FullName & Age;

const fullName = { fullName: "Jane" };
const age = { age: 29 };
const nameAndSge = { fullName: "Jane", age: 29 };

let union: Union;
union = fullName;
union = age;
union = nameAndSge;

function filter(union: Union) {
  if ("name" in union) {
    // FullName
    union.name;
  }
  if ("age" in union) {
    // Age
    union.age;
  }
  if ("name" in union && "age" in union) {
    // FullName & Age
    union.name;
    union.age;
  }
}

let intersection: Intersection;
intersection = nameAndSge;
intersection = fullName; // Error
intersection = age; // Error

type A = { name: string; age: number };
type B = { name: string; hobby: string[] };
type K1 = keyof (A | B);
type K2 = keyof (A & B);
type K3 = keyof A | keyof B;
type K4 = keyof A & keyof B;

 */

/**
 * 减少对enum的使用
 *
enum LoginMode {
  device= "device",
  email = "email",
  social= "social",
}

const LoginMode = {
  device: "device",
  email: "email",
  social: "social",
} as const;
type LoginMode = keyof typeof LoginMode;
function initiateLogin(mode: LoginMode) {}
initiateLogin("device");

 */

/**
 * Literal Types
 * 
let str:string;
str = "whatever you want";

let strLiteral:"hello";
strLiteral = "hello";
strLiteral = "anything else is an error";

let tempLateLiteral:`Example:${string}`;
tempLateLiteral = "Example:Hello";
tempLateLiteral = "Example:world";
tempLateLiteral = "without a Example prefix";


type CSSValue = 
// implies px
|number
// numbert + px|em|rem
| string

function size(input:CSSValue) {
    return typeof input === "number"? input + "px" : input;
}
size(123);
size("123px");
size('12em');
size("12ex"); // Error

type CSSValue = 
// implies px
|number
// numbert + px|em|rem
| `${number}px}`
| `${number}em}`
| `${number}rem}`


type Size = 'small' | 'medium' | 'large';
type Color = 'primary' | 'secondary';
type Style = `${Size}-${Color}`;

function applyStyle(style:Style){}
applyStyle("small-primary");
applyStyle("large-secondary");
applyStyle("medim-primary");

 */

/**
 * Mapped Types as clauses
 * 
type State = {
  name: string,
  age: number,
}

type Setters = {
  [K in keyof State]: (value:State[K]) => void;
}
type SetProperty<K extends string> = `set${Capitalize<K>}`;
type ExampleName = SetProperty<'name'>;
type ExampleAge = SetProperty<'age'>;

type Setters = {
  [K in keyof State as `set${Capitalize<K>}`]: (value:State[K]) => void;
}

type Setters<State> = {
  [K in keyof State & string  as `set${Capitalize<K>}`]: (value:State[K]) => void;
}
type Getters<State> = {
  [K in keyof State & string  as `get${Capitalize<K>}`]: () => State[K];
}
type Store<State> = Setters<State> & Getters<State>;
type PersonState = {
  name: string,
  age: number,
}
type PersonStore = Store<PersonState>;
declare const personStore: PersonStore;
personStore.setName("John");
personStore.setAge(20);
const name:string = personStore.getName();
const age:number = personStore.getAge();

 */

/**
 * satisfies operator
 * 
type Color = ColorString | ColorRGB;
type ColorString = 'red' | 'green' | 'blue' | 'purple'
type ColorRGB = [red:number, green:number, blue:number];

type Theme = Record<string,Color>;

const theme = {
  primary: 'green',
  secondary: [0,255,0],
  tertiary: 'purple',
} satisfies Theme

const [r,g,b] = theme.secondary;

 */

/**
 * Awaited Types
 * typescript会自动将Promise结果作用Awaited
 * 
main();
async function main() {
  const single: Promise<string> = new Promise((res) => res("l4d135"));

  const triple: Promise<Promise<Promise<string>>> = new Promise<
    Promise<Promise<string>>
  >((res) =>
    res(
      new Promise<Promise<string>>(
        (res) =>
          new Promise<string>((res) => {
            res("Vin Diesel");
          })
      )
    )
  );

  const singleResult = await single;
  console.log(singleResult);  // l4d135

  const tripleResult = await triple;
  console.log(tripleResult);  // Vin Diesel
}

type WrappedInDeep = Promise<Promise<Promise<{a:string}>>>;
type AwaitedResult = Awaited<WrappedInDeep>;

 */

/**
 * Lookup Types
 * 
export type SubmitRequest = {
  transactionId: string;
  personal: {
    title: string;
    driverFirstName: string;
    driverMiddleName: string;
    driverLastName: string;
    email: string;
    phone: string;
    previousAliases: {
      firstName: string;
      middleName: string;
      lastName: string;
    }[];
    gender: string;
    dob: string;
    birthCountry: string;
  };
  driver: {
    licenceNumber: string;
    expiryDate: string;
    hasLicenceForMin6Months: boolean;
    hasTerritoryLicence: boolean;
    territoryLicenceStates?: string[];
    hasDriverAccreditation: boolean;
    driverAccreditationNumber?: string;
    vehicleClasses: string[];
    tandc: true;
  };
  consent: {
    understandInformation: boolean;
    informationTrue: boolean;
    informationConsidered: boolean;
    medicalVicRoadsPoliceCheckConsent: boolean;
    consentToDisclosing: boolean;
    indemnifyAgainstLiability: boolean;
    acicCheckConsent: boolean;
    childrenCheckConsent: boolean;
    personalInfoCheckConsent: boolean;
    trafficoffences: boolean;
    assessAcicCheckConsent: boolean;
    criminaloffences: boolean;
    licenceCancelledSuspended: boolean;
    sexOffendersReporting: boolean;
    ausWorkRights: boolean;
    additionalInformation: string;
  };
  payment: {
    cardToken: string;
  };
};

type PreviousAliasRequest = SubmitRequest["personal"]["previousAliases"][0];

function getPayment(): SubmitRequest["payment"] {
  return {
    cardToken: "dfae523525dfrgdfyer6yeqw4twer",
  };
}

 */

/**
 * Never in Conditional Types
 * 
function error(message: string): never {
  throw new Error(message);
}

const notAllowed: never = "some string";
const allowed: never = error("this is okay");
const allowed2: string = error("I will not return");

type Verbose = string | never;
type Concise = string;

type NoEmpty<T> = T extends null | undefined ? never : T;

type Example = NoEmpty<string | null>;
type Example0 = NoEmpty<string> | NoEmpty<null>;
type Example1 =
  | (string extends null | undefined ? never : string)
  | (null extends null | undefined ? never : string);
type Example2 = string | never;
type Result = string;

 */

/**
 * Keyof Types
 * 
function proxy(object: any, key: any): any {
  return new Proxy(object, {
    get(target, prop, receiver) {
      if (prop === key) {
        console.log("getting", key, target[prop]);
      }
    },
    set(target, prop, value, receiver) {
      if (prop === key) {
        console.log("setting", key, value);
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

type Person = {
  name: string;
  age: number;
  location: string;
};

function logAccess(object: Person, key: keyof Person): Person {
  return proxy(object, key);
}

function logAccess<T>(object: T, key: keyof T): T {
  return proxy(object, key);
}

const todo = logAccess(
  {
    id: 1,
    text: "Buy milk",
  },
  "text"
);
todo.text = "Like & Subscribe";

 */

/**
 * Mapped Types 
 *  
type Point = {
  x: number;
  y: number;
};

type ReadonlyPoint0 = {
  readonly x: number;
  readonly y: number;
};
type ReadonlyPoint1 = {
  readonly [Key in "x" | "y"]: number;
};
type ReadonlyPoint2 = {
  readonly [Key in keyof Point]: Point[Key];
};
type Readonly<T> = {
  readonly [Key in keyof T]: T[Key];
};

const originObj: Readonly<Point> = {
  x: 0,
  y: 0,
};
originObj.x = 100; //Should error

 */

/**
 * Mapped Types Modifiers
 * 
type Point = {
  readonly x: number;
  y?: number;
};

type Mapped<T> = {
  +readonly [P in keyof T]+?: T[P];
  // [P in keyof T]: T[P];
  // -readonly [P in keyof T]-?: T[P];
};

type Result = Mapped<Point>;

class State<T> {
  constructor(public current: T) {}
  update(next: Partial<T>) {
    this.current = { ...this.current, ...next };
  }
}

const state = new State({ x: 0, y: 0 });
state.update({ y: 123 }); // 不需要全部传完

 */

/**
 * TYPES vs INTERFACES
 * 
 * types:
 *   Unions
 *   Primitives
 *   Shorthand Functions
 *   Advanced Type Functions
 * interfaces:
 *   Declaration Merging
 *   Familiarity (extends)
 *
interface Point2D {
  x: number;
  y: number;
}
interface Point3D extends Point2D {
  z: number;
}
type Point3D = Point2D & {
  z: number;
};

interface Request {
  body: any;
}
interface Request {
  json: any;
}
function handleRequest(req: Request) {
  req.body;
  req.json;
}

type InputOnChange = (newValue: InputValue) => void;
type InputValue = string;
type InputType = "text" | "email";
type InputProps = {
  type: InputType;
  value: InputValue;
  onChange: InputOnChange;
};

*/

/**
 * Mixin Classes & Multiple Class Inheritance
 * 
class Disposable {
  isDisposed = false;
  dispose() {
    this.isDisposed = true;
  }
}

class Activatable {
  isActive = false;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

// class Example extends Disposable,Activatable {
//   // ...
// }

type Class = new (...args: any[]) => any;

function DisposableMixin<Base extends Class>(base: Base) {
  return class extends base {
    isDisposed = false;
    dispose() {
      this.isDisposed = true;
    }
  };
}

function ActivatableMixin<Base extends Class>(base: Base) {
  return class extends base {
    isActive = false;
    activate() {
      this.isActive = true;
    }
    deactivate() {
      this.isActive = false;
    }
  };
}

const Example = DisposableMixin(
  ActivatableMixin(
    class {
      member = 123;
      constructor() {}
    }
  )
);
const example = new Example();
class Example2 extends DisposableMixin(ActivatableMixin(class {})) {
  member = 123;
  constructor() {
    super();
  }
}

type Example = InstanceType<typeof Example>;

function takeExample(example: Example) {}

 */

/**
 * The two kinds of Generics for Functions
 * 
type A<T> = (x: T) => T;
interface GenericInterfaceForFunction<T> {
  (x: T): T;
}
type B = <T>(x: T) => T;
interface InterfaceForGenericFunction {
  <T>(x: T): T;
}

const numToNum: A<number> = function (x: number) {
  return x + 10;
};
const identity: B = function <T>(x: T) {
  return x;
};

 */

/**
 * TypeScript built-in mapped
 * 
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type CircleConfig = {
  color?: string;
  radius?: number;
};

class Circle {
  // 初始化时成员标记必需
  private config: Required<CircleConfig>;
  constructor(config: CircleConfig) {
    this.config = {
      // 初始化时确保具有默认值
      color: config.color ?? "red",
      radius: config.radius ?? 10,
    };
  }

  draw(){
    console.log(
      'Drawing a circle',
      'Color:',this.config.color,
      'Radius:',this.config.radius
  }
}

function makeReadonly<T>(object:T):Readonly<T>{
  return Object.freeze({...object });
}

 */

/**
 * 使用内置类型创建新类型
 *
type Point3D = {
  x: number;
  y: number;
  z: number;
};

// type Pick<T> = {
//   [P in keyof T]: T[P];
// };

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Point2D = Pick<Point3D, "x" | "y">;

type CSSProperties = {
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  // ...lots more
};

function setSize(
  element: HTMLElement,
  // size:{x?:number,height?:number}
  size: Pick<CSSProperties, "width" | "height">
) {
  element.setAttribute("width", (size.width ?? 0) + "px");
  element.setAttribute("height", (size.height ?? 0) + "px");
}

 */

/**
 * object type
 * 
let car = { company: "ford", model: "mustang" };
let person = { name: "John", age: 23 };

const objectToValue = new WeakMap();
objectToValue.set(car, 50000);
objectToValue.set(person, Infinity);
objectToValue.set('sed', 687);

 */

/**
 * strict和noUncheckedIndexedAccess进行空值检查
 * 
const nums = [0, 1, 2];
if (nums[3] != null) {
  const example: number = nums[3]; // Not okay!
  console.log(example.toFixed(2)); // Error at runtime
}

for (const num of nums) {
  console.log(num.toFixed(2));
}

nums.forEach((num) => {
  console.log(num.toFixed(2));
});

const trusted = [0, 1, 2];
console.log(trusted[2]?.toFixed(2)]);

const people: { [id: number]: string } = Object.create(null);
people[1] = "John ";
people[2] = " Grace";
// 如果ts判断不了空值，可以使用?.显示判断空值，或者!.断言
console.log(people[1234].trim());

 */

/**
 * New Control Flow with const
 * 
function foo(arg: unknown) {
  const isArgString = typeof arg === "string";
  if (isArgString) {
    console.log(arg.toUpperCase());
  }
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  const { kind } = shape;
  const isCircle = kind === "circle";
  if (isCircle) {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.size ** 2;
  }
}

function bar(arg: string | number | boolean) {
  const isString = typeof arg === "string";
  const isNumber = typeof arg === "number";
  const isBoolean = typeof arg === "boolean";
  const isStringOrNumber = isString || isNumber;
  if (isStringOrNumber) {
    const onlyStringOrNumber: string | number = arg;
  } else {
    const boolTest: boolean = arg;
  }
}

function baz(x: string | number) {
  const one = typeof x === "string";
  const two = one;
  const three = two;
  const four = three;
  const five = four;
  const six = five;
  const seven = six;

  if (one) {
    const example: string = x;
  }
  if (five) {
    const example: string = x;
  }
  if (six) {
    const example: string = x;
  }
}

 */

/**
 * template index signatures
 * 
type Attributes = {
  color?:string;
  font?:string;
  [data: `data-${string}`]:string | undefined
}

const classic:Attributes = {
  colour:'red',
  font: 'Helvetica',
  'data-name':'classic'
}

 */

/**
 * Ignoring TypeScript Errors
 * 
type Circle = { radius: number };
type Square = { size: number };
// @ts-ignore
const example = getShape();

// @ts-nocheck
if (true) {
  // @ts-ignore
  declare const example: Circle;
  console.log("I know its a circle", example.radius);
} else {
  // @ts-expect-error
  console.log("False", typo);
}

 */

/**
 * DeepReadonly
 * 
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type Example = {
  a: {
    b: number;
  };
};
let example: DeepReadonly<Example> = {
  a: {
    b: 123,
  },
};

example.a.b = 556; //Error

 */

/**
 * any vs unknown
 * 
let exampleAny: any;
let exampleUnknown: unknown;

// 可以随意赋值
exampleAny = 123;
exampleAny = "Hello";
exampleUnknown = 123;
exampleUnknown = "World";

// 可以随意操作
exampleAny.ts.is.not.going.to.check.this.so.like.subscribe();
let anySetBool: boolean = exampleAny;

// 默认不能随意操作，需要类型判断
if (typeof exampleUnknown === "string") {
  exampleUnknown.trim();
}
if (typeof exampleUnknown === "boolean") {
  let unknownSetBool: boolean = exampleUnknown;
}

 */

/**
 * Boolean(value) VS !!value
 * 
function use(response: { value: string }) {
  // ...
  console.log("Write to DB:", response.value);
}

declare function getValueFromAPI(): { value: string } | null;

let valueFromNetwork = getValueFromAPI();

!!valueFromNetwork && use(valueFromNetwork);
Boolean(valueFromNetwork) && use(valueFromNetwork);

 */

/**
 * Object Key iteration
 * 
type Prizes = {
  first: string;
  second: string;
};

function logPrizes(prizes: Prizes) {
  // key需要声明为keyof Prizes类型，否则不能确保prizes[key]是string类型
  let key: keyof Prizes;
  for (key in prizes) {
    console.log(key, prizes[key].toUpperCase());
  }
}

logPrizes({
  first: "gold",
  second: "silver",
});

 */

/**
 * Temporal Uncertainty
 * 
declare function getSuffix(): string | null;
let suffix: string | null = getSuffix();
if (suffix != null) {
  let exampleOne: string = "jane" + suffix.toUpperCase();
  ["jane", "john"].forEach((name) => {
    // typescript在回调外的变量阔可能会被修改
    let exampleTwo: string = name + suffix.toUpperCase();
  });
}

if (suffix != null) {
  // 对特定变量的引用存储在新变量中
  const suffixLocal = suffix;
  let exampleOne: string = "jane" + suffixLocal.toUpperCase();
  ["jane", "john"].forEach((name) => {
    // typescript在回调外的变量阔可能会被修改
    let exampleTwo: string = name + suffixLocal.toUpperCase();
  });
}

let example: string | null = getExample();
if (example != null) {
  setTimeout(() => {
    console.log(example.toUpperCase());
  });
}

if (example != null) {
  const exampleLocal = example;
  setTimeout(() => {
    console.log(exampleLocal.toUpperCase());
  });
}

example = null;

 */

/**
 * Record Type
 * 
type Persons = Record<string, { name: string; role: string }>;
const persons: Persons = {};
persons["001"] = { name: "John", role: "admin" };
persons["002"] = { name: "Jane", role: "owner" };
persons["003"] = { name: "June" }; // Error: MIssing property `role`

type Roles = "admin" | "owner";
let peopWithRoles: Record<Roles, string[]> = {
  owner: ["Jane", "June"],
  admin: ["John"],
};
peopWithRoles = {
  owner: ["Jane", "June"],
}; // Error: 'admin' is missing

const admins: string[] = peopWithRoles["admin"]; //Safe,不需要担心未定义

type Point = Record<"x" | "y", number>;

type PageInfo = {
  id: string;
  title: string;
};
// value type是重复的PageInfo
type PagesVerbose = {
  home: PageInfo;
  serices: PageInfo;
  about: PageInfo;
  contact: PageInfo;
};
// 如果value type类型一样可以使用Record代替interface
type Pages = Record<
  "home" | "services" | "about" | "contact",
  {
    id: string;
    title: string;
  }
>;

 */

/**
 * Array Type Guards
 * 
type Square = {
  type: "square";
  size: number;
};
type Rectangle = {
  type: "rectangle";
  height: number;
  width: number;
};
type Shape = Square | Rectangle;
declare function getShapes(): Shape[];
const shapes: Shape[] = getShapes();

const isSquare = (s: Shape): s is Square => s.type === "square";
const isRectangle = (s: Shape): s is Rectangle => s.type === "rectangle";

const square = shapes.find(isSquare);
const size = square?.size;
const squares = shapes.filter(isSquare);
const sizes = squares.map((s) => s.size);

 */

/**
 * Generic ReactJS Render Functions
 * 
type Data = { name: string; location: string };

type ListProps<TItem> = {
  items: TItem[];
  renderItem: (item: TItem) => any;
};

function List<TItem>(props: ListProps<TItem>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {props.items.map((x, i) => (
        <div key={i} style={{ display: "block" }}>
          {props.renderItem(x)}
        </div>
      ))}
    </div>
  );
}

function App() {
  // 通过传入Data类型参数，可以检查拼写错误
  return (
    <List<Data>
      items={[
        { name: "Alpha", location: "Australia" },
        { name: "Beta", location: "America" },
        { name: "Gamma", location: "India" },
      ]}
      renderItem={(item) =>
        item.location === "America" ? <strong>{item.name}</strong> : item.name
      }
    ></List>
  );
}

 */

/**
 * Opaque Types
 * Nominal vs Structural Typing
 * 
type AccountNumber = number;
type AccountBalance = number;

function setupAccount(
  accountNumber: AccountNumber,
  accountBalance: AccountBalance
) {
  // ... setup the account
}
let accountNumber: AccountNumber = 1354;
let accountBalance: AccountBalance = 1654;
setupAccount(accountBalance, accountNumber);
accountNumber = accountBalance;
accountNumber = accountBalance;

type AccountNumber2 = number & { _: "AccountNumber2" };
type AccountBalance2 = number & { _: "AccountBalance2" };

const makeAccountNumber2 = (accountNumber: number): AccountNumber2 =>
  accountNumber as AccountNumber2;
const makeAccountBalance2 = (accountBalance: number): AccountBalance2 =>
  accountBalance as AccountBalance2;

function setupAccount2(
  accountNumber: AccountNumber2,
  accountBalance: AccountBalance2
) {
  // ... setup the account
}

let accountNumber2: AccountNumber2 = makeAccountNumber2(4354);
let accountBalance2: AccountBalance2 = makeAccountBalance2(234);
setupAccount2(accountNumber2, accountBalance2);

 */

/**
 * null vs. undefined
 * 
console.log(null == null); // true
console.log(undefined == null); // true
console.log(null == undefined); // true
console.log(undefined == undefined); // true
console.log("" == null); // false
console.log(0 == null); // false
console.log("" == undefined); // false
console.log(0 == undefined); // false

function example1(value: string | null | undefined) {
  if (value == null) {
    console.log("null | undefined", value);
  } else {
    console.log("string", value);
  }
}

function example2(value: string | null | undefined) {
  if (value != undefined) {
    console.log("string", value);
  }
}

 */

/**
 * Preserving AutoComplete for Literal Unions
 * 
type Padding = "small" | "normal" | "large" | string;   // 没有提示，string有侵略性，覆盖了前面的类型
// type Padding = "small" | "normal" | "large" | (string & {}); // 有提示，通过联合类型减少原始类型的侵略性

function getPadding(padding: Padding): string {
  if (padding == "small") return "12";
  if (padding == "normal") return "16px";
  if (padding == "large") return "24px";
  return padding;
}

let padding: Padding;
padding = "small";
padding = "8px";

 */

/**
 * Optional vs Undefined
 * Optional可以不传值，Undefined需要传值
 * Optional可以少写代码，推荐使用
 * 
type ExampleOptional = { name?: string };
let optional: ExampleOptional;
optional = { name: undefined };
optional = {};
type ExampleUnion = { name: string | undefined };
let union: ExampleUnion;
union = { name: undefined };
union = {}; // Error: name is missing

function logOptional(message?: string) {
  console.log(message);
}
function logUnion(message: string | undefined) {
  console.log(message);
}
logOptional(undefined);
logOptional();
logUnion(undefined);
logUnion(); // Error: Expected 1 argument. `message` was not provided

// Error: a required parameter cannot follow an optional parameter
function logOptional2(error?: Error, message: string) {}
function logUnion2(error: Error | undefined, message: string) {}

 */

/**
 * PropertyKey
 * 
const str: string = "key";
const num: number = 123;
const sym: symbol = Symbol();

const valid = {
  [str]: "valid",
  [num]: "valid",
  [sym]: "valid",
};

const obj = {};
const invalid = {
  [obj]: "invalid",
};

type ValidKey = keyof any;

let example: PropertyKey;
example = str;
example = num;
example = sym;
example = obj;

 */

/**
 * ThisType Type
 * 
type MyMath = {
  double(): void;
  half(): void;
};
const math: MyMath & ThisType<{ value: number }> = {
  double() {
    this.value *= 2;
  },
  half() {
    this.valid /= 2;
  },
};
const obj = {
  value: 1,
  ...math,
};
obj.double();
console.log(obj.value);
obj.half();
console.log(obj.value);

type StateDescription<D, M> = {
  data: D;
  methods: M & ThisType<D & M>;
};

function createState<D, M>(desc: StateDescription<D, M>): D & M {
  return { ...desc.data, ...desc.methods };
}

let state = createState({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx;
      this.y += dy;
    },
  },
});

state.x = 10;
state.y = 20;
state.moveBy(5, 5);

 */

/**
 * extends never & extends [never]
 * 
type P<T> = T extends never ? true : false;
type A1 = P<never>; //never
type A2 = P<any>; //boolean

type Q<T> = [T] extends [never] ? true : false;
type B1 = Q<never>; //true
type B2 = Q<any>; //false

 */

/**
 * covariance and contravariance
 * 协变：允许子类型转换为父类型，将参数弱化为更广泛的类型
 * 逆变：允许父类型转换为子类型，将参数强化为更具体的类型
 * ts参数是双向逆变的
 *
class Animal {
  eat() {}
}

class Dog extends Animal {
  bark() {}
}

declare let animals: Animal[];
declare let dogs: Dog[];

// covariant
animals = dogs;
dogs = animals; // Error

// contravariant
declare let funcAnimal: (x: Animal) => void;
declare let funcDog: (x: Dog) => void;
funcAnimal = funcDog; // Error (only when "--strictFunctionTypes")
funcDog = funcAnimal; // Ok

 */
