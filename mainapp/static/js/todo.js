// inititiali todo
function initTodoApp() {
    // Display current date
    const dateDisplay = document.getElementById('date-display');
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    
    // Todo functionality
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const taskCounter = document.getElementById('task-counter');
    const progressBar = document.getElementById('progress-bar');
    const filterButtons = document.querySelectorAll('.filter-btn');

    //Initial load
    updateCounters();
    
    // Add new todo
    

    todoForm.addEventListener('htmx:afterRequest', async function(e) {
        if (e.detail.elt.id == "todo-form" && e.detail.xhr.status == 200) {
            todoInput.value = ""
            updateCounters();
        }
    });
    
    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (!button.classList.contains('active')) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active')
                htmx.ajax('GET', 'update', {target: '#todo-list', swap:'outerHTML', values: {filter: button.dataset.filter }})
            }        

        });
    });
    
    
    // Update task counters and progress
    function updateCounters() {
        const totalTasks = document.querySelectorAll(".todo-item").length;

        // const completedTasks = todos.filter(todo => todo.completed).length;
        // const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        taskCounter.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        // progressBar.style.width = `${progressPercentage}%`;
    }
}

document.addEventListener('DOMContentLoaded', initTodoApp())