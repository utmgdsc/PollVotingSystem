import { createClient } from 'redis'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

const client = createClient({
  url: process.env.REDIS_URL
})

async function connectRedis () {
  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()
  console.log('connected to redis')

  const readstream = fs.createReadStream(
    path.join(__dirname, process.env.WHITELIST)
  )

  const rl = readline.createInterface({
    input: readstream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    console.log(line.trim())
    client.set(line.trim(), 'instructor')
  }
}

export { client, connectRedis }
