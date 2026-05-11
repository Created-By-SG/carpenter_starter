(function () {
  function byId(id) { return document.getElementById(id); }

  function updateScrollBar() {
    var bar = byId('scrollBar');
    if (!bar) return;
    var h = document.body.scrollHeight - window.innerHeight;
    if (h > 0) bar.style.transform = 'scaleX(' + (window.scrollY / h) + ')';
  }
  window.addEventListener('scroll', updateScrollBar, { passive: true });
  updateScrollBar();

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up').forEach(function (el) {
    revealObserver.observe(el);
  });

  window.openModal = function () {
    var modal = byId('modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function (e) {
    var modal = byId('modal');
    if (!modal) return;
    if (!e || e.target === modal || e.target.closest('.modal-close') || e.target.closest('.btn-secondary')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.toggleFaq = function (btn) {
    var item = btn && btn.parentElement;
    if (!item) return;
    var wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item.active').forEach(function (active) {
      active.classList.remove('active');
    });
    if (!wasActive) item.classList.add('active');
  };

  window.toggleBottomMenu = function () {
    var wrapper = byId('mobileDropdownWrapper');
    var btn = byId('mobileMenuToggle');
    if (!wrapper || !btn) return;
    wrapper.classList.toggle('active');
    btn.classList.toggle('active');
  };

  window.scrollToSection = function (id) {
    var el = byId(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    var wrapper = byId('mobileDropdownWrapper');
    var btn = byId('mobileMenuToggle');
    if (wrapper) wrapper.classList.remove('active');
    if (btn) btn.classList.remove('active');
  };

  var testimonialsScroll = byId('testimonialsScroll');
  window.scrollTestimonials = function (dir) {
    if (!testimonialsScroll) return;
    var card = testimonialsScroll.querySelector('.testimonial-card');
    if (!card) return;
    testimonialsScroll.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' });
  };

  document.querySelectorAll('[data-ba-slider]').forEach(function (slider) {
    var afterLayer = slider.querySelector('.ba-after');
    var handle = slider.querySelector('.ba-handle');
    if (!afterLayer || !handle) return;
    var isDragging = false;

    function updateSlider(clientX) {
      var rect = slider.getBoundingClientRect();
      var x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      var percent = (x / rect.width) * 100;
      afterLayer.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
      handle.style.left = percent + '%';
    }

    function start(e) {
      isDragging = true;
      updateSlider(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function move(e) {
      if (!isDragging) return;
      updateSlider(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function end() { isDragging = false; }

    slider.addEventListener('mousedown', start);
    slider.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
  });
})();
