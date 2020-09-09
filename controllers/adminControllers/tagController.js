const Tag = require('../../models/tagModel');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const type = 'Tag';

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
    const items = await Tag.find();
    show_items({ req, res, type, items });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  get_show_tags,
};
