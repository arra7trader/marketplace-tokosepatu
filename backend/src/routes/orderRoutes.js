const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getUserOrders);

module.exports = router;
