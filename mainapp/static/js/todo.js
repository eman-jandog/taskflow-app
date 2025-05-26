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
    
    // Get user-specific todos
    // const userEmail = localStorage.getItem('email');
    // const storageKey = `todos_${userEmail}`;
    
    // let todos = JSON.parse(localStorage.getItem(storageKey)) || [];
    // let currentFilter = 'all';
    
    // Initial render
    // renderTodos();
    // updateCounters();
    
    // Add new todo
    // todoForm.addEventListener('submit', async function(e) {
    //     e.preventDefault();

    //     const form = this;
    //     const ADD_TODO = this.dataset.urlAction;
    //     const formData = new FormData(form);

    //     try {
    //         const response = await fetch(ADD_TODO, {
    //             method: 'POST',
    //             body: formData                
    //         })

    //         if (response.ok) {
    //             const data = await response.json()
    //             console.log(data)
    //             // todos.push(newTodo);
    //             // saveTodos();
    //             // renderTodos();
    //             // updateCounters();
            
    //             // todoInput.value = '';
    //             // todoInput.focus();
    //         } else {
    //             throw new Error('')
    //         }
    //     } catch(e) {
    //         console.error('Error: ', e)
    //     }
    // });
    
    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });
    
    // Event delegation for todo actions
    todoList.addEventListener('click', function(e) {
        const target = e.target;
        const todoItem = target.closest('.todo-item');
        
        if (!todoItem) return;
        
        const todoId = parseInt(todoItem.dataset.id);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        
        if (todoIndex === -1) return;
        
        // Complete todo
        if (target.classList.contains('btn-complete') || target.closest('.btn-complete')) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            saveTodos();
            renderTodos();
            updateCounters();
        }
        
        // Edit todo
        if (target.classList.contains('btn-edit') || target.closest('.btn-edit')) {
            const newText = prompt('Edit task:', todos[todoIndex].text);
            if (newText !== null && newText.trim() !== '') {
                todos[todoIndex].text = newText.trim();
                saveTodos();
                renderTodos();
            }
        }
        
        // Delete todo
        if (target.classList.contains('btn-delete') || target.closest('.btn-delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                todos.splice(todoIndex, 1);
                saveTodos();
                renderTodos();
                updateCounters();
            }
        }
    });
    
    // Save todos to localStorage with user-specific key
    function saveTodos() {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    }
    
    // Render todos based on filter
    async function renderTodos() {
        // Clear current list except empty state
        const todoItems = todoList.querySelectorAll('.todo-item');
        todoItems.forEach(item => item.remove());

        try {
            const response = await fetch('get', {
                method: 'GET'
            })

            if (response.ok) {
                const data = response.text()
                console.log(data)
            }
        } catch(e) {
            console.error('Error: ', e)
        }
        
        
        // let filteredTodos = [];
        
        // switch (currentFilter) {
        //     case 'active':
        //         filteredTodos = todos.filter(todo => !todo.completed);
        //         break;
        //     case 'completed':
        //         filteredTodos = todos.filter(todo => todo.completed);
        //         break;
        //     default:
        //         filteredTodos = [...todos];
        // }
        
        // // Sort by creation date (newest first)
        // filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // if (filteredTodos.length === 0) {
        //     emptyState.style.display = 'block';
        // } else {
        //     emptyState.style.display = 'none';
            
        //     filteredTodos.forEach(todo => {
        //         const todoItem = document.createElement('div');
        //         todoItem.classList.add('todo-item', 'p-3', 'd-flex', 'justify-content-between', 'align-items-center');
        //         if (todo.completed) {
        //             todoItem.classList.add('completed');
        //         }
        //         todoItem.dataset.id = todo.id;
                
        //         todoItem.innerHTML = `
        //             <div class="d-flex align-items-center">
        //                 <div class="form-check">
        //                     <input class="form-check-input btn-complete" type="checkbox" ${todo.completed ? 'checked' : ''}>
        //                 </div>
        //                 <span class="ms-2 todo-text">${todo.text}</span>
        //             </div>
        //             <div class="todo-actions">
        //                 <button class="btn-edit" title="Edit">
        //                     <i class="bi bi-pencil"></i>
        //                 </button>
        //                 <button class="btn-delete" title="Delete">
        //                     <i class="bi bi-trash"></i>
        //                 </button>
        //             </div>
        //         `;
                
        //         todoList.insertBefore(todoItem, emptyState);
        //     });
        // }
    }
    
    // Update task counters and progress
    function updateCounters() {
        const totalTasks = todos.length;
        const completedTasks = todos.filter(todo => todo.completed).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        taskCounter.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        progressBar.style.width = `${progressPercentage}%`;
    }
}

document.addEventListener('DOMContentLoaded', initTodoApp())