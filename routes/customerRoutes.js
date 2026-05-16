const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const {verifyToken, isAdmin} = require('../middlewares/authMiddleware')

router.post('/register', customerController.registerCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', verifyToken, isAdmin, customerController.deleteCustomer);

module.exports = router;