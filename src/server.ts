import server from './app'

const PORT = process.env.PORT || 3000

server.listen(PORT, () => process.stdout.write(`\n>> [Server] Running on port: ${PORT}`))
