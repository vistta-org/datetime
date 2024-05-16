export class DateTime {
  static min(a: DateTime, b: DateTime): DateTime;
  static max(a: DateTime, b: DateTime): DateTime;
  static equals(a: DateTime, b: DateTime): Boolean;
  constructor(
    value?: string | number | Date | DateTime,
    options?: Intl.RelativeTimeFormatOptions,
  );

  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  readonly date: Date;
  readonly options: Intl.RelativeTimeFormatOptions;
  readonly time: number;

  equals(target: DateTime): Boolean;
  clone(): DateTime;
  toISOString(): string;
  toString(locales?: string | string[] | undefined): string;
  format(
    options?: {
      locales?: string | string[] | undefined;
    } & Intl.DateTimeFormatOptions,
  ): string;
  diff(target: DateTime, output?: string, float?: boolean): number;
  relative(
    options?: {
      locales?: string | string[] | undefined;
      from?: Date;
    } & Intl.RelativeTimeFormatOptions,
  ): string;
}

export function date(target?: string | Date, format?: string): DateTime;
export function time(target?: string | Date, format?: string): DateTime;

export default DateTime;
