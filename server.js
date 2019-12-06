const express = require('express');

const server = express();

const actionRouter = require('./data/helpers/actionRouter');
const postRouter = require('./data/helpers/projectRouter');

function logger(req, res, next) {
	console.log(`${req.method} to ${req.originalUrl} at ${new Date()}`);
	next();
}

server.use(logger);
server.use(express.json());

server.get('/', (req, res) => {
	res.send(`<h2>She works!!</h2>`);
});

server.use('/api/actions', actionRouter);
server.use('/api/projects', postRouter);

module.exports = server;
