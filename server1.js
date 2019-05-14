const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1'); //Gera uuid
const app = express();
const fs = require('fs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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


//Parte A alienea a) -> Lista todas as fotografias existentes no ficheiro photos.json
app.get('/', function (req, res) {
    res.send(JSON.parse(readFile('./photos.json')));
});


// //Parte A alinea b) -> Adicionar nova imagem e atualizar o ficheiro
app.post('/', function (req, res) {
    var foto = JSON.parse(readFile("./photos.json"));

    var fotoKeys = Object.keys(foto);
    var fotoLength = fotoKeys.length;

    foto['fotografia' + (fotoLength + 1)] = req.body;
    foto['fotografia' + (fotoLength + 1)].id = uuidv1();

    var conteudo = JSON.stringify(foto, null, 4);
    fs.writeFile('./photos.json', conteudo, function (err) {
        if (err) throw err;
        console.log('fotografia' + (fotoLength + 1) + ' guardada com sucesso!');
    });
});


//Parte A alinea c) -> Seleccionar todas as fotografias de um uploader
app.get('/uploader/:nome', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    var uploader = req.params.nome.toLowerCase(); //Passa para letras minusculuas

    //Objeto vazio para guardar os resultados
    var resul = {};

    for (var i = 1; i <= photosLength(foto); i++) {
        if (foto['fotografia' + i].uploader.toLowerCase() == uploader) {
            resul['fotografia' + i] = foto['fotografia' + i];
        }
    };

    res.send(resul);
});


//Parte A alinea d) -> Incrementar o numero de likes e atualizar o ficheiro
app.post('/like/:id', function (req, res) {
    var foto = JSON.parse(readFile('./photos.json'));

    //Ciclo que percorre o ficheiro photos.json, encontra o id especifico, incrementa os likes e devolve o resultado atualizado na resposta
    for (var i = 1; i <= photosLength(foto); i++) {
        if (foto['fotografia' + i]['id'] == req.params.id) {
            foto['fotografia' + i]['Likes'] += 1;
            res.send(foto['fotografia' + i]);
            fs.writeFileSync('./photos.json', JSON.stringify(foto, null, 4));
        }
    };
});


//Parte A alinea e) -> 
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
                    resul['fotografia' + i] = foto['fotografia' + i]; // Guarda a fotografia dentro do objecto criado anteriormente evitando resultados repetidos
                };
            };
        };
    };

    res.send(resul);
});
