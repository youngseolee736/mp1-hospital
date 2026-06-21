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

  const naverMapElement = document.getElementById('naver-map');
  if (naverMapElement && window.naver?.maps) {
    const fallbackCenter = new naver.maps.LatLng(36.9917, 127.0888);
    const hospitalAddress = '105, Jungang-ro, Pyeongtaek-si, Gyeonggi-do, Korea';
    const map = new naver.maps.Map(naverMapElement, {
      center: fallbackCenter,
      zoom: 16,
      minZoom: 12,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      }
    });

    const setHospitalMarker = (position) => {
      const marker = new naver.maps.Marker({
        position,
        map,
        title: 'Yonsei Dawoom Hospital'
      });
      const infoWindow = new naver.maps.InfoWindow({
        content: '<div class="naver-map-info"><strong>Yonsei Dawoom Hospital</strong><br />105, Jungang-ro, Pyeongtaek-si</div>'
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });

      map.setCenter(position);
      naverMapElement.classList.add('is-loaded');
    };

    if (naver.maps.Service?.geocode) {
      naver.maps.Service.geocode({ query: hospitalAddress }, (statusCode, response) => {
        const firstResult = response?.v2?.addresses?.[0];

        if (statusCode === naver.maps.Service.Status.OK && firstResult) {
          setHospitalMarker(new naver.maps.LatLng(Number(firstResult.y), Number(firstResult.x)));
          return;
        }

        setHospitalMarker(fallbackCenter);
      });
    } else {
      setHospitalMarker(fallbackCenter);
    }
  }

  const facilityGallery = document.querySelector('.facility-gallery');
  const facilityImage = document.querySelector('.facility-gallery-image');
  const facilityFloor = document.querySelector('.facility-gallery-floor');
  const facilityTitle = document.querySelector('.facility-gallery-caption h3');
  const facilityDescription = document.querySelector('.facility-gallery-caption div p');
  const facilityPrev = document.querySelector('[data-gallery-prev]');
  const facilityNext = document.querySelector('[data-gallery-next]');
  const facilitySlides = [
    {
      floor: 'EXT',
      title: 'Hospital Exterior',
      description: 'Main hospital building in Pyeongtaek.',
      image: 'images/hospital-view.jpg',
      alt: 'Yonsei Dawoom Hospital exterior in Pyeongtaek'
    },
    {
      floor: '1F',
      title: 'Main Reception Desk',
      description: 'Check in for outpatient visits, appointments, and patient guidance.',
      image: 'images/1st floor- reception.jpg',
      alt: 'Main reception desk on the first floor'
    },
    {
      floor: '2F',
      title: 'Operating Room',
      description: 'A surgical space prepared for orthopedic procedures and patient safety.',
      image: 'images/2nd floor- operation room.jpg',
      alt: 'Operating room on the second floor'
    },
    {
      floor: 'B1F',
      title: 'MRI Room',
      description: 'Diagnostic imaging support for spine, joint, and orthopedic care.',
      image: 'images/B1- MRI.jpg',
      alt: 'MRI room on basement level one'
    },
    {
      floor: 'B1F',
      title: 'Physical Therapy Room',
      description: 'Therapy equipment and treatment spaces for rehabilitation and pain care.',
      image: 'images/pelvic-floor-therapy.png',
      alt: 'Physical therapy equipment room'
    },
    {
      floor: '5F',
      title: 'Physical Rehabilitation Room',
      description: 'A bright rehabilitation area for guided movement and recovery support.',
      image: 'images/5th floor-phsyical rehab.jpg',
      alt: 'Physical rehabilitation room on the fifth floor'
    },
    {
      floor: '4F',
      title: 'International Healthcare Center',
      description: 'Visit guidance and support for international patients and regional visitors.',
      image: 'images/4th floorinternational-center.jpg',
      alt: 'International Healthcare Center reception area'
    }
  ];

  if (facilityGallery && facilityImage && facilityFloor && facilityTitle && facilityDescription) {
    let facilityIndex = 0;
    let facilityTimer;

    const showFacilitySlide = (nextIndex) => {
      facilityIndex = (nextIndex + facilitySlides.length) % facilitySlides.length;
      const slide = facilitySlides[facilityIndex];

      facilityImage.src = slide.image;
      facilityImage.alt = slide.alt;
      facilityFloor.textContent = slide.floor;
      facilityTitle.textContent = slide.title;
      facilityDescription.textContent = slide.description;
    };

    const startFacilityTimer = () => {
      window.clearInterval(facilityTimer);
      facilityTimer = window.setInterval(() => {
        showFacilitySlide(facilityIndex + 1);
      }, 5000);
    };

    const changeFacilitySlide = (direction) => {
      showFacilitySlide(facilityIndex + direction);
      startFacilityTimer();
    };

    facilityPrev?.addEventListener('click', () => changeFacilitySlide(-1));
    facilityNext?.addEventListener('click', () => changeFacilitySlide(1));
    facilityGallery.addEventListener('mouseenter', () => window.clearInterval(facilityTimer));
    facilityGallery.addEventListener('mouseleave', startFacilityTimer);

    showFacilitySlide(0);
    startFacilityTimer();
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
