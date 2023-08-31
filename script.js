document.addEventListener("DOMContentLoaded", () => {
    // Function to fetch tasks and populate the taskList
    function fetchTasks() {
        fetch("api.php")
            .then(response => response.json())
            .then(data => {
                data.forEach(task => {
                    createTaskItem(task);
                });
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });
    }

    // Function to create a new task item
    function createTaskItem(task) {
        const taskList = document.getElementById("taskList");
        const taskItem = document.createElement("li");
        taskItem.dataset.taskId = task.id;
        taskItem.innerHTML = `
            <span class="task-name">${task.task_name}</span>
            <button class="complete-button" data-task-id="${task.id}">Complete</button>
            <button class="edit-button" data-task-id="${task.id}">Edit</button>
            <button class="delete-button" data-task-id="${task.id}">Delete</button>
        `;
        taskList.appendChild(taskItem);
    }

    // Function to mark a task as completed
    function markTaskAsCompleted(taskId) {
        const formData = new FormData();
        formData.append("taskId", taskId);

        fetch("api.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Update the UI to reflect the change
        })
        .catch(error => {
            console.error("Error marking task as completed:", error);
        });
    }

    // Function to edit a task
    function editTask(taskId, newTaskName) {
        const formData = new FormData();
        formData.append("taskId", taskId);
        formData.append("newTaskName", newTaskName);

        fetch("api.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Update the UI to reflect the change
        })
        .catch(error => {
            console.error("Error editing task:", error);
        });
    }

    // Function to delete a task
    function deleteTask(taskId) {
        const formData = new FormData();
        formData.append("taskId", taskId);

        fetch("api.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Remove the task from the UI
            const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
            if (taskItem) {
                taskItem.remove();
            }
        })
        .catch(error => {
            console.error("Error deleting task:", error);
        });
    }

    // Fetch tasks and populate the UI
    fetchTasks();

    // Event listener for adding a task
    document.getElementById("addButton").addEventListener("click", () => {
        const newTaskName = prompt("Enter task:");
        if (newTaskName) {
            const formData = new FormData();
            formData.append("task", newTaskName);

            fetch("api.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // Create a new task item in the UI
                createTaskItem({ id: -1, task_name: newTaskName });
            })
            .catch(error => {
                console.error("Error adding task:", error);
            });
        }
    });

    // Event listener for marking a task as completed
    document.getElementById("taskList").addEventListener("click", (event) => {
        if (event.target.classList.contains("complete-button")) {
            const taskId = event.target.dataset.taskId;
            markTaskAsCompleted(taskId);
        }
    });

    // Event listener for editing a task
    document.getElementById("taskList").addEventListener("dblclick", (event) => {
        if (event.target.classList.contains("task-name")) {
            const taskItem = event.target.parentNode;
            const taskId = taskItem.dataset.taskId;
            const newTaskName = prompt("Edit task:", event.target.textContent);
            if (newTaskName !== null) {
                editTask(taskId, newTaskName);
            }
        }
    });

    // Event listener for deleting a task
    document.getElementById("taskList").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-button")) {
            const taskId = event.target.dataset.taskId;
            deleteTask(taskId);
        }
    });
});
