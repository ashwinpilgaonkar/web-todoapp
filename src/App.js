import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
import {FormControl, Button, Modal, InputGroup } from 'react-bootstrap';


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');
  const [isOn, toggleIsOn] = useModal();
  const [isAboutVisible, setAboutVisible] = useState(false);
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [isCheckListVisible, setCheckListVisible] = useState(false);
  const [isLoggedin, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new obkect
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function useModal(initialValue = false) {
    const [value, setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => {
      setValue(v => !v);
    }, []);
    return [value, toggle];
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }


  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function validateLogin() {
    if(username && username === "testuser") {
      if(password && password === "test1234") {
        setLoggedIn(true)
        toggleIsOn()
      }
    }
  }


  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div>
        <Modal show={isOn} className="todoapp stack-large" onHide={toggleIsOn}>
        <Modal.Header>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <br/>
        <Modal.Body>
        <InputGroup className="mb-3">
      <div style={{display: "flex", flexDirection: "column"}}>
        <FormControl style={{marginBottom: "10px"}}
          onChange={event => setUsername(event.target.value)}
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
        <FormControl
          onChange={event => setPassword(event.target.value)}
          placeholder="Password"
          aria-label="Password"
          aria-describedby="basic-addon1"
        />
      </div>
      <br/>
  </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{marginRight: "10px"}} variant="secondary" onClick={toggleIsOn}>
            Close
          </Button>
          <Button variant="primary" onClick={() => validateLogin()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isDescriptionVisible || isAboutVisible || isCheckListVisible} className="todoapp stack-large" onHide={toggleIsOn}>
        <Modal.Header>
          {isAboutVisible ? <Modal.Title>About</Modal.Title> : null}
          {isDescriptionVisible ? <Modal.Title>Description</Modal.Title> : null}
          {isCheckListVisible ? <Modal.Title>Checklist</Modal.Title> : null}
        </Modal.Header>
        <br/>
        <Modal.Body>
            Test
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
              setDescriptionVisible(false)
              setAboutVisible(false)
              setCheckListVisible(false)
            }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {
        !isOn && !isAboutVisible && !isCheckListVisible && !isDescriptionVisible ?
        <div className="todoapp stack-large">
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
          <Button disabled={isLoggedin} onClick={toggleIsOn} variant="link">Log in</Button>
          <Button onClick={() => {isLoggedin ? setAboutVisible(true) : toggleIsOn()} } variant="link">About</Button>
          <Button onClick={() => {isLoggedin ? setCheckListVisible(true) : toggleIsOn()} } variant="link">Checklist</Button>
          <Button onClick={() => {isLoggedin ? setDescriptionVisible(true) : toggleIsOn()} } variant="link">Description</Button>
        </div>
        <Form addTask={addTask} />
        <div className="filters btn-group stack-exception">
          {filterList}
        </div>
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
          {headingText}
        </h2>
        <ul
          role="list"
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading"
        >
          {taskList}
        </ul>
        <br/><br/><span>Ashwin Pilgaonkar</span>
    </div>
        :
        null
      }
    </div>
  );
}

export default App;
