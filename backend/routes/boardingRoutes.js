// routes/boardingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const boardingController = require('../controllers/boardingController');
const dailyRecordController = require('../controllers/dailyRecordController'); // Add this line

// Apply auth middleware to all routes
router.use(authMiddleware);

// Define routes
router.post('/', boardingController.createBoarding);
router.get('/', boardingController.getUserBoardings);
router.get('/:id', boardingController.getBoardingById);
router.put('/:id', boardingController.updateBoarding);
router.delete('/:id', boardingController.cancelBoarding);
router.put('/:id/status', boardingController.updateBookingStatus);
router.get('/admin/bookings', boardingController.getAllBookings);

// Add Daily Records routes
router.get('/:id/records', authMiddleware, dailyRecordController.getDailyRecords);

router.post('/boarding/:id/records', authMiddleware, dailyRecordController.addDailyRecord);

module.exports = router;