const Tag = require('../../models/tagModel');
const TagTranslation = require('../../models/tagTranslationModel');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const {
  display_add_tag_page,
  display_edit_tag_page,
  add_tag,
  edit_tag,
  formatEditInputs,
  getFields,
} = require('../../functions/adminFunctions/tagFn');
const { Mongoose } = require('mongoose');

const type = 'tag';
let page = '';

/**
 * Tag controllers of Route: /admin-panel/tag
 */

/**
 * Controller of Route/show
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_show_tags = async (req, res) => {
  try {
    const items = await TagTranslation.find({
      code: 'en',
    });
    show_items({ req, res, type, items });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller of Route/add
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_add_tag = async (req, res) => {
  page = 'Add';
  display_add_tag_page({ req, res, type, page });
};

/**
 * Controller of Route/edit/:id
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_edit_tag = async (req, res) => {
  const item = await formatEditInputs(req.params.id);
  page = 'Edit';
  display_edit_tag_page({ req, res, type, item, page });
};

/**
 * Controller of Route/add
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const post_add_tag = async (req, res) => {
  const fields = getFields(req);
  add_tag({ req, res, type, fields });
};

/**
 * Controller of Route/edit
 * Method PUT
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const put_edit_tag = async (req, res) => {
  const fields = getFields(req);
  await edit_tag({ req, res, type, fields });
};

/**
 * Controller of Route/show
 * Method DELETE
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const delete_tag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.body.id);
    await TagTranslation.deleteMany({
      tag: mongoose.Types.ObjectId(req.body.id),
    });
    res.redirect('/admin-panel/tag/show');
  } catch {}
};

module.exports = {
  get_show_tags,
  get_add_tag,
  get_edit_tag,
  post_add_tag,
  put_edit_tag,
  delete_tag,
};
