const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(process.env.DB_STRING, { useUnifiedTopology: true })
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'grocery-list'

// MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//     .then(client => {
//         console.log(`Connected to ${dbName} Database`)
//         db = client.db(dbName)
//     })

//connect changed  to below. This fixes an error where the port was attempting to connect before the database was connected

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(process.env.PORT || PORT, () => {
        console.log(`Server running on port ${PORT}`);
        db = client.db(dbName);
    })
});


// app.set is used to set the view engine to ejs. what is seen by the use is rendered in the ejs. 
app.set('view engine', 'ejs')
//this is the most powerful piece of code in express. It allows us to serve any static files we need from the public folder
app.use(express.static('public'))
//code below allows us to parse the body of the request. possibly deprecated?
app.use(express.urlencoded({ extended: true }))
//all app.use statements are middleware. This one allows us to parse json
app.use(express.json())

//what the code below does is render the index.ejs file and pass it the data from the database. it finds the data in collection 'todo' and turns that into an array. it then counts the number of items that are not completed and passes that to the index.ejs file as well.

app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todo').find().toArray()
    const itemsLeft = await db.collection('todo').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todo').find().toArray()
    // .then(data => {
    //     db.collection('todo').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//this is a basic post function. it takes the data from the form and inserts it into the database. it then redirects the user to the home page.

app.post('/addItem', (request, response) => {
    db.collection('todo').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Item Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//this is what is used to cross out the completed items. what thing: request.body.itemFromJS does is it takes the data from the item that was clicked on and uses that to find the item in the database. it then sets the completed value to true. $set is a mongodb operator that allows us to change the value of a key. what _id: -1 does is it sorts the items by the most recently added. this is so that the most recently added item is the one that is crossed out. upsert: false means that if the item is not found, it will not create a new item. if it were to sort the opposite way, it would be 1 instead of -1.

app.put('/markComplete', (request, response) => {
    db.collection('todo').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//this does basically the opposite of the function above

app.put('/markUnComplete', (request, response) => {
    db.collection('todo').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//this deletes the item from the database. it uses the same method as the markComplete function. it finds the item in the database and deletes it.

app.delete('/deleteItem', (request, response) => {
    db.collection('todo').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// client.connect(err => {
//     if(err){ console.error(err); return false;}
//     // connection to mongo is successful, listen for requests
//     app.listen(process.env.PORT || PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     })
// });