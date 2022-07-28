//declaring variables to hold our queryselectors from our DOM for delete button, items, and items marked completed
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//since we used querySelectorAll, we want an event listener on each of those selected items, so we are making an array from that set of items and putting a click event listener on each item( in this case, running the function 'deleteItem' on click)
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//since we used querySelectorAll, we want an event listener on each of those selected items, so we are making an array from that set of items and putting a click event listener on each item( in this case, running the function 'markComplete' on click)
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//since we used querySelectorAll, we want an event listener on each of those selected items, so we are making an array from that set of items and putting a click event listener on each item( in this case, running the function 'markUnComplete' on click)
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//declaring an asynchronous function named deleteItem
async function deleteItem(){
    //creating a constant variable to hold the value of the innertext of the childnode of the parentnode in the DOM of the item 'this' which is the element that had the event listener from earlier in the code
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block to run specific code and deal with errors
    try{
        //declare response variable to hold an await fetch function with route 'deleteItem', using method 'delete', with json data in the header, and taking the itemText variable from above and using it to find the matching item on the server and deleting it
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //declaring a const variable awaiting previous response to return with a json response
        const data = await response.json()
        //console.log the above variable upon recieving it back from server, and reloading the page
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

//declaring an asynchronous function named markComplete
async function markComplete(){
    //creating a constant variable to hold the value of the innertext of the childnode of the parentnode in the DOM of the item 'this' which is the element that had the event listener from earlier in the code
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block to run specific code and deal with errors
    try{
        //declare response variable to hold an await fetch function with route 'markComplete', using method 'put', with json data in the header, and taking the itemText variable from above and using it to find the matching item on the server and marking it as done/complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //declaring a const variable awaiting previous response to return with a json response
        const data = await response.json()
        //console.log the above variable upon recieving it back from server, and reloading the page
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

//declaring an asynchronous function named markUnComplete
async function markUnComplete(){
    //creating a constant variable to hold the value of the innertext of the childnode of the parentnode in the DOM of the item 'this' which is the element that had the event listener from earlier in the code
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block to run specific code and deal with errors
    try{
        //declare response variable to hold an await fetch function with route 'markUnComplete', using method 'put', with json data in the header, and taking the itemText variable from above and using it to find the matching item on the server and marking it as not done/incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //declaring a const variable awaiting previous response to return with a json response
        const data = await response.json()
        //console.log the above variable upon recieving it back from server, and reloading the page
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}