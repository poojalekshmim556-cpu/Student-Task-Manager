const API_URL = "http://localhost:8080/tasks";

// Load all tasks on start
function loadTasks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(tasks => displayTasks(tasks))
        .catch(error => console.error("Error loading tasks:", error));
}

// Add a single task
function addTask() {
    let input = document.getElementById("taskInput");
    let title = input.value;

    if (title.trim() === "") {
        alert("Please enter a task");
        return;
    }

    let newTask = { title: title, status: "Pending" };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(() => {
        input.value = "";
        loadTasks();
    })
    .catch(error => console.error("Error adding task:", error));
}

// Delete a single task by ID
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => loadTasks())
        .catch(error => console.error("Error deleting task:", error));
}

// NEW: Delete ALL tasks from database
function deleteAllTasks() {
    if (!confirm("Are you sure you want to delete ALL tasks from MySQL?")) {
        return;
    }

    fetch(API_URL)
        .then(response => response.json())
        .then(tasks => {
            // Create a DELETE request for every task in MySQL
            let deleteRequests = tasks.map(task =>
                fetch(`${API_URL}/${task.id}`, { method: "DELETE" })
            );

            // Wait for all delete requests to finish, then refresh screen
            return Promise.all(deleteRequests);
        })
        .then(() => loadTasks())
        .catch(error => console.error("Error deleting all tasks:", error));
}

// Render tasks to webpage
function displayTasks(tasks) {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.textContent = `${task.title} - ${task.status} `;

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = function() {
            deleteTask(task.id);
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

loadTasks();