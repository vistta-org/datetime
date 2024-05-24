# **Vistta Date-Time Library**

This library provides a convenient and flexible way to work with dates and times in JavaScript. It offers a `DateTime` class with various methods for formatting, comparison, and relative time calculations.

## **Getting Started**

### **Install**

```sh
npm install @vistta/date-time
```

### **Usage**

```javascript
import { DateTime, date, time } from "@vistta/date-time";
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

## **API**

Features

### **Getters/Setters**

The following getters are available:

- `year`: Returns and updates the year component of the date.
- `month`: Returns and updates the month component of the date.
- `day`: Returns and updates the day component of the date.
- `hours`: Returns and updates the hours component of the date.
- `minutes`: Returns and updates the minutes component of the date.
- `seconds`: Returns and updates the seconds component of the date.
- `milliseconds`: Returns and updates the milliseconds component of the date.

### **Properties**

The following properties are available:

- `date`: A Date object representing the current date and time.
- `options`: The date and time format options.
- `time`: The time in in milliseconds since the Unix epoch.

### **Instance Methods**

The following methods are available:

- `toISOString()`: Returns the date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.SSSZ).
- `toString(locales?)`: Formats the date according to the default or the specified locales.
- `format(options)`: Formats the date according to the default or specified options.
- `equals(target)`: Checks whether the date and time is equal to the target date and time.
- `clone()`: Creates a deep copy of the current DateTime object.
- `diff(target, output?, float?)`: Calculates the difference between two date and times (e.g., years, months, days, hours, minutes, seconds).
- `relative(options)`: Gets the relative time from the reference date (e.g., "just now", "in an hour", etc.).

### **Static Methods**

The following methods are available:

- `min(a, b)`: Returns the earlier of two date and time objects.
- `max(a, b)`: Returns the later of two date and time objects.
- `equals(a, b)`: Checks if two date and time objects are equal.

## **License**

Attribution-NonCommercial-NoDerivatives 4.0 International

## **Contributing**

Thank you for your interest in contributing to this project! Please ensure that any contributions respect the licensing terms specified. If you encounter any issues or have suggestions, feel free to report them. All issues will be well received and addressed to the best of our ability. We appreciate your support and contributions!

### **Authors**

- [Tiago Terenas Almeida](https://github.com/tiagomta)
