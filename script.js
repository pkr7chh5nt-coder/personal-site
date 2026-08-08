(function () {
  'use strict';

  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileNavQuery = window.matchMedia('(max-width: 759px)');

  var navTrigger = document.getElementById('nav-trigger');
  var mobilePanel = document.getElementById('mobile-nav-panel');
  var navLinks = document.querySelectorAll('[data-nav-link]');
  var mobileOpen = false;

  function prefersReducedMotion() {
    return reducedMotionQuery.matches;
  }

  function scrollAndFocus(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var rect = el.getBoundingClientRect();
    var top = rect.top + window.scrollY - 88;
    window.scrollTo({ top: top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    el.focus({ preventScroll: true });
  }

  function closeMobileMenu(returnFocus) {
    if (!mobileOpen) return;
    mobileOpen = false;
    mobilePanel.classList.remove('is-open');
    navTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) navTrigger.focus();
  }

  function openMobileMenu() {
    mobileOpen = true;
    mobilePanel.classList.add('is-open');
    navTrigger.setAttribute('aria-expanded', 'true');
    var first = document.getElementById('mobile-link-work');
    if (first) first.focus();
  }

  function toggleMobileMenu() {
    if (mobileOpen) {
      closeMobileMenu(false);
    } else {
      openMobileMenu();
    }
  }

  function handleNavClick(e) {
    var id = this.getAttribute('data-target');
    e.preventDefault();
    scrollAndFocus(id);
    if (mobileOpen) closeMobileMenu(false);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', handleNavClick);
  });

  if (navTrigger) {
    navTrigger.addEventListener('click', toggleMobileMenu);
  }

  if (mobilePanel) {
    mobilePanel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu(true);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileOpen) closeMobileMenu(true);
  });

  function handleResize() {
    if (!mobileNavQuery.matches && mobileOpen) {
      closeMobileMenu(false);
    }
  }
  window.addEventListener('resize', handleResize);

  var skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      var main = document.getElementById('main-content');
      if (main) main.focus();
    });
  }

  var sectionIds = ['hero', 'work', 'experience', 'about', 'contact'];
  var allNavLinkGroups = document.querySelectorAll('[data-nav-link]');

  function setActiveSection(id) {
    allNavLinkGroups.forEach(function (link) {
      if (link.getAttribute('data-target') === id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
