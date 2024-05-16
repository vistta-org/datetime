const WEEK_IN_MILLIS = 6.048e8;
const DAY_IN_MILLIS = 8.64e7;
const HOUR_IN_MILLIS = 3.6e6;
const MIN_IN_MILLIS = 6e4;
const SEC_IN_MILLIS = 1e3;

export class DateTime {
  #options = {};
  #instance;

  static min(a, b) {
    if (a instanceof DateTime && b instanceof DateTime)
      return a.time > b.time ? a : b;
    return null;
  }

  static max(a, b) {
    if (a instanceof DateTime && b instanceof DateTime)
      return a.time < b.time ? a : b;
    return null;
  }

  static equals(a, b) {
    return a instanceof DateTime && a.equals(b);
  }

  constructor(value, options) {
    if (value) {
      const typeOf = typeof value;
      if (typeOf === "string" || typeOf === "number")
        this.#instance = new Date(value);
      else if (value instanceof Date) this.#instance = new Date(value);
      else if (value instanceof DateTime) {
        this.#instance = value.date;
        Object.assign(this.#options, value.options);
      } else this.#instance = new Date();
    } else this.#instance = new Date();
    Object.assign(this.#options, options);
  }

  get year() {
    return this.#instance.getFullYear();
  }
  set year(value) {
    this.#instance.setFullYear(value);
  }

  get month() {
    return this.#instance.getMonth();
  }
  set month(value) {
    this.#instance.setMonth(value);
  }

  get day() {
    return this.#instance.getDate();
  }

  set day(value) {
    this.#instance.setDate(value);
  }

  get hours() {
    return this.#instance.getHours();
  }
  set hours(value) {
    this.#instance.setHours(value);
  }

  get minutes() {
    return this.#instance.getMinutes();
  }
  set minutes(value) {
    this.#instance.setMinutes(value);
  }

  get date() {
    return new Date(this.#instance);
  }

  get options() {
    return this.#options;
  }

  get time() {
    return this.#instance.getTime();
  }

  toISOString() {
    return this.#instance.toISOString();
  }

  toString(locales) {
    return new Intl.DateTimeFormat(locales || getLang(), this.#options).format(
      this.#instance,
    );
  }

  format(options) {
    const locales = options?.locales || getLang();
    return new Intl.DateTimeFormat(locales, options).format(this.#instance);
  }

  equals(target) {
    const formatter = new Intl.DateTimeFormat(getLang(), this.#options);
    return (
      target instanceof DateTime &&
      formatter.format(this.#instance) === formatter.format(target.date)
    );
  }

  clone() {
    return new DateTime(this.#instance, this.#options);
  }

  diff(target, output, float) {
    if (!(target instanceof DateTime)) return null;
    const format = (input) => (float ? input : Math.floor(input));
    let result = this.time - target.time;
    if (output?.startsWith("year")) result = this.year - target.year;
    else if (output?.startsWith("month"))
      result = (target.year - this.year) * 12 - this.month + target.month;
    else if (output?.startsWith("week"))
      result = result / (1000 * 60 * 60 * 24 * 7);
    else if (output?.startsWith("day")) result = result / (1000 * 60 * 60 * 24);
    else if (output?.startsWith("hour")) result = result / (1000 * 60 * 60);
    else if (output?.startsWith("minute")) result = result / (1000 * 60);
    else if (output?.startsWith("second")) result = result / 1000;
    return format(result);
  }

  relative(options) {
    const from = options?.from || new Date();
    const locales = options?.locales || getLang();
    const formatter = new Intl.RelativeTimeFormat(locales, options);
    const diff =
      this.#instance.getTime() -
      this.#instance.getTimezoneOffset() * 60000 -
      (from.getTime() - from.getTimezoneOffset() * 60000);
    if (Math.abs(diff) > WEEK_IN_MILLIS)
      return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), "week");
    else if (Math.abs(diff) > DAY_IN_MILLIS)
      return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), "day");
    else if (Math.abs(diff) > HOUR_IN_MILLIS)
      return formatter.format(
        Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS),
        "hour",
      );
    else if (Math.abs(diff) > MIN_IN_MILLIS)
      return formatter.format(
        Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS),
        "minute",
      );
    else if (Math.abs(diff) > SEC_IN_MILLIS)
      return formatter.format(
        Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS),
        "second",
      );
    return "just now";
  }
}

export const date = (value, options) => new DateTime(value, options);
export const time = (value, options) =>
  new DateTime(
    value,
    Object.assign({ hour: "numeric", minute: "numeric" }, options),
  );

export default DateTime;

//

function getLang() {
  if (typeof navigator === "undefined") return undefined;
  if (navigator.languages != undefined) return navigator.languages;
  return navigator?.language;
}
