const express = require("express");
const bodyParser = require("body-parser")
const {
	drawClosedCard, drawOpenCard, startGame, createGame, joinGame, getScore, getGames, depositCard,
	registerUser, gameStats, declareGin, makePlayerOnLogin
} = require("./api");

const app = express();
const {users} = require('./data/data')
const basicAuth = require('basic-auth');

app.use(bodyParser.json());
app.use(express.static("content"))

// Basic authentication
let authenticate = function(req, res, next) {
	let user = basicAuth(req);
	if (!user || !users.hasOwnProperty(user.name) || users[user.name].password !== user.pass) {
		//make the browser ask for credentials if none/wrong are provided
		// res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	}
	req.username = user.name;
	next();
};

// HTML routes
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/content/index.html')
})

// API routes
app.get('/api/lobby/get-games', (req, res) => {
	res.status(200).json({games: getGames()});
})

app.post('/api/lobby/join-game', authenticate, (req, res) => {
	let playerId = req.body.playerId
	let gameId = req.body.gameId;
	let game = joinGame(playerId, gameId);
	res.status(200).json(game);
})

app.post('/api/game/create', (req, res) => {
	let playerId = req.body.playerId;
	let knockingAllowed = req.body.knockingAllowed;
	let lowHighAceAllowed = req.body.lowHighAceAllowed;

	let game = createGame(playerId, knockingAllowed, lowHighAceAllowed);

	res.status(200).json(game);
})

app.get('/api/game/start/:playerId', (req, res) => {
	let game = startGame(req.params.playerId);
	res.json(game)
})

app.get('/api/game/draw-open-card/:playerId', (req, res) => {
	let card = drawOpenCard(req.params.playerId);
	res.json(card);
})

app.get('/api/game/draw-closed-card/:playerId', (req, res) => {
	let card = drawClosedCard(req.params.playerId);
	res.json(card);
})

app.post('/api/game/post-card/:playerId', (req, res) => {
	depositCard(req.params.playerId, req.body.cardNo)
	res.send(200);
})

app.post('/api/game/declare-gin/:playerId', (req, res) => {
	let winOrLose = declareGin(req.params.playerId);
	res.json(winOrLose);
})

app.get('/api/game/game-stats/:gameId', (req, res) => {
	let gameStats = gameStats();
	res.json(gameStats);
})

app.post('/api/users/register-user', (req, res) => {
	let username = req.headers.username;
	let password = req.headers.password;
	console.log(users)
	let registration = registerUser(username, password);
	// todo send text too
	console.log(users)
	res.status(registration.status).send(registration.text);
})

app.post('/api/users/login', authenticate, (req, res) => {
	// make a new player
	const playerId = makePlayerOnLogin(req.username)

	res.status(200).json(playerId);
})

app.get('/api/users/scores/:username', (req, res) => {
	username = req.params.username;
	getScore(username);
})

const PORT = 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))