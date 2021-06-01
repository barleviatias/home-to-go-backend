const stayService = require('./stay.service');
const socketService = require('../../services/socket.service');
const logger = require('../../services/logger.service');


async function getStays(req, res) {
	let filterBy = {};
    console.log('req.query:' , req.query);
	if (!req.query) {
		var loc = { address: '' };
		var guests = 1;
	} else {
		var { loc, guests } = req.query;
        loc = JSON.parse(loc);
        guests = JSON.parse(guests);
	}

	try {
		filterBy.address = loc.address;
		filterBy.guests = guests;
		const stays = await stayService.query(filterBy);
		res.send(stays);
	} catch (err) {
		logger.error('Failed to get stays', err);
		res.status(500).send({ err: 'Failed to get stays' });
	}
}

async function getStay(req, res) {
	try {
		const stay = await stayService.getById(req.params.id);
		res.send(stay);
	} catch (err) {
		logger.error('Failed to get stay', err);
		res.status(500).send({ err: 'Failed to get stay' });
	}
}

async function deleteStay(req, res) {
	try {
		await stayService.remove(req.params.id);
		res.send({ msg: 'Deleted successfully' });
	} catch (err) {
		logger.error('Failed to delete stay', err);
		res.status(500).send({ err: 'Failed to delete toy' });
	}
}

async function updateStay(req, res) {
	try {
		const stay = req.body;
		console.log('update stay from controller');
		const updatedStay = await stayService.update(stay);
		res.send(updatedStay);
		// socketService.broadcast({ type: 'stayy-updated', data: stay, to: updatedToy._id })
	} catch (err) {
		logger.error('Failed to update stay', err);
		res.status(500).send({ err: 'Failed to update stay' });
	}
}

async function addStay(req, res) {
	try {
		const stay = req.body;
		const addedStay = await stayService.add(stay);
		res.send(addedStay);
		// socketService.broadcast({ type: 'toy-added', data: stay, to: addedStay._id })
	} catch (err) {
		logger.error('Failed to add stay', err);
		res.status(500).send({ err: 'Failed to add stay' });
	}
}

module.exports = {
	getStay,
	getStays,
	deleteStay,
	updateStay,
	addStay,
};

// async function getStays(req, res) {
//     const filterBy = {}
//     const { searchTxt, availability, sortBy, type } = req.query

//     try {
//         filterBy.searchTxt = searchTxt || ''
//         filterBy.availability = availability
//         filterBy.sortBy = sortBy
//         filterBy.type = type

//         const toys = await toyService.query(filterBy)
//         res.send(toys)
//     } catch (err) {
//         logger.error('Failed to get toys', err)
//         res.status(500).send({ err: 'Failed to get toys' })
//     }
// }
