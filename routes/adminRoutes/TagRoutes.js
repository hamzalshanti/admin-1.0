const { Router } = require('express');
const router = Router();
const {
  get_show_tags,
} = require('../../controllers/adminControllers/tagController');

router.get('/show', get_show_tags);

module.exports = router;
