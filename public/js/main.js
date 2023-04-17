const deleteBtn = document.querySelectorAll('.fa-trash')    //creating a constant called delete button on all elements with the class fa-trash
const item = document.querySelectorAll('.item span')    //cont called item which selects all elements within an element that has the class item and is a span
const itemCompleted = document.querySelectorAll('.item span.completed') //const that is all elements within an element with class "item" and is a span with the "completed" class

Array.from(deleteBtn).forEach((element)=>{ //create an array from all of the delete buttons. Then, for each element within this array, something happens. 
    element.addEventListener('click', deleteItem)   //add a click event listener that runs the function deleteItem after. 
})  //closing tags

Array.from(item).forEach((element)=>{ //create an array from all of the 'items Then, for each element within this array, something happens. 
    element.addEventListener('click', markComplete)  //add a click event listener that runs the function markComplete after.
})

Array.from(itemCompleted).forEach((element)=>{ //create an array from all of the 'itemscompleted' Then, for each element within this array, something happens.
    element.addEventListener('click', markUnComplete) //add a click event listener that runs the function markUnComplete after.
})

async function deleteItem(){
  //states that the function is asyncronous.
  const itemText = this.parentNode.childNodes[1].innerText; //this creates a constant called itemText which is the text within the parent node of the delete button.
  try { //a try block
    const response = await fetch("deleteItem", {
      //fetches the deleteItem route, referencing the serverside routing
      method: "delete", //specifies the delete method is being used
      headers: { "Content-Type": "application/json" }, //specifies the content type is being used
      body: JSON.stringify({ //turning the body into a string of json
        itemFromJS: itemText, //this is pulling the above constant in and passing it in as itemFromJS
      }), //closing
    }); //closing
    const data = await response.json(); //storing the promise of json in the data constant
    console.log(data); //logging the data in the console.
    location.reload(); //reloading the page
  } catch (err) { //catching an error if there is one
    console.log(err); //console.logging the error
  }
}

async function markComplete(){ //establishing an async function
    const itemText = this.parentNode.childNodes[1].innerText //another constant, called itemText, which is the text within the parent node of the element with the class item
    try{ //try blocvk
        const response = await fetch('markComplete', { //storing the promise of a fetch in a variable called response.
            method: 'put', //establishing that this is through a 'put' request rather than a delete or get or push
            headers: {'Content-Type': 'application/json'}, //specifies the content typew being used
            body: JSON.stringify({ //turning the bodty into a string a json
                'itemFromJS': itemText //passing in itemText
            }) //closing
          }) //closing
        const data = await response.json() //awaiting the promise of response from the fetch, then turning it into json, then storing it in the variable data
        console.log(data) //logging the data in the console
        location.reload() //reloading the page

    }catch(err){ //catching any errors
        console.log(err) //then logging them
    }
}

async function markUnComplete(){ //establishing an async function
    const itemText = this.parentNode.childNodes[1].innerText //another constant, called itemText, which is the text within the parent node of the element with the class item
    try{ //try block
        const response = await fetch('markUnComplete', { //fetching the route markUNcomplete, the opposite of the above.
            method: 'put', //establishing that this is through a 'put' request rather than a delete or get or push
            headers: {'Content-Type': 'application/json'},  //specifies the content typew being used
            body: JSON.stringify({ //turning the bodty into a string a json
                'itemFromJS': itemText //passing in itemText
            }) //closing
          }) //closing
        const data = await response.json()//awaiting the promise of response from the fetch, then turning it into json, then storing it in the variable data
        console.log(data)//logging the data in the console
        location.reload()//reloading the page

    }catch(err){//catching any errors
        console.log(err)//then logging them
    }
}