const express = require('express');
const router = express.Router();
const repaymentController = require('../controllers/repayment.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

/**
 * @route POST /api/repayments
 * @desc Record a repayment (admin or agent)
 */

/**
 * @swagger
 * /api/repayments:
 *   post:
 *     summary: Record a repayment for a loan
 *     tags:
 *       - Repayment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanId
 *               - amount
 *               - paymentDate
 *             properties:
 *               loanId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 2000
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-09
 *     responses:
 *       201:
 *         description: Repayment recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Repayment'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/repayments/{loanId}:
 *   get:
 *     summary: Get all repayments for a specific loan
 *     tags:
 *       - Repayment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the loan
 *     responses:
 *       200:
 *         description: Repayment history fetched
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
 *                     $ref: '#/components/schemas/Repayment'
 *       500:
 *         description: Server error
 */


router.post('/', verifyToken, checkRole('admin', 'agent'), repaymentController.create);

/**
 * @route GET /api/repayments/:loanId
 * @desc Get all repayments for a loan
 */
router.get('/:loanId', verifyToken, checkRole('admin', 'agent'), repaymentController.getByLoan);

module.exports = router;
