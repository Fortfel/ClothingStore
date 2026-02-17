import type { Result } from 'neverthrow'
import { TRPCError } from '@trpc/server'

// --- Error constructors (as const for literal types) ---

export const notFound = (entity: string, id?: string | number) => ({ reason: 'NotFound', entity, id }) as const

export const unauthorized = (message?: string) => ({ reason: 'Unauthorized', message }) as const

export const forbidden = (message?: string) => ({ reason: 'Forbidden', message }) as const

export const validationFailed = (message: string, fields?: Record<string, Array<string>>) =>
  ({ reason: 'ValidationFailed', message, fields }) as const

export const dbError = (message: string, cause?: unknown) => ({ reason: 'DatabaseError', message, cause }) as const

// --- Union type inferred from constructors ---

export type AppError =
  | ReturnType<typeof notFound>
  | ReturnType<typeof unauthorized>
  | ReturnType<typeof forbidden>
  | ReturnType<typeof validationFailed>
  | ReturnType<typeof dbError>

// --- Error → TRPCError mapper with exhaustive checking ---

export const toTRPCError = (error: AppError): TRPCError => {
  const reason = error.reason

  switch (reason) {
    case 'NotFound': {
      return new TRPCError({ code: 'NOT_FOUND', message: `${error.entity} not found` })
    }
    case 'Unauthorized': {
      return new TRPCError({ code: 'UNAUTHORIZED', message: error.message })
    }
    case 'Forbidden': {
      return new TRPCError({ code: 'FORBIDDEN', message: error.message })
    }
    case 'ValidationFailed': {
      return new TRPCError({ code: 'BAD_REQUEST', message: error.message })
    }
    case 'DatabaseError': {
      console.error('[Service] Database error:', error.message, error.cause)
      return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' })
    }
    default: {
      reason satisfies never
      return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unhandled error' })
    }
  }
}

// --- Helper to unwrap Result at the router boundary ---

export const unwrapResult = <TValue>(result: Result<TValue, AppError>): TValue =>
  result.match(
    (value) => value,
    (error) => {
      throw toTRPCError(error)
    },
  )
