/** Response from /api/edit-image */
export type EditImageResponse = {
  result: string;
  credits: number;
};

/** Response from /api/generate */
export type GenerateResponse = {
  results?: string[];
  result?: string;
  credits: number;
};

/** Response from /api/credits */
export type CreditsResponse = {
  credits: number;
};

/** Generic API error response body */
export type ApiErrorResponse = {
  error: string;
  credits?: number;
};

/** Result of a server-side credit sufficiency check */
export type CreditCheckResult = {
  userId: string;
  credits: number;
};
