const deleteBtn = document.querySelectorAll('.fa-trash')/*creates a constant variable (which is unchangable) called deleteBtn and it holds all of the element in the html with the class of .fa-trash*/

const item = document.querySelectorAll('.item span')/*assigning a constant variable called item to all span elements that are children of elements with the class of .item */

const itemCompleted = document.querySelectorAll('.item span.completed')/*assinging a const variable called itemCompleted that holds all span with the class of .completed that are children of any elements with the class of .item */

/*using the .from() method on Array to grab all elements assigned to deleteBtn variable and create an array from those items so that we can apply an array method. then applying the .forEach() array method and setting a single parameter to element.*/Array.from(deleteBtn).forEach((element)=>{
    /*we loop through each element we add an event listener that waits for a click and on click executes the function called deleteItem*/element.addEventListener('click', deleteItem)
})/*close our first loop */

/*creating another array and looping over each span that is a child of elements with a class of .item*/Array.from(item).forEach((element)=>{
    /*for each element add a click event that will execute the function called markComplete when clicked*/element.addEventListener('click', markComplete)
})/*closes this loop */

/*creates another array from elements in the variable itemCompleted and loops over each element via the forEach array method*/Array.from(itemCompleted).forEach((element)=>{
    /*for each element we're adding a click event that executes the function markUnComplete when the element is clicked*/element.addEventListener('click', markUnComplete)
})/*ends the loop function*/

async function deleteItem(){/*declare an asynchronous function called deleteItem with no parameters */
    const itemText = this.parentNode.childNodes[1].innerText/*creating const variable called itemText that holds the inner text of the second element of the childNode of the parentNode of the element itself that was clicked(the list item) */
    try{ //begins a try-catch block
        //the try will execute some code and if it fails then 
        //the catch will execute
        const response = await fetch('deleteItem', { //creating a variable that awaits on a fetch to get data from the 'deleteItem' route
            method: 'delete', //sets the CRUD method for the route 'deleteItem' to DELETE
            headers: {'Content-Type': 'application/json'},//specifying the type of context expected which is JSON
            body: JSON.stringify({// declares the message content being passed and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            })// closing the body
          })// closing the object
        const data = await response.json() // declare variable that awaits the response and holds that response parsed into JSON
        console.log(data)//logs the data to the console
        location.reload()//reloads the page

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)// logs the error message to the console
    }//close the catch block
}//end the function

async function markComplete(){// declare asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText// creating const variable called itemText that holds the inner text of the second element of the childNode of the parentNode of the element itself that was clicked(the list item)
    try{//begins a try-catch block
        //the try will execute some code and if it fails then 
        //the catch will execute
        const response = await fetch('markComplete', {//creating a variable that awaits on a fetch to get data from the 'markComplete' route
            method: 'put',//sets the CRUD method for the route 'markComplete' to PUT so it updates
            headers: {'Content-Type': 'application/json'},//specifying the type of context expected which is JSON
            body: JSON.stringify({// declares the message content being passed and stringify that content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            })// closing the body
          })// closing the object
        const data = await response.json()// declare variable that awaits the response and holds that response parsed into JSON
        console.log(data)//logs the data to the console
        location.reload()//reloads the page

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)// logs the error message to the console
    }//close the catch block
}//end the function

async function markUnComplete(){// declare asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText// creating const variable called itemText that holds the inner text of the second element of the childNode of the parentNode of the element itself that was clicked(the list item)
    try{//begins a try-catch block
        //the try will execute some code and if it fails then 
        //the catch will execute
        const response = await fetch('markUnComplete', {///creating a variable that awaits on a fetch to get data from the 'markUnComplete' route
            method: 'put',//sets the CRUD method for the route 'markUnComplete' to PUT so it updates
            headers: {'Content-Type': 'application/json'},// declares the message content being passed and stringify that content
            body: JSON.stringify({// declares the message content being passed and stringify that content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            })// closing the body
          })//reloads the page
        const data = await response.json()// declare variable that awaits the response and holds that response parsed into JSON
        console.log(data)//logs the data to the console
        location.reload()//reloads the page

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)// logs the error message to the console
    }//close the catch block
}//end the function