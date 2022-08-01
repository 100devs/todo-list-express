const deleteBtn = document.querySelectorAll('.fa-trash')// creating a variable and assigning it to a selection of  all elments with class of the trash can 
const item = document.querySelectorAll('.item span')// creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of spans with a class of "completesd" inside of a of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)// add an event listener to the current item that waits for a click and then calls function called delete item
})

Array.from(item).forEach((element)=>{//creating an array from our selection and starting a loop 
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click and then calls function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and starting a loop 
    element.addEventListener('click', markUnComplete)//add an event listener to only completed  item that waits for a click and then calls function called markUnComplete
})

async function deleteItem(){// declaring an asyn function 
    const itemText = this.parentNode.childNodes[1].innerText //looking inside of the list item and grabs only the inner text within the list span 
try{ // try block to do something
        const response = await fetch('deleteItem', { // creating a response variable that waits on a fetch to get data from the reult of the deleteItem route 
            method: 'delete',// sets CRUD method for the route 
            headers: {'Content-Type': 'application/json'},//specifying the type of content exprected, which wil be JSON 
            body: JSON.stringify({ // declare the message content being passed, and stringify that content 
              'itemFromJS': itemText  // setting content of the body  to the inner text of the list item, and naming it  "itemFromJS"
            })// closing body 
          })// closing obj
        const data = await response.json()//waiting on json from rrespnse to be converted
        console.log(data)// log results to console 
        location.reload()// reloading the page to see changes

    }catch(err){ // if an err occurs pass the err into the catch 
        console.log(err) // log error to console 
    }//close catch 
}// end function 

async function markComplete(){ // declaring async function 
    const itemText = this.parentNode.childNodes[1].innerText // looking inside list items and grabs only the inner text within the list span 
    try{// starting try block 
        const response = await fetch('markComplete', { // creating a response variable that waits on a fetch to get data from the reult of the markComplete route 
            method: 'put',// setting CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content exprected, which wil be JSON 
            body: JSON.stringify({  // declare the message content being passed, and stringify that content 
                'itemFromJS': itemText// setting content of the body  to the inner text of the list item, and naming it  "itemFromJS"
            })
          })
        const data = await response.json()//waiting on json from rrespnse to be converted
        console.log(data)//log results
        location.reload() // reload page 

    }catch(err){ //if an err occurs pass the err into the catch 
        console.log(err)// logs err
    }// closes catch 
}// end function 

async function markUnComplete(){ // creating async function 
    const itemText = this.parentNode.childNodes[1].innerText // looking inside list items and grabs only the inner text within the list span 
    try{// try block 
        const response = await fetch('markUnComplete', {// creating a response variable that waits on a fetch to get data from the reult of the markUnComplete route
            method: 'put', // setting CRUD method for update
            headers: {'Content-Type': 'application/json'},// tell what kind of content will be expected
            body: JSON.stringify({// declare the message content being passed, and stringify that content
                'itemFromJS': itemText// setting content of the body  to the inner text of the list item, and naming it  "itemFromJS"
            })
          })
        const data = await response.json()//waiting on json from rrespnse to be converted
        console.log(data)// logging data 
        location.reload()// reloading page 

    }catch(err){ //if an err occurs pass the err into the catch 
        console.log(err)// logging err
    }// closing cath 
}// closing function 