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
 *     summary: Create a new loan (Admin only)
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
 *               - frequency
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
 *               frequency:
 *                 type: string
 *                 enum: [weekly, monthly]
 *     responses:
 *       201:
 *         description: Loan created successfully
 *       400:
 *         description: Missing or invalid fields
 *       403:
 *         description: Unauthorized (only admin can create loans)
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans (Admin or Agent)
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
 *                       frequency:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       numInstallments:
 *                         type: integer
 *                       finalAmount:
 *                         type: number
 *                       amountPaid:
 *                         type: number
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

// GET all loans - accessible by admin and agent
router.get('/', verifyToken, checkRole('admin', 'agent'), loanController.getAll);

// POST a loan - only admin can create loan
router.post('/', verifyToken, checkRole('admin'), loanController.create);

module.exports = router;
