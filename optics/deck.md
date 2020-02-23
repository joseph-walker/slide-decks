[.header: #333333, alignment(right)]

# Optics

![original](./images/lens.jpg)

---

#### Optics aren't any one library or tool. They're a __concept__.

#### Let's start with the basics and build up...

----

# Getters

We can write a function that gets a certain portion of an object. We'll call this a __getter__.

```typescript
const me = {
    name: "Joseph"
};

function getName(person) {
    return person.name;
}

const myName = getName(me);
```

---

# Setters

We can also write a function that sets a value or property of an object. We'll call this a __setter__.

```typescript
const me = {
    name: "Joseph"
};

function setName(newName, person) {
    return {
        ...person,
        name: newName
    };
}

const someoneElse = setName("Jim", me);
```

---

### Getters and Setters are __simple__ but __powerful__.

Because they're functions, you can nest them and their behavior is well defined.

```typescript
const me = { name: { first: "Joseph", last: "Walker" } };

// Some Getters
const getName = (person) => person.name;
const getFirstName = (name) => name.first;

// Some Setters
const setFirstName = (first, name) => ({ ...name, first });
const setName = (name, person) => ({ ...person, name });

// Combine them
const myName = getFirstName(getName(me));
const myBrother = setName(setFirstName("Jim", getName(me)), me);
```

---

### And since nesting pure functions is equivalent to __composition__...

We can combine them in an idiomatic way[^1].

```typescript
// Get the name, then get the first name
const getFirstName = compose(
    getName,
    getFirstName
);

const myName = getFirstName(me); // Joseph
```

[^1]: Setters can be composed too, but they have to be curried first.

---

### We can build a wrapper for convenience.

Let's call it a getter-setter -- a __SGetter__.

```typescript
class SGetter {
    constructor(getter, setter) {
        this.getter = getter;
        this.setter = setter;
    }

    get(target) { return this.get(target); }

    set(newValue, target) { return this.set(newValue, target); }
}

const nameSgetter = new SGetter(getName, setName);

const myName = nameSgetter(me);
```

---

### We can add some helpers and utilities

```typescript
class SGetter {
    // Create a SGetter from a prop
    static fromProp(propName) {
        // ...
    }

    // Create a SGetter from an array of props
    static fromPath(propPath) {
        // ...
    }

    // Combine our setter and getter
    compose(nextSGetter) {
        // ...
    }
}
```

---

#### __SGetter__ is a dumb name, though. Let's call it...

---

[.header: alignment(center)]

# Lens

---

### A lens encodes a __getter__ and __setter__

#### It can be a _class_. Or it can be a set of _functions_.

#### All that matters is that the implementation follows...

---

### The 3 Lens Laws

- Law 1: __Get-Put__
If you _modify_ something by changing its supbart to what it _already is_... Nothing happens.

```typescript
setPart(getPart(target), target) === target
```

- Law 2: __Put-Get__
If you _modify_ something by inserting a subpart and then _view_ the result, you'll get back the inserted part.

```typescript
getPart(setPart(newValue, target)) === newValue
```

- Law 3: __Put-Put__
If you _modify_ something by inserting some part _a_, then do it again with part _b_, it's exactly the same as if you only did the second part.

```typescript
setPart(valueB, setPart(valueA, target)) === setPart(valueB, target)
```

---

### Examples using Ramda

```typescript
import * as R from 'ramda';

const me = {
    name: 'Joseph',
    occupation: 'Programmer'
}

const nameLens = R.lensProp('name');

// Using a Lens
R.set(nameLens, 'Walker', me); // { name: 'Walker', ... }

// You can modify a value using lenses too
R.over(nameLens, s => s.split(''), me); // { name: ['J', 'o', 's', ...], ... }

// Get-Put Law
R.set(nameLens, R.view(nameLens, me), me); // === me

// Put-Get Law
R.view(nameLens, R.set(nameLens, 'Walker', me)); // 'Walker'

// Put-Put Law
R.set(nameLens, 'Walker', R.set(nameLens, 'Ted', me)); // { name: 'Walker', ... }
```

---

### Can we go __deeper__?

---

### What if we modify our get and set operations?

```typescript
// Instead of...
const getThing = source => source.thing;

// What about:
const getThing = source => 'thing' in source ? source.thing : null;

// And instead of...
function setThing = (newValue, source) => ({ ...source, thing: newValue });

// What about:
function setThing(newValue, source) {
    return 'thing' in source
        ? {
            ...source,
            thing: newValue
        }
        : source
}
```

---

### We've just created an __Optional__ Optic

Ramda Lenses are actually __Optionals__ [^2]

```typescript
// This is valid, but will return undefined
R.view(
    R.lensProp('lastName'),
    R.view(
        R.lensProp('name'),
        {}
    )
);
```

[^2]: Although Ramda lenses will _set_ values that don't exist, so its implementation is slightly different.

---

### We can create __more__ combinations, too. [^3]

[^3]: Examples from here forward will use a library called Monocole-TS instead of Ramda, since Ramda only has Lenses and Optionals

---

If we change our get and set to modify a value in a __reversible__ way, we've created an __Iso__.

The names __get__ and __set__ don't make sense in this context, though, so we call them __get__ and __reverse-get__.

```typescript
// This is a library called Monocle-TS
const celsiusToFreedom = new Iso<number, number>(c => c * (9 / 5) + 32, f => (f - 32) * (5 / 9));

celsiusToFreedom.get(20); // 68
celsiusToFreedom.reverseGet(68); // 20
```