// backend/routes/purchaseRequestRoutes.js

const express = require('express');
const router = express.Router();
const {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
  deletePurchaseRequest,
  approvePurchaseRequest,
  processPurchasePayment
} = require('../controllers/purchaseRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.route('/')
  .post(createPurchaseRequest)
  .get(getPurchaseRequests);

router.route('/:id')
  .patch(updatePurchaseRequestStatus)
  .delete(deletePurchaseRequest);

// Add routes for approval and payment
router.route('/approve/:id')
  .patch(approvePurchaseRequest);

router.route('/payment/:id')
  .patch(processPurchasePayment);

module.exports = router;