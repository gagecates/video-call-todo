import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import './ToDo.css'

export default function TodoList({toDos, handleUpdateToDo, setIsEditingStatus}) {
  const [editIdx, setEditIdx] = useState(null)
  const [editedValue, setEditedValue] = useState('')

  const handleOnChange = (position) => {
    setIsEditingStatus(true)
    const currentValue = toDos[position].checked
    let updatedTodos = toDos
    updatedTodos[position].checked = currentValue === true ? false : true
    handleUpdateToDo(updatedTodos)
  }

  const handleDelete = (todo) => {
    setIsEditingStatus(true)
    const updatedTodos = toDos.filter( el => el.name !== todo )
    handleUpdateToDo(updatedTodos)
  }

  const handleEdit = (position) => {
    const updatedToDos = toDos
    updatedToDos[position].name = editedValue
    handleUpdateToDo(updatedToDos)
    setEditIdx(null)
  }

  return (
    <div>
      {toDos ? toDos.map((todo, index) => (
        <div className="item">
          <div>
            <Checkbox
              checked={todo.checked}
              index={`checkbox-${index}`}
              onChange={() => handleOnChange(index)}
            />
            {editIdx === index ? (
              <input
                defaultValue={todo.name}
                onChange={(e) => setEditedValue(e.currentTarget.value)}
                type="text"
                className="edit-input"
                key={`label-${index}`}
              />
            ): <span key={`label-${index}`}>{todo.name}</span>
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            {editIdx === index && (
              <Button
                style={{ marginRight: 10 }}
                size="small"
                onClick={() => handleEdit(index)}
                variant="outlined"
              >
                Save
              </Button>
            )}
            <CreateIcon onClick={() => setEditIdx(index)} key={`create-${index}`} style={{ marginRight: 10 }} fontSize="small"/>
            <DeleteIcon onClick={() => handleDelete(todo.name)} key={`delete-${index}`} fontSize="small"/>
          </div>
        </div>
      ))
      : <p> You have no todos!</p>
      }
    </div>
  )
}
