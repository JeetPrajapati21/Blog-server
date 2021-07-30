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

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "http://localhost:5000"
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/images",  express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(console.log('Connected to mongoDB'))
    .catch(err => {
        console.log(err);
    })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
        },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
});

const upload = multer({storage: storage});

app.post('/api/upload', upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded!");
});

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});