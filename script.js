document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 1000);
  });

  // Typing Effect
  const typingText = document.getElementById('typing-effect');
  const words = ['Web Developer', 'Tech Explorer', 'Creative Coder', 'AI Learner', 'Robotics Enthusiast']

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);
    typingText.textContent = currentText;
    typingText.classList.add('typing-cursor');

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex++;
      setTimeout(type, 100);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 50);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(type, 1200);
    }
  }

  setTimeout(type, 1000);

  // Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = 'block';
      scrollTopBtn.style.opacity = '1';
    } else {
      scrollTopBtn.style.opacity = '0';
      setTimeout(() => {
        if (window.scrollY <= 300) {
          scrollTopBtn.style.display = 'none';
        }
      }, 300);
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth Scroll for Nav Links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update Active Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavLink);

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.id === 'skills') setTimeout(animateProgressBars, 300);
        if (entry.target.id === 'about') setTimeout(animateCounters, 300);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Skills Progress Bars
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute('data-progress');
      }, index * 200);
    });
  }

  // Milestone Counters
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const updateCounter = () => {
        const target = parseInt(counter.dataset.target);
        const count = parseInt(counter.textContent) || 0;
        const speed = target > 100 ? 15 : 50;
        const increment = target / speed;

        if (count < target) {
          counter.textContent = Math.ceil(count + increment);
          setTimeout(updateCounter, 50);
        } else {
          counter.textContent = `${target}+`;
        }
      };
      updateCounter();
    });
  }

  // Project Filter System
  const filterButtons = document.querySelectorAll('.tag');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      projectCards.forEach(card => {
        const cardTags = card.dataset.tags;

        if (filter === 'all' || cardTags.includes(filter)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Contact Form Validation + Notification
  const contactForm = document.querySelector('.contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#00f2a1' : type === 'error' ? '#ff6b6b' : '#0088ff'};
      color: ${type === 'success' ? '#0a0a0a' : '#ffffff'};
      padding: 1rem 1.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10000;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: inherit;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 0.5rem;
    `;
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });

    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-active');
      mobileMenuToggle.classList.toggle('active');
    });
  }

  // Parallax Effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
  });

  // Hover Effects on Project Cards
 
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Lazy Load Image Fade-in
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
  });

  // Animate Skills & Milestones
  const animateElements = document.querySelectorAll('.skill-item, .project-card, .blog-post, .milestone');
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateObserver.observe(el);
  });

  console.log('🚀 Portfolio loaded successfully!');
});
