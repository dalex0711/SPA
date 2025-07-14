import { btnLogout } from '../services/logout.js';
import { apiRequest } from '../api/request.js';
import { getUserLogged } from '../services/storage.js';
// import { showMessage } from '../services/messages.js'; // Descomenta si usas showMessage

let allEvents = []; // store all Events in memory

async function renderEvents(events) {
  const container = document.getElementById('events-container');
  const template = document.getElementById('event-template');
  const user = getUserLogged();
  const enrollments = await apiRequest('GET', 'enrollments');

  container.innerHTML = '';

  for (const event of events) {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.event-name').textContent = event.name;
    clone.querySelector('.event-capacity').textContent = `Capacity: ${event.capacity}`;

    const btn = clone.querySelector('.btn-action');
    const eventId = event.id;

    const alreadyEnrolled = enrollments.some(enr =>
      enr.userId === user.id && enr.eventId === eventId
    );

    if (alreadyEnrolled) {
      btn.textContent = 'Unenroll';
      btn.addEventListener('click', async () => {
        const found = enrollments.find(e =>
          e.userId === user.id && e.eventId === eventId
        );

        if (!found) {
          alert('You are not enrolled in this event.');
          return;
        }

        await apiRequest('DELETE', `enrollments/${found.id}`);
        const updatedCapacity = Number(event.capacity) + 1;
        await apiRequest('PATCH', `events/${eventId}`, {
          capacity: String(updatedCapacity)
        });

        alert(`Unenrolled from ${event.name}`);
        await renderEvents(allEvents);
      });

    } else {
      btn.textContent = 'Enroll';
      btn.addEventListener('click', async () => {
        if (Number(event.capacity) <= 0) {
          alert('No available slots.');
          return;
        }

        await apiRequest('POST', 'enrollments', {
          userId: user.id,
          eventId
        });

        const updatedCapacity = Number(event.capacity) - 1;
        await apiRequest('PATCH', `events/${eventId}`, {
          capacity: String(updatedCapacity)
        });

        alert(`Enrolled in ${event.name}`);
        await renderEvents(allEvents);
      });
    }

    container.appendChild(clone);
  }
}

async function renderUserEvents() {
  const user = getUserLogged();
  if (!user) return;

  const enrollments = await apiRequest('GET', 'enrollments');
  const userEnrollments = enrollments.filter(e => e.userId === user.id);

  const myEvents = allEvents.filter(c =>
    userEnrollments.some(e => e.eventId === c.id)
  );

  const container = document.getElementById('events-container');
  if (myEvents.length === 0) {
    container.innerHTML = `<p>You are not enrolled in any Events yet.</p>;`
    return;
  }

  await renderEvents(myEvents);
}

export async function init() {
  btnLogout();

  allEvents = await apiRequest('GET', 'events');
  await renderEvents(allEvents);

  document.getElementById('view-my-events')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderUserEvents();
  });
}