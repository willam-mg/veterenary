import { HttpErrorResponse } from '@angular/common/http';

import { ApiEnvelope } from '../../models/types';

export function extractApiErrorMessage(response: HttpErrorResponse, fallback: string): string {
  const apiError = response.error as ApiEnvelope<unknown> | undefined;
  const validationErrors = apiError?.errors
    ? Object.values(apiError.errors)
        .flat()
        .join(' ')
    : '';

  return validationErrors || apiError?.message || fallback;
}

export function appendFormDataValue(formData: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null || value === '') {
    return;
  }

  formData.append(key, value instanceof Blob ? value : String(value));
}
