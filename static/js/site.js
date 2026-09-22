(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    // navbar
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // faq
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        q.parentElement.classList.toggle('open');
      });
    });

    // attendees
    const attendeesSection = document.querySelector('.attendees-section');
    if (attendeesSection) {
      const container = attendeesSection.querySelector('.attendees-container');
      const apiUrl = 'https://api.evand.com/events/birjandlug-sfd1404/attendees/public?per_page=100';

      // recursive fetch to handle pagination
      async function fetchAllAttendees(url, all = []) {
        try {
          const res = await fetch(url);
          const body = await res.json();

          const attendees = body.data || [];
          all.push(...attendees);

          const pagination = body.meta?.pagination;
          if (pagination?.links?.next) {
            return fetchAllAttendees(pagination.links.next, all);
          }

          return all;
        } catch (err) {
          return all;
        }
      }

      fetchAllAttendees(apiUrl)
        .then(attendees => {
          let MAX_VISIBLE;
          const clientWidth = document.querySelector("body").clientWidth;
          if (clientWidth < 350) MAX_VISIBLE = 15;
            else if (clientWidth < 650) MAX_VISIBLE = 20;
           else if (clientWidth < 850) MAX_VISIBLE = 28;
          else MAX_VISIBLE = 32;

          attendees.reverse().forEach((attendee, index) => {
            const div = document.createElement('div');
            div.className = 'attendee';
            div.setAttribute('data-name', `${attendee.first_name} ${attendee.last_name || ''}`);

            const img = document.createElement('img');
            img.src = `https://gravatar.com/avatar/${attendee.email_md5}?s=60&d=retro`;
            img.alt = `${attendee.first_name} ${attendee.last_name || ''}`;
            div.appendChild(img);

            if (index >= MAX_VISIBLE) {
              div.classList.add('hidden');
            }
            container.appendChild(div);
          });

          if (attendees.length > MAX_VISIBLE) {
            let expanded = false;
            const hiddenCount = attendees.length - MAX_VISIBLE;

            const btn = document.createElement('button');
            btn.textContent = `+${hiddenCount} نفر دیگر`;
            btn.className = 'show-more-btn';

            btn.addEventListener('click', () => {
              expanded = !expanded;
              const allAttendees = container.querySelectorAll('.attendee');
              container.classList.toggle('collapsed');
              allAttendees.forEach((el, i) => {
                if (i >= MAX_VISIBLE) {
                  el.classList.toggle('hidden', !expanded);
                }
              });

              btn.textContent = expanded
                ? `${attendees.length} نفر شرکت کرده‌اند`
                : `+${hiddenCount} نفر دیگر`;
            });

            attendeesSection.appendChild(btn);
          }
        })
        .catch(() => {
          container.innerHTML = '<p>خطا در بارگذاری.</p>';
        });
    }




    // countdown
    const countdownEl = document.querySelector('.countdown-bar');
    if (!countdownEl) return;
    const targetDate = new Date(countdownEl.getAttribute('data-target-date'));
    const liveBadge = document.getElementById('liveBadge');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const canvas = document.getElementById("canvas");
    const countdownTitle = document.querySelector(".countdown-title");

    function padFa(n) {
      return n.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
    }

    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;

      // جشن شروع شده
      if (diff <= 0) {
        const diffSinceStart = now - targetDate;
        if (diffSinceStart < 4 * 60 * 60 * 1000) {
          document.getElementById('timer').style.display = 'none';
          liveBadge.style.display = 'flex';
          liveBadge.textContent = '🎉 جشن درحال برگزاری است';
          canvas.classList.remove("canvas_hidden")
          countdownTitle.style.display = "none";
        } else {
          document.getElementById('timer').style.display = 'none';
          liveBadge.style.display = 'flex';
          liveBadge.textContent = '✨ جشن تمام شد، سال بعد میبینیمتون';
          canvas.classList.add("canvas_hidden")
          countdownTitle.style.display = "none";
        }
        return;
      }

      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff / 36e5) % 24;
      const m = Math.floor(diff / 6e4) % 60;
      const s = Math.floor(diff / 1e3) % 60;

      daysEl.textContent = padFa(d);
      hoursEl.textContent = padFa(h);
      minutesEl.textContent = padFa(m);
      secondsEl.textContent = padFa(s);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    var tabNav = document.querySelector('.media-tabs');
    if (tabNav) {
      var tabs = tabNav.querySelectorAll('[data-tab]');
      var panels = [];
      tabs.forEach(function (tab) {
        var panel = document.getElementById(tab.getAttribute('data-tab'));
        if (panel) panels.push(panel);
      });
      if (panels.length) {
        panels.slice(1).forEach(function (panel) {
          panel.hidden = true;
        });
        tabNav.addEventListener('click', function (e) {
          var tab = e.target.closest('[data-tab]');
          if (!tab) return;
          e.preventDefault();
          var targetId = tab.getAttribute('data-tab');
          tabs.forEach(function (t) {
            t.classList.toggle('active', t === tab);
          });
          panels.forEach(function (panel) {
            panel.hidden = panel.id !== targetId;
          });
        });
      }
    }
  });
})();

function copyToClipboard(el) {
  const text = el.getAttribute('data-copy');
  navigator.clipboard.writeText(text).then(() => {
    alert('کپی شد!');
  });
}
