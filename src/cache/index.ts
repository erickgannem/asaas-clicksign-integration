import Redis from 'ioredis'

const cache = new Redis(6379, '127.0.0.1')

cache.on('connect', function () {
  process.stdout.write('\n>> [REDIS] Connected\n')
})
cache.on('error', function () {
  process.stdout.write('\n>> [REDIS] Can\'t connect. Please restart the server.\n')
  cache.quit()
})

export default cache
