class TodoApp {
    constructor(tasksContainerId) {
        this.tasksContainer = document.getElementById(tasksContainerId);
    }

    async getNotes() {
        try {
            const res = await fetch('/todo');
            const data = await res.json();
            return data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    attachCheckboxListeners() {
        const checks = document.querySelectorAll('#tasks input');
        checks.forEach(check => {
            check.addEventListener('change', (e) => {
                this.noteCompletion(e);
            });
        });
    }

    attachDeleteListeners() {
        const buttons = document.querySelectorAll('.delete');
        buttons.forEach(button => {
            button.addEventListener('click', e => {
                this.deleteNote(e);
            });
        });
    }

    async showNotes() {
        const todos = await this.getNotes();
        const completed = [];
        const notCompleted = [];
        this.tasksContainer.innerHTML = ''
        todos.forEach((e,i) => {
            const item = `
                <li>
                    <input type="checkbox" name="noteState" id="checkbox${i}" data-id="${e._id}" ${e.completed ? 'checked' : ''}>
                    <label for="checkbox${i}">${e.title}</label>
                    <span class="delete"><img src="/assets/imgs/delete.svg" ></span>
                </li>`;
            if (e.completed) {
                completed.push(item);
            } else {
                notCompleted.push(item);
            }
        });
        this.tasksContainer.innerHTML += [...notCompleted, ...completed].join('');
        this.attachCheckboxListeners(); // Attach listeners after rendering
        this.attachDeleteListeners(); // Attach delete listeners after rendering
    }

    async noteCompletion(element) {
        try {
            const res = await fetch('/todo/completion', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    state: element.target.checked,
                    id: element.target.dataset.id
                })
            });
            const data = await res.json()
            console.log(data)
            await this.showNotes()
        } catch (err) {
            console.error(err)
        }
    }

    async addNote(value) {
        const res = await fetch('/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: value,
            })
        });
        const data = await res.json()
        console.log(data)
        await this.showNotes()
    }

    async deleteNote(button) {
        const todoId = button.target.parentNode.parentNode.querySelector('input').dataset.id
        const res = await fetch(`/todo/${todoId}`, {
            method: 'DELETE'
        })
        const data = await res.json()
        console.log(data)
        await this.showNotes()
    }

    async run() {
        await this.showNotes()

        // add note
        const form = document.querySelector('form')
        form.addEventListener('submit', e => {
            e.preventDefault()
            const inputValue = document.getElementById('noteInput').value
            this.addNote(inputValue)
        })
    }
}

const app = new TodoApp("tasks");
app.run();