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

    ToStandard(id: string): string {
        return Tag('table',
            Tag('tr', ...this.headers.map(header => Tag('th', { id: `t-${id}-h-${header}` }, header))),
            ...this.rows.map((row, index) => Tag('tr', ...row.map((cell: any, columnIndex:number) => Tag('td', { id: `t-${id}-r-${index}-c-${columnIndex}` }, cell)))));
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
                todo.Description ? table.rows.push([todo.Title, todo.Description, todo.completed]) : table.rows.push([todo.Title, "", todo.completed]);
            else
                table.rows.push([todo.Title, todo.completed]);
        }
        return table;
    }
}

let tlist = new SpiderList();
tlist.todos.push({ Title: 'Buy milk', completed: false });
tlist.todos.push({ Title: 'Buy eggs', completed: false });
tlist.todos.push({ Title: 'Buy bread', completed: false });
tlist.todos.push({ Title: 'Buy cheese', completed: false });
let spiderlist = document.createElement('div');
spiderlist.innerHTML = tlist.Draw().ToStandard('spiderlist');
document.body.appendChild(spiderlist);
