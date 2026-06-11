/* =========================================================
   Inviteasily — Tanıtım Sitesi · etkileşimler & animasyonlar
   ========================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Supabase client ---------- */
  var SUPABASE_URL = 'https://vyiaaizvexowzdifbmnl.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5aWFhaXp2ZXhvd3pkaWZibW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjQxODgsImV4cCI6MjA5Njc0MDE4OH0.lqWOZjRRhXIm2tyZBuBlFsAls-PJtA1KPU5Z6tuxdwo';
  var supabase = (window.supabase && typeof window.supabase.createClient === 'function')
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  /* ---------- Header solid on scroll ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 24) header.classList.add('solid');
    else header.classList.remove('solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero WhatsApp conversation animation ---------- */
  var waBody = document.getElementById('waBody');
  var heroPanel = document.getElementById('heroPanel');

  var waScript = [
    { type: 'in',  text: 'Sayın Furkan Bey, Ayşe & Fatih çiftinin düğününe davetlisiniz. 🌸 Katılabilecek misiniz?', time: '14:02' },
    { type: 'typing', who: 'out' },
    { type: 'out', text: 'Geliyoruz, eşim Ayşe ile 3 kişi olacağız. Otopark var mı acaba?', time: '14:05' },
    { type: 'typing', who: 'in' },
    { type: 'in',  text: 'Harika! 3 kişi olarak not aldım. ✅ Otopark için salonun karşısında ücretsiz vale mevcut. 🌸', time: '14:05' },
    { type: 'panel' }
  ];

  function makeMsg(item) {
    var div = document.createElement('div');
    div.className = 'wa-msg ' + (item.type === 'in' ? 'wa-in' : 'wa-out');
    div.innerHTML = item.text + '<span class="wa-time">' + item.time + '</span>';
    return div;
  }
  function makeTyping(who) {
    var div = document.createElement('div');
    div.className = 'wa-msg ' + (who === 'in' ? 'wa-in' : 'wa-out');
    div.innerHTML = '<span class="wa-typing"><span></span><span></span><span></span></span>';
    return div;
  }

  function runWaSequence() {
    if (!waBody) return;
    waBody.innerHTML = '';
    if (heroPanel) heroPanel.classList.remove('show');
    var i = 0;
    var typingNode = null;

    function next() {
      if (i >= waScript.length) {
        // restart loop after a pause
        setTimeout(function () { runWaSequence(); }, 5200);
        return;
      }
      var item = waScript[i++];

      if (item.type === 'typing') {
        typingNode = makeTyping(item.who);
        waBody.appendChild(typingNode);
        var tn = typingNode;
        setTimeout(function () { tn.classList.add('show'); }, 30);
        setTimeout(next, 1100);
      } else if (item.type === 'panel') {
        if (heroPanel) heroPanel.classList.add('show');
        setTimeout(next, 600);
      } else {
        if (typingNode) { typingNode.remove(); typingNode = null; }
        var node = makeMsg(item);
        waBody.appendChild(node);
        setTimeout(function () { node.classList.add('show'); }, 30);
        setTimeout(next, item.type === 'out' ? 1400 : 1700);
      }
    }
    next();
  }

  if (prefersReduced && waBody) {
    // static fallback: render all bubbles + panel
    waScript.forEach(function (item) {
      if (item.type === 'in' || item.type === 'out') {
        var n = makeMsg(item); n.classList.add('show'); waBody.appendChild(n);
      }
    });
    if (heroPanel) heroPanel.classList.add('show');
  } else if (waBody) {
    // start when hero is on screen (it is, at load) — small delay
    setTimeout(runWaSequence, 700);
  }

  /* ---------- AI Spotlight chat animation ---------- */
  var aiChat = document.getElementById('aiChat');
  var aiResult = document.getElementById('aiResult');

  var aiScript = [
    { who: 'guest', av: 'M', html: '“maalesef bu sefer katılamayacağız, çok üzgünüz”' },
    { who: 'guest', av: 'Z', html: '<span class="chat-q">Soru</span> “düğün saat kaçta başlıyor, çocukla gelebilir miyiz?”' },
    { who: 'guest', av: 'F', html: '“geliyoruz, eşim <b>Ayşe</b> ile 3 kişiyiz”' }
  ];

  function buildAiLine(item) {
    var line = document.createElement('div');
    line.className = 'chat-line';
    line.innerHTML =
      '<span class="chat-ava guest">' + item.av + '</span>' +
      '<div class="chat-bubble">' + item.html + '</div>';
    return line;
  }

  function runAiSequence() {
    if (!aiChat) return;
    aiChat.innerHTML = '';
    if (aiResult) aiResult.classList.remove('show');
    var i = 0;
    function next() {
      if (i >= aiScript.length) {
        if (aiResult) setTimeout(function () { aiResult.classList.add('show'); }, 350);
        return;
      }
      var node = buildAiLine(aiScript[i++]);
      aiChat.appendChild(node);
      setTimeout(function () { node.classList.add('show'); }, 30);
      setTimeout(next, 900);
    }
    next();
  }

  if (aiChat) {
    if (prefersReduced) {
      aiScript.forEach(function (item) {
        var n = buildAiLine(item); n.classList.add('show'); aiChat.appendChild(n);
      });
      if (aiResult) aiResult.classList.add('show');
    } else {
      var aiSeen = false;
      var aiIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !aiSeen) {
            aiSeen = true;
            setTimeout(runAiSequence, 250);
          }
        });
      }, { threshold: 0.35 });
      aiIo.observe(aiChat);
    }
  }

  /* ---------- Demo form ---------- */
  var form = document.getElementById('demoForm');
  var success = document.getElementById('formSuccess');
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#B91C1C';
          field.style.boxShadow = '0 0 0 3px rgba(185,28,28,.1)';
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      });
      var email = form.querySelector('#f-email');
      if (email && email.value.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        valid = false;
        email.style.borderColor = '#B91C1C';
        email.style.boxShadow = '0 0 0 3px rgba(185,28,28,.1)';
      }
      if (!valid) return;

      function showSuccess() {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      }

      // Supabase kullanılamıyorsa yine de başarı göster (form bozulmasın)
      if (!supabase) { showSuccess(); return; }

      var payload = {
        name: form.querySelector('#f-name').value.trim(),
        org: form.querySelector('#f-org').value.trim(),
        phone: form.querySelector('#f-phone').value.trim(),
        email: form.querySelector('#f-email').value.trim(),
        events: (form.querySelector('#f-events').value || '').trim() || null
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.7'; }

      supabase.from('demo_requests').insert(payload).then(function (res) {
        if (res.error) {
          console.error('Supabase insert error:', res.error);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
          alert('Talebiniz gönderilemedi, lütfen tekrar deneyin.');
          return;
        }
        showSuccess();
      });
    });
    // clear error on input
    form.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      });
    });
  }

  /* ---------- Showcase tabs + autoplay + lightbox ---------- */
  var tabsMenu = document.querySelector('.tabs-menu');
  var tabItems = [].slice.call(document.querySelectorAll('.tab-item'));
  var tabShots = [].slice.call(document.querySelectorAll('.tab-shot'));
  var tabUrl = document.getElementById('tabUrl');
  var tabsBar = document.getElementById('tabsBar');
  var viewport = document.getElementById('tabsViewport');
  var current = 0;
  var autoTimer = null;
  var AUTOPLAY_MS = 6000;
  var autoPaused = false;

  function setTab(idx) {
    if (idx < 0) idx = tabShots.length - 1;
    if (idx >= tabShots.length) idx = 0;
    current = idx;
    tabItems.forEach(function (t, i) {
      var on = i === idx;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    tabShots.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
    if (tabUrl && tabShots[idx]) tabUrl.textContent = tabShots[idx].getAttribute('data-url');
  }

  function restartProgress() {
    if (!tabsBar) return;
    tabsBar.classList.remove('run');
    // force reflow so the transition restarts
    void tabsBar.offsetWidth;
    if (!autoPaused && !prefersReduced) tabsBar.classList.add('run');
  }

  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (autoPaused || prefersReduced) return;
    restartProgress();
    autoTimer = setTimeout(function () {
      setTab(current + 1);
      scheduleAuto();
    }, AUTOPLAY_MS);
  }

  function goManual(idx) {
    setTab(idx);
    scheduleAuto();
  }

  if (tabItems.length) {
    tabItems.forEach(function (t) {
      t.addEventListener('click', function () { goManual(parseInt(t.getAttribute('data-tab'), 10)); });
    });

    // pause autoplay on hover over the whole showcase
    var showcase = document.querySelector('.showcase-tabs');
    if (showcase) {
      showcase.addEventListener('mouseenter', function () {
        autoPaused = true; clearTimeout(autoTimer);
        if (tabsBar) { tabsBar.classList.remove('run'); tabsBar.style.width = getComputedStyle(tabsBar).width; }
      });
      showcase.addEventListener('mouseleave', function () {
        autoPaused = false;
        if (tabsBar) tabsBar.style.width = '';
        scheduleAuto();
      });
    }

    // start autoplay when showcase scrolls into view
    if (prefersReduced) {
      setTab(0);
    } else {
      var started = false;
      var scIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; scheduleAuto(); }
        });
      }, { threshold: 0.25 });
      if (showcase) scIo.observe(showcase);
    }
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbIndex = 0;

  function openLightbox(idx) {
    lbIndex = idx;
    var shot = tabShots[idx];
    if (!shot || !lightbox) return;
    lbImg.src = shot.src;
    lbImg.alt = shot.alt;
    lbCap.textContent = shot.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function lbGo(delta) {
    var n = lbIndex + delta;
    if (n < 0) n = tabShots.length - 1;
    if (n >= tabShots.length) n = 0;
    openLightbox(n);
    setTab(n); // keep underlying tab in sync
  }

  if (viewport) viewport.addEventListener('click', function () { openLightbox(current); });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', function () { lbGo(-1); });
  if (lbNext) lbNext.addEventListener('click', function () { lbGo(1); });
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') lbGo(-1);
    else if (e.key === 'ArrowRight') lbGo(1);
  });

})();
