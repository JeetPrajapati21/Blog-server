const mongoose = require("mongoose");

module.exports = async function connection() {
    try {
        const connectionParams = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        await mongoose.connect(process.env.MONGO_URL, connectionParams);
        console.log("connected to database");
    } catch (error) {
        console.log(error);
        console.log("could not connect to database");
    }
};