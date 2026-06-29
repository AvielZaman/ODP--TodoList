import "./styles.css";
import {openClosePanel, addTodo} from "./DOM_manipulate.js";


// run once on load — save/delete buttons close the panel
document.getElementById('detail-save').addEventListener('click', () => {
    document.getElementById('container').classList.remove('panel-open');
});
document.getElementById('detail-cancel').addEventListener('click', () => {
    document.getElementById('container').classList.remove('panel-open');
});

addTodo();
openClosePanel();

class Todo {
    #title;
    #desc;
    #date;
    #project;
    #priority;

    constructor(title, desc, date, project, priority) {
        this.#title = title;
        this.#desc = desc;
        this.#date = date;
        this.#project = project;
        this.#priority = priority;
    }

    get title() { return this.#title; }
    set title(newTitle) { this.#title = newTitle; }

    get desc() { return this.#desc; }
    set desc(newDesc) { this.#desc = newDesc; }

    get date() { return this.#date; }
    set date(newDate) { this.#date = newDate; }

    get project() { return this.#project; }
    set project(newProject) { this.#project = newProject; }

    get priority() { return this.#priority; }
    set priority(newPriority) { this.#priority = newPriority; }
}

