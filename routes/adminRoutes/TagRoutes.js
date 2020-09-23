const { Router } = require('express');
const router = Router();
const {
  get_add_tag,
  post_add_tag,
  get_show_tags,
  get_edit_tag,
  put_edit_tag,
  delete_tag,
} = require('../../controllers/adminControllers/tagController');

const { tagValidation } = require('../../validation');

router.get('/show', get_show_tags);
router.get('/add', get_add_tag);
router.post('/add', tagValidation, post_add_tag);
router.get('/edit/:id', get_edit_tag);
router.put('/edit', tagValidation, put_edit_tag);
router.delete('/show', delete_tag);

module.exports = router;
