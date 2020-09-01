const mongoose = require('mongoose');

const db = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, { 
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`MONGODB CONNECT ${conn.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = db;