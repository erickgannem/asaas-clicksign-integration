import Redis from 'ioredis'

const { REDIS_URL } = process.env

const cache = new Redis(REDIS_URL)

cache.on('connect', function () {
  process.stdout.write('\n>> [REDIS] Connected\n')
})
cache.on('error', function () {
  process.stdout.write('\n>> [REDIS] Can\'t connect. Please restart the server.\n')
})

export default cache
