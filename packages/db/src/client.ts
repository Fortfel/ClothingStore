// import type { MySql2Database } from 'drizzle-orm/mysql2'
// import { drizzle } from 'drizzle-orm/mysql2'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// import mysql from 'mysql2/promise'

import * as schema from './schema'

// type MysqlDatabaseConfig = {
//   url: string
//   poolMax?: number
// }
type NeonDatabaseConfig = {
  url: string
}

// Mysql config
// export const createDatabase = (config: MysqlDatabaseConfig): MySql2Database<typeof schema> & { $client: mysql.Pool } => {
//   return drizzle({
//     client: mysql.createPool({
//       uri: config.url,
//       connectionLimit: config.poolMax ?? 10,
//     }),
//     schema,
//     casing: 'snake_case', // Maps camelCase to snake_case
//     mode: 'default',
//   })
// }

// Neon config
export const createDatabase = (config: NeonDatabaseConfig) => {
  const sql = neon(config.url)
  return drizzle({
    client: sql,
    schema,
    casing: 'snake_case',
  })
}

export type DatabaseInstance = ReturnType<typeof createDatabase>
