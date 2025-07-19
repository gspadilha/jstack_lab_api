import { HttpResponse } from "../types/Https";

export function parseResponse(httpResponse: HttpResponse) {
  return {
    statusCode: httpResponse.statusCode,
    body: JSON.stringify(httpResponse.body),
  };
}
