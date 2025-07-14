

import { btnLogout } from '../services/logout';
import { validateInputs } from '../services/validations';
import { apiRequest } from '../api/request';
import { showMessage } from '../services/messages';


let editingId = null;

export async function init() {
  btnLogout();

  const createEvent = document.querySelector('#create-event-btn');
  const formEvent = document.querySelector('#f-create-event');
  const tbody = document.querySelector('#table-body');

  await renderEvents(tbody, formEvent);

  createEvent.addEventListener('click', () => {
    showMessage('Formulario habilitado', 'info');
    formEvent.style.display = 'block';
    formEvent.reset();
    editingId = null; 
  });

  setupFormEvent(formEvent, tbody);
}

function setupFormEvent(formEvent, tbody) {
  formEvent?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#nameEvent').value;
    const capacity = document.querySelector('#capacity').value;

    validateInputs(name, capacity);
    if (isNaN(capacity) || capacity <= 0) {
      showMessage('Debes ingresar números válidos', 'error');
      return;
    }

    if (!editingId) {
      const eventsFound = await apiRequest('GET', `events?name=${name}`);
      if (eventsFound.length > 0) {
        showMessage('El curso ya existe', 'error');
        return;
      }
    }

    try {
      if (editingId) {
       
        await apiRequest('PUT',`events${editingId}`,{name,capacity});
        showMessage('Curso actualizado con éxito', 'success');
      } else {
        // Modo creación: crear nuevo evento
        await apiRequest('POST', 'events', {name, capacity});
        showMessage('Curso creado con éxito', 'success');
      }

      formEvent.reset();
      formEvent.style.display = 'none';
      editingId = null; 
      await renderEvents(tbody, formEvent); 

    } catch (error) {
      showMessage('Error al guardar los datos', 'error');
      console.error(error);
    }
  });
}

async function renderEvents(tbody, formEvent) {
  tbody.innerHTML = '';

  const events = await apiRequest('GET', 'events');

  events.forEach((event) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${event.id}</td>
      <td>${event.name}</td>
      <td>${event.capacity}</td>
      <td>
        <button class="edit-btn" data-id="${event.id}">Editar</button>
        <button class="delete-btn" data-id="${event.id}">Eliminar</button>
      </td>
    `;

    tbody.appendChild(row);


    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm('¿Deseas eliminar este curso?');
      if (!confirmDelete) return;

      try {
        await apiRequest('DELETE', `events/${event.id}`);
        showMessage('Curso eliminado con éxito', 'success');
        await renderEvents(tbody, formEvent);
      } catch (error) {
        showMessage('Error al eliminar el curso.', 'error');
      }
    });


    const editBtn = row.querySelector('.edit-btn');
    editBtn.addEventListener('click', async () => {
      try {
        const oldData = await apiRequest('GET', `events/${event.id}`);

        formEvent.style.display = 'block';
        document.querySelector('#nameEvent').value = oldData.name;
        document.querySelector('#capacity').value = oldData.capacity;
        editingId = event.id; 

        showMessage('Modo edición habilitado', 'info');
      } catch (error) {
        showMessage('Error al cargar datos del curso.', 'error');
      }
    });
  });
}