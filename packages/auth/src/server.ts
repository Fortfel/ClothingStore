import type { BetterAuthOptions, BetterAuthPlugin } from 'better-auth'
import { expo } from '@better-auth/expo'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { oAuthProxy } from 'better-auth/plugins'
import urlJoin from 'url-join'
import { z } from 'zod'

import type { DatabaseInstance } from '@workspace/db/client'

export const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
} as const

const fieldSchema = {
  passwordSchema: z
    .string()
    .trim()
    .min(
      AUTH_CONFIG.PASSWORD_MIN_LENGTH,
      `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH.toString()} characters`,
    )
    .max(
      AUTH_CONFIG.PASSWORD_MAX_LENGTH,
      `Password can be at most ${AUTH_CONFIG.PASSWORD_MAX_LENGTH.toString()} characters`,
    ),
  emailSchema: z.email('Please enter a valid email address'),
  nameSchema: z
    .string()
    .trim()
    .min(AUTH_CONFIG.NAME_MIN_LENGTH, `Full Name must be at least ${AUTH_CONFIG.NAME_MIN_LENGTH.toString()} characters`)
    .max(AUTH_CONFIG.NAME_MAX_LENGTH, `Full Name can be at most ${AUTH_CONFIG.NAME_MAX_LENGTH.toString()} characters`),
}

export const authSchema = {
  registerSchema: z
    .object({
      name: fieldSchema.nameSchema,
      email: fieldSchema.emailSchema,
      password: fieldSchema.passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  loginSchema: z.object({
    email: fieldSchema.emailSchema,
    password: fieldSchema.passwordSchema,
  }),
  resetPasswordSchema: z.object({
    email: fieldSchema.emailSchema,
  }),
  newPasswordSchema: z
    .object({
      password: fieldSchema.passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
}

type AuthConfig = {
  webUrl: string
  baseUrl: string
  productionUrl: string
  apiPath: string
  additionalTrustedOrigins?: Array<string>

  db: DatabaseInstance
  extraPlugins?: Array<BetterAuthPlugin>

  authSecret: string
  googleClientId: string
  googleClientSecret: string
  discordClientId: string
  discordClientSecret: string
}

/**
 * This function is abstracted for schema generations in auth-cli.ts
 */
export const getBaseOptions = (db: DatabaseInstance, productionUrl: string, extraPlugins?: Array<BetterAuthPlugin>) =>
  ({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),

    /**
     * Only uncomment the line below if you are using plugins, so that
     * your types can be correctly inferred:
     */
    plugins: [oAuthProxy({ productionURL: productionUrl }), expo(), ...(extraPlugins ?? [])],
  }) satisfies BetterAuthOptions

export const initAuth = (options: AuthConfig) => {
  const config = {
    ...getBaseOptions(options.db, options.productionUrl, options.extraPlugins),

    baseURL: urlJoin(options.baseUrl, options.apiPath, 'auth'),
    secret: options.authSecret,
    trustedOrigins: [
      'expo://',
      new URL(options.webUrl).origin,
      ...(options.additionalTrustedOrigins ?? []).map((url) => new URL(url).origin),
    ],

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 15 * 60,
      },
    },

    account: {
      encryptOAuthTokens: true,
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'discord', 'email-password'],
        allowDifferentEmails: false,
        updateUserInfoOnLink: true,
      },
    },

    // Required for cross-origin (frontend on github-pages, backend somewhere else)
    // advanced: {
    //   useSecureCookies: true,
    //   defaultCookieAttributes: {
    //     sameSite: 'none', // Required for cross-origin
    //     secure: true,
    //     httpOnly: true,
    //   },
    // },

    // If you want to add additional fields
    // @see https://www.better-auth.com/docs/concepts/typescript#additional-fields
    // user: {
    //   additionalFields: {
    //     role: {
    //       type: 'string',
    //       input: false,
    //     },
    //   },
    // },

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
      minPasswordLength: AUTH_CONFIG.PASSWORD_MIN_LENGTH,
      maxPasswordLength: AUTH_CONFIG.PASSWORD_MAX_LENGTH,
      disableSignUp: true,
    },

    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: urlJoin(options.productionUrl, options.apiPath, 'auth/callback/google'),
        overrideUserInfoOnSignIn: true,
        prompt: 'consent',
      },
      discord: {
        clientId: options.discordClientId,
        clientSecret: options.discordClientSecret,
        redirectURI: urlJoin(options.productionUrl, options.apiPath, 'auth/callback/discord'),
        overrideUserInfoOnSignIn: true,
        prompt: 'consent',
      },
    },

    onAPIError: {
      errorURL: `${options.webUrl}/auth/error`,
      onError(error, ctx) {
        console.error('BETTER AUTH API ERROR', error, ctx)
      },
    },

    hooks: {
      // eslint-disable-next-line @typescript-eslint/require-await
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== '/sign-up/email') {
          return
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const validatedName = fieldSchema.nameSchema.parse(ctx.body?.name)

          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name: validatedName,
              },
            },
          } as { context: typeof ctx }
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new APIError('BAD_REQUEST', {
              message: (error.issues[0]?.message ?? error.message) || 'Invalid Full Name',
            })
          }
          console.error('Validation error:', error)
          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: 'Unexpected error while validating the form',
          })
        }
      }),
    },
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type AuthInstance = ReturnType<typeof initAuth>
export type SocialProviders = keyof AuthInstance['options']['socialProviders']
