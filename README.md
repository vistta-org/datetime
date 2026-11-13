# **VISTTA DateTime Library**

This library provides a convenient and flexible way to work with dates and times in JavaScript. It offers a `DateTime` class with various methods for formatting, comparison, and relative time calculations.

## **Getting Started**

### **Install**

```sh
npm install @vistta/datetime
```

### **Usage**

```javascript
import { DateTime, date, time } from "@vistta/datetime";
// Create a new DateTime object with default date format
const date1 = new DateTime();

// Create a new DateTime object with default date format
const date2 = date();

// Create a new DateTime object with custom time format
const time1 = new DateTime(null, { hour: "numeric", minute: "numeric" });

// Create a new DateTime object with default time format
const time2 = time();

// Compare two DateTime objects for equality
if (DateTime.equals(date1, date2)) {
  // Date and time values are equal
}

// Calculate the difference between two dates in days
const daysDifference = date1.diff(date2, "day");

// Get the relative time from reference date
const relativeTime = date1.relative({ from: new Date() });

// Format the date and time with locale options
const formattedDate = date1.toString("en-US");
```

## **Behavior**

- Numbers are Unix timestamps in **milliseconds**. Array inputs follow native `Date` arguments, including zero-based months.
- `add`, `subtract`, `next`, `previous`, `startOf`, and `endOf` mutate the instance and return it. Use `clone()` to retain the original.
- Month/year arithmetic clamps to the last valid day: January 31 + one month becomes February 28/29; February 29 + one year becomes February 28. Adding a month again uses the clamped day, not the original day. Direct property setters retain native `Date` overflow behavior.
- Day/week additions use local calendar arithmetic. A calendar day can span 23 or 25 hours across daylight-saving changes. Hour/minute/second additions also use native local setters; add milliseconds for an exact elapsed duration.
- `diff()` measures elapsed time for weeks through milliseconds. Year/month differences compare calendar fields, not complete elapsed years/months. Singular and plural units are supported. Omitting the unit returns milliseconds; `float: false` (the default) floors the result, including negative values.
- `relative()` measures elapsed time without timezone-offset adjustments. It selects units at exact thresholds and uses weeks for longer intervals. Subsecond differences are localized using `numeric: "auto"` unless explicitly overridden.
- `firstDayOfWeek` defaults to `"sun"`. Use `"wed"` for Wednesday; the legacy `"wen"` spelling remains supported.
- `equals()` and `isNow()` default to exact timestamp equality. `precision` compares calendar fields through that unit, including milliseconds. `precision: "week"` compares local week boundaries using the receiver's week-start option and cannot be combined with `exclude`. With `exclude` alone, comparison retains the historical second-level precision.
- Formatting `timeZone` affects display only, not getters, calendar arithmetic, or week boundaries.
- Invalid inputs remain inspectable with `isValid()`. Invalid dates throw `RangeError` during formatting, arithmetic, boundaries, relative calculations, differences, and min/max comparisons. Equality with an invalid date returns `false`. Unsupported operation units and invalid week-start options throw `RangeError`.

### **Formatting options**

`format()` inherits instance options; per-call options override them without mutating either options object. `toString(locales)` uses the same defaults.

```javascript
const value = new DateTime([2024, 0, 31, 12], { locales: "pt-PT", dateStyle: "long" });
value.format(); // Uses the stored locale and date style.
value.format({ locales: "en-GB" }); // Overrides only the locale.
value.format({ hour: "2-digit", minute: "2-digit" }); // Formats time fields instead of the inherited date style.
value.clone().add("month"); // February 29, without changing value.
```

Individual formatting fields clear inherited `dateStyle`/`timeStyle`; explicit styles clear inherited individual fields. Explicitly incompatible options still produce native `Intl` errors. Use `undefined` to clear an inherited option.

The `date`, `time`, and formatting helpers merge short-style defaults with caller options. Custom styles and individual fields override those defaults; caller options are never mutated.

### **Compatibility notes**

