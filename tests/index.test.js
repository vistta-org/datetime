import { DateTime } from "../index.js";

const DEFAULT_DATE = "1996-09-14";
const DEFAULT_DIFF = 15;

suite("DateTime", () => {
  test("Constructor: String", () => {
    expect(!isNaN(new DateTime(DEFAULT_DATE).time)).toEqual(true);
  });

  test("Constructor: Number", () => {
    expect(!isNaN(new DateTime(1643723400).time)).toEqual(true);
  });

  test("Constructor: Date", () => {
    expect(!isNaN(new DateTime(new Date()).time)).toEqual(true);
  });

  test("Constructor: DateTime", () => {
    expect(!isNaN(new DateTime(new DateTime()).time)).toEqual(true);
  });

  test("Min", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime();
    expect(DateTime.min(a, b).time).toEqual(b.time);
  });

  test("Max", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime();
    expect(DateTime.max(a, b).time).toEqual(a.time);
  });

  test("Equals", () => {
    expect(DateTime.equals(new DateTime(DEFAULT_DATE), new DateTime(DEFAULT_DATE))).toEqual(true);
    expect(new DateTime(DEFAULT_DATE).equals(new DateTime(DEFAULT_DATE))).toEqual(true);
  });

  test("Clone", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone();
    expect(a.time).toEqual(b.time);
  });

  test("ToISOString", () => {
    expect(typeof new DateTime(DEFAULT_DATE).toISOString()).toEqual("string");
  });

  test("ToString", () => {
    expect(typeof new DateTime(DEFAULT_DATE).toString()).toEqual("string");
  });

  test("Format", () => {
    expect(typeof new DateTime(DEFAULT_DATE).format()).toEqual("string");
  });

  test("Diff", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone();
    b.day += DEFAULT_DIFF;
    expect(b.diff(a, "day")).toEqual(DEFAULT_DIFF);
  });

  test("Relative", () => {
    expect(new DateTime().relative()).toEqual("just now");
  });
});
