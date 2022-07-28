const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable that is assigning it to a selection that selects all elements with class of fa-trash
const item = document.querySelectorAll('.item span') //creates a variable that is assigned to the selection of spans that are inside the class of item parent
const itemCompleted = document.querySelectorAll('.item span.completed')//creates a variable that is assigned to the selection of spans that are inside the class of item parent but also has a class of completed

Array.from(deleteBtn).forEach((element)=>{ //takes the deleteBtn and creates an array from them, and the forEeach method starts a loop to iterating throuh it
    element.addEventListener('click', deleteItem) //add an eventlistener to the current item, and on click calls a function deleteItem
}) //closese the loop

Array.from(item).forEach((element)=>{//takes item and creates an array and starts a loop
    element.addEventListener('click', markComplete)//adds and evenlistener to those spans and on click calls the function markComplete
})//closes the loop
//element.addEventListener('click', markComplete())  will execute it immediately and not on click

Array.from(itemCompleted).forEach((element)=>{//takes item and creates an array and starts a loop..only for thing that are complete
    element.addEventListener('click', markUnComplete)//evenlistener on click that calls the function markUnComplete on things that are complete
})//closes the loop

async function deleteItem(){//declares an async function....on how the code is executed out of the flow of the normal...js does things one by one..single threaded
    const itemText = this.parentNode.childNodes[1].innerText//this whole confusing bit just grabs the text inside lists ind puts in the var of itemText...parentNode.childNode acts as a selector
    try{//declaration of a try block...which is usually paired with a catch block...try does something...and if an error comes up catch block deals with the error
        const response = await fetch('deleteItem', {//creating a variable response that waits on the fetch to get data from the result of /deleteItem route

            //this also starts an object with a method of delete...
            method: 'delete',//which sets hte crud method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content we expect...which is json
            body: JSON.stringify({//declare the message content..the one we recieve from the database...and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on he json from the respones to be converted
        console.log(data)//log the data to the console
        location.reload()//refreshes the page!! so we can see changes


    }catch(err){//if an error occurs pass it through the the catch block
        console.log(err)//log the error to the console
    }//closes the catch block
}//end of function

async function markComplete(){//starts a asych function
    const itemText = this.parentNode.childNodes[1].innerText//this whole confusing bit just grabs the text inside lists ind puts in the var of itemText...parentNode.childNode acts as a selector
    try{//start a try block to do something
        const response = await fetch('markComplete', {//creating a variable response that waits on the fetch to get data from the result of /markComptele route
            method: 'put',//setting the crud method to update
            headers: {'Content-Type': 'application/json'},//setting the content expected..which is json
            body: JSON.stringify({//turn the json into a strng
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//closnig the body
          })//closing the object
        const data = await response.json()//wait for the conversion into json
        console.log(data)//log the data to console
        location.reload()//refreses the page

    }catch(err){//if error occurse we pass it through the catch block
        console.log(err)//log the error on the console
    }//closes the console block
}//closes the function

async function markUnComplete(){//starting the async function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item and grabs only the inner text within the list span
    try{//starting the try block
        const response = await fetch('markUnComplete', {//creates the response varibale that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//setting the content expected..which is json
            body: JSON.stringify({//turn the json into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })//closing the body
          })//closing the object
        const data = await response.json()//wait for the conversion into json
        console.log(data)//log the data to console
        location.reload()//refreshes the page

    }catch(err){//the catch block tries to takes care of the error
        console.log(err)//log the error in the console
    }//end of close block
}//end of function 

//main.js has become a launchpad for the things to happen in the server side

//main.js doesn't need stuff from forms because it has build in support for routes..most routes at least..since they can't update