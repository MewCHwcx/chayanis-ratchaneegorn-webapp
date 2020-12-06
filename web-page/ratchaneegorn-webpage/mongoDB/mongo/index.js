var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Mew:miwmew50962@cluster0.0zer8.mongodb.net/schedule-tasks?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
    const db = client.db("schedule-tasks")
    const collection = db.collection("tasks");
    console.log('Connected to Database');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(upload.array());
    app.use(express.static('public'));

    app.set('view engine', 'ejs')
    app.set('views', './public');
   
    app.get('/', (req, res) => {
        db.collection('tasks').find().toArray()
        .then(results => {
            res.render('index.ejs', { tasks: results})
        })
        .catch(error => console.error(error))
    })
    app.post('/schedule', function(req, res) {
        console.log(req.body)
        var date = req.body.date
        var task = req.body.task
        collection.insertOne(req.body).then(
            result => {
                console.log(result);
                res.redirect('/')
            })
            .catch(error => console.error(error))
    });
})
app.listen(3000);
