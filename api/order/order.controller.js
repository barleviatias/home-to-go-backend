const logger = require('../../services/logger.service')
const orderService = require('../order/order.service')
// const userService = require('../user/user.service')
// const socketService = require('../../services/socket.service')

async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function getOrder(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function deleteOrder(req, res) {
    try {
        await orderService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}

async function addOrder(req, res) {
    try {
        var order = req.body
        order = await orderService.add(order)
        res.send(order)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

async function updateOrder(req, res) {
    try {
        const order = req.body;
        const updatedOrder = await orderService.update(order);
        res.send(updatedOrder);
        // socketService.broadcast({ type: 'stayy-updated', data: stay, to: updatedToy._id })
    } catch (err) {
        logger.error('Failed to update order', err);
        res.status(500).send({ err: 'Failed to update order' });
    }
}




module.exports = {
    getOrders,
    getOrder,
    deleteOrder,
    addOrder,
    updateOrder
}

{
    // prepare the updated order for sending out
    // order.user = await userService.getById(order.userId)
    // order.toy = await orderService.getById(order.orderId)
    // console.log('CTRL SessionId:', req.sessionID);
    // socketService.broadcast({type: 'order-added', data: order})
    // socketService.emitToAll({type: 'user-updated', data: order.user, room: req.session.user._id})
}