const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
const path = require('path')
const multer  = require('multer')
const readSheetNames = require('read-excel-file/node')




let appexp = express()

appexp.use(express.urlencoded({ extended: true }));
appexp.use(express.json());

appexp.engine('html', require('ejs').renderFile);

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

appexp.get('/', (req, res)=>{
    res.render(path.join(__dirname, 'index.html'));
})

appexp.post('/', upload.single('file_skrd'), (req, res)=>{
    
    // readXlsxFile(req.file.buffer).then((rows) => {
    //     rows.forEach((e, i) => {
    //         if (e[0] && !Number.isInteger(e[0])) {
    //             if (e[0].substr(0, 4) == 'PT. ') {
    //                 console.log(e[0])
    //             }
    //         }
    //         if (Number.isInteger(e[0])) {
    //             console.log(e[7].split(""));
    //             return false;
    //         }        
    //     });
    //     // fs.unlink(req.file.path);
    //     // console.log('successfully deleted' + req.file.path);
    // })

    readSheetNames(req.file.buffer).then((sheetNames) => {
        console.log(sheetNames);
    })


    // console.log(path.join(__dirname, 'upload/'+req.file.filename));
    res.render(path.join(__dirname, 'index.html'));
})

appexp.listen(3000, ()=> {
    console.log('server listening on port 3000');
})

function createWindow () {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            enableRemoteModule:true,
            nodeIntegration:true,
            contextIsolation: false,
        }
    })
   
    win.loadFile(path.join(__dirname, 'skrd.html'));

    win.webContents.on('did-finish-load', () => {
        win.webContents.printToPDF({
            // marginsType: 1,
            pageSize: 'A4',
            printBackground: true,
            printSelectionOnly: false,
            landscape: false
        }).then(data => {
            console.log(data);
            fs.writeFile(app.getPath('downloads')+"/fileku.pdf", data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('PDF Generated Successfully');
                }
            });
        }).catch(error => {
            console.log(error)
        });
    });
}