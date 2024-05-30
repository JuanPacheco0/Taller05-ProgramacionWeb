document.addEventListener('DOMContentLoaded', () => {
    const calendarView = document.getElementById('calendarView');
    const monthYear = document.getElementById('monthYear');
    const eventForm = document.getElementById('eventForm');
    const addEventForm = document.getElementById('addEventForm');
    const deleteEventButton = document.getElementById('deleteEvent');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let editingEventIndex = null;

    const renderCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDate();

        monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;

        calendarView.innerHTML = '';

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            calendarView.appendChild(emptyDiv);
        }

        for (let i = 1; i <= lastDayIndex; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;

            const dayEvents = events.filter(event => new Date(event.date).toDateString() === new Date(currentYear, currentMonth, i).toDateString());
            dayEvents.forEach((event, index) => {
                const eventDiv = document.createElement('div');
                eventDiv.textContent = event.description;
                eventDiv.classList.add('event');
                eventDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEventForm(i, index);
                });
                dayDiv.appendChild(eventDiv);
            });

            dayDiv.addEventListener('click', () => openEventForm(i));
            calendarView.appendChild(dayDiv);
        }
    };

    const openEventForm = (day, eventIndex = null) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        document.getElementById('eventDate').value = selectedDate.toISOString().substr(0, 10);
        if (eventIndex !== null) {
            editingEventIndex = eventIndex;
            const event = events[eventIndex];
            document.getElementById('formTitle').textContent = "Editar Evento";
            document.getElementById('eventTime').value = event.time;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventParticipants').value = event.participants;
            deleteEventButton.style.display = 'block';
        } else {
            editingEventIndex = null;
            document.getElementById('formTitle').textContent = "Nuevo Evento";
            addEventForm.reset();
            deleteEventButton.style.display = 'none';
        }
        eventForm.style.display = 'block';
    };

    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventParticipants = document.getElementById('eventParticipants').value;

        const event = {
            date: eventDate,
            time: eventTime,
            description: eventDescription,
            participants: eventParticipants
        };

        if (editingEventIndex !== null) {
            events[editingEventIndex] = event;
        } else {
            events.push(event);
        }

        localStorage.setItem('events', JSON.stringify(events));

        eventForm.style.display = 'none';
        renderCalendar();
    });

    deleteEventButton.addEventListener('click', () => {
        if (editingEventIndex !== null) {
            events.splice(editingEventIndex, 1);
            localStorage.setItem('events', JSON.stringify(events));
            eventForm.style.display = 'none';
            renderCalendar();
        }
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('next').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();
});
