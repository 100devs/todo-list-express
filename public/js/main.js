//store queryselector on trash icon in deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Create an array from each delete button and add an event listener that runs deleteItem when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Create an array from each task and add an event listener that runs markComplete when clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Create an array from each task and add an event listener that runs markUnComplete when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//declare async function used in event listener
async function deleteItem(){
    //grab text in childNode of parentNode(li) and store in itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
         //make a fetch with route 'delete0' that is a delete request to our server
        const response = await fetch('deleteItem', {
            //set fetch method to delete
            method: 'delete',
            //tell the server we're sending JSON data
            headers: {'Content-Type': 'application/json'},
            //DOM cannot understand JSON unless stringified
            //convert our data to JSON and pass into the body property 'itemFromJS' that will be sent in request to server
            //essentially we are hardcoding the delete request to send request body, lots of info in request
            //gets sent to server API where gremlin listening for delete
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //store 'TodoDeleted' from server response in data
        const data = await response.json()
        //log on the client side
        console.log(data)
       //send refresh, makes GET request to make gremlin get updated db and render into ejs
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//declare async function used in event listener
async function markComplete(){
    //declare variable itemText and store text from todoitem span that was clicked on
    //[1] because there are things that precede, like bullet point, etc.
    const itemText = this.parentNode.childNodes[1].innerText
    //With text of clicked span 'todoitem', stored in itemText
    try{
         //make a fetch with route 'markComplete' that is a put request to our server
        const response = await fetch('markComplete', {
            //set fetch method to put
            method: 'put',
            //tell the server we're sending JSON data
            headers: {'Content-Type': 'application/json'},
            //DOM cannot understand JSON unless stringified
            //convert our data to JSON and pass into the body property 'itemFromJS' that will be sent in request to server
            //essentially we are hardcoding the put request to send request body, lots of info in request
            body: JSON.stringify({
                //request.body.itemFromJS holds itemText
                'itemFromJS': itemText
            })
          })
           //when json response 'markComplete' is received, store in data variable and log response client side
        const data = await response.json()
        console.log(data)
        //send refresh, makes GET request to make gremlin get updated db and render into ejs
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//declare async function, same as above explanation 
async function markUnComplete(){
    //declare variable itemText and store text from todoitem span that was clicked on
    //[1] because there are things that precede, like bullet point, etc.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
         //make a fetch with route 'markUnComplete' that is a put request to our server
        const response = await fetch('markUnComplete', {
             //set fetch method to put
            method: 'put',
            //tell the server we're sending JSON data
            headers: {'Content-Type': 'application/json'},
            //DOM cannot understand JSON unless stringified
            //convert our data to JSON and pass into the body property 'itemFromJS' that will be sent in request to server
            //essentially we are hardcoding the put request to send request body, lots of info in request
            body: JSON.stringify({
                //request.body.itemFromJS holds itemText
                'itemFromJS': itemText
            })
          })
           //when json response 'markUnComplete' is received, store in data variable and log response client side
        const data = await response.json()
        console.log(data)
        //send refresh, makes GET request to make gremlin get updated db and render into ejs
        location.reload()

    }catch(err){
        console.log(err)
    }
}