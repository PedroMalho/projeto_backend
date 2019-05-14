// CONSTANTES //
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const app = express();
const fs = require('fs');


// BODY PARSER NECESSÁRIO //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// VARIÁVEL UUID //
var uui = uuid();

// INICIALIZAÇÃO DE SERVIDOR //
const port = 3000
app.listen(port, () => console.log(`APP A CORRER NA PORTA: ${port}!`));

// FUNÇÕES LER FICHEIRO, ESCREVER NO FICHEIRO E OBTER TAMANHO DO FICHEIRO JSON //
function readFile(fileName) {
    var file = fs.readFileSync(fileName, 'utf-8');
    return file;
}

function writeFile(fileName, text) {
    fs.writeFileSync(fileName, text);
}

function photosLength(fileName) {
    var fotoKeys = Object.keys(fileName);
    var fotoLength = fotoKeys.length;
    return fotoLength;
};


// PARTE A // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| // PARTE A //

//Parte A alíenea a) -> Lista todas as fotografias existentes no ficheiro photos.json
app.get('/', function (req, res) {
    res.send(JSON.parse(readFile('./photos.json')));
});


// //Parte A alínea b) -> Adicionar nova imagem e atualizar o ficheiro
app.post('/', function (req, res) {
    var foto = JSON.parse(readFile("./photos.json"));

    var fotoKeys = Object.keys(foto);
    var fotoLength = fotoKeys.length;

    foto['fotografia' + (fotoLength + 1)] = req.body;
    foto['fotografia' + (fotoLength + 1)].id = uuid();

    var conteudo = JSON.stringify(foto, null, 4);
    fs.writeFile('./photos.json', conteudo, function (err) {
        if (err) throw err;
        console.log('fotografia' + (fotoLength + 1) + ' guardada com sucesso!');
    });
});


//Parte A alínea c) -> Seleccionar todas as fotografias de um uploader
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


//Parte A alínea d) -> Incrementar o numero de likes e atualizar o ficheiro
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


//Parte A alínea e) -> Listar todas as fotografias com determinadas tags
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


// PARTE B // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| // PARTE B //


// ALÍNEA A //
app.get('/photos/:id', function (request, response) {
    var id = request.params.id;
    var file = readFile("photos.json");
    var dados = JSON.parse(file);
    response.send(dados[id]);
});


// ALÍNEA B //
app.delete('/photos/:id', function (request, response) {
    var id = request.params.id;
    var file = readFile("photos.json");
    var dados = JSON.parse(file);
    // VERIFICA SE O ID DE FOTOGRAFIA POSTO NO URL EXISTE // 
    if (dados[id] == null) {
        response.send("FOTOGRAFIA NÃO EXISTE!");
        // CASO NÃO EXISTA ELIMINA A FOTOGRAFIA // 
    } else {
        delete dados[id];
        writeFile("photos.json", JSON.stringify(dados));
        response.send("FOTOGRAFIA APAGADA!");
    }
});


// ALÍNEA C //
app.get('/photos/inc/:id', function (request, response) {
    var id = request.params.id;
    var file = readFile("photos.json");
    var data = JSON.parse(file);
    // INCREMENTA SEMPRE MAIS 1 AO NUMERO ANTERIOR //
    data[id].Dislikes += 1;
    writeFile("photos.json", JSON.stringify(data));
    response.send(data[id]);
});


// ALÍNEA D //
app.post('/photos/add', function (request, response) {
    var id = request.body.id;
    var newComment = request.body.Comments;
    var file = readFile("photos.json");
    var data = JSON.parse(file);
    // ACRESCENTA O NOVO COMENTÁRIO NO OBJECTO //
    data[id].Comments.push(newComment);
    writeFile("photos.json", JSON.stringify(data));
    response.send(data[id]);
})


// ALÍNEA E //
app.get('/fotos/ordena', function (request, response) {
    var file = readFile("photos.json");
    var data = JSON.parse(file);
    var res = [];
    // ESCREVE DENTRO DO ARRAY VAZIO (RES) OS OBJECTOS //
    for (y in data) {
        res.push(data[y]);
    }
    // ORDENA POR ORDEM CRESCENTE COM SORT //
    var ord = res.sort(function (a, b) {
        if (a.Likes > b.Likes) {
            return 1;
        } else {
            return -1;
        }
    });
    response.send(ord);
})