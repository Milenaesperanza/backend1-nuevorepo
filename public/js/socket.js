const socket = io();

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const renderServices = (services) => {
  const list = document.querySelector('#services-list');
  if (!list) return;

  const isGrid = list.classList.contains('availability-grid');
  const isRealtimeProducts = list.dataset.realtimeProducts === 'true';
  list.innerHTML = services.map((service) => {
    const id = escapeHtml(service.id);
    const name = escapeHtml(service.name);
    const description = escapeHtml(service.description);
    const available = Boolean(service.available);
    const label = available ? 'Disponible' : 'No disponible';
    const stateClass = available ? 'is-available' : 'is-unavailable';

    if (isGrid) {
      return `<article class="service-card" data-service-row="${id}">
        <h3>${name}</h3><p>${description}</p>
        <span class="status ${available ? 'status-available' : 'status-unavailable'}">${label}</span>
        <button class="availability-button ${stateClass}" data-service-id="${id}" data-available="${available}" type="button">Cambiar estado</button>
      </article>`;
    }

    return `<tr data-service-row="${id}"><td>${id}</td><td>${name}</td><td>${description}</td>
      <td>${escapeHtml(service.duration)} min</td><td>$${escapeHtml(service.price)}</td>
      <td>${escapeHtml(service.category)}</td><td>
      <button class="availability-button ${stateClass}" data-service-id="${id}" data-available="${available}" type="button">${label}</button>
      ${isRealtimeProducts ? `<button class="delete-button" data-delete-service-id="${id}" type="button">Eliminar</button>` : ''}
      </td></tr>`;
  }).join('');
};

socket.on('services:updated', renderServices);
socket.on('server:error', ({ message }) => window.alert(message));

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-service-id]');
  if (!button) return;

  const available = button.dataset.available === 'true';
  button.disabled = true;
  socket.emit('service:toggle-availability', {
    id: button.dataset.serviceId,
    available: !available,
  }, (result) => {
    if (!result?.ok) window.alert(result?.error ?? 'No se pudo actualizar el servicio.');
    button.disabled = false;
  });
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('#service-form');
  if (!form) return;
  event.preventDefault();

  const formData = new FormData(form);
  const service = {
    name: formData.get('name'),
    description: formData.get('description'),
    duration: Number(formData.get('duration')),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    available: true,
  };

  socket.emit('service:create', service, (result) => {
    if (!result?.ok) window.alert(result?.error ?? 'No se pudo crear el servicio.');
    else form.reset();
  });
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-service-id]');
  if (!button) return;

  socket.emit('service:delete', { id: button.dataset.deleteServiceId }, (result) => {
    if (!result?.ok) window.alert(result?.error ?? 'No se pudo eliminar el servicio.');
  });
});
