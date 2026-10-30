import { APIGatewayProxyResult } from "aws-lambda";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // ajusta al dominio de tu front en producción
};

export const response = (
  statusCode: number,
  body: unknown,
): APIGatewayProxyResult => ({
  statusCode,
  headers: defaultHeaders,
  body: JSON.stringify(body),
});

export const resOk = (message: string, data: unknown) =>
  response(200, { message, data });
export const resCreated = (message: string, data: unknown) =>
  response(201, { message, data });
export const resBadRequest = (message = "Bad Request") =>
  response(400, { message });
export const resNotFound = (message = "Not Found") =>
  response(404, { message });
export const resServerError = (message = "Internal Server Error") =>
  response(500, { message });
