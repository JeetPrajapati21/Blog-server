require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const connection = require("./db");
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "http://localhost:5000"
};

let gfs;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
// app.use("/images",  express.static(path.join(__dirname, "/images")));

connection();

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);
app.use("/file", upload);

app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});