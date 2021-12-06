import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const ToDoForm = ({ handleAddToDo, setIsEditingStatus }) => {
    const [ userInput, setUserInput ] = useState('')

    const handleChange = (e) => {
      setUserInput(e.currentTarget.value)
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const newTodo = {
        name: userInput,
        checked: false,
      }
      handleAddToDo(newTodo)
      setUserInput("")
    }

    return (
      <form style={{ marginTop: 25 }} onSubmit={handleSubmit}>
        <TextField
          className="add-input"
          id="standard-basic"
          variant="standard"
          onChange={handleChange}
          placeholder="Add todo..."
          onClick={() => setIsEditingStatus(true)}
          value={userInput}
        />
        <Button onClick={handleSubmit} style={{ height: 30, marginLeft: 20 }} variant="contained">Add</Button>
      </form>
    );
};

export default ToDoForm;