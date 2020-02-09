autoscale: true
slidenumbers: true

^ Let's start with the elephant in the room...

# Welcome to TypeScript

---

# Any

---

^ Examples:
If you only care that something is an array
If you're returning what you take in unmodified

Any isn't evil, it's just misunderstood

It is a __Top Type__. Any can be __anything__ -- and sometimes that's what you want.

---

^ We call to console.log, and that accepts anything

This is fine

```typescript
function log(thingToLog: any): void {
    console.log(thingToLog);
}
```

---

^ These should obviously be numbers

This is not

```typescript
function addTwoNumbers(a: any, b: any): any {
    return a + b;
}
```

---

^ There are no checks when you use an any

You can assign anything to any

```typescript
let thing: any;

thing = "string"; // OK
thing = 42; // OK
thing = [1, 2, "3"]; // OK
thing = (a: number) => a + 4; // OK

thing.map(log); // We have a problem here
```

---

# Unknown

---

Unknown is like any.

Except it doesn't __"turn off"__ type checking. Instead it __defers__ type checking to the developer.

(That's _you_)

---

^ Unknown is useful when you don't know or trust the calling code, or just 
don't care what it is -- like a more safe any

You can assign anything to unknown

```typescript
let something: unknown;

something = "string"; // OK
something = 42; // OK
something = [1, 2, "3"]; // OK
something = (a: number) => a + 4; // OK
```

---

But unlike any, you can't use an unknown
unless you tell TS _what it is_

```typescript
something(7); // Not 11, but a type error

// Use a cast to tell TS what something is
(something as (a: number) => number)(7); // 11
```

---

# Void

---

Void is a __Bottom Type__.

It is the abscence of a type. It's like the _null_ or _undefined_ of types.

---

^ You can declare things as void, though it's not very useful. May be
of use for certain generics, which we'll discuss later.

It's the opposite of any

```typescript
let nothing: void;

nothing = 7; // What would this even mean?
```

---

It's generally only seen in return types

```typescript
function doSomething(): void {
    // ...
}

// This returns nothing
// In JS it returns undefined, but TS types
// this scenario as void
const nothingReturned = doSomething();
```

---

# Never

---

Never is like void, but __void-ier__

Never implies that anything typed as never will...

__never happen__.

It is like a _dead code assertion_.

---

Never is like a super-void

```typescript
let cantHappen: never;

// never not only has no type, but TS knows that a 
// never value should never be reachable
cantHappen = 7; // Type error
```

---

^ Never is a powerful tool for teaching Typescript about your logical model
It lets you clue Typescript into things that shouldn't happen in your _domain_.

A function that returns never implies that it will __never__ complete

```typescript
function notCorrect(): never {
    // A function returning 'never' cannot have a
    // reachable end point.
    return 7;
}
```

---

Typically if a function returns never, that implies it __always throws__

(Or exits, crashes, etc.)

```typescript
function thisThrows(): never {
    throw new Error("Shouldn't happen");
}
```

---

# Literal Types

---

^ Most things can be literal, it's just an instance instead
of a category.

Some primitive types type can be _narrowed_ to __literals__.

A __literal type__ is one exact value.

```typescript
type Name = "Joseph"

const myName: Name = "Big McLargeHuge" // Type Error

type Age = 27

const myAge: Age = 27 // Ok
```

---

When an _array_ is literal, it's called a __tuple__.

```typescript
type KeyValuePair = [string, number]

// An array of tuples
const people: KeyValuePair[] = [
    ["Joseph", 27]
]
```

---

`number[]` and `[number]` are __not the same thing!__

- `number[]` is an _array of numbers_.
- `[number]` is a _tuple with one number_.

---

You can use __const assertions__ to narrow declarations to literals _inline_.

```typescript
const name = "Joseph"; // typeof name === "string"

const name = "Joseph" as const; // typeof name === "Joseph"
```

---

# Readonly

---
[.code-highlight: all]
[.code-highlight: 2]
[.code-highlight: 7]
[.code-highlight: 11-12]

^ Code Highlights:
First, the keyword
The initial value cannot be changed
I'm allowed to change age, but not name

Marking a type __readonly__ helps ensure _immutability_, as typescript will not let you change it.

```typescript
interface Person {
    readonly name: string,
    age: number
}

const me: Person = {
    name: "Joseph",
    age: 27
}

me.age = 28; // OK
me.name = "Blast Hardcheese"; // Type error!
```

---

You can mark __parameters__ as readonly, too.

```typescript
function unshuffle(arr: readonly number[]) {
    arr.sort(); // This is a type error! Sort mutates the array.
}
```

---

Types vs Interfaces

Similar, but different.

---

In older versions of Typescript, _types_ and _interfaces_ were very different.

As the language has evolved, there are now __only a handful of differences.__

---

Types can alias __primitives__.

`type ID = number`

Interfaces cannot.

---

Types can contain __computed properties__.

```typescript
type Keys = "foo" | "bar"

type Obj = {
    [key in Keys]: string
}
```

Interfaces cannot.

---

Interfaces should be __extended__.

```typescript
interface MyAction extends Action<"MY_ACTION"> {
    someNewProp: string
}
```

Types should be __intersected__.

```typescript
type MyAction = Action<"MY_ACTION"> & {
    someNewProp: string
}
```

---

Interfaces __merge__.

Types don't.

---

Wait, what?

---

Two interfaces that share the same name will __merge together__.

```typescript
interface Person {
    name: string
}

interface Person {
    age: number
}
```

---

The same as

```typescript
interface Person {
    name: string
    age: number
}
```

---

Types can express __unions__.

```typescript
type Peg = Thing1 | Thing2
```

---

### When you're making a type for something...

##### The Typescript handbook recommends _trying_ to use an __Interface__ first, then changing it to a __Type__ if you can't express your thing correctly without _advanced type features_.

##### (Like _Unions_ or _Computed Properties_)

---

Combine types and interfaces together!

```typescript
interface SquarePeg {
    shape: "square"
}

interface RoungPeg {
    shape: "round"
}

type Peg = SquarePeg | RoundPeg
```

---

About that last example...

Both interfaces have a _shape_ property.

---

This forms what's known as a __discriminated union__.

A union with a property shared across all members of the union.

---

# Discriminated unions

---

Three ingredients[^1]:

- A common singleton type property -- the __discriminant__.
- A type alias with a union of those types -- the __union__.
- Type guards on the common property.

[^1]: http://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions

---

This is a powerful and important concept, because...

---

__Redux Actions__ are __discriminated unions__.

```typescript
interface ActionA {
    type: "A_TYPE"
}

interface ActionB {
    type: "B_TYPE"
}

type ReduxAction = ActionA | ActionB
```

---
[.code-highlight: all]
[.code-highlight: 2, 7]
[.code-highlight: 11]
[.code-highlight: 14-25]

Discriminated unions allow __type narrowing__.

```typescript
interface SetNameAction {
    type: "SET_NAME"
    value: string
}

interface SetAgeAction {
    type: "SET_AGE"
    value: number
}

type Action = SetNameAction | SetAgeAction

function set(person: Person, action: Action): Person {
    switch (action.type) {
        // TS knows what part of the union we're in
        // because of the discriminant
        case "SET_NAME": {
            // action is SetNameAction!
            // action.value is string
        }
        case "SET_AGE": {
            // action is SetAgeAction!
            // action.value is number
        }
    }
}
```

---
[.code-highlight: all]
[.code-highlight: 2-5, 7]
[.code-highlight: 17-23]

Discriminated unions allow __exhaustiveness checking__.

```typescript
// A new action
interface SetFavoriteColorAction {
    type: "SET_NAME"
    value: string
}

type Action = SetNameAction | SetAgeAction | SetFavoriteColorAction

function set(person: Person, action: Action): Person {
    switch (action.type) {
        case "SET_NAME": {
            // action.value is string
        }
        case "SET_AGE": {
            // action.value is number
        }
        default: {
            // Typescript knows that we will hit this default cause
            // But because we use a "never" type, it knows this should be dead code
            // We get a type error
            const unknownAction: never = action.type;
            throw new Error(`Unknown action: ${unknownAction}`);
        }
    }
}
```

--- 

# Enumerations

## (In 2 Flavors)

---

__Regular__ Enums (or just Enums)

These are compiled to _normal JS objects_.

```typescript
enum ActionTypes {
    SetAge = "SET_AGE",
    SetName = "SET_NAME"
}

const setAge = ActionTypes.SetAge; // "SET_AGE"
```

---

__Const__ enums

These are completely __compiled away__.

```typescript
const enum ActionTypes {
    SetAge = "SET_AGE",
    SetName = "SET_NAME"
}

const setAge = ActionTypes.SetAge; // "SET_AGE"
```

---

Enums can do all kinds of __wacky__ things. Computed properties, runtime hacks, mixing values, etc.

__Don't do any of that.__

Just use const enum.

---

# Type Guards

---
[.code-highlight: all]
[.code-highlight: 2]

Sometimes you don't know what something is and need to find out.

```typescript
function doSomething(value: unknown): void {
    if (typeof value === "string") {
        // value is now string
    }
}
```

---

Use __typeof__ for primitives, or __instanceof__ for classes.

But what about other types?

---
[.code-highlight: all]
[.code-highlight: 5-7]
[.code-highlight: 5]
[.code-highlight: 10-12]

DIY Type Guards

Use this __is__ keyword.

```typescript
interface SquarePeg {
    shape: "square"
}

function isSquarePeg(value: any): value is SquarePeg {
    return (value as SquarePeg).shape === "square";
}

function doSomething(value: unknown): void {
    if (isSquarePeg(value)) {
        // value is now SquarePeg
    }
}
```

---

Type guards can narrow both __top types__ and __union types__.

---

# Generics

###### <T>

---

Generics are like the __functions__ of the type world.

They allow you to use __arguments__ in type constructors.

---

Generics let you __pass in__ a type

```typescript
function generically<T>(arg: T): T {
    // Do something to T
    return arg;
}
```

---

You can narrow allowed types using __extends__

```typescript
function lessGenerically<T extends string | number>(arg: T): T {
    // Do something to T
    return arg;
}
```

---

_Types_ and _Interfaces_ can be generic too

```typescript
type WithId<T> = [number, T]

interface Person<T extends "green" | "blue"> {
    name: string,
    favoriteColor: T
}
```

---

For example, this is the exposed __Redux Action__

```typescript
interface Action<T extends string> {
    type: T
}

const anAction: Action<"ACTION_TYPE"> = {
    type: "ACTION_TYPE"
}
```

---

And FYI, generics can __(and should)__ have more descriptive names than __T__.[^2]

[^2]: Do as I say, not as I do

---

# Utility Types

---

- Partial
- Required
- Pick
- Omit
- Exclude
- Extract
- Readonly
- Record
- Parameters
- ReturnType

---

Partial

It takes a type and makes everything __optional__.

```typescript
interface Person {
    name: string
    age: number
}

type MaybePerson = Partial<Person>
```

same as

```typescript
interface MaybePerson {
    name?: string
    age?: number
}
```

---

Required

It takes a type and makes everything __not optional__.

```typescript
interface MaybePerson {
    name?: string
    age?: number
}

type Person = Required<Person>
```

same as

```typescript
interface Person {
    name: string
    age: number
}
```

---

Pick

It takes a type and __extracts__ a subset of values.

```typescript
interface Person {
    name: string
    age: number
}

// Pass multiple arguments as a union, like Pick<Thing, "name" | "age">
type NamedThing = Pick<Person, "name">
```

same as

```typescript
interface NamedThing {
    name: string
}
```

---

Omit

It takes a type and __removes__ a subset of values.

```typescript
interface Person {
    name: string
    age: number
}

// Pass multiple arguments as a union, like Omit<Thing, "name" | "age">
type Anonymous = Omit<Person, "name">
```

same as

```typescript
interface Anonymous {
    age: number
}
```

---

Exclude

Given a union, __removes__ values that __match__.

```typescript
type Colors = "red" | "green" | "blue" | "purple"

// We exclude violet, but it wasn't in the original union.
// But that's okay, this is not a type error
type NoPurpleAllowed = Exclude<Colors, "purple" | "violet">
```

same as 

```typescript
type NoPurpleAllowed = "red" | "green" | "blue"
```

---

Extract

Given a union, __removes__ values that __do not match__.

```typescript
type Colors = "red" | "green" | "blue" | "purple"

type OnlyPurple = Extract<Colors, "purple" | "violet">
```

same as 

```typescript
// Note that even though we extract "violet",
// it wasn't in the original union so it is not included in the
// computed type
type OnlyPurple = "purple"
```

---

Readonly

Makes all properties in a type __read only__.

```typescript
interface Person {
    name: string
    age: number
}

type LockedPerson = Readonly<Person>
```

same as 

```typescript
interface LockedPerson {
    readonly name: string
    readonly age: number
}
```

---

Record

Constructs an object using type for __key__ and __value__.

```typescript
// Instead of
interface LookupTable {
    [key: string]: number
}

// Use
type LookupTable = Record<string, number>
```

---

Parameters

Inspects a _function_ and tells you its __call signature__.

```typescript
function add(a: number, b: number) {
    return a + b;
}

// [number, number]
type Args = Parameters<typeof add>
```

---

ReturnType

Inspects a _function_ and tells you its __return type__.

```typescript
function add(a: number, b: number) {
    return a + b;
}

// number
type Result = ReturnType<typeof add>
```

---

###### (An Unsorted List of Other Cool Stuff)

---

# Computed Types with Typeof

---

If you have some value and need to know its type, use __typeof__.

```typescript
const config = {
    defaultTimeout: 1000
}

function doSomethingWithConfig(c: typeof config): void {
    config.defaultTimeout // Typed as number
}
```

---

Use a __const assertion__ for narrower types

```typescript
const config = {
    defaultTimeout: 1000
} as const

function doSomethingWithConfig(c: typeof config): void {
    config.defaultTimeout // Typed as 1000
}
```

---

# Property Access in Types

---

You can use types just like normal __objects__, and access their __properties__.

```typescript
interface Config {
    valA: string,
    valB: number
}

function useConfigValA(value: Config['valA']) {
    value // Typed as string
}
```

---

# Import Type

---

If you find yourself needing a type from a module, you can use __import__ as type.

```typescript
interface State {
    count: number
    configValueA: (typeof import("/my/project/config")['valA'])
}
```

---

# Keys

---

Use __keyof__ and __in__ to work with object keys and unions.

```typescript
type T = 1 | 2 | 3

type Obj = {
    [k in T]: string
}
```

same as 

```typescript
type Obj = {
    1: string
    2: string
    3: string
}
```

---
Use __keyof__, __generics__, and __type property access__ for ultimate power.

```typescript
interface Person {
    name: string
    age: number
}

function update<T extends keyof Person>(field: T, value: Person[T], person: Person): Person {
    return {
        ...person,
        [field]: value
    };
}

const me = { name: "Joseph", age: 27 };

update("name", 7, me); // Type Error, expected string
update("age", "28", me); // Type Error, expected number
update("state", "Texas", me); // Type Error, invalid field
```

---

# Readonly Reducers

---

Use the __Readonly__ utility in your reducers so you don't break things accidentally.

```typescript
interface State {
    count: number
}

function reducer(state: Readonly<State>, action: Action): State {
    switch (action.type) {
        case "ADD": {
            state.count += 1; // Type error!

            return state;
        }
        // ...
    }
}
```

---

# And So Much More

---

In fact, Typescript's Type System is __Turing Complete__. [^3]

Not the language.

<br />

The __Type System__.

[^3]: https://github.com/Microsoft/TypeScript/issues/14833

---

# Practice Practice Practice

---
[.autoscale: false]

Further Reading

| | |
| --- | --- |
| TS Handbook | https://www.typescriptlang.org/docs/handbook/basic-types.html |
| Awesome Typescript | https://github.com/dzharii/awesome-typescript
| An Exercise in High Level Types | https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/ |

---

# Questions?