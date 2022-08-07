const deleteBtn = document.querySelectorAll('.fa-trash') // store all elements with a class of 'fa-trash'
const item = document.querySelectorAll('.item span') // store all elements with a span tag in a parent element with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // store all elements with a span tag and a completed class in a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //create an array of elements from deleteBtn variable and loop
    element.addEventListener('click', deleteItem) //add an event listener for a click event and call deleteItem when clicked
})

Array.from(item).forEach((element)=>{ // create an array of elements from the item variable and loop
    element.addEventListener('click', markComplete) //add an event listener fro a click event and call markComplete when clicked
})

Array.from(itemCompleted).forEach((element)=>{ //create an array of elements from the itemCompleted variable and loop
    element.addEventListener('click', markUnComplete) //add an event listener for a click event and call markUncomplete when clicked
})

async function deleteItem(){ //define delete item async function
    const itemText = this.parentNode.childNodes[1].innerText //get the text from the first child node of the parent of the clicked element
    try{ //start try catch
        const response = await fetch('deleteItem', { // start a fetch at 'deleteItem' and store the result in response when finished
            method: 'delete', // set the CRUD method
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected
            body: JSON.stringify({ //declare the body of the request and stringify the content
              'itemFromJS': itemText //setting the value for itemFromJS with the itemText variable
            })
          })
        const data = await response.json() //convert the response to json
        console.log(data)
        location.reload() //refresh the page

    }catch(err){ //run if there was an error during the request
        console.log(err)
    }
}

async function markComplete(){ //define an async function
    const itemText = this.parentNode.childNodes[1].innerText //get the text from the first child node of the parent of the clicked item
    try{ //start try catch
        const response = await fetch('markComplete', { // start a fetch request and wait for the response
            method: 'put', // set the CRUD method of the request
            headers: {'Content-Type': 'application/json'}, //specify the type of content expected
            body: JSON.stringify({ //declare the body of the request and stringify the content
                'itemFromJS': itemText //setting the value for itemsFromJS with the itemText variable
            })
          })
        const data = await response.json() // convert the response to json
        console.log(data)
        location.reload() // refresh the page

    }catch(err){ // run if there was an error during the request
        console.log(err)
    }
}

async function markUnComplete(){ //define an async function
    const itemText = this.parentNode.childNodes[1].innerText // get the text from the first child node of the parent of the clicked item
    try{ // start try catch
        const response = await fetch('markUnComplete', { //start a fetch request and wait for the response
            method: 'put', // set the CRUD method of the request
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected
            body: JSON.stringify({ //declare the body of the request and stringify the content
                'itemFromJS': itemText // setting the value of itemsFromJS with the itemText variable
            })
          })
        const data = await response.json() //convert the response to json
        console.log(data)
        location.reload() //refresh page

    }catch(err){ //runs if there was an error during the request
        console.log(err)
    }
}