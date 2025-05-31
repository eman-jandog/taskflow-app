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
    const displayEmpty = document.querySelectorAll('.filter-btn');

    //Initial load
    updateCounters()
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


    
    // Add new todo
    todoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const form = new FormData(this)
        
        
        htmx.ajax('POST', 'update', {
            target: todoList,
            swap: 'afterbegin',
            values: form
        })
        .then(() => {
            todoInput.value = ""

            // update button
            filterButtons.forEach(btn => {
                if (btn.dataset.filter == 'all') {
                    if (!btn.classList.contains('active')) btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            updateCounters(); // only count return list: wrong data
        })        
    });

    todoList.addEventListener('click', (e) => {
        const target = e.target
        const todoItem = target.closest('.todo-item')
        const todoID = parseInt(todoItem.dataset.id)

        if (target.closest('.btn-delete') || target.classList.contains('btn-delete')) {
            htmx.ajax('DELETE', 'update', {
                target: todoItem,
                swap: 'delete',
                values: {
                    'tid': todoID
                }                
            })
            .then((r) => {
                updateCounters()
            })
            
        }
    })
  
    
    // Update task counters and progress
    function updateCounters() {
        const totalTasks = document.querySelectorAll(".todo-item").length;

        const completedTasks = document.querySelectorAll("checked").length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        taskCounter.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        progressBar.style.width = `${progressPercentage}%`;

        if (totalTasks == 0) {
            emptyState.style.display = 'block'
        } else {
            emptyState.style.display = 'none'
        }
    }
}

document.addEventListener('DOMContentLoaded', initTodoApp())