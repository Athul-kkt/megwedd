/* megWedd — script.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const bars = navToggle.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    bars[0].style.transform = isOpen ? 'translateY(6.5px) rotate(45deg)' : '';
    bars[1].style.opacity   = isOpen ? '0' : '';
    bars[2].style.transform = isOpen ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));


  /* ---- NAV scroll behaviour ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Portfolio tab filter ---- */
  const tabs    = document.querySelectorAll('.tab');
  const items   = document.querySelectorAll('.portfolio-item');

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    items.forEach(item => {
      const match = item.dataset.cat === cat;
      item.classList.toggle('hidden', !match);
      if (match) {
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = 'fadeInUp 0.45s ease forwards';
        });
      }
    });
  }));

  /* ---- Testimonial slider ---- */
  const testimonials = document.querySelectorAll('.testimonial');
  const tDots        = document.querySelectorAll('.t-dot');
  let tIndex         = 0;
  let tTimer;

  function showTestimonial(idx) {
    testimonials.forEach((t, i) => t.classList.toggle('active', i === idx));
    tDots.forEach((d, i)        => d.classList.toggle('active', i === idx));
    tIndex = idx;
  }

  function nextTestimonial() { showTestimonial((tIndex + 1) % testimonials.length); }
  function prevTestimonial() { showTestimonial((tIndex - 1 + testimonials.length) % testimonials.length); }

  function startTTimer() { tTimer = setInterval(nextTestimonial, 6000); }

  showTestimonial(0);
  startTTimer();

  document.getElementById('tNext').addEventListener('click', () => { clearInterval(tTimer); nextTestimonial(); startTTimer(); });
  document.getElementById('tPrev').addEventListener('click', () => { clearInterval(tTimer); prevTestimonial(); startTTimer(); });
  tDots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(tTimer); showTestimonial(i); startTTimer(); }));

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(
    '.story, .philosophy-inner, .portfolio-grid, .testimonial-slider, .inquire-inner, .section-header'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  /* ---- Contact form ---- */
  const form = document.getElementById('inquireForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn     = form.querySelector('button[type="submit"]');
    const name    = document.getElementById('nameField').value.trim();
    const email   = document.getElementById('emailField').value.trim();
    const date    = document.getElementById('dateField').value;
    const venue   = document.getElementById('venueField').value.trim();
    const message = document.getElementById('messageField').value.trim();

    if (!name || !email || !date || !venue) {
      shakeBtn(btn); return;
    }

    // Format the wedding date nicely
    const weddingDate = date
      ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    // Build the pre-filled WhatsApp message
    const waText = [
      `Hi Meg! 👋 I came across megWedd and absolutely love your work.`,
      ``,
      `Here are my wedding details:`,
      `👰 Names: ${name}`,
      `📅 Wedding Date: ${weddingDate}`,
      `📍 Venue / Location: ${venue}`,
      `📧 Email: ${email}`,
      message ? `💬 Message: ${message}` : '',
      ``,
      `Could you please check your availability and share your packages? Thank you! 🙏`
    ].filter(l => l !== null).join('\n');

    const waUrl = `https://wa.me/919447663142?text=${encodeURIComponent(waText)}`;

    btn.textContent = 'Opening WhatsApp…';
    btn.disabled = true;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Show success banner after a short delay
    setTimeout(() => {
      form.innerHTML = `
        <div class="form-success" style="display:block">
          ✅ WhatsApp opened! Your inquiry is pre-filled and ready to send to Meg.
          <br/><br/>Didn't open? <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color:inherit;font-weight:600;text-decoration:underline">Click here to send on WhatsApp →</a>
          <br/><br/>In the meantime, follow the journey on
          <a href="https://www.instagram.com/megwedd.stories" target="_blank" style="color:inherit;font-weight:600">@megwedd.stories</a>.
        </div>`;
    }, 800);
  });

  function shakeBtn(btn) {
    btn.style.animation = 'none';
    btn.offsetHeight; // reflow
    btn.style.animation = 'shake 0.4s ease';
  }

  /* ---- WhatsApp FAB pulse on idle ---- */
  const fab = document.getElementById('whatsappFab');
  let idleTimer = setTimeout(() => fab.classList.add('pulse'), 8000);
  document.addEventListener('scroll', () => {
    clearTimeout(idleTimer);
    fab.classList.remove('pulse');
    idleTimer = setTimeout(() => fab.classList.add('pulse'), 12000);
  }, { passive: true });

  /* ---- Keyboard navigation for hero ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { clearInterval(heroTimer); showSlide((heroIndex - 1 + heroImgs.length) % heroImgs.length); startHeroTimer(); }
    if (e.key === 'ArrowRight') { clearInterval(heroTimer); nextHeroSlide(); startHeroTimer(); }
  });

  /* ---- Touch swipe for testimonials ---- */
  let touchX = 0;
  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      clearInterval(tTimer);
      diff > 0 ? nextTestimonial() : prevTestimonial();
      startTTimer();
    }
  });

});
