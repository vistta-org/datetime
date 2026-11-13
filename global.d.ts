import { DateTime as DateTimeClass } from "./index.js";

declare global {
  var DateTime: typeof DateTimeClass;
  type DateTime = DateTimeClass;
}
