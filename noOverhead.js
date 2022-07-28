app.get('/', async (request, response) => {
    //with array of items from the databases
    const todoItems = await db.collection('todos').find().toArray();
    // How many objects that have the property of completed to false.
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    //using ejs template
    response.render('index.ejs', { items: todoItems, left: itemsLeft });
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})