/* HASDO site interactions */

(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');

  /* Sticky header shadow */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.classList.toggle('is-active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Interactive state list — placeholder until real map geo-data lands */
  var states = document.querySelectorAll('[data-state]');
  var stateDetail = document.getElementById('stateDetail');
  var detailName = document.getElementById('stateDetailName');
  var detailProjects = document.getElementById('stateDetailProjects');
  var detailPeople = document.getElementById('stateDetailPeople');
  var detailCommunities = document.getElementById('stateDetailCommunities');
  var detailList = document.getElementById('stateDetailList');

  var stateData = {
    'الخرطوم': { projects: '—', people: '—', communities: '—', items: [['المشاريع المنفذة', 'قريباً'], ['عدد المشاريع', '—'], ['آخر نشاط', 'لم يُسجّل بعد']] },
    'الجزيرة': { projects: '—', people: '—', communities: '—', items: [['المشاريع المنفذة', 'قريباً'], ['عدد المشاريع', '—'], ['آخر نشاط', 'لم يُسجّل بعد']] },
    'شمال دارفور': { projects: '—', people: '—', communities: '—', items: [['المشاريع المنفذة', 'قريباً'], ['عدد المشاريع', '—'], ['آخر نشاط', 'يُحدَّد بالبيانات الفعلية']] }
  };

  function renderState(key) {
    if (!stateDetail) return;
    var d = stateData[key] || stateData['الخرطوم'];
    stateDetail.hidden = false;
    detailName.textContent = key;
    detailProjects.textContent = d.projects;
    detailPeople.textContent = d.people;
    detailCommunities.textContent = d.communities;
    detailList.innerHTML = d.items
      .map(function (row) {
        return '<li><span>' + row[0] + '</span><span>' + row[1] + '</span></li>';
      })
      .join('');
    states.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-state') === key);
    });
  }

  if (states.length) {
    states.forEach(function (el) {
      el.addEventListener('click', function () {
        renderState(el.getAttribute('data-state'));
      });
    });
  }
})();