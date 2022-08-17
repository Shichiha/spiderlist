function StringTag(tag: string, ...content: any[]): string {return `<${tag} ${content.filter(_ => typeof _ === 'object').map(_ => Object.keys(_).map(y => `${y}="${_[y]}"`).join(' ')).join(' ')}>${content.filter(_ => typeof _ !== 'object').join('')}</${tag}>`;}
function DOMElement(tag: string, parent: HTMLElement, ...content: any[]): HTMLElement {
    let element = document.createElement(tag);
    content.forEach(_ => {if (typeof _ === 'object') Object.keys(_).forEach(y => element.setAttribute(y, _[y]));else element.innerHTML += _;});
    parent.appendChild(element);
    return element;
}
function GetFunctionBody(func: Function): string {return func.toString().replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'')}
function intLoop(start: number, end: number, step: number, callback: (i: number) => void) {for (let i = start; i < end; i += step)callback(i);} 

class HTMLTable {
    headers: string[];
    rows: any[];
    constructor(headers: string[], rows: any[]) {this.headers = headers;this.rows = rows;}

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
        let table  = new HTMLTable(hasDescription ? ['Title', 'Description', 'Completed'] : ['Title', 'Completed'], this.todos.map(todo => hasDescription ? [todo.Title, todo.Description, todo.completed] : [todo.Title, todo.completed]));        
        return table;
    }

    AddTodo(title: string, completed: boolean, description?: string): void {
        this.todos.push({ Title: title, Description: description, completed: completed });
    }

    ToggleTodo(index: number): void {
        this.todos[index].completed = !this.todos[index].completed;
        console.log(this.todos[index].completed, !this.todos[index].completed);
        
    }

    GetTodo(title: string): Todo | undefined {
        let index = this.todos.findIndex(todo => todo.Title === title);
        return index === -1 ? undefined : this.todos[index];
        
    }

}

let splist = new SpiderList();
intLoop(0, 4, 1, i => {
    let title = `Todo ${i + 1}`;
    splist.AddTodo(title, Math.random() > 0.5);
});

let slotElement = document.getElementById('todolist-slot')!
let SpiderTodoList = DOMElement('div', slotElement, splist.Draw().ToStandard('spiderlist'));

let TodoButton = DOMElement('button', slotElement, 'New Todo', { onclick: GetFunctionBody(() => {
    let title = prompt('Title');
    let description = prompt('Description');
    if (!title) return
    splist.AddTodo(title, false, description!);
    SpiderTodoList.innerHTML = splist.Draw().ToStandard('spiderlist');
})});
let ToggleButton = DOMElement('button', slotElement, 'Toggle Todo', { onclick: GetFunctionBody(() => {
    let title = prompt('Title');if (!title) return
    let todo = splist.GetTodo(title);if (!todo) return
    splist.ToggleTodo(splist.todos.indexOf(todo));
    SpiderTodoList.innerHTML = splist.Draw().ToStandard('spiderlist');
})});
let RatioButton = DOMElement('button', slotElement, 'Ratio', { onclick: GetFunctionBody(() => {
    let [finished, unfinished] = [0,0];
    splist.todos.forEach(todo => todo.completed ? finished++ : unfinished++);
    alert(`Finished: ${finished} Unfinished: ${unfinished} Ratio: ${finished / (finished + unfinished)}`);
})});
