const deleteBtn = document.querySelectorAll('.fa-trash') //assigns a NodeList of all HTMLElements with a class of `fa-trash` to the constant variable `deleteBtn`
const item = document.querySelectorAll('.item span') //assigns a NodeList of all HTMLElements that are <span>s and descendants of elements with a class of `item` to the constant variable `item`
const itemCompleted = document.querySelectorAll('.item span.completed') //assigns a NodeList of all HTMLElements that are <span>s with a class of `completed` and descendants of elements with a class of `item` to the constant variable `itemCompleted`

Array.from(deleteBtn).forEach((element)=>{ //converts `deleteBtn` to an array of HTMLElements, then call `forEach` on it
    element.addEventListener('click', deleteItem) //adds an click event listener to each element, calling `deleteItem`
})

Array.from(item).forEach((element)=>{ //converts `item` to an array of HTMLElements, then call `forEach` on it
    element.addEventListener('click', markComplete) //adds an click event listener to each element, calling `markComplete`
})

Array.from(itemCompleted).forEach((element)=>{ //converts `itemCompleted` to an array of HTMLElements, then call `forEach` on it
    element.addEventListener('click', markUnComplete) //adds an click event listener to each element, calling `markUnComplete`
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //from the current <span> (bound to this by the event listener), get the parentNode - the <li> - then get the 1th childNode - the <span>, then retrieve the text content of it by reading the `innerText` property
    try{
        const response = await fetch('deleteItem', { //makes a fetch to the relative path `deleteItem`
            method: 'delete', //sets method of request to DELETE
            headers: {'Content-Type': 'application/json'}, //sets header `Content-Type` to `application/json` so it knows we're sending JSON, and how to parse our data
            body: JSON.stringify({ //sends the object with a property of itemFromJS and value of the `itemText` of the current item as a JSON string
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //attempts to load and parse the response body as JSON, assigning it to data
        console.log(data)
        location.reload() //reloads the webpage

    }catch(err){ //if there are any errors, console.log them
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { //makes a fetch to the relative path `markComplete`
            method: 'put', //set method of request to PUT
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){ //if any errors are caught, console.log them
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', { //makes a fetch to the relative path `markUnComplete`
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