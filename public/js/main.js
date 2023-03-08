const deleteBtn = document.querySelectorAll('.fa-trash')
// This assigns everything with the fa-trash class to the variable "deleteBtn"
const item = document.querySelectorAll('.item span')
// This takes all spans that are children of elements with the class of item from the DOM and assigns them to the variable "item"
const itemCompleted = document.querySelectorAll('.item span.completed')
// This takes everything with a class of item and all spans with the class of completed and assigns them to the variable "itemCompleted"

Array.from(deleteBtn).forEach((element)=>{
// This line is making an array from all the things from the fa-trash class. Then it's going to take each element and do the following to it: 
    element.addEventListener('click', deleteItem)
// It's going to add an event listener to the elements and on a click, it's going to call the deleteItem function found later in the code
})
// End of function and method

Array.from(item).forEach((element)=>{
// This line is making an array from every span that is a descendant of an element with the class of item and starting a forEach method. This will modify the array to do the following:
    element.addEventListener('click', markComplete)
// It's going to add an event listener to those elements and on a click, do the markComplete function found later in the code
})
// End of function and method

Array.from(itemCompleted).forEach((element)=>{
// This line is making an array from every span with a class of completed that is a descendant of every element with a class of item and starting a forEach method. It is going to modify the array to do the following:
    element.addEventListener('click', markUnComplete)
// It's going to add an event listener to those elements and on click, will run the markUnComplete function found later in the code
})
// End of function and method

async function deleteItem(){
// This is an async function, meaning it will wait for some other things to get done before it runs. It's called "deleteItem"
    const itemText = this.parentNode.childNodes[1].innerText
// This assigns a variable named itemText to the following: "this" marks it as pertaining to this object. It then selects the parent element, and then the first child of that parent element's innerText
    try{
// The try catch is basically saying "try this. If you catch an error, do something else"
        const response = await fetch('deleteItem', {
// This is assigning the variable response to the await part of the function. The await will fetch the URL with "deleteItem"
            method: 'delete',
// This indicates that we want to delete an item
            headers: {'Content-Type': 'application/json'},
// This sets the content type to JSON
            body: JSON.stringify({
// This will convert our JSON reponse into javascript we can use
              'itemFromJS': itemText
// This will specify what text to delete
            })
          })
        const data = await response.json()
// This assigns the response to the variable data
        console.log(data)
// This will log the response to the console
        location.reload()
// This will force a reload of the page
    }catch(err){
// If you catch an error...
        console.log(err)
// ...log it to the console
    }
// End of catch
}
// End of deleteItem function

async function markComplete(){
// The function markComplete will be done asynchronously
    const itemText = this.parentNode.childNodes[1].innerText
// This is assigning a variable "itemText" to the innerText of the first child node of the parent node of this object
    try{
// The try catch is basically "try this if you catch an error, do something else"
        const response = await fetch('markComplete', {
// This is assigning the variable response to the result of this fetch. The fetch is going to be to the url "markComplete"
            method: 'put',
// This is saying we want to use a PUT method, AKA, update something
            headers: {'Content-Type': 'application/json'},
// This is saying we're gonna get JSON
            body: JSON.stringify({
// This parses the JSON into usable javascript
                'itemFromJS': itemText
// This is saying what we're going to modify
            })
// End of the function
          })
// End of the fetch
        const data = await response.json()
// This is assigning the variable data to whatever the response is going to be and making that response into JSON
        console.log(data)
// This is sending the data to the console
        location.reload()
// This is telling the browser to refresh

    }catch(err){
// If you caught and error...
        console.log(err)
// ...log it to the console
    }
// end of catch
}
// end of markComplete function

async function markUnComplete(){
// The function markUnComplete will be done asynchornously
    const itemText = this.parentNode.childNodes[1].innerText
// The variable itemText will be assigned to the innerText of the first child node of the parent node of this object
    try{
// The try catch is basically "try this. If you catch an error, do something else"
        const response = await fetch('markUnComplete', {
// This is assigning the variable response to the resume of the fetch that points to the URL "markUncomplete"
            method: 'put',
// This is saying that we're going to use a PUT method, AKA, an update
            headers: {'Content-Type': 'application/json'},
// This is saying the content is going to be in JSON
            body: JSON.stringify({
// We're going to put that JSON into usable javascript
                'itemFromJS': itemText
// This is what we're going to update
            })
// End of fetch
        })
// End of try
        const data = await response.json()
// Assign the variable data to the response in JSON
        console.log(data)
// log that data to the console
        location.reload()
// refresh the browser
    }catch(err){
// If you catch and error...
        console.log(err)
// ...log it to the console
    }
// End of catch
}
// End of function markUnComplete