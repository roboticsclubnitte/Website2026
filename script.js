/**
 * Main JavaScript file for the Robotics Club Nitte Website
 * --------------------------------------------------------
 * This script handles all the interactive functionality on the site, including:
 * 1. Toggling the mobile navigation menu.
 * 2. Applying fade-in animations to sections as they are scrolled into view.
 * 3. Submitting the contact form data to a Google Form endpoint.
 * 4. Handling the office bearer scroller animation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. Mobile Menu Toggle
  // ===================================================================
  // This logic controls the hamburger menu on smaller screens.
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      // The 'toggle' method adds the 'hidden' class if it's not present,
      // and removes it if it is. This is a simple way to show/hide the menu.
      mobileMenu.classList.toggle('hidden');
    });
  }


  // ===================================================================
  // 2. Scroll Animation Logic
  // ===================================================================
  // This part of the script makes sections fade in as the user scrolls.
  const sections = document.querySelectorAll('.fade-in-section');

  if (sections.length > 0) {
    // The Intersection Observer API is a modern, efficient way to detect
    // when an element enters the viewport.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 'isIntersecting' is true when the element is visible.
        if (entry.isIntersecting) {
          // We add a CSS class 'is-visible' which triggers our fade-in animation.
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      // The 'threshold' determines how much of the element must be visible
      // before the observer triggers. 0.1 means 10%.
      threshold: 0.1
    });

    // We tell the observer to watch each of our designated sections.
    sections.forEach(section => {
      observer.observe(section);
    });
  }


  // ===================================================================
  // 3. Google Form Submission Handler
  // ===================================================================
  // This code hijacks the normal form submission process to send data
  // to a Google Form in the background, without leaving the page.
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', (e) => {
      // 'e.preventDefault()' stops the form from its default action,
      // which would be to navigate to a new page.
      e.preventDefault();

      // The updated Google Form URL ending in /formResponse.
      const formActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScabZFfwyByU9nKtabVQaFgp9rRGQwg9U5vRTvpwEkUZ6sqkw/formResponse';
      
      // We gather the data from the form fields.
      const formData = new FormData(contactForm);

      // We use the 'fetch' API to send the data to the Google Form URL.
      // The 'POST' method is used to send data.
      // 'mode: no-cors' is required to avoid Cross-Origin Resource Sharing errors,
      // as we are sending data to a different domain (google.com).
      fetch(formActionUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
      })
      .then(() => {
        // If the submission is successful (or at least, doesn't throw an error):
        // 1. We clear the form fields.
        contactForm.reset();
        // 2. We show the "Thank you" message.
        successMessage.classList.remove('hidden');
        // 3. We hide the success message again after 5 seconds for a clean UI.
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 5000);
      })
      .catch((error) => {
        // If there's an error, we log it to the console for debugging.
        console.error('Error submitting form:', error);
        alert('There was an error sending your message. Please try again.');
      });
    });
  }
  
  // ===================================================================
  // 4. Office Bearer Scroller Logic
  // ===================================================================
  // This script handles the automatic scrolling and allows manual override.
  const scroller = document.querySelector('.scroller');

  if (scroller) {
    // A flag to ensure we only add the override class once.
    let isManuallyScrolled = false;

    const handleManualScroll = () => {
      if (!isManuallyScrolled) {
        isManuallyScrolled = true;
        // Add the class to permanently disable the CSS animation.
        scroller.classList.add('manual-override');
        // We can remove the listener now since its job is done.
        scroller.removeEventListener('scroll', handleManualScroll);
      }
    };
    
    // The 'scroll' event listener is key. It only fires on a user-initiated
    // scroll (mouse wheel, trackpad, touch drag), not on a CSS animation.
    scroller.addEventListener('scroll', handleManualScroll);
  }

  // ===================================================================
  // 5. Registration Deadline & Status Controller
  // ===================================================================
  // Deadline: 11:59 PM on 12/09/2026 (Sept 12, 2026 23:59:00 IST / GMT+5:30)
  // Unix timestamp: 1789237740000 ms
  const REGISTRATION_DEADLINE_MS = 1789237740000;

  function isRegistrationClosed() {
    const urlParams = new URLSearchParams(window.location.search);
    const regOverride = urlParams.get('reg');
    if (regOverride === 'closed' || urlParams.has('closed')) {
      return true;
    }
    if (regOverride === 'open') {
      return false;
    }
    return Date.now() >= REGISTRATION_DEADLINE_MS;
  }

  function updateRegistrationUI() {
    const closed = isRegistrationClosed();

    // ── 1. Index Page: Recruitment Section ──
    const indexBadge = document.getElementById('recruitment-badge');
    const indexDesc = document.getElementById('recruitment-desc');
    const indexBtn = document.getElementById('recruitment-btn');
    const indexCallout = document.getElementById('recruitment-callout');

    if (indexBadge && indexDesc) {
      if (closed) {
        indexBadge.className = 'role-badge role-badge-closed';
        indexBadge.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#ef4444;display:inline-block;box-shadow:0 0 8px #ef4444;"></span> Registrations Closed';
        indexDesc.innerHTML = 'Registrations for Club Recruitment 2026 are now closed. The application window ended on <strong>September 12, 2026 at 11:59 PM</strong>. Shortlisted candidates will be contacted for direct interviews.';
        if (indexBtn) {
          indexBtn.textContent = 'Recruitment Details (Closed) →';
        }
        if (indexCallout) {
          indexCallout.style.borderColor = 'rgba(239, 68, 68, 0.45)';
        }
      } else {
        indexBadge.className = 'role-badge';
        indexBadge.textContent = 'Deadline · 11:59 PM, Sept 12, 2026';
        indexDesc.innerHTML = 'Exclusively for 2nd and 3rd year students. Upload your resume &amp; register before 11:59 PM, Sept 12. Pick an interview slot starting from Sept 7.';
        if (indexBtn) {
          indexBtn.textContent = 'Learn More →';
        }
        if (indexCallout) {
          indexCallout.style.borderColor = 'rgba(249, 115, 22, 0.55)';
        }
      }
    }

    // ── 2. Recruitment Page (Registrations Page) ──
    const regClosedPill = document.getElementById('reg-closed-pill');
    const bannerCard = document.getElementById('reg-banner-card');
    const bannerTag = document.getElementById('reg-banner-tag');
    const bannerTitle = document.getElementById('reg-banner-title');
    const bannerSubtext = document.getElementById('reg-banner-subtext');
    const bannerCta = document.getElementById('reg-banner-cta');
    const checklistCta = document.getElementById('reg-checklist-cta');
    const interviewSubtext = document.getElementById('reg-interview-subtext');

    if (bannerCard || bannerCta) {
      if (closed) {
        if (regClosedPill) {
          regClosedPill.classList.remove('hidden');
          regClosedPill.classList.add('inline-flex');
        }
        if (bannerCard) {
          bannerCard.classList.remove('border-white/10');
          bannerCard.classList.add('border-rose-500/40', 'bg-rose-950/20');
        }
        if (bannerTag) {
          bannerTag.className = 'text-xs font-bold uppercase tracking-wider text-rose-400 block';
          bannerTag.innerHTML = '● Status: Registrations Closed';
        }
        if (bannerTitle) {
          bannerTitle.textContent = 'Registrations Closed for Recruitment 2026';
        }
        if (bannerSubtext) {
          bannerSubtext.innerHTML = 'The registration window closed on <strong>September 12, 2026 at 11:59 PM</strong>. Shortlisted candidates are being contacted for direct personal interviews.';
        }
        if (bannerCta) {
          bannerCta.className = 'px-8 py-3.5 rounded-full font-bold text-base bg-rose-500/15 text-rose-300 border border-rose-500/35 cursor-not-allowed inline-flex items-center gap-2 pointer-events-none select-none';
          bannerCta.removeAttribute('href');
          bannerCta.setAttribute('aria-disabled', 'true');
          bannerCta.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg> Registrations Closed';
        }
        if (checklistCta) {
          checklistCta.className = 'text-center block w-full py-3.5 text-base font-bold rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/35 cursor-not-allowed pointer-events-none select-none';
          checklistCta.removeAttribute('href');
          checklistCta.setAttribute('aria-disabled', 'true');
          checklistCta.textContent = 'Registrations Closed';
        }
        if (interviewSubtext) {
          interviewSubtext.innerHTML = 'Registrations are now closed as of 11:59 PM, Sept 12, 2026. Direct interviews with shortlisted candidates are currently underway.';
        }
      } else {
        if (regClosedPill) {
          regClosedPill.classList.add('hidden');
          regClosedPill.classList.remove('inline-flex');
        }
        if (bannerCard) {
          bannerCard.classList.add('border-white/10');
          bannerCard.classList.remove('border-rose-500/40', 'bg-rose-950/20');
        }
        if (bannerTag) {
          bannerTag.className = 'text-xs font-bold uppercase tracking-wider text-orange-400 block';
          bannerTag.textContent = 'Registration Deadline & Interview Schedule';
        }
        if (bannerTitle) {
          bannerTitle.innerHTML = 'Register before 11:59 PM &bull; Saturday, Sept 12, 2026';
        }
        if (bannerSubtext) {
          bannerSubtext.innerHTML = 'Pick an interview slot starting from Sept 7, 2026 &bull; <span class="text-sky-400 font-semibold">2nd &amp; 3rd Years Only</span>';
        }
        if (bannerCta) {
          bannerCta.className = 'btn-iris text-base px-8 py-3.5 inline-block whitespace-nowrap';
          bannerCta.setAttribute('href', 'https://forms.gle/LFbYVTwyNakYfAer9');
          bannerCta.removeAttribute('aria-disabled');
          bannerCta.innerHTML = 'Register for Recruitment &rarr;';
        }
        if (checklistCta) {
          checklistCta.className = 'btn-iris text-center block w-full py-3.5 text-base';
          checklistCta.setAttribute('href', 'https://forms.gle/LFbYVTwyNakYfAer9');
          checklistCta.removeAttribute('aria-disabled');
          checklistCta.innerHTML = 'Register Now (Google Form) &rarr;';
        }
        if (interviewSubtext) {
          interviewSubtext.innerHTML = 'Candidates will directly interact with our club leads and core team for a focused technical and domain discussion. Register before 11:59 PM, Sept 12 and pick your interview slot starting from Sept 7.';
        }
      }
    }

    // ── 3. Events Page: Recruitment Callout ──
    const eventsBadge = document.getElementById('events-recruitment-badge');
    const eventsDesc = document.getElementById('events-recruitment-desc');
    const eventsBtn = document.getElementById('events-recruitment-btn');

    if (eventsDesc) {
      if (closed) {
        if (eventsBadge) {
          eventsBadge.className = 'role-badge role-badge-closed';
          eventsBadge.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Registrations Closed';
        }
        eventsDesc.innerHTML = 'Recruitment for 2nd and 3rd year students is currently closed (ended Sept 12, 11:59 PM). Shortlisted applicants are undergoing direct personal interviews.';
        if (eventsBtn) {
          eventsBtn.textContent = 'View Recruitment Details (Closed) →';
        }
      } else {
        if (eventsBadge) {
          eventsBadge.className = 'role-badge';
          eventsBadge.textContent = 'Join the Engineering Team';
        }
        eventsDesc.innerHTML = 'Recruitment for 2nd and 3rd year students is live with direct personal interviews. Register before Sept 12, 11:59 PM to join the club and collaborate on national-level competitions.';
        if (eventsBtn) {
          eventsBtn.textContent = 'Recruitment Details →';
        }
      }
    }
  }

  // Initial execution on DOMContentLoaded
  updateRegistrationUI();

  // Real-time updates: Schedule trigger at deadline & periodic interval
  const now = Date.now();
  if (now < REGISTRATION_DEADLINE_MS) {
    const delay = REGISTRATION_DEADLINE_MS - now;
    if (delay > 0 && delay <= 2147483647) {
      setTimeout(updateRegistrationUI, delay);
    }
  }
  // Fallback periodic check every 30 seconds
  setInterval(updateRegistrationUI, 30000);

  // Expose to window for testing / debugging
  window.updateRegistrationUI = updateRegistrationUI;
  window.isRegistrationClosed = isRegistrationClosed;
});
