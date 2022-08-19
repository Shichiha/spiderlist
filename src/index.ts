const isObject = (_:any) => {return typeof _ === "object"}
function StringTag(tag: string, ...content: any[]): string { return `<${tag} ${content.filter(isObject).map(_ => Object.keys(_).map(y => `${y}="${_[y]}"`).join(' ')).join(' ')}>${content.filter(_ => !isObject(_)).join('')}</${tag}>`; }
console.log(StringTag('p','pewee', {id: 'poo'})); 

class DOME { 
    element?: HTMLElement
    tag: string
    parent: HTMLElement
    content: any[]
    constructor(tag: string, parent: HTMLElement, ...content: any[]) {
        this.tag = tag
        this.parent = parent
        this.content = content
    }

    mapContent(element: HTMLElement): void {
        this.content.forEach(_ => { isObject(_) ? Object.keys(_).forEach(y => element.setAttribute(y, _[y])) : element.innerHTML = _; });
    }
    synthesize(prepend: Boolean): HTMLElement {
        let element = document.createElement(this.tag);
        this.element = element
        this.mapContent(element)
        prepend ? this.parent.prepend(element) : this.parent.appendChild(element);
        return element;
    }

    alterate(...content: any[]): void {
        if (this.element == null) return;
        this.content = content
        let element = this.element
        this.mapContent(element)
    }
}
function GetFuncBody(func: Function): string { return func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '') }
function intLoop(start: number, end: number, step: number, callback: (i: number) => void) { for (let i = start; i < end; i += step)callback(i); }

class HTMLTable {
    headers: string[];
    rows: any[];
    constructor(headers: string[], rows: any[]) { this.headers = headers; this.rows = rows; }

    ToStandard(id: string, extraArgs?: any[], ...content: any[]): string {
        return StringTag('table',StringTag('tr', ...this.headers.map(header => StringTag('th', { id: `t-${id}-h-${header}` }, header))),...this.rows.map((row, index) => StringTag('tr', ...row.map((cell: any, columnIndex: number) => StringTag('td', { id: `t-${id}-r-${index}-c-${columnIndex}`, ...extraArgs }, cell)))), ...content);
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
        let table = new HTMLTable(hasDescription ? ['Title', 'Description', 'Completed'] : ['Title', 'Completed'], this.todos.map(todo => hasDescription ? [todo.Title, todo.Description, todo.completed] : [todo.Title, todo.completed]));
        return table;
    }

    AddTodo(title: string, completed: boolean, description?: string): void {
        this.todos.push({ Title: title, Description: description, completed: completed });
    }

    switch(index: number): void {
        let t=this.todos[index]
        t.completed = !t.completed
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
let SpiderTodoList = new DOME('div', slotElement, splist.Draw().ToStandard('spiderlist'));

SpiderTodoList.synthesize(true);