This update fixes reversed `min`/`max`, month-difference signs, configurable week boundaries, and relative-time thresholds. It intentionally changes month/year overflow to clamping, makes `format()` inherit stored options, localizes the former hardcoded `"just now"` (English now renders `"now"`), and makes millisecond boundaries no-ops. Invalid arithmetic/differences and unknown units now throw instead of returning `NaN` or silently doing nothing.

### **TypeScript and tests**

Main and global imports include declarations; no `allowJs` configuration is required. Public option/unit types are exported from `@vistta/datetime`.

From this package in the workspace, run `npm test`. Tests cover exact thresholds, all week starts, leap years, month ends, a fixed clock, Lisbon DST transitions, and strict TypeScript consumers.

You can also make DateTime available globally by using

```javascript
import "@vistta/datetime/global";
// Create a new DateTime object with default date format
const date = new DateTime();
```

## **API**

```typescript
/**
 * Creates a new date and time object with default date format.
 *
 * @param {Date|number|string|DateTime} [value] - The date and time value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {DateTime} A new date and time object.
 */
function date(value, options);

/**
 * Creates a new date and time object with default time format.
 *
 * @param {Date|number|string|DateTime} [value] - The date and time value.
 * @param {Intl.DateTimeFormatOptions} [options] - The options for the date and time.
 * @returns {DateTime} A new date and time object.
 */
function time(value, options);

/**
 * A class representing a date and time.
 */
class DateTime {
  /**
   * Returns the earlier of two date and time objects.
   *
   * @param {DateTime} a The first date and time object.
   * @param {DateTime} b The second date and time object.
   * @returns {DateTime | null} The date and time with the earliest time value.
   */
  static min(a, b);

  /**
   * Returns the later of two date and time objects.
   *
   * @param {DateTime} a The first date and time object.
   * @param {DateTime} b The second date and time object.
   * @returns {DateTime | null} The date and time with the latest time value.
   */
  static max(a, b);

  /**
   * Checks if two date and time objects are equal.
   *
   * @param {DateTime} a The first date and time object.
   * @param {DateTime} b The second date and time object.
   * @returns {boolean} Whether both date and time objects are equal.
   */
  static equals(a, b);

  /**
   * Gets the current time in in milliseconds since the Unix epoch.
   *
   * @returns {number} The time in in milliseconds since the Unix epoch.
   */
  static now();

  /**
   * Creates a new DateTime instance.
   *
   * @param {Date|number|string|DateTime} [value] - The date and time value.
   * @param {Intl.DateTimeFormatOptions} [options] - The options for the date and time.
   */
  constructor(value, options);

  /**
   * @returns {number} The year of the date and time.
   */
  get year();

  /**
   * @param {number} value - The new year of the date and time.
   */
  set year(value);

  /**
   * @returns {number} The month of the date and time.
   */
  get month();

  /**
   * @param {number} value - The new month of the date and time.
   */
  set month(value);

  /**
   * @returns {number} The day of the month of the date and time.
   */
  get day();

  /**
   * @param {number} value - The new day of the month of the date and time.
   */
  set day(value);

  /**
   * @returns {number} The hour of the date and time.
   */
  get hours();

  /**
   * @param {number} value - The new hour of the date and time.
   */
  set hours(value);

  /**
   * @returns {number} The minute of the date and time.
   */
  get minutes();

  /**
   * @param {number} value - The new minute of the date and time.
   */
  set minutes(value);

  get seconds();
  set seconds(value);
  get milliseconds();
  set milliseconds(value);
  get weekday();

  /**
   * Whether the underlying date is valid.
   */
  isValid();

  /**
   * @returns {Date} A Date object representing the current date and time.
   */
  get date();

  /**
   * @returns {Intl.DateTimeFormatOptions} The date and time format options.
   */
  get options();

  /**
   * @returns {number} The time in in milliseconds since the Unix epoch.
   */
  get time();

  /**
   * Gets the ISO 8601 formatted date and time in UTC.
   *
   * @returns {string} The ISO 8601 formatted date and time.
   */
  toISOString();

  /**
   * Gets the ISO 8601 formatted date and time in local time.
   *
   * @returns {string} The local ISO 8601 formatted date and time.
   */
  toLocalISOString();

  /**
   * Formats the date according to the default or the specified locales.
   *
   * @param {string} [locales] - The locale to use for formatting.
   * @returns {string} The formatted date and time.
   */
  toString(locales);

  /**
   * Formats the date according to the default or the specified options.
   *
   * @param {DateTimeFormatOptions} [options] - Overrides for stored formatting options.
   * @returns {string} The formatted date and time.
   */
  format(options);

  /**
   * Checks whether the date and time is equal to the target date and time.
   *
   * @param {DateTime} target - Comparison target.
   * @param {Object} [options] - The comparison options.
   * @param {DateTimeUnit} [options.precision] - The finest unit to compare.
   * @param {DateTimeField[]} [options.exclude] - The fields to exclude from the comparison.
   * @returns {boolean} Whether the date and time is equal to the target date and time.
   */
  equals(target, options);

  /**
   * Checks whether the date and time is equal to the current time, comparing
   * all fields down to the specified precision (inclusive). Finer fields are ignored.
   *
   * @param {DateTimeUnit} [precision] - The finest unit to compare.
   * @returns {boolean} Whether the date and time matches the current time.
   */
  isNow(precision);

  /**
   * Creates an independent date with a shallow copy of its options.
   *
   * @returns {DateTime} A new date and time object that is a clone of the current object.
   */
  clone();

  /**
   * Calculates the difference between two date and times (e.g., years, months, days, hours, minutes, seconds).
   *
   * @param {DateTime} target - The target date and time.
   * @param {DateTimeUnit | `${DateTimeUnit}s`} [output] - The output unit; defaults to milliseconds.
   * @param {boolean} [float] - Whether to use floating-point numbers.
   * @returns {number | null} The difference between the two date and times.
   */
  diff(target, output, float);

  /**
   * Gets the relative time from the reference date (e.g., "just now", "in an hour", etc.).
   *
   * @param {RelativeOptions} [options] - Intl relative options plus locales and a reference Date.
   * @returns {string} The relative time from the reference date.
   */
  relative(options);

  /**
   * Adds the specified value in the specified unit to the date and time (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to add the value in.
   * @param {number} value The value to add.
   * @returns {DateTime} The updated date and time object.
   */
  add(unit, value = 1);

  /**
   * Subtracts the specified value in the specified unit from the date and time (e.g., year, month, day, hour, minute, second).
   * @param {number} value The value to subtract.
   * @param {DateTimeUnit} unit The unit to subtract the value in.
   * @returns {DateTime} The updated date and time object.
   */
  subtract(unit, value = 1);

  /**
   * Sets the date and time to the start of the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to set the date and time to the start of.
   * @returns {DateTime} The updated date and time object.
   */
  startOf(unit);

  /**
   * Sets the date and time to the end of the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to set the date and time to the end of.
   * @returns {DateTime} The updated date and time object.
   */
  endOf(unit);

  /**
   * Moves the date and time forward by the specified step in the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to move the date and time by.
   * @param {number} step The number of units to move the date and time by (positive or negative).
   * @returns {DateTime} The updated date and time object.
   */
  next(unit, step = 1);

  /**
   * Moves the date and time backward by the specified step in the specified unit (e.g., year, month, day, hour, minute, second).
   * @param {DateTimeUnit} unit The unit to move the date and time by.
   * @param {number} step The number of units to move the date and time by (positive or negative).
   * @returns {DateTime} The updated date and time object.
   */
  previous(unit, step = 1);
}
```

## **License**

Licensed under the GNU General Public License version 3 only (`GPL-3.0-only`). See [LICENSE](LICENSE) for the full terms.

## **Contributing**

Thank you for your interest in contributing to this project! Please ensure that any contributions respect the licensing terms specified. If you encounter any issues or have suggestions, feel free to report them. All issues will be well received and addressed to the best of our ability. We appreciate your support and contributions!

### **Authors**

- [Tiago Terenas Almeida](https://github.com/tiagomta)
