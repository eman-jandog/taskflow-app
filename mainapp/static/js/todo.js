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
    let currentFilter;

    //Initial load
    if (updateCounters() == 0) displayEmpty()

    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (!button.classList.contains('active')) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active')
                currentFilter = button.dataset.filter
                htmx.ajax('GET', 'update', {
                    target: '#todo-list', 
                    swap:'innerHTML', 
                    values: {filter: currentFilter }
                })
                .then(() => {
                    if (updateCounters() == 0) displayEmpty()
                })
            }     
        });
    });

    
    // Add new todo
    todoForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = new FormData(this)

        htmx.ajax('POST', 'update', {
            target: todoList,
            swap: currentFilter == 'completed' ? 'none' : 'innerHTML',
            values: form
        })
        .then(() => {
            todoInput.value = ""
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
                if (updateCounters() == 0) displayEmpty()
            })
        }

        if (target.closest('.btn-complete') || target.classList.contains('btn-complete')) {
            htmx.ajax('PATCH', 'update', {
                swap: 'none',
                values: {
                    'tid': todoID
                }                
            })
            .then((r) => {
                if (target.closest('.btn-complete').getAttribute('checked')) {
                    target.closest('.btn-complete').removeAttribute('checked')
                } else {
                    target.closest('.btn-complete').setAttribute('checked', 'checked')
                }                
                updateCounters();
            })
            
        }
    })
  
    
    // Update task counters and progress
    function updateCounters() {
        const totalTasks = document.querySelectorAll(".todo-item").length;

        const completedTasks = document.querySelectorAll('[checked]').length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        taskCounter.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        progressBar.style.width = `${progressPercentage}%`;

        return totalTasks;
    }

    function displayEmpty() {
            
        let div = document.createElement('div')
        div.className = 'empty-state'
        
        let icon = document.createElement('i')
        icon.className = 'bi bi-clipboard'
        div.appendChild(icon)

        let h5 = document.createElement('h5')
        h5.innerText = 'No tasks yet'
        div.appendChild(h5)
        
        let p = document.createElement('p')
        p.innerText = 'Add a new task to get started'
        div.appendChild(p)

        todoList.appendChild(div)
    }
}

document.addEventListener('DOMContentLoaded', initTodoApp())