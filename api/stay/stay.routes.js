const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getStay, getStays, deleteStay, updateStay, addStay} = require('./stay.controller') // EDIT!
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getStays)
router.get('/:id', getStay)
router.put('/:id',  updateStay)
router.post('/',  addStay)
router.delete('/:id', deleteStay)

// router.put('/:id',  requireAuth, updateToy)
// router.delete('/:id',  requireAuth, requireAdmin, deleteToy)

module.exports = router