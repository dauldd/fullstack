import { useState, useEffect } from 'react'
import Filter from './components/filter'
import PersonForm from './components/PersonForm'
import Persons from './components/persons'
import personsService from './services/backend'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')


const handleDelete = (id) => {
  const person = persons.find(p => p.id === id)
  if (!person) return

  if (window.confirm(`Delete ${person.name}?`)) {
    personsService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        alert(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }
}

  useEffect(() => {
    personsService.getAll().then(data => setPersons(data))
  }, [])


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
const addPerson = (event) => {
  event.preventDefault()

  const existingPerson = persons.find(p => p.name === newName)

  if (existingPerson) {
    if (window.confirm(`${newName} is already added, replace number with new?`)) {
      const updatedPerson = { ...existingPerson, number: newNumber }
      personsService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(`Information of ${newName} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }
    return
  }

  const newPerson = { name: newName, number: newNumber }
  personsService
    .create(newPerson)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
}

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
