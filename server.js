const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const app = express();
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var uui = uuid();

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function readFile(fileName) {
    var file = fs.readFileSync(fileName, 'utf-8');
    return file;
}

// Lista todas as fotografias existentes no ficheiro photos.json
app.get('/', function (req, res) {
    res.send(readFile('./photos.json'));
});

//Adicionar nova imagem e atualizar o ficheiro
app.post('/', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    var fotoKeys = Object.keys(foto);
    var fotoLength = fotoKeys.length;

    foto['fotografia' + (fotoLength + 1)] = req.body;
    foto['fotografia' + (fotoLength + 1)].id = uui;

    fs.writeFileSync('./photos.json', JSON.stringify(foto, null, 4));

    console.log('fotografia' + (fotoLength + 1) + " adicionada com sucesso.");
    res.send(foto);
});

//Seleccionar todas as fotografias de um uploader
// app.get('/:uploader', function (req, res) {
//     var foto = JSON.parse(readFile('./photos.json'));

//     var fotoKeys = Object.keys(foto);
//     var fotoLength = fotoKeys.length;

//     var uploader = req.params.uploader;
//     var resul = [];

//     for (var i = 1; i <= fotoLength; i++) {
//         if (foto['fotografia' + i].uploader == uploader) {
//             resul.push(foto['fotografia' + i]);
//         }
//     };
//     console.log(resul);
//     res.send(resul);
// });

//Incrementar o numero de likes e atualizar o ficheiro
app.post('/', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    var fotoKeys = Object.keys(foto);
    var fotoLength = fotoKeys.length;

    for (var i = 1; i <= fotoLength; i++) {
        foto['fotografia' + i]['Likes'] += 1;
    };

    fs.writeFileSync('./photos.json', JSON.stringify(foto, null, 4));
    res.send(foto);
});

//Listar todas as fotografias por tags
app.get('/:tag1/:tag2', function(req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    var fotoKeys = Object.keys(foto);
    var fotoLength = fotoKeys.length;

    var resul = [];

    for (var i = 1; i <= fotoLength; i++) {
        for ( var j = 0; j <= foto['fotografia' + i]['tags'].length; j++ )
            if ((foto['fotografia' + i]['tags'][j] == req.params.tag1) || foto['fotografia' + i]['tags'][j] == req.params.tag2)  {
                resul.push(foto['fotografia' + i]);
            };
    };

    var resulFinal = resul.filter(function (fotografia, index) {
        return resul.indexOf(fotografia) === index;
    });

    res.send(resulFinal);
});