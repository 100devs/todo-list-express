const deleteBtn = document.querySelectorAll('.fa-trash') // declaring all the elements in the dom with this class inside a variable
const item = document.querySelectorAll('.item span') // declaring all the elements in the dom with this class inside a variable
const itemCompleted = document.querySelectorAll('.item span.completed') // declaring all the elements in the dom with this class inside a variable

Array.from(deleteBtn).forEach((element)=>{ // make an array from this variable and loop in every element 
    element.addEventListener('click', deleteItem) // add event listener to every element and connect the related function
})

Array.from(item).forEach((element)=>{ // make an array from this variable and loop in every element
    element.addEventListener('click', markComplete) // add event listener to every element and connect the related function
})

Array.from(itemCompleted).forEach((element)=>{ // make an array from this variable and loop in every element
    element.addEventListener('click', markUnComplete) // add event listener to every element and connect the related function
})

async function deleteItem(){ // async function that delete the item selected
    const itemText = this.parentNode.childNodes[1].innerText // declare the innerText inside the first element of the parent of the element clicked
    try{
        const response = await fetch('deleteItem', { // fetch request to the targeted route
            method: 'delete', // delete request
            headers: {'Content-Type': 'application/json'}, // declare the content of the request as a json
            body: JSON.stringify({ // parse the obj into a json file as a request body
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // parse response from the server into a json
        console.log(data)
        location.reload() // make the user refresh the page to make a new get request and see the changes made

    }catch(err){ // catch and log eventually errors
        console.log(err)
    }
}

async function markComplete(){  // async function that mark complete the item selected
    const itemText = this.parentNode.childNodes[1].innerText // declare the innerText inside the first element of the parent of the element clicked
    try{
        const response = await fetch('markComplete', { // fetch request to the targeted route
            method: 'put', // put request
            headers: {'Content-Type': 'application/json'}, // declare the content of the request as a json
            body: JSON.stringify({ // parse the obj into a json file as a request body
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // parse response from the server into a json
        console.log(data)
        location.reload() // make the user refresh the page to make a new get request and see the changes made

    }catch(err){ // catch and log eventually errors
        console.log(err)
    }
}

async function markUnComplete(){  // async function that mark uncomplete the item selected
    const itemText = this.parentNode.childNodes[1].innerText // declare the innerText inside the first element of the parent of the element clicked
    try{
        const response = await fetch('markUnComplete', { // fetch request to the targeted route
            method: 'put', // put request
            headers: {'Content-Type': 'application/json'}, // declare the content of the request as a json
            body: JSON.stringify({ // parse the obj into a json file as a request body 
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // parse response from the server into a json
        console.log(data)
        location.reload() // make the user refresh the page to make a new get request and see the changes made

    }catch(err){ // catch and log eventually errors
        console.log(err)
    }
}