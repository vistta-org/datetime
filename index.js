// @ts-check

/**
 * @typedef {Intl.DateTimeFormatOptions & {
 *   locales?: string|string[],
 *   firstDayOfWeek?: "mon"|"tue"|"wed"|"wen"|"thu"|"fri"|"sat"|"sun"
 * }} DateTimeFormatOptions
 */

/**
 * @typedef {number|number[]|string|Date|DateTime} DateTimeValue
 */

/**
 * @typedef {"year"|"month"|"week"|"day"|"hour"|"minute"|"second"|"millisecond"} DateTimeUnit
 */

/**
 * @typedef {Exclude<DateTimeUnit, "week">} DateTimeField
 */

/**
 * @typedef {Intl.RelativeTimeFormatOptions & { locales?: string|string[], from?: Date }} RelativeOptions
 */

const WEEK_IN_MILLIS = 6.048e8;
const DAY_IN_MILLIS = 8.64e7;
const HOUR_IN_MILLIS = 3.6e6;
const MIN_IN_MILLIS = 6e4;
const SEC_IN_MILLIS = 1e3;
const WEEKDAY_INDEX = { sun: 0, mon: 1, tue: 2, wed: 3, wen: 3, thu: 4, fri: 5, sat: 6 };
/** @type {DateTimeUnit[]} */
const UNITS = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];

/**
 * A class representing a date and time.
 */
