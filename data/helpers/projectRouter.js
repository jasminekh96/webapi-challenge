const express = require('express');

const pM = require('./projectModel');

const router = express.Router();

router.use(express.json());

//get
router.get('/', (req, res) => {
	console.log(req.id);
	pM
		.get(req.id)
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				message : 'Could not get projects.',
			});
		});
});

//get by ID
router.get('/:id', validateProjectId, (req, res) => {
	res.status(200).json(req.projects);
});

// get by ID actions
router.get('/:id/actions', validateProjectId, (req, res) => {
	pM
		.getProjectActions(req.projects.id)
		.then((actions) => {
			res.status(200).json(actions);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				message : 'Could not get actions',
			});
		});
});

//post
router.post('/', (req, res) => {
	const { name, description } = req.body;
	if (!name || !description) {
		res.status(400).json({ error: 'Please provide name and description for the post.' });
	} else {
		pM
			.insert({ name, description })
			.then(({ id }) => {
				pM.get(id).then((projectPost) => {
					res.status(201).json(projectPost);
				});
			})
			.catch((error) => {
				console.log('error on the POST for posting a new title and content', error);
				res.status(500).json({
					errorMessage : 'There was an error while saving the post to the database',
				});
			});
	}
});

//put
router.put('/:id', validateProjectId, validateProject, (req, res) => {
	pM
		.update(req.params.id, req.body)
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ errorMessage: 'Put update did not work.' });
		});
});

// remove
router.delete('/:id', validateProjectId, (req, res) => {
	pM
		.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: 'It has been removed.' });
			} else {
				res.status(400).json({ errorMessage: 'The post with this ID is not found.' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				errorMessage : 'Could not be removed.',
			});
		});
});

//middleware
function validateProjectId(req, res, next) {
	if (req.params.id) {
		pM
			.get(req.params.id)
			.then((projects) => {
				if (projects) {
					req.projects = projects;
					next();
				} else {
					res.status(404).json({ message: 'invalid actions ID' });
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

function validateProject(req, res, next) {
	if (!Object.entries(req.body).length) {
		res.status(404).json({ message: 'missing project' });
	}
	if (!req.body.name) {
		res.status(404).json({ message: 'missing name' });
	}
	if (!req.body.description) {
		res.status(404).json({ message: 'missing description' });
	} else {
		return next();
	}
}

module.exports = router;
