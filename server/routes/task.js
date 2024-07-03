const express = require('express');
const {
  createTask,
  deleteTask,
  updateTask,
  getTasks,
  getTask,
  analytics,
} = require('../controllers/task');

const {protect} = require('../middleware/AuthMiddleware');

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.get('/analytics', protect, analytics);
router.get('/:taskId', getTask);
router.patch('/:taskId', protect, updateTask);
router.delete('/:taskId', protect, deleteTask);

module.exports = router;