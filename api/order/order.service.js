const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')
// const asyncLocalStorage = require('../../services/als.service')

async function query(user) {
    try {
        const criteria = _buildCriteria(user)
        const collection = await dbService.getCollection('order')
        return await collection.find(criteria).toArray()
    } catch (err) {
        logger.error('cannot load orders', err)
        throw err
    }
}

function _buildCriteria({ id, type }) {
    let criteria = {}
    if (type === 'user') criteria = { 'user._id': id }
    else criteria = { 'host._id': id }
    return criteria
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const orderToAdd = {
            createdAt: Date.now(),
            host: order.host,
            user: order.user,
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            stay: order.stay,
            status: "wait for approval"
        }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd;
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

module.exports = {
    query,
    remove,
    add
}
