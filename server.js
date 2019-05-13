const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const app = express();
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var uui = uuid();

//Função para obter o length do ficheiro photos.json
function photosLength(fileName) {
    var fotoKeys = Object.keys(fileName);
    var fotoLength = fotoKeys.length;
    return fotoLength;
};

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

    foto['fotografia' + (photosLength(foto) + 1)] = req.body;
    foto['fotografia' + (photosLength(foto) + 1)].id = uui;

    fs.writeFileSync('./photos.json', JSON.stringify(foto, null, 4));

    console.log('fotografia' + (photosLength(foto) + 1) + " adicionada com sucesso.");
    res.send(foto);
});

//Seleccionar todas as fotografias de um uploader
app.get('/:uploader', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    var uploader = req.params.uploader;
    var resul = [];
// !!!!!!!!!!!!!!!!!!!!! VERIFICAR O RESUL PARA SER COMO ALINEA E !!!!!!!!!!!!!!!!!!!!!!!!
    for (var i = 1; i <= photosLength(foto); i++) {
        if (foto['fotografia' + i].uploader == uploader) {
            resul.push(foto['fotografia' + i]);
        }
    };

    res.send(resul);
});

//Incrementar o numero de likes e atualizar o ficheiro
app.post('/:title', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    for (var i = 1; i <= photosLength(foto); i++) {
        if (foto['fotografia' + i]['Title'] == req.params.title) {
            foto['fotografia' + i]['Likes'] += 1;
            res.send(foto['fotografia' + i]);
        }
    };
// !!!!!!!!!!!!!!!!!!!!!!!  ALTERAR PARA SER COM O ID EM VEZ DO TITULO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    fs.writeFileSync('./photos.json', JSON.stringify(foto, null, 4));

});

//Alinea E)
app.get('/search', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    //Objecto vazio onde serão guardados os resultados
    var resul = {};

    //Cria um array a partir das tags recebidas
    var q = req.query.tags.split(" ");

    //Ciclos que percorrem os arrays para encontrar as fotografias com as tags dadas
    for (var i = 1; i <= photosLength(foto); i++) {
        for (var j = 0; j <= foto['fotografia' + i]['tags'].length; j++) {
            for (var k = 0; k < q.length; k++) {
                if (foto['fotografia' + i]['tags'][j] == q[k]) {
                    resul['fotografia' + i] = foto['fotografia' + i];
                };
            };
        };
    };

    res.send(resul);
});
