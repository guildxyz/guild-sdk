/* eslint-disable max-classes-per-file */
import type { ZodError } from "zod";

export class GuildAPICallFailed extends Error {
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
export class GuildSDKValidationError<Err extends ZodError<any>> extends Error {
  zodError: Err;

  constructor(zodError: Err) {
    super(`A value passed as request body did not pass validation.`);
    this.zodError = zodError;
  }
}

export class UndefinedProjectName extends Error {
  constructor() {
    super(
      "Before making API calls, please set a project name with setProjectName"
    );
  }
}
