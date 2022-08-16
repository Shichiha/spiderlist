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

    ToStandard(id: string, extraArgs?: any[], ...content: any[]): string {
        return Tag('table',
            Tag('tr', ...this.headers.map(header => Tag('th', { id: `t-${id}-h-${header}` }, header))),
            ...this.rows.map((row, index) => Tag('tr', ...row.map((cell: any, columnIndex: number) => Tag('td', { id: `t-${id}-r-${index}-c-${columnIndex}`, ...extraArgs }, cell)))),
            ...content);
    }
}

interface Todo {
    Title: string;
    Description?: string;
    completed: boolean;
    extra?: any;
}

class SpiderList {
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
                if (todo.completed)
                    todo.Description ? table.rows.push([Tag('span', { style: 'color: #90EE90' }, todo.Title), todo.Description, todo.completed]) : table.rows.push([Tag('span', { style: 'color: #90EE90' }, todo.Title), "", todo.completed]);
                else
                    todo.Description ? table.rows.push([todo.Title, todo.Description, todo.completed]) : table.rows.push([todo.Title, "", todo.completed]);

            else
                if (todo.completed)
                    table.rows.push([Tag('span', { style: 'color: #90EE90' }, todo.Title), todo.completed]);
                else
                    table.rows.push([todo.Title, todo.completed]);

        }
        return table;
    }

    AddTodo(title: string, completed: boolean, description?: string): void {
        this.todos.push({ Title: title, Description: description, completed: completed });
    }

    CheckTodoByTitle(title: string): void {
        for (let todo of this.todos) {
            if (todo.Title === title) {
                todo.completed = true;
                return;
            }
        }
    }

    CheckTodo(index: number): void {
        this.todos[index].completed = true;
    }
}

let splist = new SpiderList();
for (let i = 0; i < 200; i++) {
    let title = "";
    for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
        title += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    splist.AddTodo(title, Math.random() > 0.5);
}
let spelement = document.createElement('div');
spelement.innerHTML = splist.Draw().ToStandard('spiderlist');
document.body.appendChild(spelement);
let newTodoButton = document.createElement('button');
newTodoButton.innerHTML = 'New Todo';
newTodoButton.onclick = () => {
    let title = prompt('Title');
    let description = prompt('Description');
    if (!title) return
    splist.AddTodo(title, description!);
    spelement.innerHTML = splist.Draw().ToStandard('spiderlist');
}

document.body.appendChild(newTodoButton);

let checkTodoButton = document.createElement('button');
checkTodoButton.innerHTML = 'Check Todo';
checkTodoButton.onclick = () => {
    let title = prompt('Title');
    if (!title) return
    splist.CheckTodoByTitle(title);
    spelement.innerHTML = splist.Draw().ToStandard('spiderlist');
}

document.body.appendChild(checkTodoButton);