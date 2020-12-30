import Redis from 'ioredis'

const { REDIS_URL } = process.env

const cache: Redis.Redis = process.env.NODE_ENV === 'production'
  ? new Redis(REDIS_URL)
  : new Redis()

cache.on('connect', function () {
  process.stdout.write('\n>> [REDIS] Client is CONNECTED\n')
})
cache.on('ready', function () {
  process.stdout.write('\n>> [REDIS] Client is READY\n')
})
cache.on('reconnecting', function () {
  process.stdout.write('\n>> [REDIS] Client is RECONNECTING\n')
})
cache.on('error', function () {
  process.stdout.write('\n>> [REDIS] Client can\'t connect. Please restart the server.\n')
  cache.connect()
})

export default cache
