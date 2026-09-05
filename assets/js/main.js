/* =========================================================
   Cala — interactions
   ========================================================= */
(function () {
  'use strict';

  /* -------------------------------------------------------
     CONFIGURATION
     ---------------------------------------------------------
     ENDPOINT : URL du service qui reçoit le formulaire
     (Formspree, Basin, Netlify Forms, script PHP…).
     Tant qu'il vaut null, le formulaire ouvre le logiciel de
     messagerie du visiteur avec le message pré-rempli.

     VILLE : ville affichée dans le titre principal.
     ------------------------------------------------------- */
  var CONFIG = {
    ENDPOINT: null,                      // ex. 'https://formspree.io/f/xxxxxxx'
    EMAIL: 'contact@cala-chef.fr',
    VILLE: 'Paris'
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Ville dynamique ---------- */
  $$('[data-city]').forEach(function (el) { el.textContent = CONFIG.VILLE; });

  /* ---------- Année du footer ---------- */
  var year = $('#year');
  if (year) { year.textContent = new Date().getFullYear(); }

  /* ---------- Header au scroll + CTA flottant ---------- */
  var header = $('#header');
  var ctaFloat = $('.cta-float');
  var contactSection = $('#contact');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) { header.classList.toggle('is-stuck', y > 20); }

    if (ctaFloat && contactSection) {
      var contactTop = contactSection.getBoundingClientRect().top;
      var show = y > window.innerHeight * 0.6 && contactTop > window.innerHeight * 0.4;
      ctaFloat.classList.toggle('is-visible', show);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = $('#burger');
  var nav = $('#nav');

  function closeNav() {
    if (!nav) { return; }
    nav.classList.remove('is-open');
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      header.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    $$('a', nav).forEach(function (link) { link.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });
  }

  /* ---------- Apparition au scroll ---------- */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-visible'); }, Math.min(i * 70, 280));
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ : une seule réponse ouverte ---------- */
  var faqItems = $$('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) { return; }
      faqItems.forEach(function (other) {
        if (other !== item) { other.open = false; }
      });
    });
  });

  /* ---------- Galerie : lightbox ---------- */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightbox-img');
  var lightboxClose = $('#lightbox-close');
  var lastFocused = null;

  function openLightbox(img) {
    if (!lightbox) { return; }
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function hideLightbox() {
    if (!lightbox || lightbox.hidden) { return; }
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocused) { lastFocused.focus(); }
  }

  $$('.gallery__item img').forEach(function (img) {
    img.parentElement.setAttribute('tabindex', '0');
    img.parentElement.setAttribute('role', 'button');
    img.parentElement.addEventListener('click', function () { openLightbox(img); });
    img.parentElement.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img); }
    });
  });

  if (lightbox) {
    lightboxClose.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { hideLightbox(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hideLightbox(); }
    });
  }

  /* ---------- Images : repli si une photo distante ne charge pas ---------- */
  function markFallback(img) {
    img.classList.add('is-fallback');
    img.removeAttribute('srcset');
    img.src = 'assets/img/placeholder.svg';
  }
  $$('img').forEach(function (img) {
    if (img.dataset.noFallback !== undefined) { return; }
    img.addEventListener('error', function () { markFallback(img); }, { once: true });
    if (img.complete && img.naturalWidth === 0) { markFallback(img); }
  });

  /* ---------- Formulaire de contact ---------- */
  var form = $('#contact-form');
  var status = $('#form-status');

  // message affiché quand un champ obligatoire est vide
  var MESSAGES = {
    nom: 'Merci d’indiquer votre nom.',
    tel: 'Merci d’indiquer un numéro de téléphone.',
    email: 'Merci d’indiquer votre adresse e-mail.',
    ville: 'Merci d’indiquer votre ville ou arrondissement.',
    message: 'Dites-m’en un peu plus sur votre projet.',
    consent: 'Merci de cocher cette case pour être recontacté.'
  };

  // message affiché quand le champ est rempli mais mal formé
  var FORMATS = {
    email: 'Cette adresse e-mail semble incorrecte.',
    tel: 'Ce numéro de téléphone semble incomplet.'
  };

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, msg) {
    var field = fieldOf(input);
    var slot = field ? $('[data-error-for="' + input.id + '"]', field) : null;
    if (field) { field.classList.toggle('is-invalid', Boolean(msg)); }
    if (slot) { slot.textContent = msg || ''; }
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate(input) {
    var value = (input.value || '').trim();
    var msg = '';

    if (input.type === 'checkbox') {
      msg = input.checked ? '' : MESSAGES[input.name];
    } else if (input.required && !value) {
      msg = MESSAGES[input.name] || 'Ce champ est obligatoire.';
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      msg = FORMATS.email;
    } else if (input.name === 'tel' && value && value.replace(/[^0-9+]/g, '').length < 9) {
      msg = FORMATS.tel;
    }

    setError(input, msg);
    return !msg;
  }

  if (form) {
    var controls = $$('input, select, textarea', form);

    controls.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('is-invalid')) { validate(input); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      var invalid = controls.filter(function (input) { return !validate(input); });
      if (invalid.length) {
        invalid[0].focus();
        status.classList.add('is-error');
        status.textContent = 'Quelques champs demandent votre attention.';
        return;
      }

      var data = {};
      controls.forEach(function (input) {
        data[input.name] = input.type === 'checkbox' ? (input.checked ? 'oui' : 'non') : input.value.trim();
      });

      if (!CONFIG.ENDPOINT) {
        // Pas de service configuré : on bascule sur le client mail du visiteur.
        var corps = [
          'Nom : ' + data.nom,
          'Prénom : ' + (data.prenom || '—'),
          'Téléphone : ' + data.tel,
          'E-mail : ' + data.email,
          'Ville : ' + data.ville,
          'Prestation : ' + data.prestation,
          '',
          data.message
        ].join('\n');

        window.location.href = 'mailto:' + CONFIG.EMAIL
          + '?subject=' + encodeURIComponent('Demande de contact — ' + [data.prenom, data.nom].filter(Boolean).join(' '))
          + '&body=' + encodeURIComponent(corps);

        status.classList.add('is-success');
        status.textContent = 'Votre logiciel de messagerie va s’ouvrir avec votre demande pré-remplie.';
        return;
      }

      var button = $('button[type="submit"]', form);
      button.disabled = true;
      status.textContent = 'Envoi en cours…';

      fetch(CONFIG.ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) { throw new Error('HTTP ' + res.status); }
          form.reset();
          status.classList.add('is-success');
          status.textContent = 'Merci ! Votre message est parti, le chef vous répond sous 24 h.';
        })
        .catch(function () {
          status.classList.add('is-error');
          status.textContent = 'L’envoi a échoué. Écrivez-moi directement à ' + CONFIG.EMAIL + '.';
        })
        .finally(function () { button.disabled = false; });
    });
  }
})();
