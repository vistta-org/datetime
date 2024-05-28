import { DateTime } from "../index.js";

const DEFAULT_DATE = "1996-09-14";
const DEFAULT_DIFF = 15;

describe("DateTime", () => {
  it("Constructor: String", () => {
    assert.ok(!isNaN(new DateTime(DEFAULT_DATE).time));
  });

  it("Constructor: Number", () => {
    assert.ok(!isNaN(new DateTime(1643723400).time));
  });

  it("Constructor: Date", () => {
    assert.ok(!isNaN(new DateTime(new Date()).time));
  });

  it("Constructor: DateTime", () => {
    assert.ok(!isNaN(new DateTime(new DateTime()).time));
  });

  it("Min", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime();
    assert.equal(DateTime.min(a, b).time, b.time);
  });

  it("Max", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime();
    assert.equal(DateTime.max(a, b).time, a.time);
  });

  it("Equals", () => {
    assert.ok(
      DateTime.equals(new DateTime(DEFAULT_DATE), new DateTime(DEFAULT_DATE)),
    );
    assert.ok(new DateTime(DEFAULT_DATE).equals(new DateTime(DEFAULT_DATE)));
  });

  it("Clone", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone();
    assert.equal(a.time, b.time);
  });

  it("ToISOString", () => {
    assert.equal(typeof new DateTime(DEFAULT_DATE).toISOString(), "string");
  });

  it("ToString", () => {
    assert.equal(typeof new DateTime(DEFAULT_DATE).toString(), "string");
  });

  it("Format", () => {
    assert.equal(typeof new DateTime(DEFAULT_DATE).format(), "string");
  });

  it("Diff", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone();
    b.day += DEFAULT_DIFF;
    assert.equal(b.diff(a, "day"), DEFAULT_DIFF);
  });

  it("Relative", () => {
    assert.equal(new DateTime().relative(), "just now");
  });
});
