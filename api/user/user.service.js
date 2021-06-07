
const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query() {

    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find().toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        // logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password
        // ***********
        // user.givenReviews = await reviewService.query({ userId: ObjectId(user._id) })
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.user
        //     return review
        // })
        // ***********
        return user
    } catch (err) {
        // logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        // logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        // logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {

    try {
        // console.log('user notifications' , user.notifications);
        // peek only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            isHost: user.isHost,
            imgUrl: user.imgUrl,
            notifications: user.notifications
        }

        if (user.wishlist || user.wishlist.length === 0) userToSave.wishlist = user.wishlist;

        const collection = await dbService.getCollection('user')

        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })

        return userToSave

    } catch (err) {
        // logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            email: user.email,
            imgUrl: user.imgUrl,
            isHost: false,
            wishlist: [],
            notifications: []
        }
        const collection = await dbService.getCollection('user')

        await collection.insertOne(userToAdd)

        return userToAdd

    } catch (err) {
        // logger.error('cannot insert user', err)
        throw err
    }
}



