import Redis from 'ioredis'

const cache = new Redis(process.env.REDIS_URL)

cache.on('connect', function () {
  process.stdout.write('\n>> [REDIS] Connected\n')
})
cache.on('error', function () {
  process.stdout.write('\n>> [REDIS] Can\'t connect. Please restart the server.\n')
  cache.quit()
})

export default cache
