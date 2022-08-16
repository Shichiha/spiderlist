class HTMLTable {
    headers: string[];
    rows: any[];
    constructor() {
        this.headers = [];
        this.rows = [];
    }

    ToStandard(): string {
        let html = '<table>';
        if (this.headers) {
            html += '<tr>';
            for (let header of this.headers)
                html += `<th>${header}</th>`;
            html += '</tr>';
        }
        for (let row of this.rows) {
            html += '<tr>';
            for (let cell of row)
                html += `<td>${cell}</td>`;
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }
}

interface Todo {
    Title: string;
    Description?: string;
    completed: boolean;
    extra?: any;
}

class TodoList {
    todos: Todo[];
    constructor() {
        this.todos = [];
    }

    Draw(): HTMLTable {
        let hasDescription = this.todos.some(todo => todo.Description);
        let table = new HTMLTable();
        table.headers = hasDescription ? ['Title', 'Description', 'Completed'] : ['Title', 'Completed'];
        for (let todo of this.todos) {
            if (hasDescription)
                todo.Description ? table.rows.push([todo.Title, todo.Description, todo.completed]) : table.rows.push([todo.Title," ",todo.completed]);
            else
                table.rows.push([todo.Title, todo.completed]);
        }
        console.log(table.headers);

        return table;
    }
}

let todoList = new TodoList();
todoList.todos.push({ Title: 'Buy milk', completed: false });
todoList.todos.push({ Title: 'Buy eggs', completed: false });
todoList.todos.push({ Title: 'Buy bread', completed: false });
todoList.todos.push({ Title: 'Buy cheese', completed: false });
let newelement = document.createElement('div');
newelement.innerHTML = todoList.Draw().ToStandard();
document.body.appendChild(newelement);
