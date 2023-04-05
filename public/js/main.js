const deleteBtn = document.querySelectorAll('.fa-trash') //select all the items with the class
const item = document.querySelectorAll('.item span') //selects all the items with the class
const itemCompleted = document.querySelectorAll('.item span.completed') //selects al the items with the class

Array.from(deleteBtn).forEach((element)=>{ //make it into an array
    element.addEventListener('click', deleteItem) //add the smurfs for each of the element in the array
})

Array.from(item).forEach((element)=>{ //make it into an array
    element.addEventListener('click', markComplete) //add the smurfs for each of the elements in the array
})

Array.from(itemCompleted).forEach((element)=>{ //make it into an array
    element.addEventListener('click', markUnComplete) //add the smurfs for each of the element in the array
})

async function deleteItem(){ //async function deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //get the variable that looks inside the list item and grabs only the inner text within the list span
    try{ //try it 
        const response = await fetch('deleteItem', { //request to server to get data from the result of a deleteItem route and save in response variable
            method: 'delete', //method of the CRUD is delete
            headers: {'Content-Type': 'application/json'}, //specify the type of content 
            body: JSON.stringify({ //stringify the body message content 
              'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it itemFromJS
            })
          })
        const data = await response.json() //get the response and convert to json 
        console.log(data) //console log the data
        location.reload() // a reload to the page 

    }catch(err){ //if the try doesn't go well, catch the error
        console.log(err) // and console log the error 
    }
}

async function markComplete(){ //mark complete function 
    const itemText = this.parentNode.childNodes[1].innerText //get the variable that looks inside the list item and grabs only the innertext within the list span 
    try{ //try the below statments 
        const response = await fetch('markComplete', { //request to the server to get the data from the result of a markComplete route and save it in resonse 
            method: 'put', //the CRUD method will be put 
            headers: {'Content-Type': 'application/json'}, //specifying what the content type will be 
            body: JSON.stringify({ //stringifys the body message content 
                'itemFromJS': itemText //sets the content of the body to the innertext of the list item and naming it itemFromJS 
            })
          })
        const data = await response.json() //await for the response and convert it to json 
        console.log(data) //console log the data
        location.reload() //reload the page 

    }catch(err){ //if try block doesn't execute properly 
        console.log(err) //console log the error 
    }
}

async function markUnComplete(){ //mark uncomplete function 
    const itemText = this.parentNode.childNodes[1].innerText //get the variable that looks inside the list item and grabs only the innertext within the list span 
    try{ //try the below statments 
        const response = await fetch('markUnComplete', { //request to the server to get the data from the result of a markUnComplete route and save it in resonse 
            method: 'put', //the CRUD method will be put 
            headers: {'Content-Type': 'application/json'}, //specifying what the content type will be 
            body: JSON.stringify({ //stringifys the body message content 
                'itemFromJS': itemText //sets the content of the body to the innertext of the list item and naming it itemFromJS 
            })
          })
        const data = await response.json()  //await for the response and convert it to json 
        console.log(data) //console log the data
        location.reload() //reload the page 

    }catch(err){ //if try block doesn't execute properly 
        console.log(err) //console log the error 
    }
}