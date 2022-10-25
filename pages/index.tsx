import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface ITodo {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface ITodoOptions extends ITodo {
  onClickComplete: (id: number) => void;
  onClickDelete: (id: number) => void;
}

const initialTodos = [
  { id: 1, title: 'todo #1', isCompleted: false },
  { id: 2, title: 'todo #2', isCompleted: false },
  { id: 3, title: 'todo #3', isCompleted: false },
  { id: 4, title: 'todo #4', isCompleted: false },
  { id: 5, title: 'todo #5', isCompleted: false },
] as ITodo[];

interface ISearchInputProps {
  onKeyUp: (title: string) => void;
}

interface INewTodoInputProps {
  onKeyUp: (title: string) => void;
}

const SearchInput = ({ onKeyUp }: ISearchInputProps) => {
  const [search, setSearch] = useState('');

  return (
    <input
      type='text'
      placeholder='Search todos'
      style={{ width: '100%', padding: '6px', marginBottom: '5px' }}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          onKeyUp(search);
          setSearch('');
        }
      }}
    />
  );
};

const NewTodoInput = ({ onKeyUp }: INewTodoInputProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  return (
    <input
      type='text'
      placeholder='New todo'
      style={{ width: '100%', padding: '6px' }}
      value={newTodoTitle}
      onChange={(e) => setNewTodoTitle(e.target.value)}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          onKeyUp(newTodoTitle);
          setNewTodoTitle('');
        }
      }}
    />
  );
};

const TodosInputs = () => {};

const Todo = ({
  onClickComplete,
  onClickDelete,
  id,
  title,
  isCompleted,
}: ITodoOptions) => {
  return (
    <div
      key={id}
      style={{
        border: '4px solid whitesmoke',
        padding: '8px',
        fontSize: '18px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <h5
        style={{
          textDecoration: isCompleted ? 'line-through' : '',
        }}
      >
        {title}
      </h5>
      <div style={{ display: 'flex', gap: '12px' }}>
        <p style={{ cursor: 'pointer' }} onClick={() => onClickComplete(id)}>
          ✔
        </p>
        <p style={{ cursor: 'pointer' }} onClick={() => onClickDelete(id)}>
          📮
        </p>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [todos, setTodos] = useState<ITodo[]>(initialTodos);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  const searchHandler = (title: string) => {
    const cleanedTitle = title.toLowerCase().trim();
    setFilteredTodos(
      todos.filter((todo) => {
        return todo.title.toLowerCase().includes(cleanedTitle);
      })
    );
  };

  const createTodoHandler = (title: string) => {
    if (!title) return;
    const newTodo = { id: Math.random(), title, isCompleted: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);

    toast.success('Created another todo - ' + title);
  };

  const completedTodoHandler = (id: number) => {
    console.log(id);
    const todo = filteredTodos.find((todo) => {
      return todo.id === id;
    });

    todo!.isCompleted = true;

    setTodos([
      ...filteredTodos.filter((todo) => {
        return todo.id !== id;
      }),
      todo!,
    ]);

    toast.success('Congrats on completing ' + todo!.title);
  };

  const deleteTodoHandler = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));

    toast.error('Removed todo');
  };

  return (
    <div
      style={{
        width: '400px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ marginBottom: '16px' }}>Todos</h1>
      <div
        style={{
          border: '2px solid whitesmoke',
          padding: '12px',
        }}
      >
        <SearchInput onKeyUp={searchHandler} />
        <NewTodoInput onKeyUp={createTodoHandler} />
      </div>
      <div
        ref={listRef}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {filteredTodos.map((todo) => {
          return (
            <Todo
              key={todo.id}
              id={todo.id}
              title={todo.title}
              isCompleted={todo.isCompleted}
              onClickComplete={completedTodoHandler}
              onClickDelete={deleteTodoHandler}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
