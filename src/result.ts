export interface BaseResult<T, E> {
  value: T | E;

  readonly isOk: boolean;
  readonly isErr: boolean;

  isOkAnd(predicate: (value: T) => boolean): boolean;
  isErrAnd(predicate: (value: E) => boolean): boolean;

  map<T2>(mapper: (val: T) => T2): Result<T2, E>;
  mapErr<E2>(mapper: (val: E) => E2): Result<T, E2>;
  mapOr<T2>(fallback: T2, mapper: (val: T) => T2): T2;

  expect(msg: string): T;
  expectErr(msg: string): E;

  unwrap(): T;
  unwrapErr(): E;
  unwrapOr<U extends T>(fallback: U): U;

  /**
   * Returns `other` if the result is Ok,
   * otherwise returns the Err value of self.
   */
  and<T2>(other: Result<T2, E>): Result<T2, E>;

  /**
   * Calls mapper if the result is Ok, otherwise returns the Err value of self.
   * This function can be used for control flow based on Result values.
   * @param mapper
   */
  andThen<T2>(mapper: (val: T) => Result<T2, E>): Result<T2, E>;

  or<T2>(other: Result<T, T2>): Result<T, T2>;
  orElse<T2>(mapper: (val: E) => Result<T, T2>): Result<T, T2>;
}

export class Ok<T, E> implements BaseResult<T, E> {
  readonly isOk = true;
  readonly isErr = false;

  constructor(public readonly value: T) {}

  isOkAnd(predicate: (value: T) => boolean): boolean {
    return predicate(this.value);
  }

  isErrAnd(_predicate: (value: E) => boolean): boolean {
    return false;
  }

  map<T2>(mapper: (val: T) => T2): Result<T2, E> {
    return ok(mapper(this.value));
  }

  mapErr<E2>(_mapper: (val: E) => E2): Result<T, E2> {
    return ok(this.value);
  }

  mapOr<T2>(_fallback: T2, mapper: (val: T) => T2): T2 {
    return mapper(this.value);
  }

  expect(_msg: string): T {
    return this.value;
  }

  expectErr(msg: string): E {
    throw new Error(msg);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapErr(): E {
    throw new Error("Cannot unwrapErr an Ok value");
  }

  unwrapOr<U extends T>(_fallback: U): U {
    return this.value as U;
  }

  and<T2>(other: Result<T2, E>): Result<T2, E> {
    return other;
  }

  andThen<T2>(mapper: (val: T) => Result<T2, E>): Result<T2, E> {
    return mapper(this.value);
  }

  or<T2>(_other: Result<T, T2>): Result<T, T2> {
    return ok(this.value);
  }

  orElse<T2>(_mapper: (val: E) => Result<T, T2>): Result<T, T2> {
    return ok(this.value);
  }
}

export class Err<T, E> implements BaseResult<T, E> {
  readonly isOk = false;
  readonly isErr = true;

  constructor(public readonly value: E) {}

  isOkAnd(_predicate: (value: T) => boolean): boolean {
    return false;
  }

  isErrAnd(predicate: (value: E) => boolean): boolean {
    return predicate(this.value);
  }

  map<U>(_mapper: (val: T) => U): Result<U, E> {
    return err(this.value);
  }

  mapErr<E2>(mapper: (val: E) => E2): Result<T, E2> {
    return err(mapper(this.value));
  }

  mapOr<T2>(fallback: T2, _mapper: (val: T) => T2): T2 {
    return fallback;
  }

  expect(msg: string): never {
    throw new Error(msg);
  }

  expectErr(_msg: string): E {
    return this.value;
  }

  unwrap(): T {
    throw new Error("Cannot unwrap an Err value");
  }

  unwrapErr(): E {
    return this.value;
  }

  unwrapOr<U extends T>(fallback: U): U {
    return fallback;
  }

  and<T2>(_other: Result<T2, E>): Result<T2, E> {
    return err(this.value);
  }

  andThen<T2>(_mapper: (val: T) => Result<T2, E>): Result<T2, E> {
    return err(this.value);
  }

  or<T2>(other: Result<T, T2>): Result<T, T2> {
    return other;
  }

  orElse<T2>(mapper: (val: E) => Result<T, T2>): Result<T, T2> {
    return mapper(this.value);
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export function ok<T, E>(value: T): Result<T, E> {
  return new Ok<T, E>(value);
}

export function err<T, E>(value: E): Result<T, E> {
  return new Err<T, E>(value);
}

export namespace Result {
  export function wrap<T, E = unknown>(op: () => T): Result<T, E> {
    try {
      const val = op();
      return ok(val);
    } catch (e) {
      if (hasKey(e, "message")) {
        // @ts-ignore
        return err(e.message as E);
      }

      return err(e as E);
    }
  }

  export async function wrapAsync<T, E = unknown>(
    op: () => Promise<T>
  ): Promise<Result<T, E>> {
    try {
      const val = await op();
      return ok(val);
    } catch (e) {
      if (hasKey(e, "message")) {
        //@ts-ignore
        return err(e.message as E);
      }
      return err(e as E);
    }
  }

  export function isResult<T, E>(val: any): val is Result<T, E> {
    return val instanceof Ok || val instanceof Err;
  }

  export function match<T, E>(
    result: Result<T, E>,
    okFn?: (result: T) => any,
    errFn?: (error: E) => any
  ) {
    if (result.isOk) {
      return okFn?.(result.unwrap());
    } else {
      return errFn?.(result.value as E);
    }
  }

  function hasKey(data: any, key: string): boolean {
    if (typeof data === "object" && data !== null) {
      return key in data;
    }
    return false;
  }
}
