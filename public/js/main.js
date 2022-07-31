const deleteBtn = document.querySelectorAll('.fa-trash')//Create variable and assign it to all element with class of trash can
const item = document.querySelectorAll('.item span')//Create variable and assign it to span tags inside parent with class item
const itemCompleted = document.querySelectorAll('.item span.completed')//create variable and assign it to a selection of spans with the completed class inside parent with class item

Array.from(deleteBtn).forEach((element)=>{//create array from selection and starting a loop
    element.addEventListener('click', deleteItem)//add event listener to the current item then calls for function deleteItem
})//close loop

Array.from(item).forEach((element)=>{//create array from selection and starting a loop
    element.addEventListener('click', markComplete)//add event listener to the current item then calls for function markComplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{//create array from selection and starting a loop
    element.addEventListener('click', markUnComplete)//add event listener to the current item then calls for function markUnComplete
})//close loop

async function deleteItem(){//declare asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item to extract the text of only the specified list item
    try{//Starting a try block to do something
        const response = await fetch('deleteItem', {//Response variable assigned to fetch info from deleteItem from server
            method: 'delete',//sets method for route
            headers: {'Content-Type': 'application/json'},//specifies type of content expected
            body: JSON.stringify({//Declare the message content and stringify the conent
              'itemFromJS': itemText//Setting content of body to the inner text of list item
            })//Closes body
          })//Closes object
        const data = await response.json()//Data variable that is assigned to JSON of response
        console.log(data)//Console log data
        location.reload()//reload page 

    }catch(err){//If error occurs pass catch block
        console.log(err)//Console log error 
    }//Close catch block
}//End function

async function markComplete(){//declare asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item to extract the text of only the specified list item
    try{//Starting a try block to do something
        const response = await fetch('markComplete', {//Response variable assigned to fetch info from markComplete from server
            method: 'put',//sets method for route
            headers: {'Content-Type': 'application/json'},//specifies type of content expected
            body: JSON.stringify({//Declare the message content and stringify the conent
                'itemFromJS': itemText//Setting content of body to the inner text of list item
            })//Closes body
          })//Closes object
        const data = await response.json()//Data variable that is assigned to JSON of response
        console.log(data)//Console log data
        location.reload()//reload page 

    }catch(err){//If error occurs pass catch block
        console.log(err)//Console log error
    }//Close catch block
}//End function

async function markUnComplete(){//declare asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside list item to extract the text of only the specified list item
    try{//Starting a try block to do something
        const response = await fetch('markUnComplete', {//Response variable assigned to fetch info from markunComplete from server
            method: 'put',//sets method for route
            headers: {'Content-Type': 'application/json'},//specifies type of content expected
            body: JSON.stringify({//Declare the message content and stringify the conent
                'itemFromJS': itemText//Setting content of body to the inner text of list item
            })//Closes body
          })//Closes object
        const data = await response.json()//Data variable that is assigned to JSON of response
        console.log(data)//Console log data
        location.reload()//reload page 

    }catch(err){//If error occurs pass catch block
        console.log(err)//Console log error
    }//Close catch block
}//End function