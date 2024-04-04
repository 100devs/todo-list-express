const deleteBtn = document.querySelectorAll('.fa-trash') //Call the document method 'querySelectorAll' and pass in '.fa-trash' as the selector. This will obtain every element with a class of 'fa-trash' and create a nodeList out of them. Assign this nodeList to a constant variable named 'deleteBtn'

const item = document.querySelectorAll('.item span') //Call the document method 'querySelectorAll' and pass in '.item span' as the selectors. This will obtain every span element that is the child of an element with a class of 'item' and create a nodeList out of them. Assign this nodeList to a constant varibale called 'item'

const itemCompleted = document.querySelectorAll('.item span.completed') //Call the document method 'querySelectorAll' and pass in 'item span.completed' as the selectors. This will obtain every span element with a class of 'completed' that is the child of an element with a class of 'item'

Array.from(deleteBtn).forEach((element) => { //Call the Array method "from" and pass in "deleteBtn" as the argument. This will create a shallow copied array instance from our "deleteBtn" nodeList. Call the "forEach" method on this new array and attach an event listener of type "click" to every element in this array. These clicks will trigger a callback function called "deleteItem"
  element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element) => { //Call the Array method "from" and pass in "item" as the argument. This will create an array out of our "item" nodeList. Call the "forEach" method on this array and attach an event listener of type "click" to every element in this array. These clicks will trigger a callback function called "markComplete"
  element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element) => { //Call the Array method "from" and pass "itemCompleted" as the argument. This will create an array out the "itemCompleted" nodeList. Call the "forEach" method on this array and attach an event listener of type "click" to every element in this array. These clicks will trigger a callback function called "markUncomplete"
  element.addEventListener('click', markUnComplete)
})

async function deleteItem() { //declare an asynchronous function called "deleteItem"
  const itemText = this.parentNode.childNodes[1].innerText //Find the parent node of this node, then find the child element of that node, using the "innerText" property, select the rendered text content of that node and assign it to a variable called "itemText"

  try { // Create a try block
    const response = await fetch('deleteItem', { //Use the fetch method of the javascript fetch API. Pass in the path/route/endpoint that our fetch will communicate with as the first argument (the 'deleteItem' route), and an object containing options as the second argument.   
      method: 'delete', //Specify the HTTP request method we are using, which is 'delete'
      headers: { 'Content-Type': 'application/json' }, //Set the content type of the request header to "application/json" This tells the fetch that we will be sending data in JSON format
      body: JSON.stringify({ //Call the JSON method "stringify" to convert the data we're sending into JSON. 
        'itemFromJS': itemText // Pass the data stored in our itemText variable into a variable called 'itemFromJs' and attach it to the request body as a property.
      })
    }) //fetch returns a promise object. Store that object in a variable called 'response'
    const data = await response.json() // use the .json() method to parse the response and convert it to JSON. This method also returns a promise, store that promise in a variable called 'data'
    console.log(data) //log that data to the console.
    location.reload() // reload the curent URL to refresh the page.

  } catch (err) { //Create a catch block and pass in any error that may have occurred 
    console.log(err) //log that error to the console.
  }
}

async function markComplete() { //Declare an asynchronous function called "markComplete"
  const itemText = this.parentNode.childNodes[1].innerText // Find the parent node of this node, then find the first child element of that node, finally select the rendered text content of that node and assign it to a variable called "itemText"
  try { //Declare a try block
    const response = await fetch('markComplete', { // Make a fetch to the 'markComplete' route, and pass in an options object.
      method: 'put', //Set the HTTP method we are using to 'put'
      headers: { 'Content-Type': 'application/json' }, // Specify that we are sending JSON data
      body: JSON.stringify({ //Convert the data we are sending to JSON format
        'itemFromJS': itemText //Pass the data stored in our itemText variable into a variable called "itemFromJs" and attach it to the request body. 
      })
    }) //Store the response we receive in a variable called "response"
    const data = await response.json() //Convert the reponse to JSON, doing so will return a promise. Store that promise in a variable called "data" 
    console.log(data) //Log the content of data to the console.
    location.reload() //Refresh the page

  } catch (err) { //Declare a catch block to catch potential errors 
    console.log(err) //Log those errors to the console.
  }
}

async function markUnComplete() { //Declare an asynchronous function called "markUnComplete"
  const itemText = this.parentNode.childNodes[1].innerText //Find the parent node of this node, then find the first child element of that node, finally select the rendered text content of that node and assign it to a variable called "itemText"
  try { //Declare a try block
    const response = await fetch('markUnComplete', { //Make a fetch to the 'markUnComplete' route, and pass in an options object.
      method: 'put', //Set the HTTP method we are using to 'put'
      headers: { 'Content-Type': 'application/json' }, // Specify that we are sending JSON data.
      body: JSON.stringify({ // Convert the data we are sending to JSON
        'itemFromJS': itemText // //Pass the data stored in our itemText variable into a variable called "itemFromJs" and attach it to the request body. 
      })
    })// Store the response we receive in a variable called "response"
    const data = await response.json() // Convert the response to JSON, doing so returns a promise. Store that promise in a variable called 'data'
    console.log(data) //Log that data to the console.
    location.reload() // Refresh the page.

  } catch (err) { //Declare a catch block to catch potential errors 
    console.log(err) //Log those errors to the console.
  }
}