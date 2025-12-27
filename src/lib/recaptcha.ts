// reCAPTCHA v3 utilities for spam protection

export interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

/**
 * Verify reCAPTCHA v3 token on the server side
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - The expected action name for this verification
 * @returns RecaptchaResponse object with success status and score
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string
): Promise<RecaptchaResponse> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not configured');
    throw new Error('reCAPTCHA is not properly configured');
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data: RecaptchaResponse = await response.json();

    // Verify the action matches (if provided)
    if (expectedAction && data.action !== expectedAction) {
      console.warn(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`);
      return {
        ...data,
        success: false,
      };
    }

    return data;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    throw new Error('Failed to verify reCAPTCHA');
  }
}

/**
 * Check if a reCAPTCHA score meets the minimum threshold
 * @param score - The reCAPTCHA score (0.0 to 1.0)
 * @param minScore - Minimum acceptable score (default 0.5)
 * @returns true if score is acceptable
 */
export function isScoreAcceptable(score: number, minScore: number = 0.5): boolean {
  return score >= minScore;
}

/**
 * Validate reCAPTCHA token and score
 * Returns true if valid, throws error if invalid
 */
export async function validateRecaptcha(
  token: string | undefined | null,
  action: string,
  minScore: number = 0.5
): Promise<boolean> {
  if (!token) {
    throw new Error('reCAPTCHA token is required');
  }

  const result = await verifyRecaptcha(token, action);

  if (!result.success) {
    const errors = result['error-codes']?.join(', ') || 'Unknown error';
    throw new Error(`reCAPTCHA verification failed: ${errors}`);
  }

  if (!isScoreAcceptable(result.score, minScore)) {
    console.warn(`Low reCAPTCHA score: ${result.score} for action ${action}`);
    throw new Error('Spam detection triggered. Please try again.');
  }

  return true;
}
