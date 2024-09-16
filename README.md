# RSJS

Library inspired by Rusts `Result`-Type

## Currently Implemented:

- `isOk()`
- `isErr()`
- `isOkAnd()`
- `isErrAnd()`
- `unwrap()`
- `unwrapOr()`
- `unwrapOrElse()`
- `unwrapErr()`
- `map()`
- `mapOr()`
- `mapErr()`
- `expect()`
- `expectErr()`
- `and()`
- `andThen()`
- `or()`
- `orElse()`

## Namespace Functions:

- `Result.wrap()`
- `Result.wrapAsync()`
- `Result.isResult()`
- `Result.match()`

# Documentation

#### `isOk()`

```ts
const result: Result<number, string> = ok(20);
result.isOk(); // true
```

#### `isErr()`

```ts
const result: Result<number, string> = err("Error");
result.isErr(); // true
```

#### `isOkAnd()`

```ts
const result: Result<number, string> = ok(20);
result.isOkAnd((value) => console.log("Result is:", value));
// Prints to Log
```

#### `isErrAnd()`

```ts
const result: Result<number, string> = err("Error");
result.isErrAnd((value) => console.log("Result is:", value));
// Prints to Log
```

#### `unwrap()`

```ts
const result: Result<number, string> = ok(20);
result.unwrap(); // Returns 20

const result: Result<number, string> = err("Error");
result.unwrap(); // Will throw
```

#### `unwrapOr()`

```ts
const result: Result<number, string> = err("Error");
result.unwrapOr(20); // 20
```

#### `unwrapOrElse()`

```ts
const result: Result<number, string> = err("Error");
result.unwrapOrElse(() => 20); // 20 (Must return the Ok value type)
```

#### `unwrapErr()`

```ts
const result: Result<number, string> = err("Error");
result.unwrapErr(); // Returns "Error"

const result: Result<number, string> = ok(2);
result.unwrapErr(); // Will throw
```

#### `map()`

```ts
const result: Result<number, string> = ok(20);
result.map((v) => v + 5); // 25
```

#### `mapOr()`

```ts
const result: Result<number, string> = err(20);
result.mapOr((v) => v + 5, 50); // 50
```

#### `mapErr()`

```ts
const result: Result<number, string> = err("Hi");
result.mapErr((v) => v.toUpperCase()); // "HI"
```

#### `expect()`

```ts
const result: Result<number, string> = err("Hi");
result.expect("This is an error"); // prints "This is an error"
```

#### `expectErr()`

```ts
const result: Result<number, string> = err("Hi");
result.expectErr("This is an error"); // prints "Hi"
```

#### `and()`

```ts
const result: Result<number, string> = ok(1);
const second: Result<number, string> = err("error");

result.and(second); // Returns the Err
second.or(result); // Returns the Err
```

#### `andThen()`

```ts
const result: Result<number, string> = ok(1);

// Returns the a new Ok with value 2
result.andThen((value) => {
  return ok(value + 1);
});

------------

const result: Result<number, string> =err("Error");

// Returns the Error with value "Error"
result.andThen((value) => {
  return ok(value + 1);
});

```

#### `or()`

```ts
const a: Result<number, string> = ok(1);
const b: Result<number, string> = err("Err");

a.or(b); // Returns the Ok
b.or(a); // Returns the Ok
```

#### `orElse()`

```ts
const a: Result<number, string> = ok(1);
const b: Result<number, string> = err("Err");

a.orElse((e) => err(e + "2")); // Returns the Ok with value 1
b.orElse((e) => ok(-1)); // Returns the Ok with value -1
```

#### `Result.wrap()`

```ts
function thatFails() {
  throw new Error("This is an error");
}

Result.wrap(thatFails); // Holds the Err of the function that failed
```

#### `Result.wrapAsync()`

```ts
async function thatFails() {
  throw new Error("This is an error");
}

Result.wrap(thatFails); // Holds the Promise<Err> of the function that failed
```

#### `Result.isResult()`

```ts
Result.isResult(ok(1)); // true
Result.isResult(err(1)); // true
Result.isResult(1); // false
```

#### `Result.match()`

```ts
Result.match(
  err("I'm an error"),
  (value) => {
    // This wont reach
  },
  (error) => {
    // Error is "I'm an error"
  }
);
```

or

```ts
Result.match(
  ok("I'm a value"),
  (value) => {
    // Value is "I'm a value"
  },
  (error) => {
    // This wont reach
  }
);
```
