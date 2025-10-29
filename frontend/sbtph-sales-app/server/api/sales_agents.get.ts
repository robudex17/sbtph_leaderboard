// server/api/sales_agents.get.ts
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'python',
    password: 'sbtph@2018',
    database: 'sbtph_leaderboard'
  })

  const [rows] = await connection.execute('SELECT * FROM sales_agents')
  await connection.end()
  
  return rows
})
