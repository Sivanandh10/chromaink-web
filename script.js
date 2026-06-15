/* ==========================================================================
   STANDARD ENTERPRISES INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. DOM Elements
  const mainHeader = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // WhatsApp Widget Elements
  const whatsappTooltip = document.getElementById('whatsappTooltip');
  const closeTooltipBtn = document.getElementById('closeTooltipBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');

  // 3. Mobile Navigation Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
      
      // Accessibility: update aria-expanded status
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when navigation links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when close icon inside nav menu is clicked
    const navCloseBtn = document.getElementById('navCloseBtn');
    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close menu when clicking outside of the menu overlay
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open')) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // 4. Scroll Effects (Sticky Header & Active Link Tracking)
  const handleScrollEffects = () => {
    const scrollPos = window.scrollY;

    // A. Sticky Header Toggle
    if (scrollPos > 20) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // B. Highlight Nav Link on Scroll
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) - 10;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScrollEffects);
  // Run once on load to establish correct styles
  handleScrollEffects();

  // 5. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.15, // Trigger when 15% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Offset slightly from bottom viewport
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('visible');
    });
  }

  // 6. WhatsApp Popup Widget Logic
  // Show tooltip after a 3.5 seconds delay to draw attention
  let tooltipTimeout = setTimeout(() => {
    if (whatsappTooltip) {
      whatsappTooltip.classList.add('show');
      const scrollTopBtn = document.getElementById('scrollTopBtn');
      if (scrollTopBtn) scrollTopBtn.classList.add('wa-open');
    }
  }, 3500);

  // Close WhatsApp Tooltip on close button click
  if (closeTooltipBtn && whatsappTooltip) {
    closeTooltipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      whatsappTooltip.classList.remove('show');
      const scrollTopBtn = document.getElementById('scrollTopBtn');
      if (scrollTopBtn) scrollTopBtn.classList.remove('wa-open');
      clearTimeout(tooltipTimeout);
    });
  }

  // Dismiss tooltip automatically if the user clicks the WhatsApp button itself
  if (whatsappBtn && whatsappTooltip) {
    whatsappBtn.addEventListener('click', () => {
      whatsappTooltip.classList.remove('show');
      const scrollTopBtn = document.getElementById('scrollTopBtn');
      if (scrollTopBtn) scrollTopBtn.classList.remove('wa-open');
      clearTimeout(tooltipTimeout);
    });
  }

  // Close tooltip on scroll (if it's already shown, hide to not disrupt reading experience)
  let scrollThresholdTriggered = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400 && !scrollThresholdTriggered) {
      if (whatsappTooltip) {
        whatsappTooltip.classList.remove('show');
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) scrollTopBtn.classList.remove('wa-open');
      }
      scrollThresholdTriggered = true;
    }
  });

  // 7. Count-Up Stats Counter Animation
  const countUpElements = document.querySelectorAll('.count-up');
  
  if (countUpElements.length > 0 && 'IntersectionObserver' in window) {
    const startCountUp = (element) => {
      const target = +element.getAttribute('data-target');
      const duration = 1500; // 1.5 seconds counting animation
      const stepTime = 20;
      const stepValue = target / (duration / stepTime);
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          element.textContent = `+${target}`;
          clearInterval(timer);
        } else {
          element.textContent = `+${Math.floor(current)}`;
        }
      }, stepTime);
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    countUpElements.forEach(el => countObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    countUpElements.forEach(el => {
      el.textContent = `+${el.getAttribute('data-target')}`;
    });
  }

  // 8. Product Section Interaction (Featured Showcase & Read More / Less & Mobile Slider)
  const productListCards = document.querySelectorAll('.product-list-card');
  const featuredProductCard = document.getElementById('featuredProductCard');
  
  if (productListCards.length > 0 && featuredProductCard) {
    const featuredImg = document.getElementById('featuredImg');
    const featuredBadge = document.getElementById('featuredBadge');
    const featuredName = document.getElementById('featuredName');
    const featuredDesc = document.getElementById('featuredDesc');
    const featuredEnquiryBtn = document.getElementById('featuredEnquiryBtn');
    
    // Product data lookup
    const productData = {
      "1": {
        tag: "★ COMPLETE BUNDLE - ALL PRODUCTS",
        name: "Standard All-in-One Combo",
        desc: "Complete industrial ink and cleaning solution package featuring all primary colors and printhead flush. Get standard banner jet, pipe crimson, sublimation yellow, industrial black, and standard cleaning solution in a single value bundle. Perfect for scaling print shops and industrial extrusion plants.",
        img: "assets/all in 1.JPG",
        waLink: "https://wa.me/1234567890?text=Hi!%20I'd%20like%20to%20order%20the%20Standard%20All-in-One%20Combo%20Pack"
      },
      "2": {
        tag: "★ BEST SELLER - SOLVENT BASED",
        name: "StandardBanner Jet",
        desc: "Premium blue solvent ink for large-format flex banner printers. Vivid density and high weather stability. Our advanced solvent formula penetrates deep into vinyl and flex substrates, ensuring the print remains waterproof, UV-resistant, and vibrant under direct sunlight for up to 5 years.",
        img: "assets/2.PNG",
        waLink: "https://wa.me/1234567890?text=Hi!%20I'd%20like%20to%20order%20StandardBanner%20Jet"
      },
      "3": {
        tag: "★ HIGH DEMAND - PVC CODING",
        name: "StandardPipe Crimson",
        desc: "Bright crimson coding ink. Fast adhesion on plastics, PVC pipes, conduits, and cables. Specifically blended for continuous inkjet (CIJ) systems. It cures instantly upon printing to prevent smudging or fading on high-speed industrial extrusion lines.",
        img: "assets/3.jpg",
        waLink: "https://wa.me/1234567890?text=Hi!%20I'd%20like%20to%20order%20StandardPipe%20Crimson"
      },
      "4": {
        tag: "★ PREMIUM QUALITY - SUBLIMATION",
        name: "StandardPrint Emerald",
        desc: "High-speed yellow printing ink. Specialized formulation for flexible vinyl banners and canvas. Offers superior color gamut and printhead lubrication to prevent clogging. Ideal for automated large-scale outdoor advertising production.",
        img: "assets/1.jpg",
        waLink: "https://wa.me/1234567890?text=Hi!%20I'd%20like%20to%20order%20StandardPrint%20Emerald"
      },
      "5": {
        tag: "★ INDUSTRIAL STANDARD - INDUSTRIAL BLACK",
        name: "Obsidian Mark-10",
        desc: "Jet black coding and batch ink. Instant dry time on plastics, PVC, glass, and steel. An industrial standard black coding fluid engineered with solvents that cross-link with substrates for chemical and abrasion resistance.",
        img: "assets/product-obsidian.png",
        waLink: "https://wa.me/1234567890?text=Hi!%20I'd%20like%20to%20order%20Obsidian%20Mark-10"
      }
    };

    // ── Mobile Slider Setup (declared first so read-more can reference them) ──
    const productListColumn = document.getElementById('productListColumn');
    const prevProductBtn = document.getElementById('prevProductBtn');
    const nextProductBtn = document.getElementById('nextProductBtn');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    
    let currentSlide = 0;
    const totalSlides = productListCards.length;
    let autoPlayInterval = null;
    
    const showSlide = (index) => {
      if (window.innerWidth > 768) return; // ignore on desktop
      currentSlide = (index + totalSlides) % totalSlides;
      productListColumn.style.transform = `translateX(-${currentSlide * 100}%)`;
      sliderDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    };
    
    const startAutoPlay = () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        if (window.innerWidth <= 768) {
          // Only auto-advance if NO card has its description expanded
          const anyExpanded = document.querySelector('.product-list-card.desc-open');
          if (!anyExpanded) showSlide(currentSlide + 1);
        }
      }, 2000);
    };
    
    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      startAutoPlay();
    };
    
    // ── Card Interactions ──
    productListCards.forEach(card => {
      // Click card to showcase on desktop
      card.addEventListener('click', (e) => {
        // Prevent click when user is clicking the Read More or WhatsApp buttons or on mobile viewports
        if (e.target.closest('.read-more-btn') || e.target.closest('.enquiry-btn') || window.innerWidth <= 768) {
          return;
        }
        
        // Remove active class from all, add to clicked
        productListCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const prodId = card.getAttribute('data-product-id');
        const data = productData[prodId];
        
        if (data) {
          // Fade effect
          featuredProductCard.style.opacity = '0.3';
          featuredProductCard.style.transform = 'translateY(8px)';
          
          setTimeout(() => {
            featuredImg.src = data.img;
            featuredBadge.textContent = data.tag;
            featuredName.textContent = data.name;
            featuredDesc.textContent = data.desc;
            featuredEnquiryBtn.href = data.waLink;
            
            featuredProductCard.style.opacity = '1';
            featuredProductCard.style.transform = 'translateY(0)';
            
            // Re-trigger Lucide icons
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }, 150);
        }
      });
      
      // Read More / Less Toggle
      const readMoreBtn = card.querySelector('.read-more-btn');
      const moreDesc = card.querySelector('.product-more-desc');
      const arrowIcon = card.querySelector('.arrow-icon');
      
      if (readMoreBtn && moreDesc && arrowIcon) {
        readMoreBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const isOpened = card.classList.toggle('desc-open');
          
          if (isOpened) {
            moreDesc.style.maxHeight = moreDesc.scrollHeight + 'px';
            moreDesc.style.opacity = '1';
            moreDesc.style.marginTop = '10px';
            arrowIcon.style.transform = 'rotate(180deg)';
            // Pause auto-scroll so user can read the expanded description
            if (autoPlayInterval) {
              clearInterval(autoPlayInterval);
              autoPlayInterval = null;
            }
          } else {
            moreDesc.style.maxHeight = '0';
            moreDesc.style.opacity = '0';
            moreDesc.style.marginTop = '0';
            arrowIcon.style.transform = 'rotate(0deg)';
            // Resume auto-scroll after description is collapsed
            startAutoPlay();
          }
        });
      }
    });
    
    // Set first card active initially
    productListCards[0].classList.add('active');
    
    // Slider arrow buttons
    if (prevProductBtn && nextProductBtn) {
      prevProductBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(currentSlide - 1);
        resetAutoPlay();
      });
      
      nextProductBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(currentSlide + 1);
        resetAutoPlay();
      });
    }
    
    sliderDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetAutoPlay();
      });
    });
    
    // Start slider autoplay timer
    startAutoPlay();
    
    // Reset translation when screen resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        productListColumn.style.transform = 'none';
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      } else {
        showSlide(currentSlide);
        startAutoPlay();
      }
    });
  }

  // 9. Contact Form Submit to WhatsApp
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const phoneVal = document.getElementById('contact-phone').value.trim();
      
      const productSelect = document.getElementById('contact-product');
      let product = 'Not selected';
      if (productSelect && productSelect.selectedIndex >= 0) {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        if (selectedOption.value) {
          product = selectedOption.text;
        }
      }
      
      const email = document.getElementById('contact-email').value.trim() || 'Not provided';
      const message = document.getElementById('contact-message').value.trim() || 'Not provided';
      
      // Construct WhatsApp message
      const text = `*New Enquiry from Standard Enterprises Web* ✒️\n\n` +
                   `*Name:* ${name}\n` +
                   `*Phone:* ${phoneVal}\n` +
                   `*Product:* ${product}\n` +
                   `*Email:* ${email}\n` +
                   `*Message:* ${message}`;
      
      // Get WhatsApp phone number from the widget or default to placeholder
      let waNumber = '1234567890';
      const whatsappBtn = document.getElementById('whatsappBtn');
      if (whatsappBtn && whatsappBtn.getAttribute('href')) {
        const match = whatsappBtn.getAttribute('href').match(/wa\.me\/([^/?]+)/);
        if (match) {
          waNumber = match[1];
        }
      }
      
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  // 10. Scroll to Top Button Visibility and Interaction
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
