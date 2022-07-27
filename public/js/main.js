//select all elements that match the following classes /elements
//trashcan
const deleteBtn = document.querySelectorAll('.fa-trash');
//the text of the thing changed to :not(.completed)
const item = document.querySelectorAll('.item span:not(.completed)');
//completed items
const itemCompleted = document.querySelectorAll('.item span.completed');

//for each trashcan:
Array.from(deleteBtn).forEach((element)=>{
    //listen for a click on the trashcan, when clicked run deleteItem func
    element.addEventListener('click', deleteItem);
});
//for each not completed item:
Array.from(item).forEach((element)=>{
    //listen for a click on the item, when click run markComplete func
    element.addEventListener('click', markComplete);
});
//for each completed item:
Array.from(itemCompleted).forEach((element)=>{
    //listen for a click on a completed item: when clicked run markUnComplete func
    element.addEventListener('click', markUnComplete);
});

//when we click on a trashcan:
async function deleteItem(){
    //get the 'inner text' of the second child (index 1, the span) of the container 'parent node'
    const itemText = this.parentNode.childNodes[1].innerText; //text of the stuff next to the trashcan we clicked on
    try{ //see if this works:
        const response = await fetch('deleteItem', { //make a request to /deleteItem
            method: 'delete', //its a delete request
            headers: {'Content-Type': 'application/json'}, //the type of content we're sending is json
            body: JSON.stringify({ //the body is the content we're sending. turn this JS object into a JSON string
              'itemFromJS': itemText //assign itemText to 'itemFromJS'
            })// package it as a string
          });
        const data = await response.json(); //data is parsed json coming back from the server 
        console.log(data); //print the response out to the browser's console
        location.reload(); //reload the page

    }catch(err){ //if the fetch fails:
        console.log(err); //console log fetch's error
    }
}

//when we click on the text of an uncompleted item:
async function markComplete(){
    //get the 'inner text' of the second child (index 1, the span) of the container 'parent node'
    const itemText = this.parentNode.childNodes[1].innerText;
    try{// lets see if this fetch works:
        //fetch => mycoolapp.com/markComplete
        const response = await fetch('markComplete', { //make a request /markComplete
            method: 'put', //its a put (update) request
            headers: {'Content-Type': 'application/json'}, //we're sending json
            body: JSON.stringify({ //turn the json object into a string
                'itemFromJS': itemText //text from our span into itemFromJS
            })
          });
        const data = await response.json(); //what did we get back from the fetch "Marked Complete"
        console.log(data); //log Marked Complete to the browser
        location.reload(); //reload the browser

    }catch(err){ //if our fetch fails:
        console.log(err) //log fetch's error to the console
    }
}

//when we click on the text of an completed item:
async function markUnComplete(){
    //get the 'inner text' of the second child (index 1, the span) of the container 'parent node'
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //see if this fetch works:
        const response = await fetch('markUnComplete', { //make request to markUnComplete
            method: 'put', //its a put method
            headers: {'Content-Type': 'application/json'}, //we're sending json
            body: JSON.stringify({ //turn json object into a string 
                'itemFromJS': itemText //text from our span into itemFromJS
            })
          })
        const data = await response.json() //get 'Marked Uncomplete' from server
        console.log(data)  //log Marked uncomplete to the browser
        location.reload() //reload the browser

    }catch(err){ //if the fetch fails
        console.log(err) //log fetch's error to the console
    }
}