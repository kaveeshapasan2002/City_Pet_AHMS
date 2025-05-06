// routes/boardingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const boardingController = require('../controllers/boardingController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Define routes
router.post('/', boardingController.createBoarding);
router.get('/', boardingController.getUserBoardings);
router.get('/:id', boardingController.getBoardingById);
router.put('/:id', boardingController.updateBoarding);
router.delete('/:id', boardingController.cancelBoarding);
router.put('/:id/status', boardingController.updateBookingStatus);
router.delete('/:id', boardingController.deleteBoarding);
router.get('/admin/bookings', boardingController.getAllBookings);

module.exports = router;
