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
   * Gets the ISO 8601 formatted date and time.
   *
   * @returns {string} The ISO 8601 formatted date and time.
   */
  toISOString();

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
   * @param {LocaleOptions & Intl.DateTimeFormatOptions} [options] - The Intl.DateTimeFormat options object.
   * @returns {string} The formatted date and time.
   */
  format(options);

  /**
   * Checks whether the date and time is equal to the target date and time.
   *
   * @param {DateTime} target - Comparison target.
   * @returns {boolean} Whether the date and time is equal to the target date and time.
   */
  equals(target);

  /**
   * Creates a deep copy of the current DateTime object.
   *
   * @returns {DateTime} A new date and time object that is a clone of the current object.
   */
  clone();

  /**
   * Calculates the difference between two date and times (e.g., years, months, days, hours, minutes, seconds).
   *
   * @param {DateTime} target - The target date and time.
   * @param {string} output - The output format.
   * @param {boolean} [float] - Whether to use floating-point numbers.
   * @returns {number | null} The difference between the two date and times.
   */
  diff(target, output, float);

  /**
   * Gets the relative time from the reference date (e.g., "just now", "in an hour", etc.).
   *
   * @param {RelativeOptions & Intl.RelativeTimeFormatOptions} options - The options for relative time calculations.
   * @returns {string} The relative time from the reference date.
   */
  relative(options);
}
```

## **License**

Attribution-NonCommercial-NoDerivatives 4.0 International

## **Contributing**

Thank you for your interest in contributing to this project! Please ensure that any contributions respect the licensing terms specified. If you encounter any issues or have suggestions, feel free to report them. All issues will be well received and addressed to the best of our ability. We appreciate your support and contributions!

### **Authors**

- [Tiago Terenas Almeida](https://github.com/tiagomta)
