// Portfolio Website JavaScript

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initTheme();
    this.initScrollAnimations();
    this.initSkillBars();
    this.initTestimonials();
    this.initContactForm();
    this.initProjectModals();
    this.initHeroImageFallback();
  }

  setupEventListeners() {
    // Navigation
    this.setupNavigation();

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.setAttribute("role", "switch");
      themeToggle.setAttribute("aria-checked", "false");
      themeToggle.addEventListener("click", () => this.toggleTheme());
      // Keyboard support
      themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }

    // Header scroll behavior
    window.addEventListener("scroll", () => this.handleHeaderScroll());

    // About tabs
    this.setupAboutTabs();

    // Mobile menu toggle
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active");
      });
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav__link");
    const sections = document.querySelectorAll("section[id]");

    // Smooth scroll for navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");

        if (targetId && targetId.startsWith("#")) {
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            const headerHeight =
              document.querySelector(".header").offsetHeight || 80;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;

            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: "smooth",
            });

            // Update active link immediately
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        }
      });
    });

    // Update active nav link on scroll
    const updateActiveNavLink = () => {
      let current = "";
      const scrollY = window.pageYOffset + 100; // Add offset for better detection

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });

      // Default to home if at top
      if (scrollY < 200) {
        current = "home";
      }

      navLinks.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (href === `#${current}`) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", updateActiveNavLink);
    // Initialize active link
    updateActiveNavLink();
  }

  initTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;

    this.setTheme(initialTheme);
    // reflect also for SVG-based toggle
    document.documentElement.setAttribute("data-theme", initialTheme);
  }

  toggleTheme() {
    // Read from data-theme (drives the SVG animation) to avoid mismatch
    const currentTheme =
      document.documentElement.getAttribute("data-theme") ||
      document.documentElement.getAttribute("data-color-scheme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    // 1) Update the icon theme immediately so its animation runs smoothly
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // 2) Defer the page-wide color scheme switch slightly to avoid jank
    //    from many background/color transitions while the icon animates
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.setAttribute("data-color-scheme", theme);
      }, 250);
    });

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-checked",
        theme === "dark" ? "true" : "false"
      );
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  handleHeaderScroll() {
    const header = document.getElementById("header");
    if (header) {
      const scrollY = window.pageYOffset;

      if (scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }

  setupAboutTabs() {
    const tabs = document.querySelectorAll(".about__tab");
    const tabContents = document.querySelectorAll(".about__tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.getAttribute("data-tab");

        // Remove active class from all tabs and contents
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        tab.classList.add("active");
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add("active");

          // Trigger skill bar animations if skills tab is activated
          if (targetTab === "skills") {
            setTimeout(() => this.animateSkillBars(), 100);
          }
        }
      });
    });
  }

  initSkillBars() {
    // Animate skill bars when they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateSkillBars();
          }
        });
      },
      { threshold: 0.5 }
    );

    const skillsSection = document.querySelector(".skills");
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  }

  animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill__progress");

    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      if (width) {
        bar.style.setProperty("--skill-width", width + "%");
        bar.style.width = width + "%";
      }
    });
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Animate sections on scroll
    const animatedElements = document.querySelectorAll(
      ".service__card, .project__card, .section__header"
    );
    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(50px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  initHeroImageFallback() {
    const img = document.querySelector(".hero__image-photo");
    const initials = document.querySelector(".hero__image-avatar");
    if (!img) return;

    const showInitials = () => {
      if (initials) initials.style.zIndex = "2";
    };
    const hideInitials = () => {
      if (initials) initials.style.zIndex = "0";
    };

    if (img.complete && img.naturalWidth > 0) {
      hideInitials();
    } else {
      img.addEventListener("load", hideInitials, { once: true });
      img.addEventListener("error", showInitials, { once: true });
    }
  }
  initTestimonials() {
    const testimonials = document.querySelectorAll(".testimonial__card");
    const indicators = document.querySelectorAll(".testimonial__indicator");
    const prevBtn = document.querySelector(".testimonial__nav--prev");
    const nextBtn = document.querySelector(".testimonial__nav--next");

    if (testimonials.length === 0) return;

    let currentTestimonial = 0;

    const showTestimonial = (index) => {
      // Hide all testimonials
      testimonials.forEach((testimonial) =>
        testimonial.classList.remove("active")
      );
      indicators.forEach((indicator) => indicator.classList.remove("active"));

      // Show current testimonial
      if (testimonials[index]) {
        testimonials[index].classList.add("active");
      }
      if (indicators[index]) {
        indicators[index].classList.add("active");
      }
    };

    const nextTestimonial = () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    };

    const prevTestimonial = () => {
      currentTestimonial =
        (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentTestimonial);
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener("click", nextTestimonial);
    if (prevBtn) prevBtn.addEventListener("click", prevTestimonial);

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
      });
    });

    // Auto-advance testimonials
    setInterval(nextTestimonial, 5000);

    // Initialize first testimonial
    showTestimonial(0);
  }

  initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear previous errors
      this.clearFormErrors();

      // Validate form
      if (!this.validateForm()) {
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector(".btn__text");
      const btnLoader = submitBtn.querySelector(".btn__loader");

      const startLoading = () => {
        if (btnText && btnLoader) {
          btnText.classList.add("hidden");
          btnLoader.classList.remove("hidden");
          submitBtn.disabled = true;
        }
      };

      const stopLoading = () => {
        if (btnText && btnLoader) {
          btnText.classList.remove("hidden");
          btnLoader.classList.add("hidden");
          submitBtn.disabled = false;
        }
      };

      startLoading();

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        timestamp: new Date().toISOString(),
      };

      const endpoint =
        form.dataset.endpoint && form.dataset.endpoint.trim() !== ""
          ? form.dataset.endpoint
          : null;

      this.sendContact(payload, endpoint)
        .then((sentVia) => {
          this.showFormSuccess(sentVia);
          form.reset();
        })
        .catch((err) => {
          console.error("Contact form submit failed", err);
          this.showFormError(
            "Sorry, something went wrong while sending your message. Please try again or email me directly."
          );
        })
        .finally(() => {
          stopLoading();
        });
    });
  }

  async sendContact(payload, endpoint) {
    // If endpoint provided (e.g., Formspree, custom API), POST JSON
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      return "endpoint"; // indicates API path used
    }

    // Fallback: open user's email client with prefilled content
    const to = "m.basharazaz@gmail.com";
    const subject = encodeURIComponent(`Contact: ${payload.subject}`);
    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}\n\nSent from portfolio contact form.`
    );
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    return "mailto";
  }

  validateForm() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    let isValid = true;

    if (!name || !name.value.trim()) {
      this.showFieldError("name", "Name is required");
      isValid = false;
    }

    if (!email || !email.value.trim()) {
      this.showFieldError("email", "Email is required");
      isValid = false;
    } else if (!this.isValidEmail(email.value)) {
      this.showFieldError("email", "Please enter a valid email");
      isValid = false;
    }

    if (!subject || !subject.value.trim()) {
      this.showFieldError("subject", "Subject is required");
      isValid = false;
    }

    if (!message || !message.value.trim()) {
      this.showFieldError("message", "Message is required");
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearFormErrors() {
    const errorElements = document.querySelectorAll(".form-error");
    errorElements.forEach((el) => (el.textContent = ""));
  }

  showFormSuccess() {
    // Remove existing success/error messages
    const existingMessages = document.querySelectorAll(
      ".form-success, .form-error-general"
    );
    existingMessages.forEach((msg) => msg.remove());

    // Create and show success message
    const successMessage = document.createElement("div");
    successMessage.className = "form-success";
    successMessage.innerHTML = `
            <div style="
                background: var(--color-success);
                color: var(--color-btn-primary-text);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin-top: var(--space-16);
                text-align: center;
                animation: fadeIn 0.5s ease-in-out;
            ">
                ✅ Message sent successfully! I'll get back to you soon.
            </div>
        `;

    const form = document.getElementById("contact-form");
    form.appendChild(successMessage);

    // Remove success message after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  }

  showFormError(errorMessage) {
    // Remove existing success/error messages
    const existingMessages = document.querySelectorAll(
      ".form-success, .form-error-general"
    );
    existingMessages.forEach((msg) => msg.remove());

    const errorDiv = document.createElement("div");
    errorDiv.className = "form-error-general";
    errorDiv.innerHTML = `
            <div style="
                background: rgba(var(--color-error-rgb, 192, 21, 47), 0.12);
                color: var(--color-error);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin-top: var(--space-16);
                text-align: center;
                border: 1px solid rgba(var(--color-error-rgb, 192, 21, 47), 0.25);
            ">
                ❌ ${errorMessage}
            </div>
        `;

    const form = document.getElementById("contact-form");
    form.appendChild(errorDiv);
  }

  initProjectModals() {
    const projectCards = document.querySelectorAll(".project__card");
    const modal = document.getElementById("project-modal");

    if (!modal || projectCards.length === 0) return;

    const modalClose = modal.querySelector(".modal__close");
    const modalOverlay = modal.querySelector(".modal__overlay");

    // Project data for modals
    const projectData = {
      vegingo: {
        title: "Vegingo E-commerce Platform",
        description:
          "Enhanced e-commerce platform focusing on backend development, API optimization, and database management. Built with Laravel and MySQL, this project showcased my ability to work with complex backend systems and deliver scalable solutions.",
        technologies: ["Laravel", "MySQL", "REST APIs", "PHP", "JavaScript"],
        highlights: [
          "Improved backend performance by 40%",
          "Optimized API endpoints for faster response times",
          "Enhanced data management and database structure",
          "Implemented secure authentication systems",
          "Added comprehensive error handling and logging",
        ],
        outcomes: [
          "Reduced server response time by 35%",
          "Improved user experience with faster page loads",
          "Enhanced data security and integrity",
          "Streamlined development workflow for future updates",
        ],
      },
      payment: {
        title: "Payment Gateway Integration",
        description:
          "Implemented secure payment processing with PhonePe gateway integration. This project involved creating a seamless payment flow with proper error handling, security protocols, and user-friendly interfaces.",
        technologies: [
          "PhonePe API",
          "Laravel",
          "Security Protocols",
          "JavaScript",
          "MySQL",
        ],
        highlights: [
          "Integrated PhonePe payment gateway successfully",
          "Implemented comprehensive security measures",
          "Created intuitive payment flow interface",
          "Added real-time payment status updates",
          "Developed robust error handling system",
        ],
        outcomes: [
          "99.9% payment success rate achieved",
          "Zero security breaches recorded",
          "Improved customer payment experience",
          "Reduced payment processing time by 50%",
        ],
      },
      notification: {
        title: "Push Notification System",
        description:
          "Developed comprehensive push notification system using Firebase Cloud Messaging. The system supports real-time notifications across multiple platforms with advanced targeting and analytics capabilities.",
        technologies: [
          "Firebase",
          "Cloud Messaging",
          "JavaScript",
          "Laravel",
          "Mobile APIs",
        ],
        highlights: [
          "Real-time notification delivery across platforms",
          "Advanced user targeting and segmentation",
          "Comprehensive analytics and reporting",
          "Cross-platform compatibility ensured",
          "Optimized for high-volume message delivery",
        ],
        outcomes: [
          "Achieved 95% notification delivery rate",
          "Increased user engagement by 60%",
          "Reduced notification latency to under 2 seconds",
          "Successfully handled 10,000+ daily notifications",
        ],
      },
    };

    // Open modal when clicking project cards
    projectCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const projectId = card.getAttribute("data-project");
        const project = projectData[projectId];

        if (project) {
          this.showProjectModal(project, modal);
        }
      });
    });

    // Close modal function
    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    };

    // Close modal event listeners
    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener("click", closeModal);
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  showProjectModal(project, modal) {
    const modalBody = document.getElementById("modal-body");

    if (!modalBody) return;

    modalBody.innerHTML = `
            <div class="project-modal">
                <h2 class="project-modal__title" style="
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                    margin-bottom: var(--space-16);
                ">${project.title}</h2>
                
                <p class="project-modal__description" style="
                    font-size: var(--font-size-lg);
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                    margin-bottom: var(--space-24);
                ">${project.description}</p>
                
                <div class="project-modal__section" style="margin-bottom: var(--space-24);">
                    <h3 style="
                        font-size: var(--font-size-xl);
                        font-weight: var(--font-weight-semibold);
                        color: var(--color-primary);
                        margin-bottom: var(--space-12);
                    ">Technologies Used</h3>
                    <div class="project-modal__tech" style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: var(--space-8);
                    ">
                        ${project.technologies
                          .map(
                            (tech) => `
                            <span style="
                                background: var(--color-primary);
                                color: var(--color-btn-primary-text);
                                padding: var(--space-8) var(--space-16);
                                border-radius: var(--radius-full);
                                font-size: var(--font-size-sm);
                                font-weight: var(--font-weight-medium);
                            ">${tech}</span>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="project-modal__section" style="margin-bottom: var(--space-24);">
                    <h3 style="
                        font-size: var(--font-size-xl);
                        font-weight: var(--font-weight-semibold);
                        color: var(--color-primary);
                        margin-bottom: var(--space-12);
                    ">Key Highlights</h3>
                    <ul style="
                        list-style: none;
                        padding: 0;
                    ">
                        ${project.highlights
                          .map(
                            (highlight) => `
                            <li style="
                                padding: var(--space-8) 0;
                                padding-left: var(--space-24);
                                position: relative;
                                color: var(--color-text-secondary);
                                line-height: 1.5;
                            ">
                                <span style="
                                    position: absolute;
                                    left: 0;
                                    color: var(--color-primary);
                                ">✓</span>
                                ${highlight}
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
                
                <div class="project-modal__section">
                    <h3 style="
                        font-size: var(--font-size-xl);
                        font-weight: var(--font-weight-semibold);
                        color: var(--color-primary);
                        margin-bottom: var(--space-12);
                    ">Measurable Outcomes</h3>
                    <ul style="
                        list-style: none;
                        padding: 0;
                    ">
                        ${project.outcomes
                          .map(
                            (outcome) => `
                            <li style="
                                padding: var(--space-8) 0;
                                padding-left: var(--space-24);
                                position: relative;
                                color: var(--color-text-secondary);
                                line-height: 1.5;
                            ">
                                <span style="
                                    position: absolute;
                                    left: 0;
                                    color: var(--color-success);
                                ">📈</span>
                                ${outcome}
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();

  // Add loading animation to page
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);

  // Enhance form inputs with focus effects
  const formInputs = document.querySelectorAll(".form-control");
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      const formGroup = input.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("focused");
      }
    });

    input.addEventListener("blur", () => {
      const formGroup = input.closest(".form-group");
      if (formGroup && !input.value.trim()) {
        formGroup.classList.remove("focused");
      }
    });
  });

  // Add parallax effect to hero section
  const handleParallax = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    const particles = document.querySelector(".hero__particles");

    if (particles) {
      particles.style.transform = `translateY(${rate}px)`;
    }
  };

  window.addEventListener("scroll", handleParallax);

  // Add typing animation to hero title
  const animatedTitle = document.querySelector(".hero__title-line--animated");
  if (animatedTitle) {
    const text = animatedTitle.textContent;
    animatedTitle.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        animatedTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    setTimeout(typeWriter, 1000);
  }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounced scroll handler for performance
const debouncedScrollHandler = debounce(() => {
  // Additional scroll-based animations or updates
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);
