import React, {useState, useEffect} from 'react'
import axios from 'axios'

function Todo() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    axios.get('http://localhost:4000/todos/')
        .then(response => {
            setTodos({ todos: response.data });
            console.log(todos)
        })
        .catch(function (error){
            console.log(error);
        })
  }, []); //  Only re-run the effect if count changes

  console.log(todos)
  return(
    <div>
      Todos
      {todos.todos ?
        <div>
          {todos.todos.map((todo, index) =>
            <div key={todo._id}>
              "description:"
              {todo.todo_description}
              {todo.todo_priority}
            </div>
          )}
        </div>
        :
        "loading"
      }
    </div>
  )
}

export default Todo

// {todos ?
//   <div>
//     {todos.map((index, todo) =>
//       <div>
//         {todo.todo_description}
//       </div>
//     )}
//   </div>
//   :
//   "loading"
// }
