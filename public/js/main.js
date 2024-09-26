
//targeting all DOM elements with 'fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')
//targeting all <span> tags in the DOM, where the parent element has the class of 'item' 
const item = document.querySelectorAll('.item span')
//targeting all <span> tags in the DOM with the class 'completed', where the parent element has the class of 'item' 
const itemCompleted = document.querySelectorAll('.item span.completed')


//create an array from the queery selector all results, so we can loop through all of them, and add a 'click' event listener that fires the 'deleteItem' function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//create an array from the queery selector all results, so we can loop through all of them, and add a 'click' event listener that fires the 'markComplete' function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//create an array from the queery selector all results, so we can loop through all of them, and add a 'click' event listener that fires the 'markUnComplete' function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// note. -open your EJS file to help the element targeting here make more sense

async function deleteItem(){
    //a node is basically an html element, like a a span or div or li
    //const is setting varaible itemText to the value of the deletedItem call the 
    //'this is a cleaner way of going up to the previous sibling node above..
    const itemText = this.parentNode.childNodes[1].innerText
    //try ... catch block is used over a staright .catch, in an async function, so that if theres an error, it just logs it and the server keeps running
    //once that element is targeted
    try{
        //fetch() sends a request- it's the JS equivalent of putting a URL into the address bar of your browser, but with fetch() you can tell it fmore detail about what you want to send with your request, whereas a URL is always just gonna be a GET REQUEST
        //here we're sending a delete to the 'deleteItem' endpoint, 
        //it sets the headers to inform the server that receives this request that it's sending JSON content....
        //we're using fetch() to send delete request to the server, whether hosted locally or Heroku, and send it to the /delete Item
        //if you want to understand more about 'Headers', read up on HTTP, it's something that's needed but not read, like HTML headers. Just get a basic knowledge and know the few most common ones
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //waiting response, parsing Json, and chuck that data in the console of the browser (remember main.js is all the clientside/browser )  
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //traverses the DOM up to the parent <li> and gets the text inside of the first <span> element
    //this redquest leaves our client side, goes to the server.....
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a put request to the 'markComplete' endpoint/route .....
        //when the server hears that request in server.js.....it activates app.put in that file, see the app.put code with endpoint mark complete
        //look at the methodd, we're making a put request to our server!
        /* when we send this put request to the server, the server can look at the request body, and the itemFromJS property, which is holeing what property?
        -the property 'Get Pizza'. We're sending that alonsg here, from the request body to the server
        -a gremlin is waiting to hear this put erequest , which is on the markComplete route, because its the name on teh fetch(the fetch and route must match)
        -then the server does everything in app.put in the server.js
        -so go look at that now, app.put 

        */
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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