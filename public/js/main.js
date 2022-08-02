const deleteBtn = document.querySelectorAll('.fa-trash')//creating variable and assigning it to selection of all elments w class of trashcan
const item = document.querySelectorAll('.item span')//creating variable and assigning it to selection of span tags inside of a parents with a class of item 
const itemCompleted = document.querySelectorAll('.item span.completed')//creating variable, assigning it to selection of spans with a class of completed with a class of item

Array.from(deleteBtn).forEach((element)=>{ //creating an array from selection and starting a loop
    element.addEventListener('click', deleteItem)//add event listener to current item, listen for click, upon click - runs delete item fucntion
})//close loop 

Array.from(item).forEach((element)=>{//creating an array from selection, starting a loop
    element.addEventListener('click', markComplete)//add event listener to current item, listen for click, upon click - runs mark complete function
})//close loop 

Array.from(itemCompleted).forEach((element)=>{//creating an array from selection, starting a loop
    element.addEventListener('click', markUnComplete)//add event listener to ONLY completed items
})//close loop 

async function deleteItem(){//declare asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item, grabs inner text w/in list span
    try{//declare try block
        const response = await fetch('deleteItem', {//creates response variable, waits on fetch to get data from deleteItem route
            method: 'delete',//sets CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying type of content expected to JSON
            body: JSON.stringify({//declare msg content, stringify that content
              'itemFromJS': itemText//setting content of body to the inner text of the list item and making it itemFromJS
            })//closing body
          })//closing object
        const data = await response.json()//waiting on json from the response to bbe converted
        console.log(data)//log data to the console
        location.reload()//reloading the webpage to update whats displayed

    }catch(err){//error handling, basic catch. if error occurs, pass into catch block
        console.log(err)//log the error to console
    }//close catch block
}//end function

async function markComplete(){//declare asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item, grabs inner text w/in list span
    try{//starting try block
        const response = await fetch('markComplete', {//declaring response and awaiting fetch on markComplete
            method: 'put',//setting CRUD method to update for route
            headers: {'Content-Type': 'application/json'},//specifiying type of content expected, JSON
            body: JSON.stringify({//declare msg content being passed, stringify it 
                'itemFromJS': itemText//setting content of body to inner text of the list item 
            })//close body
          })//close object 
        const data = await response.json()//waiting on JSON from response to be converted
        console.log(data)//log result to the console
        location.reload()//reloads page to update whats displayed 

    }catch(err){//error handling, basic catch. if error occurs, pass into catch block
        console.log(err)//log the error to console
    }//close catch block
}//end function

async function markUnComplete(){//declare asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item, grabs inner text w/in list span
    try{//starting try block
        const response = await fetch('markUnComplete', {//declaring response and awaiting fetch on markUnComplete
            method: 'put',//setting CRUD method to update for route
            headers: {'Content-Type': 'application/json'},//specifiying type of content expected, JSON
            body: JSON.stringify({//declare msg content being passed, stringify it 
                'itemFromJS': itemText//setting content of body to inner text of the list item 
            })//close body
          })//close object 
        const data = await response.json()//waiting on JSON from response to be converted
        console.log(data)//log result to the console
        location.reload()//reloads page to update whats displayed

    }catch(err){//error handling, basic catch. if error occurs, pass into catch block
        console.log(err)//log the error to console
    }//close catch block
}//end function