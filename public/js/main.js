const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning it to all elements with a class of trash can//
const item = document.querySelectorAll('.item span')//creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item" //
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of spans with a class of completed inside of a parent with a class of item//

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop //
    element.addEventListener('click', deleteItem)//adding an event listener to current item that waits for a click and then calls a function called deleteItem//
})//closing our loop//

Array.from(item).forEach((element)=>{//creating array from our selection and starting a loop//
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click and then calls a function called markComplete//
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//creating array from our selection and starting a loop//
    element.addEventListener('click', markUnComplete)//adds an event listener to ONLY completed items//
})//close our loop

async function deleteItem(){//declare an asychronous function//
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span//
    try{//starting a try block to do something//
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from the reult of deleteItem route//
            method: 'delete',//sets the CRUD method for the route//
            headers: {'Content-Type': 'application/json'},//specifying type of content expected, which is JSON//
            body: JSON.stringify({//declare message content, and //
              'itemFromJS': itemText//we're setting content of the body to the innertext of the list item, and naming it 'itemFromEJS'//
            })//closing the body
          })//closing the object
        const data = await response.json()//awaiting on JSON from response to be converted 
        console.log(data)//log result to console
        location.reload()//reloads page to update what is displayed

    }catch(err){//if an error ocurrs, pass the error into catch block
        console.log(err)//error to console log
    }//close the catch block
}

async function markComplete(){// declare async function
    const itemText = this.parentNode.childNodes[1].innerText//look inside list item and grabs only the inner tx within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', {//create response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},//specifying type of content expected (JSON)
            body: JSON.stringify({//declare message content being passed ad strignify
                'itemFromJS': itemText//setting contentof body to inner text of list item, naming it itemFromJs
            })//close body
          })//close obj
        const data = await response.json()
        console.log(data)//waiting on JSON from response to be converted
        location.reload()//reloads page to update what is displayed

    }catch(err){//error handling
        console.log(err)//console loging error
    }//close catch block
}//close object

async function markUnComplete(){// declare async function
    const itemText = this.parentNode.childNodes[1].innerText//look inside list item and grabs only the inner tx within the list span
    try{//starting try block
        const response = await fetch('markUnComplete', {//create response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},//specifying type of content expected (JSON)
            body: JSON.stringify({//declare message content being passed ad strignify
                'itemFromJS': itemText//setting contentof body to inner text of list item, naming it itemFromJs
            })//close body
          })//close obj
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){//error handling
        console.log(err)//console loging error
    }//close catch block
}//close obj