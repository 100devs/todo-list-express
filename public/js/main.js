const deleteBtn = document.querySelectorAll('.fa-trash')       //creating a viariable all elements with class  of .fa-trash
const item = document.querySelectorAll('.item span')           //creating a variable and assingns to span tags and item classes
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigns to a selection os spans with a class of completer insied of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{  //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)   //add an event listener to the current item that waits for a click then calls a fucntion called deleteItem
})  //closes loop

Array.from(item).forEach((element)=>{       //creating an array from out selection and strtng a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then call a function called complete
})

Array.from(itemCompleted).forEach((element)=>{  //creating an array from out selection and strtng a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
}) //closes loop

async function deleteItem(){     // declaring an async function 
    const itemText = this.parentNode.childNodes[1].innerText    //looking inside of the list item to extract the tex value only of the specified list item
    try{    // starting a try block to do something
        const response = await fetch('deleteItem', {       //creates a variable that waits on a fetch to get data from the result of a deleteItem route
            method: 'delete',       //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},  //speicfying the type of content expected,which is JSON
            body: JSON.stringify({      // declare the message being passed, and stringinfy that content
              'itemFromJS': itemText    //setting the content of the body to the inner text of the list item and naming it "itemFromJS"
            }) //closing the body
          }) //closing body
        const data = await response.json() //waiting on the server to respond with some JSON 
        console.log(data)
        location.reload()   //reload the page

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console.
    }//close the catch block
}//end the function

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
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