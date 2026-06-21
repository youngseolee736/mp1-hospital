document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const form = document.getElementById('appointment-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name') || 'patient';
      status.textContent = `Thank you, ${name}. Your appointment request has been received.`;
      form.reset();
    });
  }

  const doctorCards = document.querySelectorAll('.doctor-card[data-doctor]');
  const doctorDetail = document.getElementById('doctor-detail');
  let activeDoctorCard = null;
  const doctorDetails = {
    'dong-min-kang': {
      label: '1 Department',
      title: 'Specialty Care',
      image: 'images/Department1.jpeg',
      imageAlt: '1 Department specialty care information'
    },
    'hyung-ho-kim': {
      label: '2 Department',
      title: 'Specialty Care',
      image: 'images/Department2.jpeg',
      imageAlt: '2 Department specialty care information'
    },
    'geun-soo-lee': {
      label: '3 Department',
      title: 'Specialty Care',
      image: 'images/Department3.jpeg',
      imageAlt: '3 Department specialty care information'
    },
    'yeon-ho-kim': {
      label: '5 Department',
      title: 'Specialty Care',
      image: 'images/Department5.jpeg',
      imageAlt: '5 Department specialty care information'
    },
    'go-wie-kim': {
      label: '6 Department',
      title: 'Specialty Care',
      image: 'images/Department6.jpeg',
      imageAlt: '6 Department specialty care information'
    },
    'won-tae-kim': {
      label: 'Pain Clinic',
      title: 'Specialty Care',
      image: 'images/pain-clinic.jpeg',
      imageAlt: 'Pain Clinic specialty care information'
    }
  };

  const renderDoctorDetail = (doctorId) => {
    if (!doctorDetail || !doctorDetails[doctorId]) return;

    const detail = doctorDetails[doctorId];

    doctorDetail.hidden = false;
    doctorDetail.setAttribute('aria-label', `${detail.label} ${detail.title}`);
    doctorDetail.innerHTML = `
      <div class="doctor-detail-backdrop" data-close-detail></div>
      <div class="doctor-detail-panel">
        <button class="doctor-detail-close" type="button" aria-label="Close doctor details" data-close-detail>&times;</button>
        <img class="doctor-detail-shot" src="${detail.image}" alt="${detail.imageAlt}" />
      </div>
    `;

    doctorCards.forEach((card) => {
      const isSelected = card.dataset.doctor === doctorId;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-pressed', String(isSelected));
      if (isSelected) activeDoctorCard = card;
    });

    requestAnimationFrame(() => {
      doctorDetail.classList.add('is-open');
      doctorDetail.querySelector('.doctor-detail-close')?.focus();
    });
  };

  const closeDoctorDetail = () => {
    if (!doctorDetail || doctorDetail.hidden) return;

    doctorDetail.classList.remove('is-open');
    doctorCards.forEach((card) => {
      card.classList.remove('is-selected');
      card.setAttribute('aria-pressed', 'false');
    });

    window.setTimeout(() => {
      doctorDetail.hidden = true;
      doctorDetail.innerHTML = '';
      activeDoctorCard?.focus();
    }, 220);
  };

  doctorCards.forEach((card) => {
    card.setAttribute('aria-pressed', 'false');

    card.addEventListener('click', () => {
      renderDoctorDetail(card.dataset.doctor);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        renderDoctorDetail(card.dataset.doctor);
      }
    });
  });

  if (doctorDetail) {
    doctorDetail.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-detail]')) {
        closeDoctorDetail();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDoctorDetail();
    }
  });
});
