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
    const b = new DateTime("2024-01-01");
    expect(DateTime.min(a, b)).toEqual(a);
    expect(DateTime.min(b, a)).toEqual(a);
  });

  test("max()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = new DateTime("2024-01-01");
    expect(DateTime.max(a, b)).toEqual(b);
    expect(DateTime.max(b, a)).toEqual(b);
  });

  test("equals()", () => {
    expect(DateTime.equals(new DateTime(DEFAULT_DATE), new DateTime(DEFAULT_DATE))).toEqual(true);
    expect(new DateTime(DEFAULT_DATE).equals(new DateTime(DEFAULT_DATE))).toEqual(true);
  });

  test("equals() with precision", () => {
    const a = new DateTime("2023-05-17T14:23:45.678Z");
    const b = new DateTime("2023-05-17T14:23:50.123Z");
    // Same down to the minute, different seconds
    expect(a.equals(b, { precision: "minute" })).toEqual(true);
    // Same down to the second
    expect(a.equals(b, { precision: "second" })).toEqual(false);
    // Same date, different time
    const c = new DateTime("2023-05-17T18:00:00.000Z");
    expect(a.equals(c, { precision: "day" })).toEqual(true);
    expect(a.equals(c, { precision: "hour" })).toEqual(false);
  });

  test("equals() with exclude", () => {
    const a = new DateTime("2023-05-17T14:23:45.678Z");
    const b = new DateTime("2023-05-17T14:23:50.123Z");
    // Exclude seconds — should be equal
    expect(a.equals(b, { exclude: ["second"] })).toEqual(true);
    // Exclude seconds and minutes — should be equal
    expect(a.equals(b, { exclude: ["second", "minute"] })).toEqual(true);
    // Exclude hours — different hours would still differ
    const c = new DateTime("2023-05-17T18:23:45.678Z");
    expect(a.equals(c, { exclude: ["hour"] })).toEqual(true);
    expect(a.equals(c, { exclude: ["second"] })).toEqual(false);
  });

  test("isNow()", () => {
    expect(new DateTime(DEFAULT_DATE).isNow()).toEqual(false);
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

  test("month differences have the same sign as elapsed differences", () => {
    const a = new DateTime([2023, 11, 1]);
    const b = new DateTime([2024, 1, 1]);
    expect(b.diff(a, "month")).toEqual(2);
    expect(a.diff(b, "month")).toEqual(-2);
  });

  test("relative()", () => {
    expect(new DateTime(0).relative({ from: new Date(0), locales: "en" })).toEqual("now");
  });

  test("relative() selects units at exact thresholds", () => {
    const formatter = new Intl.RelativeTimeFormat("en");
    for (const [unit, milliseconds] of [
      ["second", 1000],
      ["minute", 60000],
      ["hour", 3600000],
      ["day", 86400000],
      ["week", 604800000],
    ]) {
      for (const direction of [-1, 1]) {
        expect(new DateTime(direction * milliseconds).relative({ from: new Date(0), locales: "en" })).toEqual(
          formatter.format(direction, unit),
        );
      }
    }
  });

  test("add()", () => {
    const a = new DateTime(DEFAULT_DATE);
    const b = a.clone().add("day", DEFAULT_DIFF);
    expect(b.diff(a, "day")).toEqual(DEFAULT_DIFF);
  });

  test("subtract()", () => {
    const a = new DateTime([2024, 0, 20]);
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

  test("week boundaries respect every configured first day", () => {
    const weekdays = ["sun", "mon", "tue", "wen", "thu", "fri", "sat"];
    for (const [firstDay, firstDayOfWeek] of weekdays.entries()) {
      for (let weekday = 0; weekday < 7; weekday++) {
        const dt = new DateTime([2023, 4, 14 + weekday, 12], { firstDayOfWeek });
        const offset = (weekday - firstDay + 7) % 7;
        const start = dt.clone().startOf("week");
        const end = dt.clone().endOf("week");
        expect(start.day).toEqual(dt.day - offset);
        expect(end.day).toEqual(dt.day + 6 - offset);
        expect(start.weekday).toEqual(firstDay);
        expect(end.weekday).toEqual((firstDay + 6) % 7);
        expect(start.hours).toEqual(0);
        expect(end.hours).toEqual(23);
      }
    }
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

  test("month and year arithmetic clamp while retaining the time", () => {
    const january = new DateTime([2024, 0, 31, 12, 34, 56, 789]);
    const february = january.clone().add("month");
    expect(february.month).toEqual(1);
    expect(february.day).toEqual(29);
    expect(february.hours).toEqual(12);
    expect(february.milliseconds).toEqual(789);
    expect(january.day).toEqual(31);
    expect(january.clone().next("month").time).toEqual(february.time);
    expect(february.clone().add("year").day).toEqual(28);
    expect(february.clone().previous("year").day).toEqual(28);
    const march = new DateTime([2023, 2, 31]);
    expect(march.subtract("month").day).toEqual(28);
    expect(new DateTime([2023, 11, 31]).add("month", 2).toLocalISOString()).toEqual("2024-02-29T00:00:00.000");
  });

  test("millisecond boundaries preserve the instant", () => {
    const dt = new DateTime("2024-01-01T12:34:56.789Z");
    expect(dt.clone().startOf("millisecond").time).toEqual(dt.time);
    expect(dt.clone().endOf("millisecond").time).toEqual(dt.time);
    expect(dt.clone().add("millisecond").time).toEqual(dt.time + 1);
  });

  test("comparison handles milliseconds and calendar weeks", () => {
    const a = new DateTime([2023, 4, 17, 12, 0, 0, 123], { firstDayOfWeek: "mon" });
    const b = new DateTime(a.time + 1);
    expect(a.equals(b, { precision: "second" })).toEqual(true);
    expect(a.equals(b, { precision: "millisecond" })).toEqual(false);
    expect(a.equals(b, { precision: "millisecond", exclude: ["millisecond"] })).toEqual(true);
    expect(a.equals(new DateTime([2023, 4, 21]), { precision: "week" })).toEqual(true);
    expect(a.equals(new DateTime([2023, 4, 22]), { precision: "week" })).toEqual(false);
    const start = new DateTime([2023, 4, 17], { firstDayOfWeek: "wed" }).startOf("week");
    expect(start.weekday).toEqual(3);
  });

  test("formatting inherits options and supports overrides without Intl conflicts", () => {
    const dt = new DateTime([2024, 0, 1, 12], { locales: "en", dateStyle: "full", timeZone: "UTC" });
    expect(dt.format()).toEqual(dt.toString());
    expect(dt.format({ locales: "pt" })).toEqual(
      new Intl.DateTimeFormat("pt", { dateStyle: "full", timeZone: "UTC" }).format(dt.date),
    );
    expect(dt.toString("pt")).toEqual(dt.format({ locales: "pt" }));
    expect(dt.format({ hour: "2-digit", minute: "2-digit" })).toEqual(
      new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(dt.date),
    );
    const fields = new DateTime(dt.date, { locales: "en", year: "numeric", hour: "numeric" });
    expect(fields.format({ dateStyle: "short" })).toEqual(
      new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(dt.date),
    );
    expect(dt.options.dateStyle).toEqual("full");
    expect(new DateTime(null, { dateStyle: "full" }).options.dateStyle).toEqual("full");
  });

  test("helpers preserve caller options and merge format defaults", () => {
    const options = Object.freeze({ locales: "en", dateStyle: "long" });
    expect(date(DEFAULT_DATE, options).options.dateStyle).toEqual("long");
    const timeOptions = Object.freeze({ locales: "en", timeStyle: "long" });
    expect(time(DEFAULT_DATE, timeOptions).options.timeStyle).toEqual("long");
    const dt = new DateTime([2024, 0, 1, 12], { locales: "pt", timeStyle: "long" });
    expect(formatDate(dt, { locales: "en" })).toEqual(new Intl.DateTimeFormat("en", { dateStyle: "short" }).format(dt.date));
    expect(formatTime(dt, { locales: "en" })).toEqual(new Intl.DateTimeFormat("en", { timeStyle: "short" }).format(dt.date));
    expect(formatDateTime(dt, { locales: "en" })).toEqual(
      new Intl.DateTimeFormat("en", { dateStyle: "short", timeStyle: "short" }).format(dt.date),
    );
    expect(formatDate(dt, { year: "numeric" })).toEqual(new Intl.DateTimeFormat("pt", { year: "numeric" }).format(dt.date));
    expect(formatTime(dt.date, { locales: "en", hour: "numeric" })).toEqual(
      new Intl.DateTimeFormat("en", { hour: "numeric" }).format(dt.date),
    );
  });

  test("relative zero is localized and honors numeric options", () => {
    const dt = new DateTime(0, { locales: "pt" });
    expect(dt.relative({ from: new Date(500) })).toEqual(
      new Intl.RelativeTimeFormat("pt", { numeric: "auto" }).format(0, "second"),
    );
    expect(dt.relative({ from: new Date(0), numeric: "always" })).toEqual(
      new Intl.RelativeTimeFormat("pt", { numeric: "always" }).format(0, "second"),
    );
  });

  test("invalid dates and unsupported operations fail explicitly", () => {
    const invalid = new DateTime("not a date");
    expect(invalid.isValid()).toEqual(false);
    expect(invalid.equals(invalid, { exclude: ["year", "month", "day", "hour", "minute", "second"] })).toEqual(false);
    expect(() => invalid.toLocalISOString()).toThrow("Invalid date and time");
    expect(() => invalid.add("day")).toThrow("Invalid date and time");
    expect(() => new DateTime(0).diff(invalid)).toThrow("Invalid date and time");
    expect(() => new DateTime(0).relative({ from: new Date(NaN) })).toThrow("Invalid reference date");
    expect(() => DateTime.min(invalid, new DateTime(0))).toThrow("Invalid date and time");
    expect(() => new DateTime(0).add("day", Infinity)).toThrow("finite value");
    expect(() => new DateTime(0).diff(new DateTime(0), "invalid")).toThrow("Invalid date and time unit");
    expect(() => new DateTime(0, { firstDayOfWeek: "invalid" }).startOf("week")).toThrow("Invalid first day of week");
  });
});
