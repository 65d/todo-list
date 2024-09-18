document.addEventListener('focusin', (e) => {
  if (e.target.classList.contains('task-input')) {
    const taskDiv = e.target.closest('.task');
    taskDiv.style.backgroundColor = '#00000017';
  }
});

document.addEventListener('focusout', (e) => {
  if (e.target.classList.contains('task-input')) {
    const taskDiv = e.target.closest('.task');
    taskDiv.style.backgroundColor = '';
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('new-task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const itemsSection = document.getElementById('items');

  letDragingTask = null;

  loadTasksFromLocalStorage();



  const toggleButton = document.getElementById('toggleDarkMode');
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  taskInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      const taskText = taskInput.value.trim();
      if (taskText) {
        addTask(taskText);
        taskInput.value = ''; // Clear input field after adding
        saveTasksToLocalStorage();
      }
    }
  });



  function addTask(taskText, isCompleted = false) {
    const task = document.createElement('div');
    task.classList.add('task');

    if (isCompleted) {
      task.classList.add('completed');
    }

    task.draggable = true;

    task.innerHTML = `
                 <div class="edit-part">
            <!-- <input class="checkbox-t" type="checkbox" id="task1"> -->
             <label class="chekbox-t">
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="checkmark"></span>
      </label>
            <input class="task-input" type="text" value="${taskText}">
          </div>
          <div class="close-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
          </div>
          <div class="move-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-grip-horizontal" viewBox="0 0 16 16">
              <path d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
          </div>
            `;



    const closeIcon = task.querySelector('.close-icon');
    closeIcon.addEventListener('click', () => {
      task.classList.add('removing');
      task.remove();
      saveTasksToLocalStorage();
    });

    const checkbox = task.querySelector('input[type="checkbox"]');


    document.getElementById('clear-done').addEventListener('click', () => {
      const tasks = document.querySelectorAll('.task');

      tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
          task.remove();
        }
      });

      saveTasksToLocalStorage();
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        task.classList.add('completed');
      } else {
        task.classList.remove('completed');
      }
      saveTasksToLocalStorage();
    });

    task.addEventListener('dragstart', () => {
      draggingTask = task;
      task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
      task.classList.remove('dragging');
      draggingTask = null;
      saveTasksToLocalStorage();
    });

    task.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingOverTask = e.target.closest('.task');
      if (draggingTask && draggingOverTask && draggingOverTask !== draggingTask) {
        itemsSection.insertBefore(draggingTask, draggingOverTask);
      }
    });


    const taskInput = task.querySelector('.task-input');


    taskInput.addEventListener('click', () => {
      taskInput.removeAttribute('readonly');
      taskInput.focus();
    });

    taskInput.addEventListener('blur', saveTaskOnUpdate);
    taskInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        saveTaskOnUpdate();
      }
    });

    function saveTaskOnUpdate() {
      taskInput.setAttribute('readonly', true);
      saveTasksToLocalStorage();
    }

    itemsSection.appendChild(task);

  };


  function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
      const taskText = task.querySelector('.task-input').value;
      const isCompleted = task.querySelector('input[type="checkbox"]').checked;
      tasks.push({ taskText, isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasksCount()

  }



  function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        JSON.parse(savedTasks).forEach(task => addTask(task.taskText, task.isCompleted));
    } else {
        localStorage.setItem('tasks', JSON.stringify([]));
    }

    loadTasksCount();
}

function loadTasksCount() {
  const savedTasks = localStorage.getItem('tasks');
  const itemsLeft = document.getElementById('items-left');
  
  if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const il = tasks.filter(task => !task.isCompleted).length;
      itemsLeft.innerHTML = `${il} items left`; 
  } else {
      itemsLeft.innerHTML = '0 items left';
  }
}


});
