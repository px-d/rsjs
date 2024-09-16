import { ok, Result, err } from "../src/result";

describe("Ok", () => {
  it("isOk", () => {
    const x: Result<number, string> = ok(1);
    expect(x.isOk).toBe(true);

    const y: Result<number, string> = err("error");
    expect(y.isOk).toBe(false);
  });

  it("isOkAnd", () => {
    const x: Result<number, string> = ok(2);
    expect(x.isOkAnd((x) => x > 1)).toEqual(true);

    const y: Result<number, string> = ok(0);
    expect(y.isOkAnd((x) => x > 1)).toEqual(false);

    const z: Result<number, string> = err("error");
    expect(z.isOkAnd((x) => x > 1)).toEqual(false);
  });

  it("map", () => {
    const x: Result<number, string> = ok(2);
    expect(x.map((x) => x + 1)).toEqual(ok(3));
  });

  it("mapErr", () => {
    const x: Result<number, string> = ok(2);
    expect(x.mapErr((x) => x + "1")).toEqual(ok(2));
  });

  it("mapOr", () => {
    const x: Result<number, string> = ok(2);
    expect(x.mapOr(0, (x) => x + 1)).toEqual(3);
  });

  it("expect", () => {
    const x: Result<number, string> = ok(2);
    expect(x.expect("error")).toEqual(2);
  });

  it("expectErr", () => {
    const x: Result<number, string> = ok(2);
    expect(() => x.expectErr("error")).toThrow("error");
  });

  it("unwrap", () => {
    const x: Result<number, string> = ok(2);
    expect(x.unwrap()).toEqual(2);
  });

  it("unwrapOr", () => {
    const x: Result<number, string> = ok(2);
    expect(x.unwrapOr(0)).toEqual(2);
  });

  it("unwrapErr", () => {
    const x: Result<number, string> = ok(2);
    expect(() => x.unwrapErr()).toThrow("Cannot unwrapErr an Ok value");
  });

  it("and", () => {
    const x: Result<number, string> = ok(2);
    const y: Result<number, string> = ok(3);
    expect(x.and(y)).toEqual(y);
  });

  it("andThen", () => {
    const x: Result<number, string> = ok(2);
    const y: Result<number, string> = ok(3);
    expect(x.andThen((x) => y)).toEqual(y);
  });

  it("or", () => {
    const x: Result<number, string> = ok(2);
    const y: Result<number, string> = ok(3);
    expect(x.or(y)).toEqual(x);
  });

  it("orElse", () => {
    const x: Result<number, string> = ok(2);
    const y: Result<number, string> = ok(3);
    expect(x.orElse((x) => y)).toEqual(x);
  });
});

describe("Err", () => {
  it("isErr", () => {
    const x: Result<number, string> = ok(1);
    expect(x.isErr).toBe(false);

    const y: Result<number, string> = err("error");
    expect(y.isErr).toBe(true);
  });

  it("isErrAnd", () => {
    const x: Result<number, string> = err("error");
    expect(x.isErrAnd((x) => x === "error")).toEqual(true);

    const y: Result<number, string> = err("another error");
    expect(y.isErrAnd((x) => x === "error")).toEqual(false);

    const z: Result<number, string> = ok(0);
    expect(z.isErrAnd((x) => x === "error")).toEqual(false);
  });

  it("map", () => {
    const x: Result<number, string> = err("error");
    expect(x.map((x) => x + 1)).toEqual(err("error"));
  });

  it("mapErr", () => {
    const x: Result<number, string> = err("error");
    expect(x.mapErr((x) => x + "1")).toEqual(err("error1"));
  });

  it("mapOr", () => {
    const x: Result<string, string> = err("foo");
    expect(x.mapOr(42, (m) => m.length)).toEqual(42);
  });

  it("expect", () => {
    const x: Result<number, string> = err("error");
    expect(() => x.expect("error")).toThrow("error");
  });

  it("expectErr", () => {
    const x: Result<number, string> = err("error");
    expect(x.expectErr("error")).toEqual("error");
  });

  it("unwrap", () => {
    const x: Result<number, string> = err("error");
    expect(() => x.unwrap()).toThrow("Cannot unwrap an Err value");
  });

  it("unwrapOr", () => {
    const x: Result<number, string> = err("error");
    expect(x.unwrapOr(0)).toEqual(0);
  });

  it("unwrapErr", () => {
    const x: Result<number, string> = err("error");
    expect(x.unwrapErr()).toEqual("error");
  });

  it("and", () => {
    const x: Result<number, string> = err("error");
    const y: Result<number, string> = ok(3);
    expect(x.and(y)).toEqual(x);
  });

  it("andThen", () => {
    const x: Result<number, string> = err("error");
    const y: Result<number, string> = ok(3);
    expect(x.andThen((x) => y)).toEqual(x);
  });

  it("or", () => {
    const x: Result<number, string> = err("error");
    const y: Result<number, string> = ok(3);
    expect(x.or(y)).toEqual(y);
  });

  it("orElse", () => {
    const x: Result<number, string> = err("error");
    const y: Result<number, string> = ok(3);
    expect(x.orElse((x) => y)).toEqual(y);
  });
});

describe("Namespace", () => {
  it("wrap", () => {
    expect(Result.wrap(() => 1)).toEqual(ok(1));
    expect(
      Result.wrap(() => {
        throw "error";
      })
    ).toEqual(err("error"));
    expect(
      Result.wrap(() => {
        throw new Error("error");
      })
    ).toEqual(err("error"));
  });

  it("wrapAsync", async () => {
    expect(await Result.wrapAsync(async () => 1)).toEqual(ok(1));
    expect(
      await Result.wrapAsync(async () => {
        throw "error";
      })
    ).toEqual(err("error"));
    expect(
      await Result.wrapAsync(async () => {
        throw new Error("error");
      })
    ).toEqual(err("error"));
  });

  it("isResult", () => {
    expect(Result.isResult(ok(1))).toBe(true);
    expect(Result.isResult(err("error"))).toBe(true);
    expect(Result.isResult(1)).toBe(false);
    expect(Result.isResult("error")).toBe(false);
  });

  it("match", () => {
    const a: Result<number, unknown> = ok(1);
    const b: Result<unknown, string> = err("error");

    expect(Result.match(a, (x) => x + 1)).toEqual(2);
    expect(
      Result.match(
        b,
        (x) => x,
        (x) => x + "1"
      )
    ).toEqual("error1");
  });
});
