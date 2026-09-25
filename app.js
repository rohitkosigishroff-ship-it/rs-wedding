(function () {
  const eventMarkup = (event) => {
    const theme = eventThemes[event.category];
    return `
      <a class="event-card theme-${event.category}" href="event.html?event=${encodeURIComponent(event.id)}" aria-label="View details for ${event.title}">
        <div class="event-time"><time>${event.time}</time><span>${theme.symbol}</span></div>
        <div class="event-card-body">
          <p class="event-type">${theme.label}</p>
          <h3>${event.title}</h3>
          <p>${event.venue}</p>
        </div>
        <span class="event-arrow" aria-hidden="true">→</span>
      </a>`;
  };

  const journeyList = document.querySelector("#journey-list");
  if (journeyList) {
    const days = [...new Set(weddingEvents.map((event) => event.day))];
    journeyList.innerHTML = days.map((day) => {
      const events = weddingEvents.filter((event) => event.day === day);
      return `
        <div class="day-schedule">
          <div class="day-marker"><strong>${day}</strong><span>2026</span></div>
          <div class="events-grid">${events.map(eventMarkup).join("")}</div>
        </div>`;
    }).join("");
  }

  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const target = new Date("2026-12-30T07:55:00+05:30").getTime();
    const fields = {
      days: countdown.querySelector("[data-days]"),
      hours: countdown.querySelector("[data-hours]"),
      minutes: countdown.querySelector("[data-minutes]"),
      seconds: countdown.querySelector("[data-seconds]")
    };
    const updateCountdown = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        countdown.innerHTML = '<p class="countdown-complete">The auspicious hour is here. <br />Celebrate with us!</p>';
        return;
      }
      const seconds = Math.floor(distance / 1000);
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      fields.days.textContent = String(days).padStart(3, "0");
      fields.hours.textContent = String(hours).padStart(2, "0");
      fields.minutes.textContent = String(minutes).padStart(2, "0");
      fields.seconds.textContent = String(seconds % 60).padStart(2, "0");
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const eventContent = document.querySelector("#event-content");
  if (eventContent) {
    const id = new URLSearchParams(window.location.search).get("event");
    const event = weddingEvents.find((item) => item.id === id);
    if (!event) {
      eventContent.innerHTML = `
        <section class="not-found section">
          <p class="eyebrow">Celebration details</p>
          <h1>That event could not be found.</h1>
          <p>Please return to the complete celebration plan and select an event.</p>
          <a class="button button-dark" href="index.html#journey">View all celebrations</a>
        </section>`;
    } else {
      const theme = eventThemes[event.category];
      document.title = `${event.title} | Rohit & Shreya`;
      const map = event.map
        ? `<a class="button button-outline" href="${event.map}" target="_blank" rel="noopener">${event.mapLabel} <span aria-hidden="true">↗</span></a>`
        : `<span class="status-pill large">${event.venue}</span>`;
      eventContent.innerHTML = `
        <section class="event-hero theme-${event.category}">
          <div class="event-hero-art" aria-hidden="true">${theme.symbol}</div>
          <div class="event-hero-copy">
            <p class="eyebrow">${event.date}</p>
            <p class="event-theme-label">${theme.label}</p>
            <h1>${event.title}</h1>
            <p class="event-summary">${event.summary}</p>
          </div>
          <div class="event-stamp"><strong>${event.time}</strong><span>${event.venue}</span></div>
        </section>
        <section class="event-details section">
          <div class="detail-main">
            <p class="eyebrow">At a glance</p>
            <h2>Everything you need for this moment</h2>
            <ul class="detail-list">${event.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
            <div class="detail-actions">${map}</div>
          </div>
          <aside class="help-panel">
            <p class="eyebrow">Need a hand?</p>
            <h3>We are only a call away.</h3>
            <p>For any questions about the wedding schedule, venues, events or travel.</p>
            <a href="tel:+919866581502">Call Raghunath · +91 98665 81502</a>
          </aside>
        </section>`;
    }
  }
})();
