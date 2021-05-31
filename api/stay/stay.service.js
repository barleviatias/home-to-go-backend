
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByStayname,
    remove,
    update,
    add
}

async function query() {
    // const criteria = _buildCriteria({ ...filterBy })
    try {
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find().toArray()
        // var stays
        // if (filterBy.sortBy) {
        //     switch (filterBy.sortBy) {
        //         case 'price':
        //              stays = await collection.find(criteria).sort({'price' : 1}).toArray()
        //             break;
        //         case 'name':
        //              stays = await collection.find(criteria).sort({'name' : 1}).toArray() 
        //             break;
        //         case 'all':
        //              stays = await collection.find(criteria).toArray() 
        //             break;
        //         default:
        //             break;
        //     }
        // }
        // stays = stays.map(toy => {
        //     toy.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
        //     // toy.createdAt = ObjectId(toy._id).getTimestamp()
        //     // Returning fake fresh data
        //     return toy
        // })
        return stays
    } catch (err) {
        // logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ '_id': ObjectId(stayId) })
        // toy.givenReviews = await reviewService.query({ byToyId: ObjectId(toy._id) })
        // toy.givenReviews = toy.givenReviews.map(review => {
        //     delete review.byToy
        //     return review
        // })
        return stay
    } catch (err) {
        // logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function getByStayname(toyname) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ toyname })
        return toy
    } catch (err) {
        // logger.error(`while finding toy ${toyname}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
    } catch (err) {
        // logger.error(`cannot remove toy ${toyId}`, err)
        throw err
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
            updadetAt: Date.now()
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ '_id': stayToSave._id }, { $set: stayToSave })
        return stayToSave;
    } catch (err) {
        // logger.error(`cannot update toy ${toy._id}`, err)
        throw err
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
        }
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stayToAdd)
        return stayToAdd
    } catch (err) {
        // logger.error('cannot insert toy', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    const txtCriteria = { $regex: filterBy.searchTxt, $options: 'i' }

    if (filterBy.searchTxt && filterBy.searchTxt !== '') {
        criteria.name = txtCriteria
    }

    if (filterBy.type && filterBy.type !== 'all') {
        criteria.type = filterBy.type
    }

    if (filterBy.availability && filterBy.availability !== 'all') {
        switch (filterBy.availability) {
            case 'in-stock':
                criteria.inStock = true
                break;
            case 'out-of-stock':
                criteria.inStock = false
                break;
            default:
                break;
        }
    }
    return criteria
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