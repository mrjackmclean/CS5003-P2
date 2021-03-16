import {
	game,
	getStats,
	compareScore,
	setState
} from "./clientUtils.js";

const makeEndVue = function () {
	const endVue = new Vue({
		el: "#end",
		data: {
			scores: [],
			youWin: false
		},
		computed: {
			state() {
				return game.state;
			}
		},
		methods: {
			getScores: function () {
				getStats()
					.then(json => {
						let scores = json.scores;
						let niceUsernames = json.niceUsernames;
						let usernamesScores = [];
						for (let id in scores) {
							let pair = {};
							pair.niceUsername = niceUsernames[id]
							pair.score = scores[id];
							usernamesScores.push(pair);
						}

						this.scores = usernamesScores.sort(compareScore);

						let winners = usernamesScores.sort(compareScore);
						for (let scorer of winners) {
							winners = winners.filter(el => el.score >= scorer.score);
						}
						let winnerUsernames = winners.map(el => Object.entries(el)[0][1]);

						if (winnerUsernames.includes(json.niceUsername)) {
							this.youWin = true
						}
					})
			},
			setHistory: () => {
				console.log(game.state);
				setState('history');
				console.log(game.state)
			},
			showState: () => {
				console.log(game.state)
			}



		}
	})
}

export const makeEnd = function () {
	makeEndVue();
}