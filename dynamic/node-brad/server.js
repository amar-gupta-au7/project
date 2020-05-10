let express = require('express')
let mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let app = express()
let db

app.use(express.static('./public'))

let collectionString = 'mongodb://127.0.0.1:27017'
const database="todoapp"
MongoClient.connect(collectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res)=>{
  db = res.db(database)
  app.listen(3000)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res)=> {
  db.collection('item').find().toArray((err, item)=>{
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <style>
      footer {
        min-height: 100px;
        background-color: #eaecee70;
        color: #929eaa;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
        font-size: 20px;
        text-align: center;
    }
      </style>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-feild" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
          ${item.map((item)=>{
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Change</button>
              <button data-id="${item._id}"class="delete-me btn btn-danger btn-sm">Done</button>
            </div>
          </li>`
          }).join('') }
        </ul>
        
      </div>
      <footer>
            <p>Made with ❤️ by Amar Gupta </p>
        </footer>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="browser.js"></script>
    </body>
    </html>`)
    
  })
  })


app.post('/create-item', function(req, res) {
  db.collection('item').insertOne({text: req.body.item}, ()=>{
    res.redirect('/')
  })
    
})


app.post('/update-item', (req, res)=>{
  db.collection('item').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, ()=>{
    res.send('sucess')})
})


app.post('/delete-item', (req, res) =>{
  db.collection('item').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, ()=>{
    res.send('sucess')
  })
})