/* eslint-disable max-classes-per-file */
import type { ZodError } from "zod";

class GuildAPICallFailed extends Error {
  endpoint: string;

  message: string;

  correlationId: string;

  statusCode: number;

  constructor(
    endpoint: string,
    message: string,
    statusCode: number,
    correlationId: string
  ) {
    super(
      `Guild API call failed on ${endpoint} with http code ${statusCode} with message: ${
        message ?? "Unexpected Error"
      }\nID: ${correlationId}`
    );
    this.endpoint = endpoint;
    this.message = message;
    this.statusCode = statusCode;
    this.correlationId = correlationId;
  }
}

/**
 * This error represents a validation on a guild request body. When this
 * error is thrown, no request was sent. Instances of this error contin a
 * `zodError` field, which contains information on why the supplied data
 * didn't pass validation
 */
class GuildSDKValidationError<Err extends ZodError<any>> extends Error {
  zodError: Err;

  constructor(zodError: Err) {
    super(`A value passed as request body did not pass validation.`);
    this.zodError = zodError;
  }
}

class GuildAPIInvalidResponse extends Error {
  responseText: string;

  responseCode: number;

  url: string;

  method: string;

  body: any;

  correlationId: string;

  constructor({
    responseText,
    response,
    url,
    method,
    body,
    correlationId,
  }: {
    responseText: string;
    response: Response;
    url: string;
    method: string;
    body: any;
    correlationId?: string | null;
  }) {
    super(
      "Guild API returned invalid data. Please open an issue: https://github.com/guildxyz/guild-sdk/issues"
    );

    this.responseCode = response.status;
    this.responseText = responseText;
    this.url = url;
    this.method = method;
    this.body = body;
    this.correlationId = correlationId ?? "UNKNOWN";
  }
}

export { GuildAPICallFailed, GuildAPIInvalidResponse, GuildSDKValidationError };
