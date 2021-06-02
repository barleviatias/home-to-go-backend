const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios');

module.exports = {
	query,
	getById,
	// getByStayname,
	getStaysByType,
	remove,
	update,
	add,
	getWishStays,
	getHostStays
};

async function query(filterBy = { address: '', guests: 1, type: '' }) {

	const criteria = _buildCriteria({ ...filterBy });
	try {
		const collection = await dbService.getCollection('stay');
		var stays = await collection.find(criteria).toArray();
		return stays;
	} catch (err) {
		logger.error('cannot find stays', err);
		throw err;
	}
}

async function getById(stayId) {
	try {
		const collection = await dbService.getCollection('stay');
		const stay = await collection.findOne({ _id: ObjectId(stayId) });
		return stay;
	} catch (err) {
		logger.error(`while finding stay ${stayId}`, err);
		throw err;
	}
}

async function remove(stayId) {
	try {
		const collection = await dbService.getCollection('stay');
		await collection.deleteOne({ _id: ObjectId(stayId) });
	} catch (err) {
		logger.error(`cannot remove stay ${stayId}`, err)
		throw err;
	}
}

async function update(stay) {
	try {
		const cords=await getCords(stay)
		// peek only updatable fields!
		const stayToSave = {
			_id: ObjectId(stay._id),
			name: stay.name,
			imgUrls: stay.imgUrls,
			price: stay.price,
			desc: stay.desc,
			capacity: stay.capacity,
			favorites: stay.favorites,
			host:{...stay.host ,_id:ObjectId(stay.host._id)},
			loc:{...stay.loc,lat:cords.lat,lng:cords.lng},
			propertyType: stay.propertyType,
			stayType: stay.stayType,
			reviews: stay.reviews,
			msgs: stay.msgs,
			amenities: stay.amenities,
			createdAt: stay.createdAt,
			updadetAt: Date.now(),
		};
		const collection = await dbService.getCollection('stay');
		await collection.updateOne({ _id: stayToSave._id }, { $set: stayToSave });
		return stayToSave;
	} catch (err) {
		logger.error(`cannot update stay ${stay._id}`, err)
		throw err;
	}
}
async function getCords(stay){
	try {
		const address=stay.loc.address.replace(',',' ')
		const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAfvktGRnTPT-aq4CfjmM3zi1jWHxqojY4`)
		console.log('res',response.data.results);
		const geo=response.data.results
		console.log('geo',geo);
		console.log('cords',geo[0].geometry.location);
		return geo[0].geometry.location
	  } catch (error) {
		console.error(error);
	  }
	// console.log('cords',cords.results[0].geometry.location);
}
async function add(stay) {
	try {
		const cords=await getCords(stay)
		// peek only updatable fields!
		const stayToAdd = {
			name: stay.name,
			imgUrls: stay.imgUrls,
			price: stay.price,
			desc: stay.desc,
			capacity: stay.capacity,
			favorites: [],
			host:{...stay.host ,_id:ObjectId(stay.host._id)} ,
			loc:{...stay.loc,lat:cords.lat,lng:cords.lng},
			propertyType: stay.propertyType,
			stayType: stay.stayType,
			reviews: [],
			msgs: [],
			amenities: stay.amenities,
			createdAt: Date.now(),
		};
		const collection = await dbService.getCollection('stay');
		await collection.insertOne(stayToAdd);
		return stayToAdd;
	} catch (err) {
		logger.error('cannot insert stay', err)
		throw err;
	}
}

function _buildCriteria(filterBy) {
	let criteria = {};
	const txtCriteria = { $regex: filterBy.address, $options: 'i' };
	if (filterBy.address && filterBy.address !== '') {
		criteria = { 'loc.address': txtCriteria };
	}
	if (filterBy.guests) {
		criteria.capacity = { $gte: filterBy.guests };
	}
	return criteria;
}

async function getWishStays(user) {
	var list = user.wishlist;
	try {
		const collection = await dbService.getCollection('stay');

		var ids = [];
		list.forEach(function (item) {
			ids.push(new ObjectId(item));
		});
		var stays = await collection.find({ _id: { $in: ids } }).toArray();
		return stays;
	} catch (err) {
		logger.error('cannot find stays', err);
		throw err;
	}
}

async function getHostStays(hostId) {
	try {
		const collection = await dbService.getCollection('stay');
		const id = new ObjectId(hostId)
		var stays = await collection.find({ 'host._id': id }).toArray();
		return stays;
	} catch (err) {
		logger.error('cannot find stays', err);
		throw err;
	}
}

async function getStaysByType(filterBy) {
	try {
		const collection = await dbService.getCollection('stay');
		var stays = await collection.find().toArray();
		if (stays) {
			if (filterBy.type === 'top rated') {
				stays = stays.map((stay) => {
					stay.avgRate = _getRate(stay);
					return stay;
				});
				stays.sort(function (a, b) {
					return b.avgRate - a.avgRate;
				});
				return stays.slice(0, 4);
			}
			else if (filterBy.type === 'nearby') {
				const { data } = filterBy
				stays = stays.filter((stay) => {
					return stay.loc.address.toUpperCase().includes(data.toUpperCase());
				});
				return stays.slice(0, 4);
			}
		}
	} catch (err) {
		logger.error('cannot find stays', err);
		throw err;
	}
}

function _getRate(stay) {
	const rates = stay.reviews.map((review) => review.avgRate);
	const sum = rates.reduce((acc, rate) => {
		acc += rate;
		return acc;
	}, 0);
	return sum / rates.length;
}



// async function getByStayname(name) {
// 	try {
// 		const collection = await dbService.getCollection('stay');
// 		const stay = await collection.findOne({ name });
// 		return stay;
// 	} catch (err) {
// 		logger.error(`while finding stay ${toyname}`, err)
// 		throw err;
// 	}
// }


// async function getStaysByType(filterBy) {
	// 	const { type, user } = filterBy
	// 	var data = user
	// 	var stays = []
	// 	let criteria = {}
	// 	console.log('$$$$$$$$$$$$$$',type, user);
	// 	const collection = await dbService.getCollection('stay')
	// 	switch (type) {
	// 		case 'wishlist': {
	// 			console.log('enter to wish');
	// 			data = JSON.parse(data)
	// 			console.log('data',data);
	// 			var list = data.wishlist;
	// 			var ids = [];
	// 			list.forEach(function (item) {
	// 				ids.push(new ObjectId(item));
	// 			});
	// 			criteria = { '_id': { $in: ids } }
	// 			console.log('criteria',criteria);
	// 			break
	// 			// stays = await collection.find({ _id: { $in: ids } }).toArray();
	// 		}
	// 		case 'host': {
	// 			const id = new ObjectId(data)
	// 			criteria = { 'host._id': id }
	// 			break
	// 			//  stays = await collection.find({ 'host._id': id }).toArray();
	// 			// return stays;
	// 		}
	// 		case 'top rated': {

	// 		}
	// 		case 'nearby': {

	// 		}
	// 	}

	// 	try {
	// 		stays = await collection.find(criteria).toArray();
	// 	} catch (err) {
	// 		logger.error('cannot find stays', err);
	// 		throw err;
	// 	}
	// }
// }