// SELECTORS references

// ref to the input to get the value to add
const todoInput = document.querySelector(".todo-input");
// ref to the button to add element to the list
const todoButton = document.querySelector(".todo-button");
//ref to the <ul> because we're gonna append our element list to that <ul>
const todoList = document.querySelector(".todo-list");
//ref to the select element
const filterOption = document.querySelector(".filter-todo");



// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", getTodos);
// On click to this button we call the function addTodo()
todoButton.addEventListener('click', addTodo);
// Event on click on this ul, we're gonna call the function deleteCheck --> This will target the specify button child of the specify li element we want to act on. This function will call two different actions 
todoList.addEventListener('click', deleteCheck);
// Event to call the function filterTodo 
filterOption.addEventListener('change', filterTodo);



// FUNCTIONS

// FUNCTION TO ADD A TO DO TO OUR LIST  --> Function call on a submit element in the input


function addTodo(event) {
    // First thing to do is to create our <li> element nested in a <div> element. and we will add also in this <div> two button, one to set the status of it to "done" and one button to delete our element from the list
    // This will prevent form from submitting. The default behave is to reload the page.
    event.preventDefault();

    // CREATE THE MAIN DIV ELEMENT

    const todoDiv = document.createElement("div");
    // We add the class = "todo" to this <div>
    todoDiv.classList.add("todo");


    // CREATE THE LI ELEMENT

    const newTodo = document.createElement("li");
    // Here we add the value of the input as text inside the <li> element
    newTodo.innerText = todoInput.value;
    //we add the class = "todo-item" to this <li>
    newTodo.classList.add("todo-item");
    // We add the <li> element as a child in the main <div> we created
    todoDiv.appendChild(newTodo);

    // ADD THE TODO TO LOCAL STORAGE --> I call the function saveLocalTodos. What do i want to save ? I want to save todoInput.value so that's what i put in parameter.
    saveLocalTodos(todoInput.value);


    //CREATE THE COMPLETED BUTTON

    const completedButton = document.createElement("button");
    // add the icon inside the button using .innerHTML, not textHTML
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    // add the class = "complete-btn" to the complete button
    completedButton.classList.add("complete-btn");
    // add the completed Button to the main <div> element
    todoDiv.appendChild(completedButton)


    //CREATE THE TRASH/DELETE BUTTON

    const trashButton = document.createElement("button");
    // add the icon inside the button using .innerHTML, not textHTML
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    // add the class = "complete-btn" to the complete button
    trashButton.classList.add("trash-btn");
    // add the trash Button to the main <div> element
    todoDiv.appendChild(trashButton);


    // APPEND THE MAIN DIV TO THE <UL> LIST

    // add the todoDiv, our main <div> element to the <ul> of our HTML. We ref to it with the variable we declared todoList
    todoList.appendChild(todoDiv);

    //CLEAR TODOINPUT VALUE
    todoInput.value = "";


}


// FUNCTION TO DELETE OR TO CHECK --> Function call on an click event 

function deleteCheck(e) {  //here the parameter e = the event click
    // Pour console.log et check quel element est target ?? l'event click
    console.log(e.target)

    // Dans cette const on stocke la target sur laquelle on a appuy??
    const item = e.target;

    // DELETE TODO
    // Ici ma condition c'est que je cible item qui a ??t?? target et je compare sa classe ?? celle du button "trash-btn". Si ??a match c'est que le boutton delete a ??t?? cliqu??.
    if (item.classList[0] === 'trash-btn') {
        // Ici on vient cibler le parent de l'item target. Par exemple si on clique sur la trash bin, trash bin devient l'item, et le parent de l'item c'est la todoDiv
        const todo = item.parentElement
        // We add a class to li item selected, that will be the style of our div right before we deleted it. Here the style will be an animation with the class name "fall"
        todo.classList.add("fall")
        removeLocalTodos(todo);
        // todo.remove(); // WE CANT REMOVE IT RIGHT NOW > --> We have to give the time to animation to be before we delete it. So we will use an event --> 'transitionend' : this event occurs when a CSS transition has completed.
        todo.addEventListener('transitionend', function () {
            todo.remove();
        })

        console.log("j'ai cliqu?? sur la poubelle")
    }

    // CHECK MARK
    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement;
        //clasList.toggle("classNAme") --> If the class doesn't exist in the li element the toggle method will add it --> Otherwise if it does already exist it will remove the class. 
        todo.classList.toggle("completed");

        console.log("j'ai clique sur le check")
    }

}

// FUNCTION TO FILTER OUR LI ELEMENT IN 3 CATEGORIES : ALL, COMPLETED, UNCOMPLETED

