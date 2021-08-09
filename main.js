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
    // Pour console.log et check quel element est target à l'event click
    console.log(e.target)

    // Dans cette const on stocke la target sur laquelle on a appuyé
    const item = e.target;

    // DELETE TODO
    // Ici ma condition c'est que je cible item qui a été target et je compare sa classe à celle du button "trash-btn". Si ça match c'est que le boutton delete a été cliqué.
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

        console.log("j'ai cliqué sur la poubelle")
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
    // Cette fonction est appelée au "click" plus précisément à l'event "change" sur l'une des options de mon select

    // Rappel : todoList c'est <ul> où on envoie les todoDiv. Donc en ciblant todoList.childNodes --> On cible toutes ces todoDiv
    const todos = todoList.childNodes;

    // Avec la méthode forEach, on cible chacune des todoDiv pour exécuter le switch case.

    // En paramètre de la fonction on a todo --> nom que l'on donne à tous les item se trouvant dans la variable todos. todo --> chaque todoDiv

    //Le switch case : Je passe en paramètre du switch case e.target.value --> les value correspondent au valeurs que j'ai donné à chaque option dans le html. Ensuite je décris chaque cas. Si l'option sur laquelle j'ai cliqué est "all" alors je veux tous mes todo display visible flex. 
    // Ensuite le cas où je clique sur l'option dont la value est comleted : 2 choix --> si la todo a une class qui contient "completed" alors on affiche la todo div, sinon on la display none.
    // Même idée pour le dernier cas "uncompleted" --> Si la todo Div ne contient pas la class "completed" alors on l'affiche sinon display none. 
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

// //L’API Web Storage permet de stocker des données sous forme de paires clefs/valeurs qui doivent obligatoirement être des chaines de caractères dans le navigateur de vos visiteurs.

// //Pour stocker des données avec Web Storage, on va pouvoir utiliser les propriétés (qui sont avant tout des objets) localstorage et sessionstorage. On va utiliser ces propriétés avec l’objet implicite Window. 

// // Pour être tout à fait précis, un OBJET STORAGE est créé lorsqu’on utilise une de ces propriétés. On va pouvoir manipuler les données à travers cet objet.

// // La méthode getItem() : permet d’obtenir une valeur liée à une clef. Prend une clef en argument

// // La méthode setItem() : permet de stocker une paire clef/valeur. Prend une clef et une valeur en arguments ;


function saveLocalTodos(todo) { // Here the parameter todo = todoInput.value (It's what we write and add to the list)
    // First we check -- Hey do i already have something there ?  
    let todos;
    if (localStorage.getItem("todos") === null) {
      // On utilise ici getItem() pour rechercher la valeur liée à la clef « todos». 
      // Si mon objet localStorage a une clé todos qui est égale à null ça veut dire qu'il n'y a pas de objet de stockage qui existe déjà et que nous devons donc le créer.
      todos = []; // Ici je créé une empty array
    } else {
      // If i already have an objet sotrage with the key todos
      // La méthode JSON.parse() analyse une chaîne de caractères JSON et construit la valeur JavaScript ou l'objet décrit par cette chaîne. We have to do this because JSON are string character.
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

    //La méthode splice() modifie le contenu d'un tableau en retirant des éléments et/ou en ajoutant de nouveaux éléments à même le tableau.On peut ainsi vider ou remplacer une partie d'un tableau.
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
  }


// FUNCTION CALLED WHEN THE HTML HAS BEEN LOADED (SEE UP IN EVENT AREA)
  function getTodos() {

    // Pour les garder afficher sur l'écran et pas seulement en storage 
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












