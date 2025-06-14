const express = require('express');
const router = express.Router();
const repaymentController = require('../controllers/repayment.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

router.get('/', verifyToken, checkRole('admin', 'agent'), repaymentController.getAll);
router.post('/', verifyToken, checkRole('admin', 'agent'), repaymentController.create);

module.exports = router;
