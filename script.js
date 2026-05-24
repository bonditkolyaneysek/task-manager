
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* =========================
   ELEMENTS
========================= */
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveTask");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");

const taskList = document.getElementById("taskList");

const sidebarItems = document.querySelectorAll(".sidebar li");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

menuBtn.onclick = () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
};

overlay.onclick = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
};
/* =========================
   MODAL CONTROLS
========================= */
openBtn.onclick = () => {
    modal.style.display = "flex";
};

closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};


/* =========================
   SAVE TASK
========================= */
saveBtn.onclick = () => {

    const title = taskTitle.value;
    const desc = taskDescription.value;
    const category = taskPriority.value;

    if (!title || !category) {
        alert("Please enter task title and category!");
        return;
    }

    tasks.push({
        title,
        desc,
        category,
        completed: false
    });

    saveTasks();
    renderTasks();

    clearInputs();

    modal.style.display = "none";
};


/* =========================
   RENDER TASKS
========================= */
function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `<p style="color:gray;">No tasks yet 🎉</p>`;
        return;
    }

    tasks.forEach((taskData, index) => {

        const task = document.createElement("div");
        task.classList.add("task");

        if (taskData.completed) {
            task.classList.add("completed");
        }

        task.dataset.category = taskData.category;

        task.innerHTML = `
            <div>
                <h3 class="task-title">${taskData.title}</h3>
                <p>${taskData.desc}</p>
            </div>

            <div style="display:flex; gap:10px; align-items:center;">
                <span class="tag ${taskData.category}">
                    ${taskData.category}
                </span>

                <button class="done-btn">✔</button>
                <button class="delete-btn">🗑</button>
            </div>
        `;

        /* =========================
           COMPLETE TASK
        ========================= */
        task.querySelector(".done-btn").onclick = () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        };

        /* =========================
           DELETE TASK
        ========================= */
        task.querySelector(".delete-btn").onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        /* =========================
           EDIT TASK
        ========================= */
        task.querySelector(".task-title").onclick = () => {
            const newTitle = prompt("Edit task:", tasks[index].title);

            if (newTitle && newTitle.trim() !== "") {
                tasks[index].title = newTitle;
                saveTasks();
                renderTasks();
            }
        };

        taskList.appendChild(task);
    });
}


/* =========================
   SAVE TO LOCALSTORAGE
========================= */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* =========================
   SIDEBAR FILTER
========================= */
sidebarItems.forEach(item => {
    item.addEventListener("click", () => {

        const filter = item.textContent.toLowerCase();

        const tasksDOM = document.querySelectorAll(".task");

        tasksDOM.forEach(task => {

            const category = task.dataset.category;
            const isCompleted = task.classList.contains("completed");

            let show = true;

            if (filter === "upcoming") {
                show = !isCompleted;
            }
            else if (filter === "completed") {
                show = isCompleted;
            }
            else {
                show = category === filter;
            }

            task.style.display = show ? "flex" : "none";
        });
    });
});


/* =========================
   MOBILE MENU
========================= */
menuBtn.onclick = () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
};

overlay.onclick = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
};


/* =========================
   INIT
========================= */
renderTasks();

function clearInputs() {
    taskTitle.value = "";
    taskDescription.value = "";
    taskPriority.value = "";
}