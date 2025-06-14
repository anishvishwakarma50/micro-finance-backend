const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   - name: Loan
 *     description: Loan management
 */

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Create a new loan
 *     tags:
 *       - Loan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - amount
 *               - durationMonths
 *               - interestRate
 *               - startDate
 *             properties:
 *               customerId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               durationMonths:
 *                 type: integer
 *               interestRate:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Loan created successfully
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans
 *     tags:
 *       - Loan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of loans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       customerId:
 *                         type: integer
 *                       amount:
 *                         type: number
 *                       durationMonths:
 *                         type: integer
 *                       interestRate:
 *                         type: number
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       Customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           phone:
 *                             type: string
 *       500:
 *         description: Internal server error
 */

router.get('/', verifyToken, checkRole('admin', 'agent'), loanController.getAll);
router.post('/', verifyToken, checkRole('admin', 'agent'), loanController.create);

module.exports = router;
