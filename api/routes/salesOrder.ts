import express from 'express'
import controller from '../controller/salesOrderController'

const router = express.Router()

const { getSalesOrderByUserId, createSalesOrder, getOrdersByUserId, updateOrder } = controller

router.get('/', getOrdersByUserId)
router.put('/:id', updateOrder)
router.get('/sales', getSalesOrderByUserId)
router.post('/create', createSalesOrder)

export default router