const bcrypt = require('bcrypt');

const getErrorsObject = (errors) => {
    const errorObject = {};
    errors.forEach(error => {
        errorObject[error.param] = error.msg;
    });
    return errorObject;
}

const hashPassword = async password => await bcrypt.hash(password, await bcrypt.genSalt());

module.exports = {
    getErrorsObject,
    hashPassword
}