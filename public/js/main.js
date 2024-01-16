//Grabbing the delete button from the dom, all of the ones that exist at least, the length of the node list depending on the amount of documents passed into the ejs file.
const deleteBtn = document.querySelectorAll('.fa-trash')
//grabbing all of our todo items.
const item = document.querySelectorAll('.item span')
//grabbing all of our todo items that have been completed.
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creating an array from the nodelist returned by querySelectorAll selecting all the deleteBtns and adding an event listener for each one of them with the callback function of deleteItem, which is declared below.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Same for the items, we specify a callback of markComplete, when the user clicks on an uncomplete item, it will mark it.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Same for the completed items, when a click event is heard, will call the markUncomplete function and set that item to uncomplete.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//declaring an async function of deleteItem, which asynchronously deletes the item the user has clicked on.
async function deleteItem(){
    //grabbing the text, by accessing the parent li holding the trashcan, accessing the second element in that li, which is the span that has the content, being the task itself.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //when we click the trashcan we send a fetch request to the server, with a method type of delete, which returns a promise which is why we are awaiting it. When the operations have completed, we assign the return, i.e. the fulfillment value, to the response variable which we declared with const.

        //The first argument passed to fetch is the URL or endpoint we wish to hit. The second argument is an options object, in which we can provide additional options to go along with this fetch.
        const response = await fetch('deleteItem', {
            //method option sets the type of http request being issued.
            method: 'delete',
            //headers allows us to provide additional information such as the content type, so the server knows what type of data it is recieving.
            headers: {'Content-Type': 'application/json'},
            //here for our request body, we are serializing an object literal whose property contains the value being the itemText we grabbed, in other words we are sending the task itself to the server, in which the server will look for a document with this content as the value for the thing property and delete it.
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //We again away the response.json() call, which will parse the response from the server asynchronously as json, returning a javascript object as the fulfillment value for the awaited promise, being assigned to our newly declared data property.
        const data = await response.json()
        //We log to the console the data, which in this case is just a message of successfully deleted.
        console.log(data)
        //then since we have successfully deleted, we force a reload() on the user, reissuing a get request to our root, or the current url the user is on, to show the updated changes. This is a method of the location object which is apart of the BOM(Browser Object Model), which we have access to through the global scope, the window.
        location.reload()

    }catch(err){
        //in the event there is an error, i.e. a network error, because the fetch api only really rejects when there is a network error. We will log the error to the console.
        console.log(err)
    }
}

async function markComplete(){
    //again navigating to the parent li, grabbing the text content from the second childnode, which is the span. It is the second because childNodes includes non element nodes as well such as text and comments.
    const itemText = this.parentNode.childNodes[1].innerText
    try{//issuing a fetch to the markComplete path, with the type of request being specified in the options, here it is put. Everything else is the same as with the deleteItem function above. We issue the update request and store the initial response from the server into our response variable, and reload upon a successful mark.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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

async function markUnComplete(){
    //the same flow of operations is done here, the only difference is that we are marking uncomplete rather than deleting or marking complete. The actual operation is handled server side depending on where the request is issued from/ the type of request.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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