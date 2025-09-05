export type ApiError = Error & {
  response?: {
    data?: {
      error?: string;
      message?: string
    }
  }
}