function Tag(tag: string, ...content: any[]) {
    let attributes = content.filter(x => typeof x === 'object');
    let contentArray = content.filter(x => typeof x !== 'object');
    let attributesString = attributes.map(x => Object.keys(x).map(y => `${y}="${x[y]}"`).join(' ')).join(' ');
    return `<${tag} ${attributesString}>${contentArray.join('')}</${tag}>`;
}

class HTMLTable {
    headers: string[];
    rows: any[];
    constructor() {
        this.headers = [];
        this.rows = [];
    }

    ToStandard(): string {
        return Tag('table',
            Tag('tr', ...this.headers.map(header => Tag('th', header))),
            ...this.rows.map(row => Tag('tr', ...row.map((cell: any) => Tag('td', cell))))
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
                todo.Description ? table.rows.push([todo.Title, todo.Description, todo.completed]) : table.rows.push([todo.Title, "", todo.completed]);
            else
                table.rows.push([todo.Title, todo.completed]);
        }
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
