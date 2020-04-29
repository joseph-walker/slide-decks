# _let_ __a__ = 1;

---

# _let_ __b__ = __a__ + 1;

---

# __a__ = 10;

---

# What is __b__?

---

![left fit](./images/expandingBrain.png)

### Obviously, __b__ is 2

###### But how in the world does that make sense? We just said __b__ _is equal to_ __a__, plus 1.

###### Shouldn't it be 11?

---

###### A paradigm where __b__ updates in response to __a__ would be called

# Reactive

---

![](./images/excel.jpg)

### It's been around since the 80's

---

### But Javascript is not reactive.

---

[.header: alignment(center)]

### We still have Reactive libraries and tools, though

![inline 50%](./images/rx.png)

---

### RXJS is a __reactive__ library

(__R__eactive e__X__tensions in __J__ava__S__cript)

```js
const a$ = new BehaviorSubject(1);

const b$ = a$.pipe(
    map(a => a + 1)
);

b$.subscribe(console.log);

a$.next(10);

// First b is 2
// Then b is 11 when a updates
// b reacts to a
```

---

### What about React?

![](./images/react.png)

---

## React enables a declarative programming model...

```js
function myComponent() {
    const [count, setCount] = useState(0);

    return (
        <div className="counter">
            <h1>{count}</h1>
            <button className="btn" onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

---

# ...but React is not __reactive__

![inline](./images/visible.jpg)

---

===

### React uses its virtual DOM to cheat.

===

What we typically call "rendering" in a React application is actually the __commit__ phase.

Before there is a commit phase, there is a __reconciliation__ phase where your entire application is __rendered in memory__ and __diffed__.

---

###### When props or state changes, React has to construct a __new snapshot__ of the application

It enumerates every node in the snapshot and compare it to the previous snapshot. If something changed, React adds it to a patch.

[.column]

```js
element <div>
    className "counter"
    children
        element "h1"
            children
                textNode "1"
        element "button"
            className "btn"
            children
                textNode "Increment"
```

[.column]

```js
element <div>
    className "counter"
    children
        element "h1"
            children
                textNode "2" // ❗
        element "button"
            className "btn"
            children
                textNode "Increment"
```

---

#### Once the DOM patch operation is constructed, the change is __committed__

###### But the only operation in that entire process with any _real value_ is the __last one__ -- updating the DOM

---

### It's kind of like:

```js
function calculateApplicationState() {
    let b = a + 1;
    let c = somePotentiallyExpensiveOperation();
    let d = c * 2;
    // ...etc for our whole application model

    return { b, c, d, /* etc */ };
}

let a = 1;
let { b } = calculateApplicationState();

// If a changes, all we care about is updating b
a = 10;

// But we have to recompute our whole app to get to it
{ b } = calculateApplicationState();
```

---

===

###### And recalculating the entire application state to respond to a single change is the __opposite__ of Reactive programming.

===

If React were truly reactive, then updating a prop for a component would cause _only that component_ to update -- nothing else.

Because that component would __react__ to its changing inputs.

---

You can of course use optimizations like __PureComponent__ and __Memo__. But these are not the _default_ React behaviors.

The _default behavior_ is to do __unnecessary work__, and it's your job to optimize it.

---

But Virtual DOM is fast

---

But Virtual DOM is ~~fast~~ fast enough

---

^ Because the problem with doing unnecessary work is that you eventually do so much unnecessary work that you eventually start noticing it in your performance. And because the overhead is thousands and thousands of units of small work and not just a few units of large work, you wind up with a bottleneck and no targets to aim for when it comes time to optimize, left with that unsettling feeling in the pit of your stomach that there's not any one thing wrong with your application but that something is fundamentally broken about your architecture and that nothing you can do will ever really lead to the performance improvements you're hoping to achieve so you resort to nasty hacks like splitting your application into chunks and moving work units around and pretending it's good enough even though it's not and you just want to cry. Stop me if this sounds familiar.

But Virtual DOM is ~~fast~~ ~~fast enough~~ usually fast enough

--- 

### So if React is a dumpster fire[^1], why do we put up with it?

###### Because React enables that __declarative__ programming model we saw earlier and all know and love.

[^1]: It's not really a dumpster fire, just poking fun

---

### We used to use fast, imperitive programming tools.

---

### But we all remember how that turned out.

![inline](./images/jquery.png)

---

What we want is a tool that is:

1) __Reactive__ - so the amount of work we have to do to perform an update is minimized
2) __Declarative__ - so it's easy to build and maintain
3) __Imperative__ - so that it's fast and optimized

But points 2 and 3 conflict. You can't be declarative _and_ imperative.

===

===

_Unless you're a compiler._

---

[.text: #333333, text-scale(0.5)]
[.background-color: #FFFFFF]

![inline 50%](./images/svelte.png)

Svelte is not a framework.

Svelte is a __compiler__ that turns __reactive and declarative__ code into __imperative__ code.

---

[.text: #333333, text-scale(0.5)]
[.background-color: #FFFFFF]

Let's learn some __Svelte__

(https://svelte.dev/repl)
