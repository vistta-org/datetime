export type DateTimeUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond";
export type DateTimeField = Exclude<DateTimeUnit, "week">;
export type DateTimeValue = number | number[] | string | Date | DateTime;
export type DateTimeFormatOptions = Intl.DateTimeFormatOptions & {
  locales?: string | string[];
  firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "wen" | "thu" | "fri" | "sat";
};
export type RelativeOptions = Intl.RelativeTimeFormatOptions & {
  locales?: string | string[];
  from?: Date;
};
export type DateTimeComparisonOptions =
  { precision?: DateTimeField; exclude?: DateTimeField[] } | { precision: "week"; exclude?: never };

export class DateTime {
  static min(a: DateTime, b: DateTime): DateTime | null;
  static max(a: DateTime, b: DateTime): DateTime | null;
  static equals(a: DateTime, b: DateTime): boolean;
  static now(): number;

  constructor(value?: DateTimeValue | DateTimeFormatOptions | null, options?: DateTimeFormatOptions);

  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  readonly date: Date;
  readonly options: DateTimeFormatOptions;
  readonly time: number;
  readonly weekday: number;

  isValid(): boolean;
  toISOString(): string;
  toLocalISOString(): string;
  toString(locales?: string | string[]): string;
  format(options?: DateTimeFormatOptions): string;
  equals(target: DateTime, options?: DateTimeComparisonOptions): boolean;
  isNow(precision?: DateTimeUnit): boolean;
  clone(): DateTime;
  diff(target: DateTime, output?: DateTimeUnit | `${DateTimeUnit}s`, float?: boolean): number | null;
  relative(options?: RelativeOptions): string;
  add(unit: DateTimeUnit, value?: number): this;
  subtract(unit: DateTimeUnit, value?: number): this;
  startOf(unit: DateTimeUnit): this;
  endOf(unit: DateTimeUnit): this;
  next(unit: DateTimeUnit, step?: number): this;
  previous(unit: DateTimeUnit, step?: number): this;
}

export function date(value?: DateTimeValue, options?: DateTimeFormatOptions): DateTime;
export function time(value?: DateTimeValue, options?: DateTimeFormatOptions): DateTime;
export function formatDate(value?: DateTimeValue, options?: DateTimeFormatOptions): string;
export function formatTime(value?: DateTimeValue, options?: DateTimeFormatOptions): string;
export function formatDateTime(value?: DateTimeValue, options?: DateTimeFormatOptions): string;

export default DateTime;
