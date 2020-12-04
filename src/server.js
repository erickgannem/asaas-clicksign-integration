import server from './app.js';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => process.stdout.write(`Server is listening on port: ${PORT} \n`));
