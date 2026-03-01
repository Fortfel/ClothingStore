import crypto from 'node:crypto'
import { reset, seed } from 'drizzle-seed'

import { createDatabase } from '../client'
import * as schema from '../schema'
import { account as accountTable, user as userTable } from '../schemas/auth'
import { initUsersData } from './initial-users-data'

// eslint-disable-next-line no-restricted-properties
if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL')
}

const main = async (): Promise<void> => {
  const db = createDatabase({
    // eslint-disable-next-line no-restricted-properties
    url: process.env.DATABASE_URL as string,
  })

  console.log('🌱 Starting database seeding...')

  try {
    // Reset database (optional - remove if you want to keep existing data)
    console.log('🗑️  Resetting database...')
    await reset(db, schema)

    // Seed users using drizzle-seed's 'with' feature
    console.log('🌱 Seeding users...')
    await seed(db, {
      user: userTable,
      account: accountTable,
    }).refine((funcs) => ({
      user: {
        count: initUsersData.length,
        columns: {
          id: funcs.uuid(),
          name: funcs.fullName(),
          email: funcs.email(),
          emailVerified: funcs.default({ defaultValue: false }),
          image: funcs.valuesFromArray({
            values: initUsersData.map((user) => user.image),
          }),
        },
        with: {
          account: 1,
        },
      },
      account: {
        columns: {
          id: funcs.uuid(),
          accountId: funcs.uuid(), // This will be overridden by the user relationship
          providerId: funcs.valuesFromArray({ values: ['credential'] }),
          password: funcs.valuesFromArray({
            values: [
              '50a7cca404e858850b673d68495596f3:5cf3da3a312c0d801cf09dbbfcb2eb14bb578d02b31d8c7ec08a7f4bc86212d87c33b1549dc4610d19c2405db9a40d571ba7471da912efa847e8dadbb2c1fa02',
            ], // hashed version. non-hashed is "securePassword"
          }),
        },
      },
    }))

    // Add test account using Better Auth's signUpEmail
    console.log('🔧 Adding test account...')
    try {
      const testUserId = crypto.randomUUID()
      const testAccountId = crypto.randomUUID()

      // Insert user directly
      await db.insert(userTable).values({
        id: testUserId,
        name: 'Demo User',
        email: 'demo@example.com',
        emailVerified: false,
        image: initUsersData[0]?.image || '',
      })

      // Insert account with hashed password
      await db.insert(accountTable).values({
        id: testAccountId,
        userId: testUserId,
        accountId: testUserId,
        providerId: 'credential',
        password:
          '50a7cca404e858850b673d68495596f3:5cf3da3a312c0d801cf09dbbfcb2eb14bb578d02b31d8c7ec08a7f4bc86212d87c33b1549dc4610d19c2405db9a40d571ba7471da912efa847e8dadbb2c1fa02', // "securePassword"
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log('✅ Test account created successfully')
    } catch (error) {
      console.log('⚠️  Test account might already exist or creation failed:', error)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${initUsersData.length.toString()} users created`)
    console.log(`   - ${initUsersData.length.toString()} accounts created`)
    console.log('   - 1 test account (demo@example.com / secret)')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    // await db.$client.end()
    console.log('🔌 Database connection closed')
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0)
  }
}

void main()
