import React, { useState, useEffect } from "react";

//include images into your bundle

//create your first component
const Home = () => {
	const [input, setInput] = useState("");
	const [tareas, setTareas] = useState([]);

	//crear usuario
	const createUser = () => {
		fetch('https://playground.4geeks.com/todo/users/sanx', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			}),
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.msg && data.msg.includes("already exists")) {
					console.log("El usuario ya existe");
				}
			})
			.catch(error => console.error('Usuario creado', error));
	};

	//hasta aqui la creacion del usuario
	//obtener tareas
	const getTodos = () => {
		fetch('https://playground.4geeks.com/todo/users/sanx', {
			//method: 'GET'
		})
			.then(res => res.json())
			.then(data => {

				console.log(data);
				if (Array.isArray(data.todos)) {
					setTareas(data.todos);
				} else {
					console.error('Error: La respuesta no contiene un array de tareas.', data);
					setTareas([]);
				}
			})
			.catch(error => {
				console.error('Error al obtener tareas:', error);
				setTareas([]);
			});
	};
	//hasta aqui la obtencion de tareas

	//crear tarea
	const createTodo = (tarea) => {
		fetch('https://playground.4geeks.com/todo/todos/sanx', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				label: tarea,
				is_done: false
			}),
		})
			.then(res => res.json())
			.then(() => getTodos())
			.catch(error => console.error('Error creando tarea:', error));
	};
	//hasta aqui la creacion de tareas

	//eliminar tarea
	const handleDelete = (id) => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: 'DELETE'
		})
			.then(() => getTodos())
			.catch(error => console.error('Error al borrar tarea:', error));
	};
	//hasta aqui la eliminacion de tareas

	//eliminar todas las tareas
	const clearAll = () => {
		const deletePromises = tareas.map(t =>
			fetch(`https://playground.4geeks.com/todo/todos/${t.id}`, {
				method: 'DELETE'
			})
		);

		Promise.all(deletePromises)
			.then(() => getTodos())
			.catch(error => console.error('Error al limpiar todo:', error));
	};
	//hasta aqui la eliminacion de todas las tareas


	useEffect(() => {
		createUser();
		getTodos()
	}, []);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && input) {
			// Validamos si 'tareas' es un array antes de llamar a 'find'
			if (Array.isArray(tareas) && !tareas.find(t => t.label === input)) {
				createTodo(input);
				setInput("");
			} else if (!Array.isArray(tareas)) {
				console.error('Error: "tareas" no es un array.');
			}
		}
	};

	return (
		<div className="container">
			<div className="TodoList">
				<div className="Title">ToDo's</div>
				<div className="form-control">
					<input
						type="text"
						className="CustomInput"
						placeholder="¿Qué hay que hacer?"
						onChange={(e) => setInput(e.target.value)}
						value={input}
						onKeyDown={(e) => handleKeyDown(e)}
					/>
					{/*<button onClick={handleClick}>Send</button>*/}
					<ul>
						{Array.isArray(tareas) && tareas.map((tarea) => (
							<li key={tarea.id} className="d-flex justify-content-between align-items-center">
								<span>{tarea.label}</span>
								<button className="btn btn-sm CustomButton" onClick={() => handleDelete(tarea.id)}><i className="bi bi-x"></i></button>
							</li>
						))}
					</ul>
					{tareas.length > 0 && (
						<button className="btn DeleteButton" onClick={clearAll}>
							Eliminar todas
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;