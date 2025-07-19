import { HttpResponse } from "../types/Https";

export function ok(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 200,
    body,
  };
}

export function created(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 201,
    body,
  };
}

export function badRequest(errors: Record<string, any>): HttpResponse {
  return {
    statusCode: 400,
    body: errors,
  };
}
