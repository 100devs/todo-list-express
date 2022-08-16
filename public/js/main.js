const deleteBtn = document.querySelectorAll('.fa-trash') //const variable created to store deletebutton selection from html
const item = document.querySelectorAll('.item span') //const variable created to store all span tags with class of .item selection from html
const itemCompleted = document.querySelectorAll('.item span.completed')//const variable created to store all span tags with class of .item , span.completed

Array.from(deleteBtn).forEach((element)=>{//creating an array from a selection and looping through using forEach() array method
    element.addEventListener('click', deleteItem) //adding a click event that calls deleteItem function
})//close method

Array.from(item).forEach((element)=>{//creating an array from variable declared above(item) and looping through using forEach() method
    element.addEventListener('click', markComplete)//adds click event and calls markComplete function
})//close method

Array.from(itemCompleted).forEach((element)=>{//create an array from varibale declared above (itemCompleted) and looping through useing forEach() method 
    element.addEventListener('click', markUnComplete)//adds click event and calls markUncomplete function
})

async function deleteItem(){//declaring an async function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText//declaring a const variable that looks inside the listy item and looks at the inner text(not the innerhtml) and stores the value 
    try{//declaring a try block 
        const response = await fetch('deleteItem', {//creating a const variable that awaits on a fetch to get data from result of deleteItem
            method: 'delete',//sets CRUD method for route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, JSON in this case
            body: JSON.stringify({//declare the message content being passed, and stringify(turn into string) that content
              'itemFromJS': itemText//setting content of the body to inner text of list item and naming it 'itemFromJS'
            })//closing body
          })//closing repsonse object
        const data = await response.json()//waiting for server to respond with converted JSON 
        console.log(data)//log the data to console
        location.reload()//reload the page to update what is displayed 

    }catch(err){// declare catch block with param of err to catch error
        console.log(err)//log error if there is one
    }//close catch block
}//close async fucntion

async function markComplete(){//declaring an sync function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText//declaring a const variable that looks inside the listy item and looks at the inner text(not the innerhtml) and stores the value
    try{//declaring try block 
        const response = await fetch('markComplete', {//creating a const variable object that awaits on a fetch to get data from result of markComplete
            method: 'put',//sets CRUD method for route, put in this case 
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, JSON in this case
            body: JSON.stringify({//declare the message content being passed, and stringify(turn into string) that content
                'itemFromJS': itemText//setting content of the body to inner text of list item and naming it 'itemFromJS'
            })//closing body
          })//closing response object
        const data = await response.json()//waiting for server to respond with converted JSON
        console.log(data)//log data to console
        location.reload()//reload page to update information being displayed

    }catch(err){//declare catch block with param of err to catch error
        console.log(err)//log error to console if there is one
    }//close catch block 
}//close async function

async function markUnComplete(){//declaring async function called markUnComplete 
    const itemText = this.parentNode.childNodes[1].innerText//declaring a const variable that looks inside the listy item and looks at the inner text(not the innerhtml) and stores the value
    try{//decalting a try block
        const response = await fetch('markUnComplete', {//creating a const variable object that awaits on a fetch to get data from result of markComplete
            method: 'put',//sets CRUD method for route, put in this case
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, JSON in this case
            body: JSON.stringify({//declare the message content being passed, and stringify(turn into string) that content
                'itemFromJS': itemText//setting content of the body to inner text of list item and naming it 'itemFromJS'
            })//closing body
          })//closing response object
        const data = await response.json()//waiting for server to respond with converted JSON
        console.log(data)//log data to console
        location.reload()//reload page to update info being displayed 

    }catch(err){//declare catch block with param of err to catch err
        console.log(err)//log err to console if there is one
    }//close catch block
}//close async function