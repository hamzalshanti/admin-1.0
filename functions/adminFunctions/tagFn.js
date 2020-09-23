const {
  set_render_args,
  redirect_page,
  modefied_message,
  added_message,
  successful_redirect,
  check_add_errors,
  check_edit_errors,
} = require('./commonFn');

const Tag = require('../../models/tagModel');
const TagTranslation = require('../../models/tagTranslationModel');
const codes = ['en', 'ar'];
const mongoose = require('mongoose');

/*********** Tag Functions ****************/

// Display Add Tag Page
function display_add_tag_page({ req, res, type, page }) {
  const args = set_render_args({ req, type, page });
  redirect_page({ res, type, args });
}

// Display Edit Tag Page
async function display_edit_tag_page({ req, res, type, item, page }) {
  const args = set_render_args({ req, type, page });
  args.isEdit = true;
  args.item = item;
  redirect_page({ res, type, args });
}

// Add Tag
async function add_tag({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  const tag = await Tag.create({});
  await addTranslationTag(fields, tag._id);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit Tag
async function edit_tag({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  const tags = await TagTranslation.find({
    tag: mongoose.Types.ObjectId(req.body.itemId),
  });
  manageEdit(fields, tags);
  modefied_message({ req, type });
  successful_redirect({ req, res, type });
}

async function addTranslationTag(fields, id) {
  const translations = [];
  codes.forEach((code) => {
    translations.push({
      name: fields[`name_${code}`],
      code: code,
      tag: id,
    });
  });
  await TagTranslation.create(translations);
}

async function formatEditInputs(id) {
  const TagTranslations = await TagTranslation.find({
    tag: id,
  });
  const inputsNames = {};
  TagTranslations.forEach((c) => {
    inputsNames[`name_${c.code}`] = c.name;
  });
  inputsNames.id = id;
  return inputsNames;
}

function getFields(req) {
  const fields = {};
  codes.forEach((c) => {
    fields[`name_${c}`] = req.body[`name_${c}`];
  });
  return fields;
}

function manageEdit(fields, tags) {
  tags.forEach(async (c) => {
    await TagTranslation.findByIdAndUpdate(c._id, {
      name: fields[`name_${c.code}`],
    });
  });
}

module.exports = {
  display_add_tag_page,
  display_edit_tag_page,
  add_tag,
  edit_tag,
  formatEditInputs,
  getFields,
};
