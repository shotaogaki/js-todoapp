import {TodoListModel} from "./model/TodoListModel.js";
import {TodoItemModel} from "./model/TodoItemModel.js";
import {TodoListView} from "./view/TodoListView.js";
import {render} from "./view/html-util.js";

export class App{
    constructor(){
        this.todoListView = new TodoListView();
        this.todoListModel = new TodoListModel();
    }
    handleAdd(title){
        this.todoListModel.addTodo(new TodoItemModel({title,completed:false}));
    }
    handleUpdate({id, completed}){
        this.todoListModel.updateTodo({id, completed});
    }
    handleDelete({id}){
        this.todoListModel.deleteTodo({id});
    }
    mount(){
        const formElement = document.querySelector("#js-form");
        const inputElement = document.querySelector("#js-form-input");
        const containerElement = document.querySelector("#js-todo-list");
        const todoItemCountElement = document.querySelector("#js-todo-count");
        this.todoListModel.onChange(() => {
            const todoItems = this.todoListModel.getTodoitems();
            const todoListView = new TodoListView();
            const todoListElement = todoListView.createElement(todoItems,{
                onUpdateTodo:({id, completed}) => {
                    this.handleUpdate({id,completed});
                    // this.todoListModel.updateTodo({ id, completed });
                },
                onDeleteTodo:({id}) => {
                    this.handleDelete({id});
                    // this.todoListModel.deleteTodo({ id });
                }
            });
            // const todoListElement = element`<ul />`;
            // const todoItems = this.todoListModel.getTodoitems();
            // todoItems.forEach(item => {
            //     const todoItemElement = item.completed 
            //         ? element`<li><input type="checkbox" class="checkbox" checked>
            //             <s>${item.title}</s>
            //             <button class="delete">X</button>
            //         </input></li>`
            //         : element`<li><input type="checkbox" class="checkbox" >
            //             ${item.title}
            //             <button class="delete">X</button>
            //         </input></li>`;
            //     const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
            //     inputCheckboxElement.addEventListener("change", () =>{
            //         this.todoListModel.updateTodo({
            //             id: item.id,
            //             completed: !item.completed
            //         });
            //     });
            //     const deleteButtonElement = todoItemElement.querySelector(".delete");
            //     deleteButtonElement.addEventListener("click", () => {
            //         this.todoListModel.deleteTodo({
            //             id: item.id
            //         });
            //     });
            //     todoListElement.appendChild(todoItemElement);
            // });
            render(todoListElement,containerElement);
            todoItemCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`
        })
        formElement.addEventListener("submit", (event)=>{
            event.preventDefault();
            if(!inputElement.value == ""){
                this.handleAdd(inputElement.value);
            }
            // this.todoListModel.addTodo(new TodoItemModel({
            //     title: inputElement.value,
            //     completed: false
            // }));
            inputElement.value = "";
        });
    }

    unmount(){
        const formElement = document.querySelector("#js-form");
        // const inputElement = document.querySelector("#js-form-input");
        // const containerElement = document.querySelector("#js-todo-list");
        // const todoItemCountElement = document.querySelector("#js-todo-count");
        this.todoListModel.deleteListener(() => {
            const todoItems = this.todoListModel.getTodoitems();
            const todoListView = new TodoListView();
            const todoListElement = todoListView.createElement(todoItems,{
                onUpdateTodo:({id, completed}) => {
                    this.handleUpdate({id,completed});
                },
                onDeleteTodo:({id}) => {
                    this.handleDelete({id});
                }
            });
            render(todoListElement,containerElement);
            todoItemCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`
        })
        formElement.removeEventListener("submit", (event)=>{
            event.preventDefault();
            if(!inputElement.value == ""){
                this.handleAdd(inputElement.value);
            }
            inputElement.value = "";
        });
    }
};

const app = new App();
// ページのロードが完了したときのイベント
window.addEventListener("load", () => {
    app.mount();
});
// ページがアンロードされたときのイベント
window.addEventListener("unload", () => {
    app.unmount();
});
