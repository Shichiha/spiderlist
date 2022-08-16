class HTMLTable {
    headers: string[];
    rows: any[];
    constructor() {
        this.headers = [];
        this.rows = [];
    }

    Tag(tag:string, ...content: any[]) { return `<${tag}>${content.join('')}</${tag}>`; }
    ToStandard(): string {
        return this.Tag('table', 
            this.Tag('tr', ...this.headers.map(header => this.Tag('th', header))),
            ...this.rows.map(row => this.Tag('tr', ...row.map((cell:any) => this.Tag('td', cell))))
        );
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
