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

// post
router.post('/', (req, res) => {
	const { project_id, description, notes } = req.body;
	if (!project_id || !description || !notes) {
		res.status(400).json({ error: 'Please provide project_id, description, and notes for the post.' });
	} else {
		aM
			.insert({ project_id, description, notes })
			.then(({ id }) => {
				pM.get(id).then((actionPost) => {
					res.status(201).json(actionPost);
				});
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({
					errorMessage : 'There was an error while saving the post to the database',
				});
			});
	}
});

// put
router.put('/:id', validateActionId, validateAction, (req, res) => {
	aM
		.update(req.params.id, req.body)
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ errorMessage: 'Put update did not work.' });
		});
});
//delete
router.delete('/:id', validateActionId, (req, res) => {
	aM
		.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: 'It has been removed.' });
			} else {
				res.status(400).json({ errorMessage: 'The action with this ID is not found.' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				errorMessage : 'Could not be removed.',
			});
		});
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
					res.status(404).json({ message: 'invalid project ID' });
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

function validateAction(req, res, next) {
	if (!Object.entries(req.body).length) {
		res.status(404).json({ message: 'missing project' });
	}
	if (!req.body.project_id) {
		res.status(404).json({ message: 'missing project_id' });
	}
	if (!req.body.description) {
		res.status(404).json({ message: 'missing description' });
	}
	if (!req.body.notes) {
		res.status(404).json({ message: 'missing notes' });
	} else {
		return next();
	}
}

module.exports = router;
