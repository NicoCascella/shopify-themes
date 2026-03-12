/* ============================================================
   LEONE PASTICCERIA — Theme JavaScript
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky header ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const hamburger   = document.querySelector('.hamburger');
  const mobileNav   = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav__close');

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Fade-in on scroll ── */
  const fadels = document.querySelectorAll('.fade-in');
  if (fadels.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadels.forEach((el) => io.observe(el));
  } else {
    fadels.forEach((el) => el.classList.add('visible'));
  }

  /* ── Product gallery thumbnails ── */
  const gallery = document.querySelector('.product-gallery');
  if (gallery) {
    const mainImg = gallery.querySelector('.product-gallery__main img');
    const thumbs  = gallery.querySelectorAll('.product-gallery__thumb');

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg) {
          const newSrc = thumb.querySelector('img').src;
          mainImg.style.opacity = '0';
          mainImg.style.transition = 'opacity 0.25s ease';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  /* ── Quantity control ── */
  document.querySelectorAll('.qty-control').forEach((ctrl) => {
    const input    = ctrl.querySelector('.qty-input');
    const btnMinus = ctrl.querySelector('.qty-btn[data-action="minus"]');
    const btnPlus  = ctrl.querySelector('.qty-btn[data-action="plus"]');
    if (!input) return;

    const update = (delta) => {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
    };

    if (btnMinus) btnMinus.addEventListener('click', () => update(-1));
    if (btnPlus)  btnPlus.addEventListener('click',  () => update(1));
  });

  /* ── Variant selector ── */
  const priceEl        = document.getElementById('product-current-price');
  const comparePriceEl = document.getElementById('product-compare-price');
  const atcSubmit      = document.querySelector('.product-atc');

  function formatMoney(cents) {
    return (cents / 100).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
  }

  document.querySelectorAll('.variant-options').forEach((group) => {
    group.querySelectorAll('.variant-option').forEach((option) => {
      option.addEventListener('click', () => {
        if (option.classList.contains('variant-option--unavailable')) return;

        group.querySelectorAll('.variant-option').forEach((o) => o.classList.remove('active'));
        option.classList.add('active');

        const variantId    = option.dataset.variantId || '';
        const price        = parseInt(option.dataset.price, 10);
        const comparePrice = parseInt(option.dataset.comparePrice, 10);
        const available    = option.dataset.available === 'true';

        const hiddenInput = document.getElementById('variant-id');
        if (hiddenInput) hiddenInput.value = variantId;

        if (priceEl && !isNaN(price)) {
          priceEl.textContent = formatMoney(price);
        }

        if (comparePriceEl) {
          if (!isNaN(comparePrice) && comparePrice > price) {
            comparePriceEl.textContent = formatMoney(comparePrice);
            comparePriceEl.style.display = '';
          } else {
            comparePriceEl.style.display = 'none';
          }
        }

        if (atcSubmit) {
          const span = atcSubmit.querySelector('span');
          if (available) {
            atcSubmit.disabled = false;
            if (span) span.textContent = atcSubmit.dataset.addToCartText || span.textContent;
          } else {
            atcSubmit.disabled = true;
            if (span) span.textContent = atcSubmit.dataset.soldOutText || 'Esaurito';
          }
        }
      });
    });
  });

  /* ── Add to cart UX feedback ── */
  const atcBtn = document.querySelector('.product-atc');
  if (atcBtn) {
    atcBtn.addEventListener('click', function () {
      const span    = this.querySelector('span');
      const original = span.textContent;
      span.textContent   = this.dataset.addedText || 'Aggiunto!';
      this.style.pointerEvents = 'none';
      setTimeout(() => {
        span.textContent         = original;
        this.style.pointerEvents = '';
      }, 2200);
    });
  }

  /* ── Active nav link ── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.header-nav a, .mobile-nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
  });

})();
