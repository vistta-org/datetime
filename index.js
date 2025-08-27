// @ts-check

/**
 * @typedef {Object} LocaleOptions
 * @property {string|string[]} [locales] - The locale to use for formatting.
 */

/**
 * @typedef {Object} RelativeOptions
 * @property {Date} [from] - The reference date for relative time calculations.
 * @property {string|string[]} [locales] - The locale to use for formatting.
 */

const WEEK_IN_MILLIS = 6.048e8;
const DAY_IN_MILLIS = 8.64e7;
const HOUR_IN_MILLIS = 3.6e6;
const MIN_IN_MILLIS = 6e4;
const SEC_IN_MILLIS = 1e3;

/**
 * A class representing a date and time.
 */
export class DateTime {
  #options = {};
  #instance;

  /**
   * Returns the earlier of two date and time objects.
   *
   * @param {DateTime} a The first date and time object.
   * @param {DateTime} b The second date and time object.
   * @returns {DateTime | null} The date and time with the earliest time value.
   */
  static min(a, b) {
    if (a instanceof DateTime && b instanceof DateTime) return a.time > b.time ? a : b;
    return null;
  }

  /**
   * Returns the later of two date and time objects.
   *
   * @param {DateTime} a The first date and time object.
   * @param {DateTime} b The second date and time object.
   * @returns {DateTime | null} The date and time with the latest time value.
   */
  static max(a, b) {
    if (a instanceof DateTime && b instanceof DateTime) return a.time < b.time ? a : b;
    return null;
  }

  /**
   * Checks if two date and time objects are equal.
   *
   * @param {DateTime} a The first date and time object.
   * @param {DateTime} b The second date and time object.
   * @returns {boolean} Whether both date and time objects are equal.
   */
  static equals(a, b) {
    return a instanceof DateTime && a.equals(b);
  }

  /**
   * Gets the current time in in milliseconds since the Unix epoch.
   *
   * @returns {number} The time in in milliseconds since the Unix epoch.
   */
  static now() {
    return new DateTime().time;
  }

