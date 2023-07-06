//stores all elements in the dom with class 'fa-trash' in 'deleteBtn' variable
const deleteBtn = document.querySelectorAll('.fa-trash')
//stores all spans that a children of the class 'item' from the dom in the 'item' variable
const item = document.querySelectorAll('.item span')
//stores all spans with class 'completed' that are children of class 'item' from the dom in the 'itemCompleted' variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from 'deletedBtn' and loops through the array
Array.from(deleteBtn).forEach((element)=>{
    //adds an event listener to listen for a click on each element of the array. If clicked, it triggers the deleteItem function
    element.addEventListener('click', deleteItem)
})

//creates an array from 'item' and loops through the array
Array.from(item).forEach((element)=>{
    //adds an event listener to listen for a click on each element of the array. If clicked, it triggers the markComplete function
    element.addEventListener('click', markComplete)
})

//creates an array from 'itemComplete' and loops through the array
Array.from(itemCompleted).forEach((element)=>{
    //adds an event listener to listem for a click on each element of the array. If clicked, it triggers the markUnCompleted function
    element.addEventListener('click', markUnComplete)
})

//declares deleteItem() async function
async function deleteItem(){
    //declares itemText variable and stores the text of the first child node of 'this' parent. The text should be the todo item.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a delete request with the itemText in the body
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //the request body key is 'itemFromJS' with itemText value
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //awaiting a JSON response from the server which will be stored in data variable
        const data = await response.json()
        //console log the response
        console.log(data)
        //refresh the page triggering a new GET (READ) request
        location.reload()

    }//catches any errors and logs them to the console
    catch(err){
        console.log(err)
    }
}

//declares markComplete() async function
async function markComplete(){
    //declares itemText variable and stores the text of the first child node of 'this' parent. The text should be the todo item.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a PUT (UPDATE) request to the server with itemText in the body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //the request body key is 'itemFromJS' with itemText value
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //awaiting a JSON response from the server which will be stored in data variable
        const data = await response.json()
        //console log the response
        console.log(data)
        //refresh the page triggering a new GET (READ) request
        location.reload()

    }//catches any errors and logs them to the console
    catch(err){
        console.log(err)
    }
}

//declares markUnComplete() async function
async function markUnComplete(){
    //declares itemText variable and stores the text of the first child node of 'this' parent. The text should be the todo item.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a PUT (UPDATE) request to the server with itemText in the body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //the request body key is 'itemFromJS' with itemText value
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //awaiting JSON response from the server which will be stored in data variable
        const data = await response.json()
        //console log the response
        console.log(data)
        //refresh the page triggering a new GET (READ) request
        location.reload()

    }//catches any errors and logs them to the console
    catch(err){
        console.log(err)
    }
}