const deleteBtn = document.querySelectorAll('.fa-trash') // grabbing the elements with a class fa-trash and storing it into a variable to call upon
const item = document.querySelectorAll('.item span') // grabbign the spans that's in a parent element with the class of item and storing it into a variable named item
const itemCompleted = document.querySelectorAll('.item span.completed')  // grabbing the span with a class completed that's in a list element with class name item and storing it into a variable itemcompleted

Array.from(deleteBtn).forEach((element)=>{   // it's taking the deltebtn elements and turning the items into an array, and take each element in that array  and attaching an event listener to the parent element so that when theres a click, the deleteItem function will fire 
    element.addEventListener('click', deleteItem)  // and add an event listener to those elemnts, which will fire when theres a click an item will delete
}) //closing loop

Array.from(item).forEach((element)=>{      //creating an array from variables Item starting a loop and attaching an event handler to  the elments that are spans that have a parent of item (these will be marked complete)
    element.addEventListener('click', markComplete)
}) //close the loop

Array.from(itemCompleted).forEach((element)=>{   // creats an array from each item that is in the varialbes itemUncompleted and adding an event lsitener to the current item that run when there's a click which will initiate the function called 'markUncompleted'
    element.addEventListener('click', markUnComplete)
}) //close the loop

async function deleteItem(){   // the delte sync function in which we formed earlier
    const itemText = this.parentNode.childNodes[1].innerText  // looks inside of the list item to extract the text value only of the specified list item 
    try{ // try catch block, does something
        const response = await fetch('deleteItem', {  // creates a response variable that waits on a fetch to get data,from the result of deleteitem
            method: 'delete',   // using a delelte more 
            headers: {'Content-Type': 'application/json'}, //specifying the content which is json
            body: JSON.stringify({     // then it will take the message content thats being passed and turn into json and returns it as a string 
              'itemFromJS': itemText   // setting the contnt of the body to the inner text of the list item and naming it itemfrom js 
            }) // closing body
          }) //closing the object
        const data = await response.json() // waiing for server to respond with json 
        console.log(data) // when it's done it will console log the data and reload 
        location.reload() //reloads page to update what is displayed

    }catch(err){ //if error pass eroor into catch
        console.log(err)   // if theres an error it will let me know by logging it
    } //closing catch block
} //close function
 
async function markComplete(){    // the asyc funtion we determined earlier
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {   //creating a variable and storing the awaited fetch and it's fetvhing the markcomplete
            method: 'put', // telling us it's using a put method which is updating the marked item
            headers: {'Content-Type': 'application/json'}, // and again inserting content in the headers and retirning a json app
            body: JSON.stringify({   // that's brought back in a string 
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
    const itemText = this.parentNode.childNodes[1].innerText // same thing with the functions to mark things incomplete
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',  // updating the uncomplete items when the click happens
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