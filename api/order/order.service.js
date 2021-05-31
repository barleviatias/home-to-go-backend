const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('order')
        return await collection.find().toArray()            
    } catch (err) {
        logger.error('cannot load orders', err)
        throw err
    }

}

async function remove(orderId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const collection = await dbService.getCollection('order')
        // remove only if user is owner/admin
        // const query = { _id: ObjectId(orderId) }
        // if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne( {_id: ObjectId(orderId)})
        // return await collection.deleteOne({ _id: ObjectId(reviewId), byUserId: ObjectId(userId) })
    } catch (err) {
        // logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(order) {
    try {
        // peek only updatable fields!
        const orderToAdd = {
           createdAt:Date.now(),
           host:order.host,
           user:order.user,
           totalPrice:order.totalPrice,
           startDate:order.startDate,
           endDate:order.endDate,
           guests:order.guests,
           stay:order.stay,
           status:"wait for approval"
        }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd;
    } catch (err) {
        // logger.error('cannot insert review', err)
        throw err
    }
}

// function _buildCriteria(filterBy) {
//     const criteria = {}
//     return criteria
// }

module.exports = {
    query,
    remove,
    add
}



// async function query(filterBy = {}) {
//     try {
//         // const criteria = _buildCriteria(filterBy)
//         const collection = await dbService.getCollection('order')
//         // const reviews = await collection.find(criteria).toArray()
//         var reviews = await collection.aggregate([
//             {
//                 $match: filterBy
//             },
//             {
//                 $lookup:
//                 {
//                     localField: 'userId',
//                     from: 'user',
//                     foreignField: '_id',
//                     as: 'user'
//                 }
//             },
//             {
//                 $unwind: '$user'
//             },
//             {
//                 $lookup:
//                 {
//                     localField: 'toyId',
//                     from: 'toy',
//                     foreignField: '_id',
//                     as: 'toy'
//                 }
//             },
//             {
//                 $unwind: '$toy'
//             }
//         ]).toArray()
//         reviews = reviews.map(review => {
//             review.user = { _id: review.user._id, fullname: review.user.fullname }
//             review.toy = { _id: review.toy._id, name: review.toy.name }
//             delete review.userId
//             delete review.toyId
//             return review
//         })

//         return reviews
//     } catch (err) {
//         // logger.error('cannot find reviews', err)
//         throw err
//     }

// }