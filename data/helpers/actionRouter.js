const express = require('express');

const aM = require('./actionModel');

const router = express.Router();

router.use(express.json());

//get actions
router.get('/', (req, res) => {
	console.log(req.id);
	aM
		.get(req.id)
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				message : 'Could not get actions.',
			});
		});
});
//get actions with id
router.get('/:id', validateActionId, (req, res) => {
	res.status(200).json(req.actions);
});

// middleware
function validateActionId(req, res, next) {
	if (req.params.id) {
		aM
			.get(req.params.id)
			.then((actions) => {
				if (actions) {
					req.actions = actions;
					next();
				} else {
					res.status(404).json({ message: 'invalid user id' });
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({
					message : 'The post information could not be retrieved.',
				});
			});
	}
}

module.exports = router;
