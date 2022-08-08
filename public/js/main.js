const deleteBtn = document.querySelectorAll('.fa-trash') /* UNCHANGEABLE VARIABLE SELECTING CLASS ELEMENTS STORING IT IN THE DELETEBTN */
const item = document.querySelectorAll('.item span') /* UNCHANGEABLE VARIABLE SELECTING CLASS ELEMENTS ASSIGNING THEM TO THE CHILD ITEM SPAN */
const itemCompleted = document.querySelectorAll('.item span.completed') /* UNCHANGEABLE VARIABLE SELECTING CLASS ELEMENTS ASSIGNING THEM TO THE CHILD ITEM CLASS COMPLETED */

Array.from(deleteBtn).forEach((element)=>{ /* ARRAY METHOD CREATED FROM SELECTION AND BEGINING A LOOP */
    element.addEventListener('click', deleteItem) /* EVENT LISTENER CLICK FROM THE ITEM CALLING FUNCTION TO deleteItem */
}) /* ARRAY LOOP CLOSING TAG */

Array.from(item).forEach((element)=>{ /* ARRAY METHOD CREATED FROM SELECTION AND BEGINING A LOOP */
    element.addEventListener('click', markComplete) /* EVENT LISTENER CLICK FROM THE ITEM CALLING FUNCTION TO markComplete */
}) /* ARRAY LOOP CLOSING TAG */

Array.from(itemCompleted).forEach((element)=>{ /* ARRAY METHOD CREATED FROM SELECTION AND BEGINING A LOOP */
    element.addEventListener('click', markUnComplete) /* EVENT LISTENER FOR COMPLETED ITEMS */
}) /* ARRAY LOOP CLOSISNG TAG */

async function deleteItem(){ /* ASYNCHRONOUS FUNCTION DECLARED  */
    const itemText = this.parentNode.childNodes[1].innerText /* LIST ITEM THAT GRABS THE INNER TEXT OF THE LIST SPAN */
    try{ /* TRY BLOCK START */
        const response = await fetch('deleteItem', { /* FETCH VARIABLE TO RETRIEVE DATA AND GIVES A RESPONSE OF deleteItem */
            method: 'delete', /* DELETE AY METHOD  */
            headers: {'Content-Type': 'application/json'}, /* DECLARING THE USE OF JSON AS THE CONTENT TYPE USED */
            body: JSON.stringify({ /* STRINGIFY THE RETURN MESSAGE CONTENT */
              'itemFromJS': itemText /*  CONTENT OF THE BODY TO THE INNER TEXT OF THE LIST ITEM */
            }) /* CLOSING THE BODY */
          }) /* CLOSING THE OBJECT */
        const data = await response.json() /* WAITING ON JSON FROM THE RESPONSE TO BE CONVERTED */
        console.log(data) /* LOG THE RESULT THE CONSOLE */
        location.reload() /* RELOADS THE PAGE TO UPDATE WHAT IS DISPLAYED  */

    }catch(err){ /* IF AN ERROR OCCURS, PASS THE ERROR INTO THE CATCH BLOCK */
        console.log(err) /* LOGS THE ERROR TO THE CONSOLE */
    } /* CLOSE THE CATCH BLOCK */
} /* END THE FUNCTION */

async function markComplete(){ /* ASYNCHRONOUS FUNCTION DECLARED */
    const itemText = this.parentNode.childNodes[1].innerText /* LIST ITEM THAT GRABS THE INNER TEXT OF THE LIST SPAN */
    try{ /* TRY BLOCK START */
        const response = await fetch('markComplete', { /* FETCH VARIABLE TO RETRIEVE DATA AND GIVES A RESPONSE OF markComplete */
            method: 'put', /* SETTING THE CRUD METHOD TO "update" FOR THE ROUTE */
            headers: {'Content-Type': 'application/json'}, /* SPECIFYING THE TYPE OF CONTENT EXPECTED, JSON */
            body: JSON.stringify({ /* STRINGIFY THE RETURN MESSAGE CONTENT */
                'itemFromJS': itemText /* CONTENT OF THE BODY TO THE INNER TEXT OF THE LIST ITEM */
            }) /* CLOSING THE BODY  */
          }) /* CLOSING THE OBJECT */
        const data = await response.json() /* WAITING ON JSON FROM THE RESPONSE TO BE CONVERTED */
        console.log(data) /* LOG THE RESULT THE CONSOLE */
        location.reload() /* RELOADS THE PAGE TO UPDATE WHAT IS DISPLAYED */

    }catch(err){ /* IF AN ERROR OCCURS, PASS THE ERROR INTO THE CATCH BLOCK  */
        console.log(err) /* LOGS THE ERROR TO THE CONSOLE */
    } /* CLOSE THE CATCH BLOCK */
} /* END THE FUNCTION */

async function markUnComplete(){ /* ASYNCHRONOUS FUNCTION DECLARED */
    const itemText = this.parentNode.childNodes[1].innerText /* LIST ITEM THAT GRABS THE INNER TEXT OF THE LIST SPAN */
    try{ /* TRY BLOCK START  */
        const response = await fetch('markUnComplete', { /* FETCH VARIABLE TO RETRIEVE DATA AND GIVES A RESPONSE OF markComplete */
            method: 'put', /* SETTING THE CRUD METHOD TO "update" FOR THE ROUTE */
            headers: {'Content-Type': 'application/json'}, /* SPECIFYING THE TYPE OF CONTENT EXPECTED, JSON */
            body: JSON.stringify({ /* STRINGIFY THE RETURN MESSAGE CONTENT */
                'itemFromJS': itemText /* CONTENT OF THE BODY TO THE INNER TEXT OF THE LIST ITEM */
            }) /* CLOSING THE BODY */
          }) /* CLOSING THE OBJECT */
        const data = await response.json() /* WAITING ON JSON FROM THE RESPONSE TO BE CONVERTED */
        console.log(data) /* LOG THE RESULT THE CONSOLE */
        location.reload() /* RELOADS THE PAGE TO UPDATE WHAT IS DISPLAYED */

    }catch(err){ /* IF AN ERROR OCCURS, PASS THE ERROR INTO THE CATCH BLOCK */
        console.log(err) /* LOGS THE ERROR TO THE CONSOLE */
    } /* CLOSE THE CATCH BLOCK */
} /* END THE FUNCTION */    