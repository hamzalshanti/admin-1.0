const { validationResult } = require('express-validator');
const { getErrorsObject } = require('../authFn');


/*********** Common Functions ****************/

// Put Args For Render Function
function set_render_args(req, type, page, arrayType = []) {
    let args = {
        layout: 'admin', 
        errorObject: req.flash('errorObject')[0],
        formTitle: `${page} ${type}`,
        arrayType,
        item: req.flash(type)[0]
    }
    try {
        args.arrayType = arrayType.map(arr => arr.toJSON());
        return args;
    } catch(error) {
       return args;
    }
}


// Show Items
function show_items(req, res, type, items) {
    return res.render(`dashboard/${type}/show`, { 
        layout: 'admin', 
        items: items.map(user => user.toJSON()),
        success: req.flash('success')[0],
    });
}

// Redirect to Add/Edit Page
function redirect_page(res, type, args) {
    return res.render(`dashboard/${type}/add`, args);
}


// Put successful Modified Massege Into Flash Request
function modefied_message(req, type) {
    req.flash('success', `Modified ${type} Successfuly ..`);
}

// Put successful Added Massege Into Flash Request
function added_message(req, type) {
    req.flash('success', `Create ${type} Succssfuly ..`);   
}

// Redirect User To Show Page Of Item Type if successful
function successful_redirect(req, res, type) {
    return res.redirect(`/admin-panel/${type}/show`);
}

// Check Errors In Add Page Of Item Type
function check_add_errors(req, res, type, fields) {
    errors  = check_errors(req, res, type, fields);
    if(errors.length > 0) return `/admin-panel/${type}/add`;
    return;
}

// Check Errors In Edit Page Of Item Type
function check_edit_errors(req, res, type, fields) {
    errors  = check_errors(req, res, type, fields);
    if(errors.length > 0) return `/admin-panel/${type}/edit/${req.body.itemId}`;
    return;
}

// Return Result Of Validation
function check_errors(req, res, type, fields) {
    let { errors } = validationResult(req);
    if(errors.length > 0) {
        req.flash('errorObject', getErrorsObject(errors));
        req.flash(type, fields);
    }
    return errors;
}


module.exports = {
    set_render_args,
    show_items,
    redirect_page,
    modefied_message,
    added_message,
    successful_redirect,
    check_add_errors,
    check_edit_errors,
}