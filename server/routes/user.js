const express = require('express');
const { updateUser, getUser, assignPeople } = require('../controllers/user');
const { protect } = require('../middleware/AuthMiddleware');

const router = express.Router();

router.patch('/', protect, updateUser);
router.post("/assignee", protect, assignPeople);
router.get('/', protect, getUser);

module.exports = router;