function filterTodo(e) {  //Here parameter e = event on click
    // Cette fonction est appel??e au "click" plus pr??cis??ment ?? l'event "change" sur l'une des options de mon select

    // Rappel : todoList c'est <ul> o?? on envoie les todoDiv. Donc en ciblant todoList.childNodes --> On cible toutes ces todoDiv
    const todos = todoList.childNodes;

    // Avec la m??thode forEach, on cible chacune des todoDiv pour ex??cuter le switch case.

    // En param??tre de la fonction on a todo --> nom que l'on donne ?? tous les item se trouvant dans la variable todos. todo --> chaque todoDiv

    //Le switch case : Je passe en param??tre du switch case e.target.value --> les value correspondent au valeurs que j'ai donn?? ?? chaque option dans le html. Ensuite je d??cris chaque cas. Si l'option sur laquelle j'ai cliqu?? est "all" alors je veux tous mes todo display visible flex. 
    // Ensuite le cas o?? je clique sur l'option dont la value est comleted : 2 choix --> si la todo a une class qui contient "completed" alors on affiche la todo div, sinon on la display none.
    // M??me id??e pour le dernier cas "uncompleted" --> Si la todo Div ne contient pas la class "completed" alors on l'affiche sinon display none. 
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex"
                break;
            case "completed":
                if (todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains('completed')) {
                    todo.style.display = "flex"
                } else {
                    todo.style.display = "none"
                }
                break;
        }
    })
}

// // FUNCTION POUR STOCKER LES TODO DANS UN OBJET STORAGE

// // POINT SUR LOCALSTORAGE

// //L???API Web Storage permet de stocker des donn??es sous forme de paires clefs/valeurs qui doivent obligatoirement ??tre des chaines de caract??res dans le navigateur de vos visiteurs.

// //Pour stocker des donn??es avec Web Storage, on va pouvoir utiliser les propri??t??s (qui sont avant tout des objets) localstorage et sessionstorage. On va utiliser ces propri??t??s avec l???objet implicite Window. 

// // Pour ??tre tout ?? fait pr??cis, un OBJET STORAGE est cr???? lorsqu???on utilise une de ces propri??t??s. On va pouvoir manipuler les donn??es ?? travers cet objet.

// // La m??thode getItem() : permet d???obtenir une valeur li??e ?? une clef. Prend une clef en argument

// // La m??thode setItem() : permet de stocker une paire clef/valeur. Prend une clef et une valeur en arguments ;


function saveLocalTodos(todo) { // Here the parameter todo = todoInput.value (It's what we write and add to the list)
    // First we check -- Hey do i already have something there ?  
    let todos;
    if (localStorage.getItem("todos") === null) {
      // On utilise ici getItem() pour rechercher la valeur li??e ?? la clef ?? todos??. 
      // Si mon objet localStorage a une cl?? todos qui est ??gale ?? null ??a veut dire qu'il n'y a pas de objet de stockage qui existe d??j?? et que nous devons donc le cr??er.
      todos = []; // Ici je cr???? une empty array
    } else {
      // If i already have an objet sotrage with the key todos
      // La m??thode JSON.parse() analyse une cha??ne de caract??res JSON et construit la valeur JavaScript ou l'objet d??crit par cette cha??ne. We have to do this because JSON are string character.
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    // Now we can push our todo into this array. Todo is the paremeter --> which is the todoInput.value
    todos.push(todo);
    // Last Step --> We actually add it to our object localStorage. First parameter is the key which is our array todos. Second parameter is the value, in our case it's the todo. And here we use the method JSON.stringify to get a string from our todo value.
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.children[0].innerText;
    console.log("ilsepassekoi" + todoIndex);

    //La m??thode splice() modifie le contenu d'un tableau en retirant des ??l??ments et/ou en ajoutant de nouveaux ??l??ments ?? m??me le tableau.On peut ainsi vider ou remplacer une partie d'un tableau.
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
  }


// FUNCTION CALLED WHEN THE HTML HAS BEEN LOADED (SEE UP IN EVENT AREA)
  function getTodos() {

    // Pour les garder afficher sur l'??cran et pas seulement en storage 
    let todos;
    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
      //Create todo div
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      //Create list
      const newTodo = document.createElement("li");
      newTodo.innerText = todo;
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);
      todoInput.value = "";
      //Create Completed Button
      const completedButton = document.createElement("button");
      completedButton.innerHTML = `<i class="fas fa-check"></i>`;
      completedButton.classList.add("complete-btn");
      todoDiv.appendChild(completedButton);
      //Create trash button
      const trashButton = document.createElement("button");
      trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
      trashButton.classList.add("trash-btn");
      todoDiv.appendChild(trashButton);
      //attach final Todo
      todoList.appendChild(todoDiv);
    });
  }












