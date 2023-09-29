import { DataFormat } from "./wrap";

export const COVALENT_API = "https://api.covalenthq.com";

export function getDataFormatType(format: DataFormat): string {
  switch (format) {
    case DataFormat._JSON:
      return "JSON";
    case DataFormat.CSV:
      return "CSV";
    default:
      throw new Error("Unsupported data format");
  }
}
