const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{        //every task has a delete item button
    element.addEventListener('click', deleteItem) //calls deleteItem function on click
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{   //the list of tasks will have a mark uncomplete button
    element.addEventListener('click', markUnComplete)  //call markuncomplete function when the button is clicked
})

async function deleteItem(){ //called when click
    const itemText = this.parentNode.childNodes[1].innerText  //all this is same as mark complete, but method is delete, sends to server js
    try{
        const response = await fetch('deleteItem', {  
            method: 'delete',  //state method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText //this is property that the server sends to db to identify which task to delete. will be do laundry
            })
          })
        const data = await response.json() //waits for response.json from server.js
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){  
    const itemText = this.parentNode.childNodes[1].innerText  //item text has the task text: example"do laundry"
    try{ //if try doesn't complete, do catch error
        const response = await fetch('markComplete', {  //await fetch returns a promise .  pass in the name 'markComplete' tied to server.js
            //the fetch request does a url request which is /markComplete to server js
            method: 'put',   //we pass it the put(udpate method
            headers: {'Content-Type': 'application/json'},  //just put this allows the database to understand what we're sending
            body: JSON.stringify({  'itemFromJS': itemText  })// then the server.js will decide what we do with this info
          })  //this is all data the database needs to send us what we want
        const data = await response.json()  //we are awaiting a response from the server.  server.js
        console.log(data)//shows us what we got back
        location.reload() //reloads the home page

    }catch(err){
        console.log(err)// tells us if something went wront
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {  //
            method: 'put',     //this is an update in the CRUD
            headers: {'Content-Type': 'application/json'}, //tells the headers that db will need to identify correct task
            body: JSON.stringify({         //capture the text into a json object so that server.js can send it also to db
                'itemFromJS': itemText    //so db finds right item .  itemfromjs is property with value itemtext sent to server.js
            })
          })
        const data = await response.json()  //this ties response.json('MarkeunComplete') from server.js
        console.log(data) //data is "MarkedunComplete" fron server.js
        location.reload()  //this isn't necessary because js will reload the page automatically when it receives a response
           //if we don't get an response, the location.reload won't happen
    }catch(err){
        console.log(err) //provide
    }
}
