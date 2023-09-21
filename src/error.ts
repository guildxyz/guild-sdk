/* eslint-disable max-classes-per-file */
import type { ZodError } from "zod";

class GuildAPICallFailed extends Error {
  endpoint: string;

  message: string;

  statusCode: number;

  constructor(endpoint: string, message: string, statusCode: number) {
    super(
      `Guild API call failed on ${endpoint} with http code ${statusCode} with message: ${
        message ?? "Unexpected Error"
      }`
    );
    this.endpoint = endpoint;
    this.message = message;
    this.statusCode = statusCode;
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

export { GuildAPICallFailed, GuildSDKValidationError };
