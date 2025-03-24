// backend/routes/purchaseRequestRoutes.js


//Purchase Request Routes:


const express = require('express');
const router = express.Router();
const {
  createPurchaseRequest,
  getPurchaseRequests,
  updatePurchaseRequestStatus,
  deletePurchaseRequest
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

module.exports = router;