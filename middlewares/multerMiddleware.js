const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const productName = req.body.productName;
        // if (!fs.existsSync(`uploads/products/${productName}`)){
        //     fs.mkdirSync(`uploads/products/${productName}`);
        // }
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);  
    else cb(null, false);
}

    upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});
    


module.exports = upload;