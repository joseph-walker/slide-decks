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

#### __SGetter__ is a dumb name, though. Let's call it...

---

[.header: alignment(center)]

# Lens