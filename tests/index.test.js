import { DateTime, date, formatDate, formatDateTime, formatTime, time } from "../index.js";

const DEFAULT_DATE = "1996-09-14";
const DEFAULT_DIFF = 15;

suite("DateTime", () => {
  test("new DateTime()", () => {
    expect(!isNaN(new DateTime(DEFAULT_DATE).time)).toEqual(true);
    expect(!isNaN(new DateTime(1643723400).time)).toEqual(true);
    expect(!isNaN(new DateTime(new Date()).time)).toEqual(true);
    expect(!isNaN(new DateTime(new DateTime()).time)).toEqual(true);
  });

  test("min()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime();
    expect(DateTime.min(a, b).time).toEqual(b.time);
  });

  test("max()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime();
    expect(DateTime.max(a, b).time).toEqual(a.time);
  });

  test("equals()", () => {
    expect(DateTime.equals(new DateTime(DEFAULT_DATE), new DateTime(DEFAULT_DATE))).toEqual(true);
    expect(new DateTime(DEFAULT_DATE).equals(new DateTime(DEFAULT_DATE))).toEqual(true);
  });

  test("clone()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone();
    expect(a.time).toEqual(b.time);
  });

  test("toISOString()", () => {
    expect(typeof new DateTime(DEFAULT_DATE).toISOString()).toEqual("string");
  });

  test("toString()", () => {
    expect(typeof new DateTime(DEFAULT_DATE).toString()).toEqual("string");
  });

  test("format()", () => {
    expect(typeof new DateTime(DEFAULT_DATE).format()).toEqual("string");
  });

  test("diff()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone();
    b.day += DEFAULT_DIFF;
    expect(b.diff(a, "day")).toEqual(DEFAULT_DIFF);
  });

  test("relative()", () => {
    expect(new DateTime().relative()).toEqual("just now");
  });

  test("add()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone().add("day", DEFAULT_DIFF);
    expect(b.diff(a, "day")).toEqual(DEFAULT_DIFF);
  });

  test("subtract()", () => {
    const a = new DateTime();
    const b = a.clone().subtract("day", DEFAULT_DIFF);
    expect(a.diff(b, "day")).toEqual(DEFAULT_DIFF);
  });

  test("startOf()", () => {
    const dt = new DateTime();
    expect(dt.clone().startOf("year").month).toEqual(0);
    expect(dt.clone().startOf("month").day).toEqual(1);
    expect(dt.clone().startOf("day").hours).toEqual(0);
    expect(dt.clone().startOf("hour").minutes).toEqual(0);
    expect(dt.clone().startOf("minute").seconds).toEqual(0);
    expect(dt.clone().startOf("second").milliseconds).toEqual(0);

    // Week (assuming Sunday as first day)
    const weekDt = new DateTime();
    weekDt.startOf("week");
    expect(weekDt.weekday).toEqual(0); // Sunday
    expect(weekDt.hours).toEqual(0);
    expect(weekDt.minutes).toEqual(0);
    expect(weekDt.seconds).toEqual(0);
    expect(weekDt.milliseconds).toEqual(0);
  });

  test("endOf()", () => {
    const dt = new DateTime("2023-05-17T14:23:45.678Z");
    expect(dt.clone().endOf("year").month).toEqual(11);
    expect(dt.clone().endOf("month").day).toEqual(new Date(2023, 5, 0).getDate());
    expect(dt.clone().endOf("day").hours).toEqual(23);
    expect(dt.clone().endOf("hour").minutes).toEqual(59);
    expect(dt.clone().endOf("minute").seconds).toEqual(59);
    expect(dt.clone().endOf("second").milliseconds).toEqual(999);

    // Week (assuming Sunday as first day)
    const weekDt = new DateTime("2023-05-17T14:23:45.678Z");
    weekDt.endOf("week");
    expect(weekDt.weekday).toEqual(6); // Saturday
    expect(weekDt.hours).toEqual(23);
    expect(weekDt.minutes).toEqual(59);
    expect(weekDt.seconds).toEqual(59);
    expect(weekDt.milliseconds).toEqual(999);
  });

  test("next()", () => {
    const dt = new DateTime("2023-05-17T14:23:45.678Z");
    expect(dt.clone().next("year").year).toEqual(2024);
    expect(dt.clone().next("month").month).toEqual(5);
    expect(dt.clone().next("week").day).toEqual(dt.day + 7);
    expect(dt.clone().next("day").day).toEqual(dt.day + 1);
    expect(dt.clone().next("hour").hours).toEqual(dt.hours + 1);
    expect(dt.clone().next("minute").minutes).toEqual(dt.minutes + 1);
    expect(dt.clone().next("second").seconds).toEqual(dt.seconds + 1);
  });

  test("previous()", () => {
    const dt = new DateTime("2023-05-17T14:23:45.678Z");
    expect(dt.clone().previous("year").year).toEqual(2022);
    expect(dt.clone().previous("month").month).toEqual(3);
    expect(dt.clone().previous("week").day).toEqual(dt.day - 7);
    expect(dt.clone().previous("day").day).toEqual(dt.day - 1);
    expect(dt.clone().previous("hour").hours).toEqual(dt.hours - 1);
    expect(dt.clone().previous("minute").minutes).toEqual(dt.minutes - 1);
    expect(dt.clone().previous("second").seconds).toEqual(dt.seconds - 1);
  });

  test("date()", () => {
    const d = date(DEFAULT_DATE);
    expect(d instanceof DateTime).toEqual(true);
    expect(typeof d.format()).toEqual("string");
    expect(d.options.dateStyle).toEqual("short");
  });

  test("time()", () => {
    const t = time(DEFAULT_DATE);
    expect(t instanceof DateTime).toEqual(true);
    expect(typeof t.format()).toEqual("string");
    expect(t.options.timeStyle).toEqual("short");
  });

  test("formatDate()", () => {
    const str = formatDate(DEFAULT_DATE);
    expect(typeof str).toEqual("string");
    const dt = new DateTime(DEFAULT_DATE);
    expect(formatDate(dt)).toEqual(dt.format({ dateStyle: "short", timeStyle: undefined }));
  });

  test("formatTime()", () => {
    const str = formatTime(DEFAULT_DATE);
    expect(typeof str).toEqual("string");
    const dt = new DateTime(DEFAULT_DATE);
    expect(formatTime(dt)).toEqual(dt.format({ dateStyle: undefined, timeStyle: "short" }));
  });

  test("formatDateTime()", () => {
    const str = formatDateTime(DEFAULT_DATE);
    expect(typeof str).toEqual("string");
    const dt = new DateTime(DEFAULT_DATE);
    expect(formatDateTime(dt)).toEqual(dt.format({ dateStyle: "short", timeStyle: "short" }));
  });
});
