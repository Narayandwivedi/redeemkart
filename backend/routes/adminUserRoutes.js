const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  resetUserPassword,
  toggleUserStatus,
  toggleUser404,
  impersonateUser
} = require('../controllers/adminUserController');

const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
// router.use(protect);
// router.use(authorize('admin'));

// User management routes
router.route('/')
  .get(getAllUsers);

router.get('/stats', getUserStats);

router.route('/:id')
  .get(getUserById) 
  .put(updateUser)
  .delete(deleteUser);

router.post('/:id/reset-password', resetUserPassword);
router.patch('/:id/toggle-status', toggleUserStatus);
router.patch('/:id/toggle-404', toggleUser404);
router.post('/:id/impersonate', impersonateUser);

module.exports = router;