//import { express } from 'express';
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
import _ from 'lodash/array';

/**
 * Consdtructeur.
 * @constructor
 */
function Upload () {

}

Upload.launchServer = function(msg) {
    global.appRoot = path.resolve(__dirname);
    var isWin = process.platform === "win32";
    console.log(isWin)

    const app = express();
    app.use(express.static('public'));
    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: true }))

    app.listen(3333, function () {
        console.log('listening on port 3333!');
    });

    const uploadDir = 'F:/naoned-makers/lea/leaspeaking/uploads';

    app.post('/', function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            console.log("sdvfvd", fields);
            console.log("files",files);
            
            saveSound(fields.sound-name, files.vpd);
        
        });
        res.send(null);
    });

    function saveSound(title, file) {
        fs.copyFileSync(file.path, uploadDir + "/" + title + ".mp3");
        //fs.rename(file.path, path.join(uploadDir, title + ".mp3"));
        console.log("popo");
    }

    app.post('/upload', function(req, res){
        console.log("req", req.value);
    //    console.log(JSON.stringify(req.body, null, 2));
    //    console.log(req.body);
    //     console.log(req.query.value);
    //     console.log(req.query.soundName);
        //console.log("res", res);

        // create an incoming form object
        /*var form = new formidable.IncomingForm();

        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;

        // store all uploads in the /uploads directory
        form.uploadDir = 'F:/naoned-makers/lea/leaspeaking/uploads';

        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file, soundName) {

            console.log("field", field);
            console.log("file.path", file);
            console.log("form.uploadDir", form.uploadDir);
            console.log("file.name", file.formData);
            console.log("soundName", file.soundName);
            console.log(field);
            
            if (path.extname(file.name) == ".mp3") {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
            console.log("popo");
            } else {
            console.log("paspopo");
            fs.unlinkSync(file.path);
            form._error;
            }
            
        });

        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            res.end('success');
        });

        // parse the incoming request containing the form data
        form.parse(req);
*/
        });
}

module.exports = Upload;