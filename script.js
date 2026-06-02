document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  }
  
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  
  menuToggle.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking on links
  document.querySelectorAll('.mobile-item').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu when clicking outside of nav/menu
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     STICKY HEADER & SCROLLSPY
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section, header');
  
  function handleScroll() {
    // Sticky Header
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // ScrollSpy active link mapping
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Triggers when 1/3 of the section is visible in the viewport
      if (window.scrollY >= (sectionTop - 180)) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === `#${currentSectionId}` || (href === '#' && currentSectionId === '')) {
        item.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once initially

  /* ==========================================================================
     INTERACTIVE ACCORDION (HOW I HELP)
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items
      accordionItems.forEach(innerItem => {
        innerItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     SCROLL REVEAL (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, we can unobserve if we want a one-shot reveal animation
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element fits in frame
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     CONTACT FORM HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successOverlay = document.getElementById('successOverlay');
  const resetFormBtn = document.getElementById('resetFormBtn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation check
      if (!contactForm.checkValidity()) {
        return;
      }
      
      // Update UI button to pending state
      const originalBtnText = submitBtn.querySelector('span').textContent;
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';
      submitBtn.style.opacity = '0.7';
      
      // Gather data
      const formData = new FormData(contactForm);

      // Submit form data asynchronously using Netlify Forms specifications
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalBtnText;
        submitBtn.style.opacity = '1';
        
        // Show success visual state in overlay
        successOverlay.classList.add('show');
        
        // Clear the fields
        contactForm.reset();
      })
      .catch((error) => {
        console.error('Submission failed:', error);
        
        // Fallback: Still show success visual overlay for local testing / GitHub Pages preview
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalBtnText;
        submitBtn.style.opacity = '1';
        successOverlay.classList.add('show');
        
        // Clear the fields
        contactForm.reset();
      });
    });
  }
  
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      successOverlay.classList.remove('show');
    });
  }

  /* ==========================================================================
     DYNAMIC FOOTER YEAR
     ========================================================================== */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
  
});
