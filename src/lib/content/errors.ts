export class ContentNotFoundError extends Error {
  readonly code = "not_found";
}

export class ContentUnavailableError extends Error {
  readonly code = "unavailable";
}
