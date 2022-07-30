//declaring and assigning variables to target all DOM elements with classes of 'fa-trash', 'item span', and 'item span.completed'
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates shallow array for each element and if that is a delete button it is assigned an event listener of click to each of those delete buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//creates shallow array for each element and if that is an item, each is assigned an event listener of click to designate it as 'complete'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//creates shallow array for each item that is marked complete and each is assigned an event listener of click to redesignate the status of the item
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//creates an asynchronous function named deleteitem that occurs whenever someone clicks the delete item button
async function deleteItem(){
    //after the function is called, the text of the childnode is targeted 
    const itemText = this.parentNode.childNodes[1].innerText
   //what the function will 'try' to do
    try{
        //once deleteitem is called this response occurs. and the method of delete targets the header of an element with the type of json
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //once response of response is complete, data occurs which calls on the response and displays 
        const data = await response.json()
        //displays the const of data/ response.json() in the console/terminal
        console.log(data)
        //refreshes the page
        location.reload()
    //if try method is unsuccessful then this will occur
    }catch(err){
        //displays error message of 'err' to the console
        console.log(err)
    }
}
//whenever this asynchronous function is called
async function markComplete(){
    //after the function is called, the text of the childnode is targeted 
    const itemText = this.parentNode.childNodes[1].innerText
     //what the function will 'try' to do
    try{
        //once markcomplete is called, the response of put(update) occurs which targets the header in the body and marks it complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //once response of markcomplete is completed on the data,
        const data = await response.json()
        //displays updated response to the console/terminal
        console.log(data)
        //the page is then refreshed
        location.reload()
    //if try method is unsuccessful then this will occur
    }catch(err){
        //displays error message of 'err' to the console
        console.log(err)
    }
}
//whenever this asynchronous function is called
async function markUnComplete(){
    //after the function is called, the text of the childnode is targeted 
    const itemText = this.parentNode.childNodes[1].innerText
    //what the function will 'try' to do
    try{
        //markuncomplete is called  hich targets the header in the body and marks it as uncomplete
        const response = await fetch('markUnComplete', {
            //the response of put(update) occurs 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //once data is marked as uncomplete
        const data = await response.json()
        //new data is displayed to the console/terminal
        console.log(data)
        //the page is then refreshed
        location.reload()
    //if try method is unsuccessful then this will occur
    }catch(err){
        //displays error message of 'err' to the console
        console.log(err)
    }
}
