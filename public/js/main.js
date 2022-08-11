const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and select all element with class trash
const item = document.querySelectorAll('.item span')// creating a variable of class with span tags --thats why there is a white space between .item and span
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable that are all .items with spans.completed -- completed is a class on the span

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our slection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item -- that waits for a click it calls a function called delete item
})// close loop

Array.from(item).forEach((element)=>{ //creating an array and starting a loop -- 
    element.addEventListener('click', markComplete) // add an even listener to the current item that waits for a  click and then calls a cuntion called markcomplete
})// close

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our sleection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
})//close loop

async function deleteItem(){ // delcaring an asyncrhonos function 
    const itemText = this.parentNode.childNodes[1].innerText // declaring itemText and looks at the list item and grabs only the iner text within the list span
    try{ // opening of a try block -- when object resolves succefully
        const response = await fetch('deleteItem', { // delcaring response variable that waits on the fetch as a result of deleteitem
            method: 'delete', // sets thte CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed and  turn that JSON into a string
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and namiing it itemFromJS
            })//close body 
          })//closing the object
        const data = await response.json() // delcare data as a vraible asigned the value of the repsons JSON
        console.log(data) // console logs the JSON obj
        location.reload() //refreshes the page to update what is displayed

    }catch(err){ // opening catch block -- if error run the catch block
        console.log(err)//console loge the error
    }// close catch
}//close async funtion

async function markComplete(){ //declaare asnyc fucntion calle dmareComplete
    const itemText = this.parentNode.childNodes[1].innerText //// declaring itemText and looks at the list item and grabs only the iner text within the list span
    try{ //start try block
        const response = await fetch('markComplete', { // delcare respnse and  it awaits the fetch to get data form the result of the markCOmplete
            method: 'put',// settting the CRUD method to pudate the route
            headers: {'Content-Type': 'application/json'},// soecufying the  type of content ehich is JSON
            body: JSON.stringify({ // dekcare the messafge cintent ebing passed and stringfy the content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming is itemFrom JS
            })//clsoningboy
          })//close obj
        const data = await response.json()//watubg the JSON fromt eh repsonse obj
        console.log(data)//console log
        location.reload() //refresh page

    }catch(err){//if err occures pass the error into catch block
        console.log(err)//console log
    }//close catch
}//close function

async function markUnComplete(){//declare asnyc function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs the onluy inner text within the list span
    try{// open try block
        const response = await fetch('markUnComplete', {// creates a response variable that waits on a fetch to get data fromt he result of the markUncomplete route
            method: 'put', // setting the CRUD method to update route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({//delcare the message content  being passed and stringify that content
                'itemFromJS': itemText//setting the content of the body to the inner text of the list item and naming it itemText
            })//close the body
          })//close the obj
        const data = await response.json()//delcare data and give it valuje of the respnse obj
        console.log(data)//console log the response
        location.reload()//refresh page

    }catch(err){//run catch block
        console.log(err)//console log error
    }//close catch block
}//close funciton