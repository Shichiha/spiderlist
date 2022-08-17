function StringTag(tag: string, ...content: any[]) {
    return `<${tag} ${content.filter(x => typeof x === 'object').map(x => Object.keys(x).map(y => `${y}="${x[y]}"`).join(' ')).join(' ')}>${content.filter(x => typeof x !== 'object').join('')}</${tag}>`;
}
function DOMElement(tag: string, parent: HTMLElement, ...content: any[]) {
    let element = document.createElement(tag);
    content.forEach(x => {
        if (typeof x === 'object') Object.keys(x).forEach(y => element.setAttribute(y, x[y]));
        else element.innerHTML += x;
    });
    parent.appendChild(element);
    return element;
}

class HTMLTable {
    headers: string[];
    rows: any[];
    constructor() {
        this.headers = [];
        this.rows = [];
    }

    ToStandard(id: string, extraArgs?: any[], ...content: any[]): string {
        return StringTag('table',
            StringTag('tr', ...this.headers.map(header => StringTag('th', { id: `t-${id}-h-${header}` }, header))),
            ...this.rows.map((row, index) => StringTag('tr', ...row.map((cell: any, columnIndex: number) => StringTag('td', { id: `t-${id}-r-${index}-c-${columnIndex}`, ...extraArgs }, cell)))), ...content);
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
        this.todos.forEach(todo => hasDescription ? table.rows.push([todo.Title, todo.Description, todo.completed]) : table.rows.push([todo.Title, todo.completed]));
        return table;
    }

    AddTodo(title: string, completed: boolean, description?: string): void {
        this.todos.push({ Title: title, Description: description, completed: completed });
    }

    CheckTodoByTitle(title: string): void {
        this.todos.forEach(todo => todo.Title === title ? todo.completed = true : null);
    }

    CheckTodo(index: number): void {
        this.todos[index].completed = true;
    }
}

let splist = new SpiderList();
function intLoop(start: number, end: number, step: number, callback: (i: number) => void) {for (let i = start; i < end; i += step)callback(i);}
intLoop(0, 200, 1, i => {
    let title = "";
    intLoop(0, Math.floor(Math.random() * 10) + 1, 1, i => { title += String.fromCharCode(Math.floor(Math.random() * 26) + 97); });
    splist.AddTodo(title, Math.random() > 0.5);
});

let SpiderTodoList = DOMElement('div', document.getElementById('todolist-slot')!, splist.Draw().ToStandard('spiderlist'));
let TodoButton = DOMElement('button', document.getElementById('todolist-slot')!, 'New Todo');
TodoButton.onclick = () => {
    let title = prompt('Title');
    let description = prompt('Description');
    if (!title) return
    splist.AddTodo(title, false, description!);
    SpiderTodoList.innerHTML = splist.Draw().ToStandard('spiderlist');
}

let CheckButton = DOMElement('button', document.getElementById('todolist-slot')!, 'Check Todo');
CheckButton.onclick = () => {
    let title = prompt('Title');
    if (!title) return
    splist.CheckTodoByTitle(title);
    SpiderTodoList.innerHTML = splist.Draw().ToStandard('spiderlist');
}