//these three variables pull from the classes specified in index.ejs
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//this creates an array for each item in the deleteBtn and starts a foreach loop
Array.from(deleteBtn).forEach((element)=>{
    //adds event listener to the deleteBtn waiting for a click to run deleteItem function below.
    element.addEventListener('click', deleteItem)
})

//this creates an array for each item in the deleteBtn and starts a foreach loop
Array.from(item).forEach((element)=>{
     //adds event listener to the item waiting for a click to run markComplete function below.
    element.addEventListener('click', markComplete)
})

//this creates an array for each item in the itemCompleted and starts a foreach loop
Array.from(itemCompleted).forEach((element)=>{
    //adds event listener to the item waiting for a click to run markUnComplete function below.
    element.addEventListener('click', markUnComplete)
})

//this function deletes items.
async function deleteItem(){
    //grabs the innerText within the list span in index.js and assigns it to the itemText variable. Parent node is li.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //a fetch is sent to the server, the fetch has the route deleteItem. This creates a response variable that waits on a fetch to get data from the result of the deletItem route
        const response = await fetch('deleteItem', {
            //sets the CRUD method for the route
            method: 'delete',
            //specifying the type of content expected, which is JSON
            headers: {'Content-Type': 'application/json'},
            //makes sure the json content is a string
            body: JSON.stringify({
                //setting the content of the body to the inner text of the list item, and naming it 'itemForJS'
              'itemFromJS': itemText
            })
          })
         //waiting on JSON from the response to be converted
        const data = await response.json()
        //logs the data to the console and reloads the page.
        console.log(data)
        location.reload()
        //console logs when theres a error. 
    }catch(err){
        console.log(err)
    }
}

//this function runs when the itemtext is clicked. 
async function markComplete(){
    //looks inside of the list item and grabs only the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //creates a response variable that waits on a fetch to get data from the result of the MarkComplete route
        const response = await fetch('markComplete', {
            //sets the CRUD method to PUT(update)
            method: 'put',
            //specifies JSON content
            headers: {'Content-Type': 'application/json'},
            //JSON to string. 
            body: JSON.stringify({
                //the item that was clicked will be called itemFromJS 
                'itemFromJS': itemText
            })
          })
          //waiting for JSON from the response to be converted  
        const data = await response.json()
        //log data to console, reload page
        console.log(data)
        location.reload()
    //what to do if error
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //looking inside the text inside a list item and grabs only the innerText within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //starts an obj and creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
        const response = await fetch('markUnComplete', {
            //Sets CRUD method of PUT
            method: 'put',
             //specifies JSON content
            headers: {'Content-Type': 'application/json'},
            //JSON to string
            body: JSON.stringify({
                //the item that was clicked will be called itemFromJS 
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}