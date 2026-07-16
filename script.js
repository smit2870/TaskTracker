document.addEventListener("DOMContentLoaded", () => {
    
    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const errorMessage = document.getElementById("errorMessage");
    const prioritySelect = document.getElementById("prioritySelect");

    const filterButtons = document.querySelectorAll(".filter-btn");
    let currentFilter = "all";

    loadTasks();

    addBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            currentFilter = btn.dataset.filter;

            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            filterTasks();
        });
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (!taskText) {
            errorMessage.textContent = "Please enter a task";
            return;
        }

        errorMessage.textContent = "";

        createTask(taskText, false, priority);

        saveTasks();
        updateProgress();

        taskInput.value = "";
    }

    function createTask(taskText, completed, priority) {

        const allowed = ["low", "mid", "high"];
        if (!allowed.includes(priority)) {
            priority = "mid";
        }

        const li = document.createElement("li");

        const taskLeft = document.createElement("div");
        taskLeft.classList.add("task-left");

        const priorityTag = document.createElement("span");
        priorityTag.classList.add("priority", priority);
        priorityTag.textContent = priority.toUpperCase();

        const span = document.createElement("span");
        span.classList.add("task-text");
        span.textContent = taskText;

        if (completed) {
            span.classList.add("done");
        }

        taskLeft.appendChild(priorityTag);
        taskLeft.appendChild(span);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("btnclass");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");

        const deleteImg = document.createElement("img");
        deleteImg.src = "delete icon.png";
        deleteBtn.appendChild(deleteImg);

        const completeBtn = document.createElement("button");
        completeBtn.classList.add("complete-btn");

        const completeImg = document.createElement("img");
        completeImg.src = completed
            ? "checkbox-checked.png"
            : "checkbox-unchecked.png";

        completeBtn.appendChild(completeImg);

        deleteBtn.addEventListener("click", function () {
            if (confirm(`Delete task "${taskText}"?`)) {
                li.remove();
                saveTasks();
                updateProgress();
            }
        });

        completeBtn.addEventListener("click", function () {
            span.classList.toggle("done");

            const isCompleted = span.classList.contains("done");

            completeImg.src = isCompleted
                ? "checkbox-checked.png"
                : "checkbox-unchecked.png";

            saveTasks();
            updateProgress();
        });

        buttonContainer.appendChild(deleteBtn);
        buttonContainer.appendChild(completeBtn);

        li.appendChild(taskLeft);
        li.appendChild(buttonContainer);

        taskList.appendChild(li);

        filterTasks();
    }

    function filterTasks() {
        const tasks = document.querySelectorAll("#taskList li");

        tasks.forEach(task => {
            const priority = task.querySelector(".priority").classList[1];

            if (currentFilter === "all" || currentFilter === priority) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        });
    }

    function updateProgress() {
        const totalTasks = document.querySelectorAll("#taskList li").length;
        const completedTasks = document.querySelectorAll(".task-text.done").length;

        document.getElementById("taskProgress").textContent =`${completedTasks} of ${totalTasks} tasks completed`;
    }

    function saveTasks() {
        const tasks = [];

        document.querySelectorAll("#taskList li").forEach(li => {
            const text = li.querySelector(".task-text").textContent;
            const completed = li.querySelector(".task-text").classList.contains("done");
            const priority = li.querySelector(".priority")?.classList[1] || "mid";

            tasks.push({ text, completed, priority });
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(task => {
            createTask(task.text, task.completed, task.priority || "mid");
        });

        updateProgress();
    }

});
