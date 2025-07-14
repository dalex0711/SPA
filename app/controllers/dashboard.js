import { btnLogout } from '../services/logout';
import { validateInputs } from '../services/validations';
import { apiRequest } from '../api/request';
import { showMessage } from '../services/messages';

let editingId = null;

// Main entry point for dashboard logic
export async function init() {
  btnLogout();

  const createEvent = document.querySelector('#create-event-btn');
  const formEvent = document.querySelector('#f-create-event');
  const tbody = document.querySelector('#table-body');

  await renderEvents(tbody, formEvent);

  // Show form in creation mode
  createEvent.addEventListener('click', () => {
    showMessage('Form enabled', 'info');
    formEvent.style.display = 'block';
    formEvent.reset();
    editingId = null; // Reset editing mode
  });

  setupFormEvent(formEvent, tbody);
}

// Handles form submission for both create and update
function setupFormEvent(formEvent, tbody) {
  formEvent?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#nameEvent').value;
    const capacity = document.querySelector('#capacity').value;

    validateInputs(name, capacity);
    if (isNaN(capacity) || capacity <= 0) {
      showMessage('Enter a valid number', 'error');
      return;
    }

    if (!editingId) {
      // Prevent creating duplicated event names
      const eventsFound = await apiRequest('GET', `events?name=${name}`);
      if (eventsFound.length > 0) {
        showMessage('This event already exists', 'error');
        return;
      }
    }

    try {
      if (editingId) {
        // Edit mode
        await apiRequest('PUT', `events/${editingId}`, { name, capacity });
        showMessage('Event updated successfully', 'success');
      } else {
        // Create new event
        await apiRequest('POST', 'events', { name, capacity });
        showMessage('Event created successfully', 'success');
      }

      formEvent.reset();
      formEvent.style.display = 'none';
      editingId = null;
      await renderEvents(tbody, formEvent);

    } catch (error) {
      showMessage('Failed to save data', 'error');
    }
  });
}

// Renders the table with event data and setup buttons
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

    // Handle deletion
    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm('¿Deseas eliminar este curso?');
      if (!confirmDelete) return;

      try {
        await apiRequest('DELETE', `events/${event.id}`);
        showMessage('Event deleted successfully', 'success');
        await renderEvents(tbody, formEvent);
      } catch (error) {
        showMessage('Failed to delete event', 'error');
      }
    });

    // Handle editing
    const editBtn = row.querySelector('.edit-btn');
    editBtn.addEventListener('click', async () => {
      try {
        const oldData = await apiRequest('GET', `events/${event.id}`);

        formEvent.style.display = 'block';
        document.querySelector('#nameEvent').value = oldData.name;
        document.querySelector('#capacity').value = oldData.capacity;
        editingId = event.id;

        showMessage('Edit mode enabled', 'info');
      } catch (error) {
        showMessage('Failed to load event data', 'error');
      }
    });
  });
}