export class DateTime {
  /** @type {DateTimeFormatOptions} */
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
    if (a instanceof DateTime && b instanceof DateTime) {
      a.#assertValid();
      b.#assertValid();
      return a.time < b.time ? a : b;
    }
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
    if (a instanceof DateTime && b instanceof DateTime) {
      a.#assertValid();
      b.#assertValid();
      return a.time > b.time ? a : b;
    }
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
   * @param {DateTimeValue|DateTimeFormatOptions|null} [value] - The date and time value or options.
   * @param {DateTimeFormatOptions} [options] - The options for the date and time.
   */
  constructor(value, options) {
    if (
      value !== null &&
      typeof value === "object" &&
      !(value instanceof Date) &&
      !(value instanceof DateTime) &&
      !Array.isArray(value)
    )
      options = value;
    switch (typeof value) {
      case "object":
        if (Array.isArray(value)) {
          const [year, month, day = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = value;
          this.#instance =
            value.length === 0
              ? new Date()
              : value.length === 1
                ? new Date(year)
                : new Date(year, month, day, hours, minutes, seconds, milliseconds);
        } else if (value instanceof DateTime) this.#instance = new Date(value.date);
        else if (value instanceof Date) this.#instance = new Date(value);
        else this.#instance = new Date();
        break;
      case "string":
      case "number":
        this.#instance = new Date(value);
        break;
      default:
        this.#instance = new Date();
    }
    Object.assign(this.#options, options);
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
   * @returns {number} The milliseconds of the date and time.
   */
  get milliseconds() {
    return this.#instance.getMilliseconds();
  }

  /**
   * @param {number} value - The new milliseconds of the date and time.
   */
  set milliseconds(value) {
    this.#instance.setMilliseconds(value);
  }

  /**
   * @returns {Date} A Date object representing the current date and time.
   */
  get date() {
    return new Date(this.#instance);
  }

  /**
   * @returns {DateTimeFormatOptions} The date and time format options.
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
   * @returns {number} The day of the week of the date and time (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
   */
  get weekday() {
    return this.#instance.getDay();
  }

  /**
   * @returns {boolean} Whether the underlying date is valid.
   */
  isValid() {
    return !Number.isNaN(this.time);
  }

  #assertValid() {
    if (!this.isValid()) throw new RangeError("Invalid date and time");
  }

  #firstDayOfWeek() {
    const weekday = this.#options.firstDayOfWeek ?? "sun";
    if (!Object.hasOwn(WEEKDAY_INDEX, weekday)) throw new RangeError(`Invalid first day of week: ${weekday}`);
    return WEEKDAY_INDEX[weekday];
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
   * Gets the ISO 8601 formatted date and time in local time.
   *
   * @returns {string} The local ISO 8601 formatted date and time.
   */
  toLocalISOString() {
    this.#assertValid();
    const y =
      this.year >= 0 && this.year <= 9999
        ? String(this.year).padStart(4, "0")
        : `${this.year < 0 ? "-" : "+"}${String(Math.abs(this.year)).padStart(6, "0")}`;
    const m = String(this.month + 1).padStart(2, "0");
    const d = String(this.day).padStart(2, "0");
    const h = String(this.hours).padStart(2, "0");
    const min = String(this.minutes).padStart(2, "0");
    const s = String(this.seconds).padStart(2, "0");
    const ms = String(this.milliseconds).padStart(3, "0");
    return `${y}-${m}-${d}T${h}:${min}:${s}.${ms}`;
  }

  /**
   * Formats the date according to the default or the specified locales.
   *
   * @param {string|string[]} [locales] - The locale to use for formatting.
   * @returns {string} The formatted date and time.
   */
  toString(locales) {
    return this.format(locales === undefined ? undefined : { locales });
  }

  /**
   * Formats the date according to the default or the specified options.
   *
   * @param {DateTimeFormatOptions} [options] - The Intl.DateTimeFormat options object.
   * @returns {string} The formatted date and time.
   */
  format(options) {
    const resolved = mergeFormatOptions(this.#options, options);
    return new Intl.DateTimeFormat(resolved.locales ?? getLang(), resolved).format(this.#instance);
  }

  /**
   * Checks whether the date and time is equal to the target date and time.
   *
   * @param {DateTime} target - Comparison target.
   * @param {Object} [options] - The comparison options.
   * @param {DateTimeUnit} [options.precision] - The finest unit to compare.
   * @param {DateTimeField[]} [options.exclude] - The fields to exclude from the comparison.
   * @returns {boolean} Whether the date and time is equal to the target date and time.
   */
  equals(target, options) {
    if (!(target instanceof DateTime)) return false;
    if (!this.isValid() || !target.isValid()) return false;
    const { precision, exclude } = options || {};
    if (precision) assertUnit(precision);
    if (exclude) {
      for (const unit of exclude) {
        assertUnit(unit);
        if (!["year", "month", "day", "hour", "minute", "second", "millisecond"].includes(unit))
          throw new RangeError("Week is not a comparison field");
      }
    }
    if (precision === "week") {
      if (exclude?.length) throw new RangeError("Week precision cannot be combined with excluded fields");
      const firstDayOfWeek = this.#options.firstDayOfWeek;
      const other = new DateTime(target.date, { firstDayOfWeek });
      return this.clone().startOf("week").time === other.startOf("week").time;
    }
    if (precision || exclude) {
      /** @type {[DateTimeField, number, number][]} */
      const fields = [
        ["year", this.year, target.year],
        ["month", this.month, target.month],
        ["day", this.day, target.day],
        ["hour", this.hours, target.hours],
        ["minute", this.minutes, target.minutes],
        ["second", this.seconds, target.seconds],
        ["millisecond", this.milliseconds, target.milliseconds],
      ];
      const last = precision ? fields.findIndex(([unit]) => unit === precision) : 5;
      return fields.slice(0, last + 1).every(([unit, a, b]) => (!exclude?.includes(unit) ? a === b : true));
    }
    return this.time === target.time;
  }

  /**
   * Checks whether the date and time is equal to the current time, comparing
   * all fields down to the specified precision (inclusive). Fields finer than
   * the precision are ignored.
   *
   * @param {DateTimeUnit} [precision] - The finest unit to compare.
   * @returns {boolean} Whether the date and time matches the current time.
   */
  isNow(precision) {
    return this.equals(new DateTime(), { precision });
  }

  /**
   * Creates an independent date with a shallow copy of the options.
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
   * @param {DateTimeUnit | `${DateTimeUnit}s`} [output] - The output unit; defaults to milliseconds.
   * @param {boolean} [float] - Whether to use floating-point numbers.
   * @returns {number | null} The difference between the two date and times.
   */
  diff(target, output, float) {
    if (!(target instanceof DateTime)) return null;
    this.#assertValid();
    target.#assertValid();
    const unit = output?.replace(/s$/, "") ?? "millisecond";
    assertUnit(unit);
    let result = this.time - target.time;
    if (unit === "year") result = this.year - target.year;
    else if (unit === "month") result = (this.year - target.year) * 12 + this.month - target.month;
    else if (unit === "week") result /= WEEK_IN_MILLIS;
    else if (unit === "day") result /= DAY_IN_MILLIS;
    else if (unit === "hour") result /= HOUR_IN_MILLIS;
    else if (unit === "minute") result /= MIN_IN_MILLIS;
    else if (unit === "second") result /= SEC_IN_MILLIS;
    return float ? result : Math.floor(result);
  }

  /**
   * Gets the relative time from the reference date (e.g., "just now", "in an hour", etc.).
   *
   * @param {RelativeOptions} [options] - The options for relative time calculations.
   * @returns {string} The relative time from the reference date.
   */
  relative(options) {
    this.#assertValid();
    const from = options?.from || new Date();
    if (!(from instanceof Date) || Number.isNaN(from.getTime())) throw new RangeError("Invalid reference date");
    const locales = options?.locales ?? this.#options.locales ?? getLang();
    const formatter = new Intl.RelativeTimeFormat(locales, options);
    const diff = this.time - from.getTime();
    if (Math.abs(diff) >= WEEK_IN_MILLIS) return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), "week");
    else if (Math.abs(diff) >= DAY_IN_MILLIS) return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), "day");
    else if (Math.abs(diff) >= HOUR_IN_MILLIS) return formatter.format(Math.trunc(diff / HOUR_IN_MILLIS), "hour");
    else if (Math.abs(diff) >= MIN_IN_MILLIS) return formatter.format(Math.trunc(diff / MIN_IN_MILLIS), "minute");
    else if (Math.abs(diff) >= SEC_IN_MILLIS) return formatter.format(Math.trunc(diff / SEC_IN_MILLIS), "second");
    return new Intl.RelativeTimeFormat(locales, { ...options, numeric: options?.numeric ?? "auto" }).format(0, "second");
  }

  /**
   * Adds the specified value in the specified unit to the date and time (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to add the value in.
   * @param {number} value The value to add.
   * @returns {DateTime} The updated date and time object.
   */
  add(unit, value = 1) {
    assertUnit(unit);
    this.#assertValid();
    if (!Number.isFinite(value)) throw new RangeError("Date arithmetic requires a finite value");
    switch (unit) {
      case "year":
        this.#moveMonth("year", value);
        break;
      case "month":
        this.#moveMonth("month", value);
        break;
      case "week":
        this.#instance.setDate(this.day + value * 7);
        break;
      case "day":
        this.#instance.setDate(this.day + value);
        break;
      case "hour":
        this.#instance.setHours(this.hours + value);
        break;
      case "minute":
        this.#instance.setMinutes(this.minutes + value);
        break;
      case "second":
        this.#instance.setSeconds(this.seconds + value);
        break;
      case "millisecond":
        this.#instance.setMilliseconds(this.milliseconds + value);
        break;
    }
    this.#assertValid();
    return this;
  }

  /**
   * @param {"year"|"month"} unit
   * @param {number} value
   */
  #moveMonth(unit, value) {
    const day = this.day;
    if (unit === "year") this.#instance.setFullYear(this.year + value, this.month, 1);
    else this.#instance.setMonth(this.month + value, 1);
    const last = new Date(this.#instance);
    last.setMonth(last.getMonth() + 1, 0);
    this.#instance.setDate(Math.min(day, last.getDate()));
  }

  /**
   * Subtracts the specified value in the specified unit from the date and time (e.g., year, month, day, hour, minute, second).
   * @param {number} value The value to subtract.
   * @param {DateTimeUnit} unit The unit to subtract the value in.
   * @returns {DateTime} The updated date and time object.
   */
  subtract(unit, value = 1) {
    return this.add(unit, -value);
  }

  /**
   * Sets the date and time to the start of the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to set the date and time to the start of.
   * @returns {DateTime} The updated date and time object.
   */
  startOf(unit) {
    assertUnit(unit);
    this.#assertValid();
    switch (unit) {
      case "year":
        this.#instance.setMonth(0, 1);
      // falls through
      case "month":
        this.#instance.setDate(1);
      // falls through
      case "day":
        this.#instance.setHours(0);
      // falls through
      case "hour":
        this.#instance.setMinutes(0);
      // falls through
      case "minute":
        this.#instance.setSeconds(0);
      // falls through
      case "second":
        this.#instance.setMilliseconds(0);
        break;
      case "week":
        var firstDayOfWeek = this.#firstDayOfWeek();
        var weekday = this.weekday;
        this.#instance.setDate(this.day - ((weekday - firstDayOfWeek + 7) % 7));
        this.#instance.setHours(0);
        this.#instance.setMinutes(0);
        this.#instance.setSeconds(0);
        this.#instance.setMilliseconds(0);
        break;
    }
    return this;
  }

  /**
   * Sets the date and time to the end of the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to set the date and time to the end of.
   * @returns {DateTime} The updated date and time object.
   */
  endOf(unit) {
    assertUnit(unit);
    this.#assertValid();
    switch (unit) {
      case "year":
        this.#instance.setMonth(11);
      // falls through
      case "month":
        this.#instance.setDate(new Date(this.year, this.month + 1, 0).getDate());
      // falls through
      case "day":
        this.#instance.setHours(23);
      // falls through
      case "hour":
        this.#instance.setMinutes(59);
      // falls through
      case "minute":
        this.#instance.setSeconds(59);
      // falls through
      case "second":
        this.#instance.setMilliseconds(999);
        break;
      case "week":
        var firstDayOfWeek = this.#firstDayOfWeek();
        var weekday = this.weekday;
        this.#instance.setDate(this.day + 6 - ((weekday - firstDayOfWeek + 7) % 7));
        this.#instance.setHours(23);
        this.#instance.setMinutes(59);
        this.#instance.setSeconds(59);
        this.#instance.setMilliseconds(999);
        break;
    }
    return this;
  }

  /**
   * Moves the date and time forward by the specified step in the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to move the date and time by.
   * @param {number} step The number of units to move the date and time by (positive or negative).
   * @returns {DateTime} The updated date and time object.
   */
  next(unit, step = 1) {
    return this.add(unit, step);
  }

  /**
   * Moves the date and time backward by the specified step in the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to move the date and time by.
   * @param {number} step The number of units to move the date and time by (positive or negative).
   * @returns {DateTime} The updated date and time object.
   */
  previous(unit, step = 1) {
    return this.next(unit, -step);
  }
}

/**
 * Creates a new date and time object with default date format.
 *
 * @param {DateTimeValue} [value] - The date and time value.
 * @param {DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {DateTime} A new date and time object.
 */
export const date = (value, options = {}) =>
  new DateTime(value, mergeFormatOptions({ dateStyle: "short", timeStyle: undefined }, options));

/**
 * Creates a new date and time object with default time format.
 *
 * @param {DateTimeValue} [value] - The date and time value.
 * @param {DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {DateTime} A new date and time object.
 */
export const time = (value, options = {}) =>
  new DateTime(value, mergeFormatOptions({ dateStyle: undefined, timeStyle: "short" }, options));

/**
 * Transforms a date value or string value into a formatted string.
 *
 * @param {DateTimeValue} [value] - The date value.
 * @param {DateTimeFormatOptions} [options] - The options for the date .
 * @returns {String} The formatted date.
 */
export const formatDate = (value, options) => {
  const resolved = mergeFormatOptions({ dateStyle: "short", timeStyle: undefined }, options);
  if (value instanceof DateTime) return value.format(resolved);
  return new DateTime(value).format(resolved);
};

/**
 * Transforms a time value or string value into a formatted string.
 *
 * @param {DateTimeValue} [value] - The time value.
 * @param {DateTimeFormatOptions} [options] - The options for the time.
 * @returns {String} The formatted time.
 */
export const formatTime = (value, options) => {
  const resolved = mergeFormatOptions({ dateStyle: undefined, timeStyle: "short" }, options);
  if (value instanceof DateTime) return value.format(resolved);
  return new DateTime(value).format(resolved);
};

/**
 * Transforms a date and time value or string value into a formatted string.
 *
 * @param {DateTimeValue} [value] - The date and time value.
 * @param {DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {String} The formatted date and time.
 */
export const formatDateTime = (value, options) => {
  const resolved = mergeFormatOptions({ dateStyle: "short", timeStyle: "short" }, options);
  if (value instanceof DateTime) return value.format(resolved);
  return new DateTime(value).format(resolved);
};

export default DateTime;

//

/**
 * @param {string} unit
 * @returns {asserts unit is DateTimeUnit}
 */
function assertUnit(unit) {
  if (!UNITS.some((known) => known === unit)) throw new RangeError(`Invalid date and time unit: ${unit}`);
}

/** @type {(keyof Intl.DateTimeFormatOptions)[]} */
const FORMAT_FIELDS = [
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "dayPeriod",
  "hour",
  "minute",
  "second",
  "fractionalSecondDigits",
  "timeZoneName",
];

/**
 * @param {DateTimeFormatOptions} defaults
 * @param {DateTimeFormatOptions} [overrides]
 * @returns {DateTimeFormatOptions}
 */
function mergeFormatOptions(defaults, overrides) {
  const resolved = { ...defaults };
  // Intl styles and individual fields cannot be combined.
  if (FORMAT_FIELDS.some((field) => overrides?.[field] !== undefined)) {
    delete resolved.dateStyle;
    delete resolved.timeStyle;
  } else if (overrides?.dateStyle !== undefined || overrides?.timeStyle !== undefined) {
    for (const field of FORMAT_FIELDS) delete resolved[field];
  }
  return Object.assign(resolved, overrides);
}

function getLang() {
  if (typeof navigator === "undefined") return undefined;
  if (navigator.languages != undefined) return navigator.languages;
  return navigator?.language;
}
