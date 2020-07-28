//Validar datos al pulsal el boton button y quitar evento defecto formulario
const form = document.getElementById('form'); //Formulario
const button = document.getElementById('button'); //Boton enviar formulario
const error = document.getElementById('error'); //Espacio para escribir los errores de la validacion del formulario
const text = document.getElementById('text'); //Espacio para escribir las tareas guardadas

//Objeto guaradar las tareas
const task = {
	id: '',
	name: '',
	color: '',
	date: ''
};

//Desactivamos el envio por defecto
form.addEventListener('submit', (e) => {
	e.preventDefault();
});

//Al pulsar el boton de guardar
button.addEventListener('click', (e) => {
	//Validamos los campos del formulario
	const objValidate = {
		task: false,
		color: false,
		date: false
	};
	let msgerror = '';
	if (form.task.value == '') {
		objValidate.task = false;
		msgerror = '<p>No has introducido la tarea</p>';
	} else {
		objValidate.task = true;
	}
	if (form.color.value == '') {
		objValidate.color = false;
		msgerror += '<p>No has seleccionado ningún color</p>';
	} else {
		objValidate.color = true;
	}

	if (form.date.value == '') {
		objValidate.date = false;
		msgerror += '<p>No has introducido una fecha<p>';
	} else if (new Date(form.date.value) < new Date()) {
		objValidate.date = false;
		msgerror += '<p>La fecha introducida es anterior a la actual<p>';
	} else {
		objValidate.date = true;
	}
	error.innerHTML = msgerror;

	//Si todos los campor estan validados, guardamos la tarea, y la dibujamos
	if (validateForm(objValidate)) {
		saveTask();
		renderTasks();
	}
});

//Funcion para validar un objeto
const validateForm = (objetovalidar) => {
	const formValues = Object.values(objetovalidar);
	const valid = formValues.findIndex((value) => value == false);
	if (valid == -1) return 'true';
	else return false;
};

//Funcion para guardar la tarea
const saveTask = () => {
	//Generamos un id aleateorio y guardamos los datos del formulario en el objeto
	task.id = Math.random().toString(16).substring(2);
	task.name = form.task.value;
	task.color = form.color.value;
	task.date = form.date.value;
	//Guardamos el objeto en localStorage
	localStorage.setItem(task.id, JSON.stringify(task));
};

//Dibujar las tareas
const renderTasks = () => {
	//Borramos las que haya dibujadas
	text.innerHTML = '';
	//Almacenamos las tareas guardadas en un array
	const arrayStorage = Object.values(localStorage);
	const fragment = document.createDocumentFragment();
	//Recorremos el array de tareas
	arrayStorage.forEach((element) => {
		const tasks = JSON.parse(element);
		//Recuperamos cada una de las tareas
		const storageTask = JSON.parse(localStorage.getItem(tasks.id));
		//Si la tarea tiene una fecha posterior a la de hoy, la dibujamos
		if (new Date(storageTask.date).getTime() >= new Date().getTime()) {
			//Dibujamos el contador de la tarea
			const htmlCountDown = printCountDown(storageTask.date).html;
			//Creamos todos los elementos para dibujar la tarea
			const div = document.createElement('DIV');
			div.setAttribute('class', `text__tasks ${storageTask.color}`);

			const p = document.createElement('P');
			p.textContent = storageTask.name;

			const pCountDown = document.createElement('P');
			pCountDown.classList.add('countdown');
			pCountDown.innerHTML = htmlCountDown;
			//Cada segundo dibujamos el contador de cada tarea
			const interval = setInterval(() => {
				pCountDown.innerHTML = printCountDown(storageTask.date).html;

				if (new Date(storageTask.date).getTime() <= new Date().getTime()) {
					clearInterval(interval);
				}
			}, 1000);

			const i = document.createElement('I');
			i.setAttribute('class', 'fas fa-times');
			i.setAttribute('id', storageTask.id);

			div.append(p);
			div.append(pCountDown);
			div.append(i);
			fragment.append(div);
		}
	});
	text.append(fragment);
};

//Funcion para borrar una tarea
const removeTask = (id) => {
	localStorage.removeItem(id);
	renderTasks();
};

//Funcion para generar la cuenta atras
const generateCountDown = (finishDate) => {
	const now = new Date();
	const remainTime = (new Date(finishDate) - now + 1000) / 1000;
	const remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2);
	const remainMinutes = ('0' + (Math.floor(remainTime / 60) % 60)).slice(-2);
	const remainHours = ('0' + (Math.floor(remainTime / 3600) % 24)).slice(-2);
	const remainDays = Math.floor(remainTime / (3600 * 24));
	return {
		remainSeconds,
		remainMinutes,
		remainHours,
		remainDays,
		remainTime
	};
};

//Funcion para imprimir la cuanta atras
const printCountDown = (finishDate) => {
	const countDown = generateCountDown(finishDate);
	return {
		html: `<span>${countDown.remainDays}</span>
        <span>${countDown.remainHours}</span>
        <span>${countDown.remainMinutes}</span>
        <span>${countDown.remainSeconds}</span>
        <span>D</span>
        <span>H</span>
        <span>M</span>
        <span>S</span>`
	};
};

//Si existe alguna tarea guardada en localStorage la dibujamos al cargar la pagina
window.addEventListener('DOMContentLoaded', () => {
	const storage = localStorage;
	if (storage.length > 0) {
		renderTasks();
	}
});

//Evento para eliminar una tarea
text.addEventListener('click', (e) => {
	if (e.target.classList.contains('fas')) {
		removeTask(e.target.id);
	}
});
