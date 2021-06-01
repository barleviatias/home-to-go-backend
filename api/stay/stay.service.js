const dbService = require('../../services/db.service');
// const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId;

module.exports = {
	query,
	getById,
	getByStayname,
	remove,
	update,
	add,
};
async function query(filterBy = { address: '', guests: 1 }) {
	const criteria = _buildCriteria({...filterBy});
	try {
		const collection = await dbService.getCollection('stay');
		var stays = await collection.find(criteria).toArray();
		// var stays = await collection.find({'loc.address': "Porto, Portugal"}).toArray();
		console.log('criteria', criteria);
		// console.log(stays);

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
		// toy.givenReviews = await reviewService.query({ byToyId: ObjectId(toy._id) })
		// toy.givenReviews = toy.givenReviews.map(review => {
		//     delete review.byToy
		//     return review
		// })
		return stay;
	} catch (err) {
		logger.error(`while finding stay ${stayId}`, err);
		throw err;
	}
}

async function getByStayname(name) {
	try {
		const collection = await dbService.getCollection('stay');
		const stay = await collection.findOne({ name });
		return stay;
	} catch (err) {
		// logger.error(`while finding toy ${toyname}`, err)
		throw err;
	}
}

async function remove(stayId) {
	try {
		const collection = await dbService.getCollection('stay');
		await collection.deleteOne({ _id: ObjectId(stayId) });
	} catch (err) {
		// logger.error(`cannot remove toy ${toyId}`, err)
		throw err;
	}
}

async function update(stay) {
	try {
		// peek only updatable fields!
		const stayToSave = {
			_id: ObjectId(stay._id),
			name: stay.name,
			imgUrls: stay.imgUrls,
			price: stay.price,
			desc: stay.desc,
			capacity: stay.capacity,
			favorites: stay.favorites,
			host: stay.host,
			loc: stay.loc,
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
		// logger.error(`cannot update toy ${toy._id}`, err)
		throw err;
	}
}

async function add(stay) {
	try {
		// peek only updatable fields!
		const stayToAdd = {
			name: stay.name,
			imgUrls: stay.imgUrls,
			price: stay.price,
			desc: stay.desc,
			capacity: stay.capacity,
			favorites: [],
			host: stay.host,
			loc: stay.loc,
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
		// logger.error('cannot insert toy', err)
		throw err;
	}
}

function _buildCriteria(filterBy) {
	let criteria = {};
	console.log('filter by i crite', filterBy);
	// const regex = new RegExp(filterBy.address, 'i')

	const txtCriteria = { $regex: filterBy.address, $options: 'i' };
	
        if (filterBy.address && filterBy.address !== '') {
            criteria= {'loc.address':txtCriteria};
        }
        if (filterBy.guests) {
            criteria.capacity = { $gte: filterBy.guests };
	}
	return criteria;
}

// async function query(filterBy = { availability: 'all', searchTxt: '', type: 'all', sortBy: 'all' }) {
//     const criteria = _buildCriteria({ ...filterBy })
//     try {
//         const collection = await dbService.getCollection('toy')
//         var toys
//         if (filterBy.sortBy) {
//             switch (filterBy.sortBy) {
//                 case 'price':
//                      toys = await collection.find(criteria).sort({'price' : 1}).toArray()
//                     break;
//                 case 'name':
//                      toys = await collection.find(criteria).sort({'name' : 1}).toArray()
//                     break;
//                 case 'all':
//                      toys = await collection.find(criteria).toArray()
//                     break;
//                 default:
//                     break;
//             }
//         }
//         toys = toys.map(toy => {
//             toy.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
//             // toy.createdAt = ObjectId(toy._id).getTimestamp()
//             // Returning fake fresh data
//             return toy
//         })
//         return toys
//     } catch (err) {
//         // logger.error('cannot find toys', err)
//         throw err
//     }
// }
