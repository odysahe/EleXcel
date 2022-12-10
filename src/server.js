let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
const path = require('path')
const multer  = require('multer')
const readXlsxFile = require('read-excel-file/node')


let app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('html', require('ejs').renderFile);

const upload = multer({ 
    storage: multer.memoryStorage()
    // storage: multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, path.join(__dirname, 'upload'))
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null,  '__' + Date.now() + path.extname(file.originalname))
    //     }
    // }) 
})

app.get('/', (req, res)=>{
    res.render(path.join(__dirname, 'index.html'));
})

app.post('/', upload.single('file_skrd'), (req, res)=>{
    
    readXlsxFile(req.file.buffer).then((rows) => {
        rows.forEach((e, i) => {
            if (e[0] && !Number.isInteger(e[0])) {
                if (e[0].substr(0, 4) == 'PT. ') {
                    console.log(e[0])
                }
            }
            if (Number.isInteger(e[0])) {
                console.log(e[3]);
            }         
        });
        // fs.unlink(req.file.path);
        // console.log('successfully deleted' + req.file.path);
    })


    // console.log(path.join(__dirname, 'upload/'+req.file.filename));
    res.render(path.join(__dirname, 'index.html'));
    // res.status(req.file.path)
})

app.listen(3000, ()=> {
    console.log('server listening on port 3000');
})