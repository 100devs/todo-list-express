const deleteBtn = document.querySelectorAll('.fa-trash')  //creating a variable and assigning it to a selection of class of trash can.
const item = document.querySelectorAll('.item span')  //creating a variable and assigning it a selection of span tags inside a parent with a class of item (ie: there's an li with a class of item, this targets the span within this li)
const itemCompleted = document.querySelectorAll('.item span.completed') //creating variable and assigning it a selection of span tags with a class of completed with a parent with a class of item.

Array.from(deleteBtn).forEach((element)=>{  //creating an array from our deleteBtn (from above) and starting a loop
    element.addEventListener('click', deleteItem)  //adding eventListener to each item that is listening for a click, starts deleteItem function PS there are not another set of parentheses after function name becasue it would execute immediately regardless of click. good to know!
})  //close our loop

Array.from(item).forEach((element)=>{  //creating an array from 'item'(refers to const above) and starting loop
    element.addEventListener('click', markComplete)   //adds eventListener and kicks off markComplete function
})  //close loop

Array.from(itemCompleted).forEach((element)=>{  //creating an array of completed items and starting loop
    element.addEventListener('click', markUnComplete)  //adds eventListener and kicks off markUnComplete function
}) //closes loop

async function deleteItem(){  //declaring asynchronous function (clicked on trashcan)
    const itemText = this.parentNode.childNodes[1].innerText //should have used classes.looks inside of the li item to extract the inner text only of the list span. The task name is eliminated?
    try{  // starting a try block to do something. Pairs with catch below.
        const response = await fetch('deleteItem', {  //creates response variable that is waiting on fetch to get data from result of deleteItem route. Starting object
            method: 'delete',  //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying content we are expecting, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //ugh. Setting content of the body to the inner text of list item and naming it 'itemFromJS'
            }) //closing body
          })  //closing our object
        const data = await response.json() //waiting for JSON from response to be converted
        console.log(data)  //log data to console
        location.reload()  //refreshes the page to update changes

    }catch(err){  //if an error occurs, pass error into catch block
        console.log(err) //log error
    }  //close catch
}  //close function

async function markComplete(){  //declare ansynchronous function- only difference between this function and the one above is route and method
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the li item to extract the inner text only of the list span
    try{  //starting a try block to do something. Pairs with catch below.
        const response = await fetch('markComplete', {  //creates response variable that is waiting on fetch to get data from result of markComplete route.
            method: 'put',//this is an update
            headers: {'Content-Type': 'application/json'}, //requesting json
            body: JSON.stringify({  //declare the message content being passed to the server, and stringify that content
                'itemFromJS': itemText  //Setting content of the body to the inner text of list item and naming it 'itemFromJS'
            }) //closing body
          })  //closing object
        const data = await response.json() //waiting for JSON from response to be converted
        console.log(data)  //log data to console
        location.reload()  //reloads the page to udate changes

    }catch(err){  //if an error occurs, pass error into catch block
        console.log(err)  //log error
    }  //close catch
}  //close function

async function markUnComplete(){  //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText  //looks inside of the li item to extract the inner text only of the list span
    try{  //start try block
        const response = await fetch('markUnComplete', { //creates response variable that is waiting on fetch to get data from result of markUnComplete route.
            method: 'put', //request update
            headers: {'Content-Type': 'application/json'}, //request JSON
            body: JSON.stringify({ //declare the message content being passed to the server, and stringify that content
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}