const deleteBtn = document.querySelectorAll('.fa-trash')
// declares constant deleteBtn (selects) as all element with the class .fa-trash in the DOM
const item = document.querySelectorAll('.item span')
// declares constant of item as all (selects) spans with .item as a class
const itemCompleted = document.querySelectorAll('.item span.completed')
// declares constant of itemCompleted as all spans with classes of item and completed

Array.from(deleteBtn).forEach((element)=>{
// makes an array out of deleteBtn elements and for each item in the array does below
    element.addEventListener('click', deleteItem)
// add an event listener for each element in the array (deleteBtn) which runs deleteItem function on click
})
// closes out for each behavior

Array.from(item).forEach((element)=>{
// makes an array from all items selected with the queryselectorall and contained in constant item and does below for each
    element.addEventListener('click', markComplete)
// adds an event listener to each array element which on click runs markComplete
})
// closes out for each behavior

Array.from(itemCompleted).forEach((element)=>{
// makes an array from elements in itemCompleted constant and for each of them runs the below
    element.addEventListener('click', markUnComplete)
// for each element, adds an event listener that on click goes 'Heyo, gimme markUncomplete'!
})
// closes out for each behavior

async function deleteItem(){
// asyncronous function named deleteItem, as called by above event listeners
    const itemText = this.parentNode.childNodes[1].innerText
// declares constant which refers to element it is being called on as this and then selects the parent node and the next child nodes inner text, ie the inner text of the element
    try{
// opening for try behavior similar to resolve reject, ie or more like if else syntax is similar
        const response = await fetch('deleteItem', {
// declares constant named response which waits (promise) for a fetch to complete which does deleteItem and object it will send with the fetch
            method: 'delete',
// property and value for method in object sent with the fetch, delete, ie deleetay
            headers: {'Content-Type': 'application/json'},
// property and value for headers in object sent with the fetch, gives content type as application/json
            body: JSON.stringify({
// body property of object sent with fetch, makes JSON out of below content
              'itemFromJS': itemText
// stringifys this object, into JSON, the item from JS and the item text as declared above (item text is content/value of itemFromJs)
            })
// closes the stringifying
          })
// closes the object and the fetch
        const data = await response.json()
// declares a constant named data as the await (promised) response (above variable) and converts it from JSON to an object
        console.log(data)
// logs the data object in the console
        location.reload()
// refreshes the page

    }catch(err){
// catch if the async function doesn't try succesfully
        console.log(err)
// console logs an error
    }
// closes the catch statement
}
//

async function markComplete(){
// opens asynchronous function named markComplete, as called by above even listeners
    const itemText = this.parentNode.childNodes[1].innerText
// declares constant which refers to element it is being called on as this and then selects the parent node and the next child nodes inner text, ie the inner text of the element
    try{
// opens try for function, ie if all resolves correctly, runs
        const response = await fetch('markComplete', {
// declares constant response with await (promise) fetch for markComplete to server containing object containing below
            method: 'put',
// property and value for method sent with the fetch, put, ie update 
            headers: {'Content-Type': 'application/json'},
// property and value for headers in object sent with the fetch, gives content type as application/json
            body: JSON.stringify({
// body property of object sent with fetch, makes JSON out of below content
              'itemFromJS': itemText
// stringifys this object, into JSON, the item from JS and the item text as declared above (item text is content/value of itemFromJs)
            })
// closes the stringifying
          })
// closes the object and the fetch
        const data = await response.json()
// declares a constant named data as the await (promised) response (above variable) and converts it from JSON to an object
        console.log(data)
// logs the data object in the console
        location.reload()
// refreshes the page

    }catch(err){
// catch if the async function doesn't try succesfully
        console.log(err)
// console logs an error
    }
// closes the catch statement
}
//

async function markUnComplete(){
// opens asynchronous function named markUnComplete, as called by above even listeners
    const itemText = this.parentNode.childNodes[1].innerText
// declares constant which refers to element it is being called on as this and then selects the parent node and the next child nodes inner text, ie the inner text of the element
    try{
// opens try for function, ie if all resolves correctly, runs
        const response = await fetch('markUnComplete', {
// declares constant response with await (promise) fetch for markUnComplete to server containing object containing below
            method: 'put',
// property and value for method sent with the fetch, put, ie update 
            headers: {'Content-Type': 'application/json'},
// property and value for headers in object sent with the fetch, gives content type as application/json
            body: JSON.stringify({
// body property of object sent with fetch, makes JSON out of below content
              'itemFromJS': itemText
// stringifys this object, into JSON, the item from JS and the item text as declared above (item text is content/value of itemFromJs)
            })
// closes the stringifying
          })
// closes the object and the fetch
        const data = await response.json()
// declares a constant named data as the await (promised) response (above variable) and converts it from JSON to an object
        console.log(data)
// logs the data object in the console
        location.reload()
// refreshes the page

    }catch(err){
// catch if the async function doesn't try succesfully
        console.log(err)
// console logs an error
    }
// closes the catch statement
}
//