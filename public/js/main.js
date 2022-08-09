const deleteBtn = document.querySelectorAll('.fa-trash') //creates a const and selects all elements with the class of ".fa-trash" (the trash cans)
const item = document.querySelectorAll('.item span') //creates const and assigns it to select all spans inside parents with class of ".item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creates const and assigns it to select all spans with class "completed" inside parents with ".item" class

Array.from(deleteBtn).forEach((element)=>{ //creating an array from selection and starting forEach loop
    element.addEventListener('click', deleteItem) // adds event listener to current item and waits for click to call function deleteItem
}) //close loop

Array.from(item).forEach((element)=>{ //creating an array from selection and starting forEach loop
    element.addEventListener('click', markComplete) // adds event listener to current item and waits for click to call function markComplete
}) //close loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from selection and starting forEach loop
    element.addEventListener('click', markUnComplete) // adds event listener to current item and waits for click to call function markUnComplete
}) //close loop
// CONTINUE VID AT 3:13 ///////////////////////////////////////////////
async function deleteItem(){ //decalre an ansynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText  //looks inside of list item, selects inner text within list span
    try{ // begins a try block in order to do something
        const response = await fetch('deleteItem', { //creates a response const that waits to fetch data from deleteItem route
            method: 'delete', //sets CRUD method type for route
            headers: {'Content-Type': 'application/json'}, //sets type of content expected (JSON in this case)
            body: JSON.stringify({ //declare content being passed and stringifying it
              'itemFromJS': itemText //sets content of body to inner text of list item and names it 'itemFromJS'
            }) //closing body
          }) //closing the fetch object
        const data = await response.json() //waits on JSON from response to be converted
        console.log(data) //  clg result to the console

        location.reload() //reloads page and and updates what is displayed

    }catch(err){ // if error occurs, pass err to catch block
        console.log(err)
    } //close catch 
} //close async function 

async function markComplete(){  //decalre an ansynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item, selects inner text within list span
    try{ // begins a try block in order to do something
        const response = await fetch('markComplete', { //creates a response const that waits to fetch data from markComplete route
            method: 'put', //setting CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //sets type of content expected (JSON in this case)
            body: JSON.stringify({ //declare content being passed and stringifying it
                'itemFromJS': itemText //sets content of body to inner text of list item and names it 'itemFromJS'
            }) //close body
          }) //close fetch object
        const data = await response.json() //waits on JSON from response to be converted
        console.log(data) // clg result to the console
        location.reload() //reloads page and and updates what is displayed

    }catch(err){ // if error occurs, pass err to catch block
        console.log(err) // clg result to the console
    } //close catch 
} //close async function 

async function markUnComplete(){ //decalre an ansynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of list item, selects inner text within list span
    try{ // begins a try block in order to do something
        const response = await fetch('markUnComplete', { //creates a response const that waits to fetch data from markUnComplete route
            method: 'put', //setting CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //sets type of content expected (JSON in this case)
            body: JSON.stringify({ //declare content being passed and stringifying it
                'itemFromJS': itemText //sets content of body to inner text of list item and names it 'itemFromJS'
            }) //close body
          }) //close fetch object
        const data = await response.json() //waits on JSON from response to be converted
        console.log(data) // clg result to the console
        location.reload() //reloads page and and updates what is displayed

    }catch(err){ // if error occurs, pass err to catch block
        console.log(err) // clg result to the console
    } //close catch 
} //close async function 