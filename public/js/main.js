const deleteBtn = document.querySelectorAll('.fa-trash')//assigning the doc.qselector for the class .fa-trash to variable "deletebtn". This is for the font awesome trash can.
const item = document.querySelectorAll('.item span')//assigning the doc.qselector for the class .item and html element "span" to variable "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//assigning the doc.qselector for the class .item and html element "span" to variable "itemcompleted"

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Once activated, it iterates through the array of elements to delete the selected element

Array.from(item).forEach((element)=>{//creating an array and starting a loop
    element.addEventListener('click', markComplete)//adds an event listener on only completed items
})

// Once activated, it iterates through the array of elements to mark the selected element as completed

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Once activated, it iterates through the array of elements to mark the selected element as uncompleted

async function deleteItem(){ //declare an async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item grab this text from the DOM and assign it to "itemText"
    try{//starting a try block
        
        const response = await fetch('deleteItem', {//Now run the delete request by fetching the delete item route from the API
            
            method: 'delete',// setting CRUD delete method used for deleting data
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected in which in this case is json
            body: JSON.stringify({//declare the message content being passed and turning it into a string
              'itemFromJS': itemText //setting the content of the body to the innertext of the list item and assigning it to itemFromJS
            })//closing the body
          })//closing the object
        

        // await result aka data removed from the database
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)// log your data on the console
        
        location.reload()// reload your page

    }catch(err){//If an error occurs in the try part, pass it to the catch part
        //catch errors logged on the console
        console.log(err)
    }//close the catch block
}//close the function block

async function markComplete(){//declare an async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item grab this text from the DOM and assign it to "itemText
    
    try{//starting a try block
        //Now run the put request by fetching the markComplete route from the API
        const response = await fetch('markComplete', {//Now run the put request by fetching the put item route from the API
            // put method used for modifying data
            method: 'put',// setting CRUD Update method used for updating data
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected in which in this case is json
            body: JSON.stringify({//declare the message content being passed and turning it into a string
                //assign the itemText to itemFromJS as indicated in the API
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and assigning it to itemFromJS
            })//closing the body
          })//closing the object
        // await result aka data removed from the database
        const data = await response.json() //waiting on JSON from the response to be converted
        
        console.log(data)// View your data on the console
        
        location.reload()// reload your page

    }catch(err){
        //catch errors to log on the console
        console.log(err)
    }//close the catch block
}//close the function block

async function markUnComplete(){//declare an async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item grab this text from the DOM and assign it to "itemText
    try{//starting a try block
        //Now run the put request by fetching the unmarkComplete route from the API
        const response = await fetch('markUnComplete', {//Now run the put request by fetching the put item route from the API
            // put method used for modifying data
            method: 'put',// setting CRUD Update method used for updating data
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected in which in this case is json
            body: JSON.stringify({//declare the message content being passed and turning it into a string
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and assigning it to itemFromJS
            })//closing the body
          })//closing the object
        // await result aka data
        const data = await response.json()
        // View your data on the console
        console.log(data)// View your data on the console
        
        location.reload()// reload your page

    }catch(err){
        //catch errors to log on the console
        console.log(err)
    }//close the catch block
}//close the function block