  /**
   * Creates a new DateTime instance.
   *
   * @param {Date|number|string|DateTime|Intl.DateTimeFormatOptions} [arg1] - The date and time value or options.
   * @param {Intl.DateTimeFormatOptions} [arg2] - The options for the date and time.
   */
  constructor(arg1, arg2) {
    if (arg1) {
      if (typeof arg1 === "string" || typeof arg1 === "number") this.#instance = new Date(arg1);
      else if (arg1 instanceof Date) this.#instance = new Date(arg1);
      else if (arg1 instanceof DateTime) {
        this.#instance = arg1.date;
        Object.assign(this.#options, arg1.options);
      } else ((arg2 = arg1), (this.#instance = new Date()));
    } else this.#instance = new Date();
    if (typeof arg2 === "object") Object.assign(this.#options, arg2);
  }

  /**
   * @returns {number} The year of the date and time.
   */
  get year() {
    return this.#instance.getFullYear();
  }

  /**
   * @param {number} value - The new year of the date and time.
   */
  set year(value) {
    this.#instance.setFullYear(value);
  }

  /**
   * @returns {number} The month of the date and time.
   */
  get month() {
    return this.#instance.getMonth();
  }

  /**
   * @param {number} value - The new month of the date and time.
   */
  set month(value) {
    this.#instance.setMonth(value);
  }

  /**
   * @returns {number} The day of the month of the date and time.
   */
  get day() {
    return this.#instance.getDate();
  }

  /**
   * @param {number} value - The new day of the month of the date and time.
   */
  set day(value) {
    this.#instance.setDate(value);
  }

  /**
   * @returns {number} The hours of the date and time.
   */
  get hours() {
    return this.#instance.getHours();
  }

  /**
   * @param {number} value - The new hours of the date and time.
   */
  set hours(value) {
    this.#instance.setHours(value);
  }

  /**
   * @returns {number} The minutes of the date and time.
   */
  get minutes() {
    return this.#instance.getMinutes();
  }

  /**
   * @param {number} value - The new minutes of the date and time.
   */
  set minutes(value) {
    this.#instance.setMinutes(value);
  }

  /**
   * @returns {number} The seconds of the date and time.
   */
  get seconds() {
    return this.#instance.getSeconds();
  }

  /**
   * @param {number} value - The new seconds of the date and time.
   */
  set seconds(value) {
    this.#instance.setSeconds(value);
  }

  /**
   * @returns {Date} A Date object representing the current date and time.
   */
  get date() {
    return new Date(this.#instance);
  }

  /**
   * @returns {Intl.DateTimeFormatOptions} The date and time format options.
   */
  get options() {
    return this.#options;
  }

  /**
   * @returns {number} The time in in milliseconds since the Unix epoch.
   */
  get time() {
    return this.#instance.getTime();
  }

  /**
   * Gets the ISO 8601 formatted date and time.
   *
   * @returns {string} The ISO 8601 formatted date and time.
   */
  toISOString() {
    return this.#instance.toISOString();
  }

  /**
   * Formats the date according to the default or the specified locales.
   *
   * @param {string} [locales] - The locale to use for formatting.
   * @returns {string} The formatted date and time.
   */
  toString(locales) {
    return new Intl.DateTimeFormat(locales || getLang(), this.#options).format(this.#instance);
  }

  /**
   * Formats the date according to the default or the specified options.
   *
   * @param {LocaleOptions & Intl.DateTimeFormatOptions} [options] - The Intl.DateTimeFormat options object.
   * @returns {string} The formatted date and time.
   */
  format(options) {
    const locales = options?.locales || getLang();
    return new Intl.DateTimeFormat(locales, options).format(this.#instance);
  }

  /**
   * Checks whether the date and time is equal to the target date and time.
   *
   * @param {DateTime} target - Comparison target.
   * @returns {boolean} Whether the date and time is equal to the target date and time.
   */
  equals(target) {
    const formatter = new Intl.DateTimeFormat(getLang(), this.#options);
    return target instanceof DateTime && formatter.format(this.#instance) === formatter.format(target.date);
  }

  /**
   * Creates a deep copy of the current DateTime object.
   *
   * @returns {DateTime} A new date and time object that is a clone of the current object.
   */
  clone() {
    return new DateTime(this.#instance, this.#options);
  }

  /**
   * Calculates the difference between two date and times (e.g., years, months, days, hours, minutes, seconds).
   *
   * @param {DateTime} target - The target date and time.
   * @param {string} output - The output format.
   * @param {boolean} [float] - Whether to use floating-point numbers.
   * @returns {number | null} The difference between the two date and times.
   */
  diff(target, output, float) {
    if (!(target instanceof DateTime)) return null;
    const format = (input) => (float ? input : Math.floor(input));
    let result = this.time - target.time;
    if (output?.startsWith("year")) result = this.year - target.year;
    else if (output?.startsWith("month")) result = (target.year - this.year) * 12 - this.month + target.month;
    else if (output?.startsWith("week")) result = result / (1000 * 60 * 60 * 24 * 7);
    else if (output?.startsWith("day")) result = result / (1000 * 60 * 60 * 24);
    else if (output?.startsWith("hour")) result = result / (1000 * 60 * 60);
    else if (output?.startsWith("minute")) result = result / (1000 * 60);
    else if (output?.startsWith("second")) result = result / 1000;
    return format(result);
  }

  /**
   * Gets the relative time from the reference date (e.g., "just now", "in an hour", etc.).
   *
   * @param {RelativeOptions & Intl.RelativeTimeFormatOptions} options - The options for relative time calculations.
   * @returns {string} The relative time from the reference date.
   */
  relative(options) {
    const from = options?.from || new Date();
    const locales = options?.locales || getLang();
    const formatter = new Intl.RelativeTimeFormat(locales, options);
    const diff = this.#instance.getTime() - this.#instance.getTimezoneOffset() * 60000 - (from.getTime() - from.getTimezoneOffset() * 60000);
    if (Math.abs(diff) > WEEK_IN_MILLIS) return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), "week");
    else if (Math.abs(diff) > DAY_IN_MILLIS) return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), "day");
    else if (Math.abs(diff) > HOUR_IN_MILLIS) return formatter.format(Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS), "hour");
    else if (Math.abs(diff) > MIN_IN_MILLIS) return formatter.format(Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS), "minute");
    else if (Math.abs(diff) > SEC_IN_MILLIS) return formatter.format(Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS), "second");
    return "just now";
  }
}

/**
 * Creates a new date and time object with default date format.
 *
 * @param {Date|number|string|DateTime} [value] - The date and time value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {DateTime} A new date and time object.
 */
export const date = (value, options) =>
  new DateTime(
    value,
    // @ts-ignore
    Object.assign(options, { dateStyle: "short", timeStyle: undefined }),
  );

/**
 * Creates a new date and time object with default time format.
 *
 * @param {Date|number|string|DateTime} [value] - The date and time value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {DateTime} A new date and time object.
 */
export const time = (value, options) =>
  new DateTime(
    value,
    // @ts-ignore
    Object.assign(options, { dateStyle: undefined, timeStyle: "short" }),
  );

/**
 * Transforms a date value or string value into a formatted string.
 *
 * @param {Date|number|string|DateTime} [value] - The date value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the date .
 * @returns {String} The formatted date.
 */
export const formatDate = (value, options = { dateStyle: "short", timeStyle: null }) => {
  if (value instanceof DateTime) return value.format(options);
  return new DateTime(value, options).format(options);
};

/**
 * Transforms a time value or string value into a formatted string.
 *
 * @param {Date|number|string|DateTime} [value] - The time value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the time.
 * @returns {String} The formatted time.
 */
export const formatTime = (value, options = { dateStyle: null, timeStyle: "short" }) => {
  if (value instanceof DateTime) return value.format(options);
  return new DateTime(value, options).format(options);
};

/**
 * Transforms a date and time value or string value into a formatted string.
 *
 * @param {Date|number|string|DateTime} [value] - The date and time value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {String} The formatted date and time.
 */
export const formatDateTime = (value, options = { dateStyle: "short", timeStyle: "short" }) => {
  if (value instanceof DateTime) return value.format(options);
  return new DateTime(value, options).format(options);
};

export default DateTime;

//

function getLang() {
  if (typeof navigator === "undefined") return undefined;
  if (navigator.languages != undefined) return navigator.languages;
  return navigator?.language;
}
