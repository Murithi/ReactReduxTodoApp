import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';

import { createStore, applyMiddleware } from 'redux';
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };

    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});

const store = createStore(todoApp);

//Presentational components : No behavior specified. Knows how to render a todo
const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
);
// Presentational component: Only concerned with how to dos are rendered
const TodoList = ({ todos, onTodoClick }) => (
  <ul>{todos.map(todo => <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />)}</ul>
);

const AddTodo = ({ onAddClick }) => {
  let input;
  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddClick(input.value);
          input.value = '';
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

const FilterLink = ({ filter, currentFilter, children, onClick }) => {
  if (filter == currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick(filter);
      }}
    >
      {children}
    </a>
  );
};
const Footer = ({ visibilityFilter, onFilterClick }) => {
  return (
    <div>
      <p>
        Show:
        {'    '}
        <FilterLink currentFilter={visibilityFilter} onClick={onFilterClick} filter="SHOW_ALL">
          {' '}
          All{' '}
        </FilterLink>
        {'    '}
        <FilterLink currentFilter={visibilityFilter} onClick={onFilterClick} filter="SHOW_ACTIVE">
          {' '}
          Active{' '}
        </FilterLink>
        {'    '}
        <FilterLink currentFilter={visibilityFilter} onClick={onFilterClick} filter="SHOW_COMPLETED">
          {' '}
          Completed{' '}
        </FilterLink>
      </p>
    </div>
  );
};
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    default:
      return todos;
  }
};
let nextTodoId = 0;
//Container component: Passes data from the store and specifies behavior
const TodoApp = ({ todos, visibilityFilter }) => (
  <div>
    <AddTodo
      onAddClick={text =>
        store.dispatch({
          type: 'ADD_TODO',
          text,
          id: nextTodoId++
        })}
    />
    // Renders todolist with visibleTodos and specifies action on item click
    <TodoList
      todos={getVisibleTodos(todos, visibilityFilter)}
      onTodoClick={id =>
        store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })}
    />
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })}
    />
  </div>
);

const render = () => {
  ReactDOM.render(<TodoApp {...store.getState()} />, document.getElementById('root'));
};
store.subscribe(render);
render();
console.log(store.getState());

console.log(store.getState());
