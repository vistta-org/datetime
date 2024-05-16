# **DateTime Library**

A lightweight JavaScript library for working with dates and times.

## **Features**

- Creates Date objects from strings, numbers, or existing Date objects
- Supports formatting and parsing of dates in various formats (ISO 8601, etc.)
- Provides methods for calculating time differences (years, months, days, hours, minutes, seconds)
- Offers relative date formatting (e.g., "just now", "in an hour", etc.)

## **Usage**

To use this library, simply import the `DateTime` class and create a new instance:

```javascript
import { DateTime } from "@vistta/date-time";
const now = new DateTime();
```

You can also pass in a value and options to customize the date object:

```javascript
const date = new DateTime("2022-01-01", { locale: "en-US" });
```

## **Getters/Setters**

The following getters are available:

- `year`: Returns and updates the year component of the date.
- `month`: Returns and updates the month component of the date.
- `day`: Returns and updates the day component of the date.
- `hours`: Returns and updates the hours component of the date.
- `minutes`: Returns and updates the minutes component of the date.
- `seconds`: Returns and updates the seconds component of the date.
- `milliseconds`: Returns and updates the milliseconds component of the date.
- `date`: Returns the current instance as a Date Class.
- `options`: Returns the current instance Intl.RelativeTimeFormatOptions.
- `time`: Returns the number of milliseconds for this date since the epoch.

## **Setters**

The following setters are available:

- `setYear(year)`: Sets the year component of the date.
- `setMonth(month)`: Sets the month component of the date.
- `setDay(day)`: Sets the day component of the date.
- `setHours(hours)`: Sets the hours component of the date.
- `setMinutes(minutes)`: Sets the minutes component of the date.
- `setSeconds(seconds)`: Sets the seconds component of the date.
- `setMilliseconds(milliseconds)`: Sets the milliseconds component of the date.

## **Properties**

The following properties are available:

- `date`: A readonly Date object representing the current date and time.
- `options`: A readonly Intl.RelativeTimeFormatOptions object representing the formatting options for the DateTime class.
- `time`: A readonly number representing the elapsed time in milliseconds since the Unix epoch.

## **Methods**

The following methods are available:

- `equals(target)`: Returns whether two dates are equal.
- `clone()`: Creates a deep copy of the current DateTime object.
- `toISOString()`: Returns the date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.SSSZ).
- `toString(locales?)`: Formats the date using the specified locales and options.
- `format(options)`: Formats the date according to the specified options.
- `diff(target, output?, float?)`: Calculates the difference between two dates in a specified unit of time (e.g., years, months, days, hours, minutes, seconds).
- `relative(options)`: Returns a relative date format string (e.g., "just now", "in an hour", etc.).

## **Class Static Methods**

The following methods are available:

- `min(a, b)`: Returns the smallest of two dates.
- `max(a, b)`: Returns the largest of two dates.
- `equals(a, b)`: Returns whether two dates are equal.

## **License**

This library is licensed under the CC BY-NC-ND 4.0 DEED License.

## **Contributing**

If you'd like to contribute to this library, please fork the repository and submit a pull request with your changes. We appreciate any feedback or suggestions!
