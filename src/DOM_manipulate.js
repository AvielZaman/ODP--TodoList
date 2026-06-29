import { format } from "date-fns";

function formatRelativeDate(dateStr) {
    if (!dateStr) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateStr + "T00:00:00");
    const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
}

function renderChecklist(checklist, container) {
    container.innerHTML = "";

    checklist.forEach((item) => {
        const label = document.createElement("label");
        label.classList.add("check-item");
        if (item.completed) label.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;

        checkbox.addEventListener("change", () => {
            item.completed = checkbox.checked;
            label.classList.toggle("completed", checkbox.checked);
        });

        label.append(checkbox, " " + item.text);
        container.appendChild(label);
    });

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.classList.add("add-check-item");
    addBtn.textContent = "Add item";

    addBtn.addEventListener("click", () => {
        const text = prompt("New checklist item:");
        if (!text) return;
        checklist.push({ text, completed: false });
        renderChecklist(checklist, container);
    });

    container.appendChild(addBtn);
}

function updateTodo(todoElement, title, date, project, priority, checklist) {
    todoElement.querySelector("h2").textContent = title;

    const tag = todoElement.querySelector(".tag");
    tag.className = "tag " + priority;
    tag.textContent = priority;

    todoElement.querySelector(".bottom p:nth-child(2)").textContent = formatRelativeDate(date);
    todoElement.querySelector(".bottom p:nth-child(3)").textContent = project;

    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    const progressEl = todoElement.querySelector(".checklist-progress");
    progressEl.textContent = total > 0 ? `${completed}/${total}` : "";
}

function openClosePanel(todo, title, desc, date, project, priority, checklist) {
    const container = document.getElementById('container');
    container.classList.toggle('panel-open');

    if (!todo) return;

    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const detailDate = document.getElementById('detail-due-date');
    const detailProject = document.getElementById('detail-project');
    const detailPriorityBtns = document.querySelectorAll('#detail-panel .priority-btn');
    const checklistContainer = document.querySelector('#detail-panel .checklist');

    detailTitle.value = title;
    detailDesc.value = desc;
    detailDate.value = date;
    detailProject.value = project;

    detailPriorityBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.value === priority) btn.classList.add('active');
    });

    detailPriorityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            detailPriorityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    renderChecklist(checklist, checklistContainer);

    document.getElementById('detail-save').addEventListener('click', () => {
        container.classList.remove('panel-open');
        updateTodo(todo,
            detailTitle.value,
            detailDate.value,
            detailProject.value,
            document.querySelector('#detail-panel .priority-btn.active')?.dataset.value ?? priority,
            checklist
        );
    }, { once: true });

    document.getElementById('detail-cancel').addEventListener('click', () => {
        container.classList.remove('panel-open');
    }, { once: true });
}

function addTodo() {
    const viewsTodomContainer = document.querySelector(".view-todos");
    const submitBtn = document.getElementById("submits");
    const title = document.getElementById("title");
    const desc = document.getElementById("desc");
    const date = document.getElementById("due-date");
    const project = document.getElementById("project");
    const priorityBtns = document.querySelectorAll(".priority-btn");

    priorityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            priorityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const titleData = title.value;
        const descData = desc.value;
        const projectData = project.value;
        const priorityData = document.querySelector(".priority-btn.active")?.dataset.value ?? "medium";
        const checklistData = [];

        let dateData = date.value;
        if (dateData) {
            dateData = format(new Date(dateData + "T00:00:00"), "yyyy-MM-dd");
        }

        const pPriority = document.createElement("p");
        pPriority.classList.add("tag", priorityData);
        pPriority.textContent = priorityData;

        const pDate = document.createElement("p");
        pDate.textContent = formatRelativeDate(dateData);

        const pProject = document.createElement("p");
        pProject.textContent = projectData;

        const pProgress = document.createElement("p");
        pProgress.classList.add("checklist-progress");

        const bottomDiv = document.createElement("div");
        bottomDiv.classList.add("bottom");
        bottomDiv.append(pPriority, pDate, pProject, pProgress);

        const h2 = document.createElement("h2");
        h2.textContent = titleData;

        const todoDetailsDiv = document.createElement("div");
        todoDetailsDiv.classList.add("todo-details");
        todoDetailsDiv.append(h2, bottomDiv);

        const input = document.createElement("input");
        input.type = "radio";

        const radioDiv = document.createElement("div");
        radioDiv.classList.add("radio");
        radioDiv.append(input, todoDetailsDiv);

        const viewTodoItemDiv = document.createElement("div");
        viewTodoItemDiv.classList.add("view-todos-item");
        viewTodoItemDiv.appendChild(radioDiv);

        viewsTodomContainer.appendChild(viewTodoItemDiv);

        document.getElementById('add-task-dialog').close();

        viewTodoItemDiv.addEventListener('click', () =>
            openClosePanel(viewTodoItemDiv, titleData, descData, dateData, projectData, priorityData, checklistData)
        );
    });
}

export { openClosePanel, addTodo };