//selecting all elements with the class .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//selecting all elements with the class 'item' that are followed by a span
const item = document.querySelectorAll('.item span')
// selecting all elements with the class item that are followed by a span and have a class completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//adding a click event listener to each delete button element
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//looping through the array and adding a click event listener to each item element that is not completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
////looping through the array and adding a click event listener to each item element that is completed
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//async function to handle deletion
async function deleteItem(){
    //getting the text from the item and putting it in a itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
      // delete method request to the deleteItem route 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                //we add the itemText to the request body
              'itemFromJS': itemText
            })
          })

          //parsing the json data and putting it in the data variable
        const data = await response.json()
        //console logging the response data
        console.log(data)
        //reloading the page after deletion
        location.reload()

    }catch(err){
        //if an error occurs during deletion it is going to be logged to the console
        console.log(err)
    }
}

//asyn function to handle the marking complete of the item
async function markComplete(){
    //getting the text from the item and putting it in a itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
              // put method request to the markComplete route 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            //we add the itemText to the request body
                'itemFromJS': itemText
            })
          })
        //parsing the json data and putting it in the data variable
        const data = await response.json()
        console.log(data)
        //reloading the page after updating
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//asyn function to handle the marking uncomplete of the item
async function markUnComplete(){
        //getting the text from the item and putting it in a itemText variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // put method request to the markUnComplete route 
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //we add the itemText to the request body
        const data = await response.json()
        console.log(data)
        //reloading the page after updating
        location.reload()

    }catch(err){
        //catching the error if it occurs
        console.log(err)
    }
}