const deleteBtn = document.querySelectorAll('.fa-trash') //trash can icon next to each todo item
const item = document.querySelectorAll('.item span') //the todo list item span
const itemCompleted = document.querySelectorAll('.item span.completed') //the todo list items that have class completed

Array.from(deleteBtn).forEach((element)=>{  //Adds event listener to delete icon. Triggers event on click
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{   //Adds event listener to item spans. Triggers on click
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{  //Adds event listener to item spans with class of complete. Triggers on click
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){    //async function that triggers onclick of trash icon. Once clicked, it targets the inner text, sends a delete request to 
    const itemText = this.parentNode.childNodes[1].innerText    // server.js API code, then awaits a response from the server. console logs the response,
    try{                                                       //then refreshes the page.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},  //Necessary for the server to correctly receive and interpret JSON data in the body.
            body: JSON.stringify({          //converts object to string since fetch requests can only send JSON strings (not objects)
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){            //If there is an exception in try code response, catch will be triggered.
        console.log(err)
    }
}

async function markComplete(){     //Function that triggers onclick of span text. Targets the inner text of span, sends a put request to server.js API code,
    const itemText = this.parentNode.childNodes[1].innerText       //then awaits a response from server. console logs the response, and refreshes the page.
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},  //Necessary for the server to correctly receive and interpret JSON data in the body.
            body: JSON.stringify({                  //converts object to string since fetch requests can only send JSON strings (not objects)
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){        //If there is an exception in try code response, catch will be triggered.
        console.log(err)
    }
}

async function markUnComplete(){        //function that triggers onclick of item spans with the class of complete. Targets inner text of those spans,
    const itemText = this.parentNode.childNodes[1].innerText    //sends a request to the server.js api code and receives a response, console logs it,
    try{                                                        // and refreshes the page.
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},      //Necessary for the server to correctly receive and interpret JSON data in the body.
            body: JSON.stringify({                          //converts object to string since fetch requests can only send JSON strings (not objects)
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){                //If there is an exception in try code response, catch will be triggered.
        console.log(err)
    }
}