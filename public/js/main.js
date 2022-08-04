const deleteBtn = document.querySelectorAll('.fa-trash')    //creating a variable and asigning it to a selection of all elements with a class of the trash can
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside a of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans of "completed" inside a class of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{  //creating an array from our selection and starting a loop 
    element.addEventListener('click', deleteItem) //add an event listener to the current item thast waits for a click and calss a function called deletesItem
})//close our loop

Array.from(item).forEach((element)=>{ //craeting ana array from our selection and starting a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item  waits afor a click and cals a funct called markComplete
})// close our loop

Array.from(itemCompleted).forEach((element)=>{ //creates an array from our selection and starts a loop
    element.addEventListener('click', markUnComplete)// adds an event listener to only completed items 
})//closes our loop

async function deleteItem(){  //declaring an async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates a variable that waits on afetch to get data from the results of adeletItem route
            method: 'delete', //sets the crud method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected,which is json
            body: JSON.stringify({ //declare the message content being passed, and stringify the content
              'itemFromJS': itemText //setting the content of the body to the innertext of the list item and naming it 'itemFromJs'
            })//closes body
          })//closing the object
        const data = await response.json() //waiting fro the server to rwespond with some json
        console.log(data) //log the result in the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){ //if an error occurs pass the error int othe catch
        console.log(err) //log the error into the console
    } //closes the catch block
}//end of function

async function markComplete(){ //declaring an async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text withn the list span
    try{ //starting a trying a block
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to get data from a reult of the markComplete route
            method: 'put',//setting a crud method update for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected,which is json
            body: JSON.stringify({//declare the message content being passed, and stringify the content
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and naming it 'itemFromJs'
            })//closing the body
          })//closing the object
        const data = await response.json() //waiting on json from the response to be convereted
        console.log(data)//log the result to the console
        location.reload()//reload page to update what is displayed

    }catch(err){//if an error occurs pass the error int othe catch
        console.log(err)//log the error into the console
    }//closes catch block
}//end of function

async function markUnComplete(){// declaration of async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text withn the list span
    try{//starting a try block
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from a reult of the markUncomplete route
            method: 'put',//setting a crud method update for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected,which is json
            body: JSON.stringify({//declare the message content being passed, and stringify the content
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and naming it 'itemFromJs'
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on json from the response to e converted
        console.log(data)//log the result to the console
        location.reload()//reload page to update what is displayed

    }catch(err){//if an error ocxcur pass the error into the catch
        console.log(err)//log the error into the console
    }//closes the catch block
}//closes the function