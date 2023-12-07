const deleteBtn = document.querySelectorAll('.fa-trash')                // grabs elements in DOM with .fa-trash class and stores them in variable 'deleteBtn'
const item = document.querySelectorAll('.item span')                    // stores span elements with class of 'item' and stores them in var 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // span elements with class of 'completed' that have a parent with class of 'item', stored in itemCompleted var

Array.from(deleteBtn).forEach((element)=>{         // creates array from everything in deleteBtn variable, then iterates through em using forEach, giving each element the variable name of 'element'
    element.addEventListener('click', deleteItem)  // adds click event listener to every element, passing in a callback func with name of deleteItem
})

Array.from(item).forEach((element)=>{               // .from() creates array from the elements in 'item', then calls forEach on that array, which iterates through each element one by one
    element.addEventListener('click', markComplete) // adds a click event listener to every element in our array, and passes in markComplete() as the callback func to be called when one gets clicked on
})

Array.from(itemCompleted).forEach((element)=>{        // creates an array from everything in our itemCompleted variable, then iterates through our array using forEach
    element.addEventListener('click', markUnComplete) // adds a click event listener to every element, and passes in markUnComplete as our func to be called whenever a click happens
})

async function deleteItem(){                                 // declares a asynchornous func. asynchronous funcs allow us to do something while we wait for some else to finish
    const itemText = this.parentNode.childNodes[1].innerText // 'this' refers to the current context, or current obj. 'parentNode' is a property that returns the parent node of a specified node in DOM, 'childNodes' is a property that returns a NodeList of child nodes of specified element. We are accessing second one; it's zero-based. 'innerText' retrieves the text content
    try{
        const response = await fetch('deleteItem', {         // using fetch api to make delete request to 'deleteItem' URL along with a second argument which is an object
            method: 'delete',                                // this specifies HTTP method to be used for the request
            headers: {'Content-Type': 'application/json'},   // specifying headers, saying the request body will be JSON
            body: JSON.stringify({                           // body of request will be an object, but we convert it into a JSON string
              'itemFromJS': itemText                         // seeting 'itemFromJS' equal to our itemText variable from earlier
            })
          })
        const data = await response.json()  // 'await' will pause execution of code until the Promise returned from 'fetch' is resolved, we use json() to format the response, and store it in a 'data' variable
        console.log(data)                   // consoling logging our 'data' variable
        location.reload()                   // reloads our current page to reflect changes made on server

    }catch(err){
        console.log(err)                    // log any erros
    }
}

async function markComplete(){ // async
    const itemText = this.parentNode.childNodes[1].innerText // same as above
    try{
        const response = await fetch('markComplete', {      // 'await' keyword tells program to pause execution of code until our fetch promise is resolved. 'fetch' is making a request to a page with the url endpoitn of 'markComplete', the second argument is an options object
            method: 'put',                                  // we specify the method of this request as a 'put' request 
            headers: {'Content-Type': 'application/json'},  // indicates that the request body will be in JSON format
            body: JSON.stringify({                          // this is the data we are including in the request. it will be an object that is turned into  JSON str
                'itemFromJS': itemText                      // this obj is payload that will be sent to server, it contains the item text obtained earlier
            })
          })
        const data = await response.json()  // .json() used to extract JSON body content from response, this returns a promsie. 'await' is used to pause execution of func until the promise returned by .json() is complete
        console.log(data)                   // 'data' gets logged
        location.reload()                   // current page is then reloaded to reflect changes made on server

    }catch(err){
        console.log(err)    // log any errors 
    }
}

async function markUnComplete(){    // declaring async function, so we'll return a promise, this also allows us to use 'await' keyword inside our func
    const itemText = this.parentNode.childNodes[1].innerText    // goes to parent element of current element, gets list of children, grabs text content from second one
    try{
        const response = await fetch('markUnComplete', {    // making 'fetch' request to 'markUnComplete' endpoing, second argument is obj where we'll specifiy more about the request we are making. 'await' pauses execution of code until promise that fetch returns is resolved
            method: 'put',                                  // declares method of request as 'put'
            headers: {'Content-Type': 'application/json'},  // specifies 'Content-Type' header, declaring body of request will be in JSON
            body: JSON.stringify({                          // passes data in request as JSON string, using the item Text we got earlier
                'itemFromJS': itemText
            })
          })
        const data = await response.json()  // .json() extracts json data from our response and returns a promise, 'await' will pause execution of code until that promise is resolved
        console.log(data)                   // logs data, which is resolved promise form response.json()
        location.reload()                   // reloads current page to reflect changes in server

    }catch(err){
        console.log(err)
    }
}