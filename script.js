document.addEventListener('DOMContentLoaded', function() {

    /* =====================================================================
       ۰. سیستم دو زبانه
       ===================================================================== */
    var currentLang = localStorage.getItem('lang') || 'fa';
    var typeTimeout, eraseTimeout;
    var textArrayIndex = 0, charIndex = 0;
    
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.setAttribute('lang', translations[lang].lang);
        document.documentElement.setAttribute('dir', translations[lang].dir);
        
        // ترجمه عناصر ساده
        var elements = document.querySelectorAll('[data-translate]');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var key = el.getAttribute('data-translate');
            if (translations[lang][key] !== undefined) {
                // فقط اگه عنصر بچه نداشته باشه یا بچه‌هاش تگ‌های ساده باشن
                if (el.children.length === 0 || el.querySelector('i, strong, span') === null) {
                    el.textContent = translations[lang][key];
                } else if (el.children.length <= 2) {
                    el.innerHTML = translations[lang][key];
                }
            }
        }
        
        // ترجمه دستی بخش‌های خاص
        translateSpecialSections();
        
        updateLangButton();
        resetTyping();
    }
    
    function translateSpecialSections() {
        // ترجمه about-list
        var aboutItems = document.querySelectorAll('.about-list li');
        if (aboutItems.length >= 4) {
            var labels = ['about_list_name', 'about_list_email', 'about_list_phone', 'about_list_location'];
            var values = ['about_name_value', 'about_email_value', 'about_phone_value', 'about_location_value'];
            
            for (var i = 0; i < 4; i++) {
                var strong = aboutItems[i].querySelector('strong');
                var icon = aboutItems[i].querySelector('i');
                if (strong) strong.textContent = translations[currentLang][labels[i]];
                // مقدار بعد از strong رو عوض کن
                var textNode = aboutItems[i].lastChild;
                if (textNode && textNode.nodeType === 3) {
                    textNode.textContent = ' ' + translations[currentLang][values[i]];
                }
            }
        }
        
        // ترجمه پورتفولیو آیتم‌ها
        var portfolioItems = document.querySelectorAll('.portfolio-item');
        for (var j = 0; j < portfolioItems.length; j++) {
            var num = j + 1;
            var titleKey = 'portfolio' + num + '_title';
            var catKey = 'portfolio' + num + '_cat';
            var techKey = 'portfolio' + num + '_tech';
            var descKey = 'portfolio' + num + '_desc';
            
            if (translations[currentLang][titleKey]) {
                portfolioItems[j].setAttribute('data-title', translations[currentLang][titleKey]);
                var h3 = portfolioItems[j].querySelector('.portfolio-overlay h3');
                if (h3) h3.textContent = translations[currentLang][titleKey];
            }
            if (translations[currentLang][catKey]) {
                var p = portfolioItems[j].querySelector('.portfolio-overlay p');
                if (p) p.textContent = translations[currentLang][catKey];
            }
            if (translations[currentLang][techKey]) {
                portfolioItems[j].setAttribute('data-tech', translations[currentLang][techKey]);
            }
            if (translations[currentLang][descKey]) {
                portfolioItems[j].setAttribute('data-desc', translations[currentLang][descKey]);
            }
        }
        
        // ترجمه فوتر
        var footerLis = document.querySelectorAll('.footer-contact ul li');
        if (footerLis.length >= 3) {
            var footerData = [
                { icon: 'fa-location-dot', text: translations[currentLang].footer_address },
                { icon: 'fa-phone', text: translations[currentLang].footer_phone },
                { icon: 'fa-envelope', text: translations[currentLang].footer_email }
            ];
            
            for (var k = 0; k < 3; k++) {
                var icon = footerLis[k].querySelector('i');
                if (icon) {
                    footerLis[k].innerHTML = '<i class="fa-solid ' + footerData[k].icon + '"></i> ' + footerData[k].text;
                }
            }
        }
        
        // ترجمه contact detail items
        var contactItems = document.querySelectorAll('.contact-detail-item');
        if (contactItems.length >= 3) {
            var contactLabels = ['contact_phone_label', 'contact_email_label', 'contact_address_label'];
            var contactValues = ['contact_phone_value', 'contact_email_value', 'contact_address_value'];
            
            for (var m = 0; m < 3; m++) {
                var h4 = contactItems[m].querySelector('h4');
                var p = contactItems[m].querySelector('p');
                if (h4) h4.textContent = translations[currentLang][contactLabels[m]];
                if (p) p.textContent = translations[currentLang][contactValues[m]];
            }
        }
        
        // ترجمه لیبل‌های فرم
        var formLabels = {
            'name': 'form_name_label',
            'email': 'form_email_label',
            'message': 'form_message_label'
        };
        for (var id in formLabels) {
            var label = document.querySelector('label[for="' + id + '"]');
            if (label) label.textContent = translations[currentLang][formLabels[id]];
        }
        
        // ترجمه دکمه submit فرم
        var submitSpan = document.querySelector('.submit-btn span');
        if (submitSpan) submitSpan.textContent = translations[currentLang].form_submit;
        
        // ترجمه success message
        var successDiv = document.getElementById('form-success');
        if (successDiv) successDiv.textContent = translations[currentLang].form_success;
        
        // ترجمه lightbox
        var lightboxTechLabel = document.querySelector('.lightbox-tech strong');
        if (lightboxTechLabel) lightboxTechLabel.textContent = translations[currentLang].lightbox_tech_label;
        
        var lightboxBtn = document.querySelector('.lightbox-info-side .btn');
        if (lightboxBtn) lightboxBtn.textContent = translations[currentLang].lightbox_btn;
    }
    
    function updateLangButton() {
        var btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.innerHTML = currentLang === 'fa' ? 
                '<span style="margin-right:5px;">🇬🇧</span> English' : 
                '<span style="margin-right:5px;">🇮🇷</span> فارسی';
        }
    }
    
    // ایجاد دکمه زبان
    (function() {
        var headerActions = document.querySelector('.header-actions');
        if (headerActions && !document.getElementById('lang-toggle')) {
            var langBtn = document.createElement('button');
            langBtn.id = 'lang-toggle';
            langBtn.className = 'btn-icon lang-toggle-btn';
            langBtn.style.cssText = 'font-size:0.9rem;font-weight:600;padding:6px 14px;background:var(--bg-alt);border:1px solid var(--border-color);border-radius:25px;cursor:pointer;transition:all 0.3s;font-family:inherit;';
            langBtn.innerHTML = currentLang === 'fa' ? 
                '<span style="margin-right:5px;">🇬🇧</span> English' : 
                '<span style="margin-right:5px;">🇮🇷</span> فارسی';
            
            langBtn.addEventListener('mouseenter', function() {
                this.style.background = 'var(--accent-color)';
                this.style.color = '#fff';
                this.style.borderColor = 'var(--accent-color)';
            });
            langBtn.addEventListener('mouseleave', function() {
                this.style.background = 'var(--bg-alt)';
                this.style.color = 'var(--text-primary)';
                this.style.borderColor = 'var(--border-color)';
            });
            
            langBtn.addEventListener('click', function() {
                applyLanguage(currentLang === 'fa' ? 'en' : 'fa');
            });
            
            var themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) {
                headerActions.insertBefore(langBtn, themeBtn);
            } else {
                headerActions.appendChild(langBtn);
            }
        }
    })();
    
    applyLanguage(currentLang);

    /* =====================================================================
       ۱. تم تاریک و روشن
       ===================================================================== */
    var themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        var themeIcon = themeToggleBtn.querySelector('i');
        if (localStorage.getItem('theme') === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        themeToggleBtn.addEventListener('click', function() {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

    /* =====================================================================
       ۲. منوی همبرگری موبایل
       ===================================================================== */
    var hamburgerBtn = document.getElementById('hamburger-menu');
    var navLinks = document.querySelector('.nav-links');
    if (hamburgerBtn) {
        var menuIcon = hamburgerBtn.querySelector('i');
        hamburgerBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            if (navLinks.classList.contains('show')) {
                menuIcon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                menuIcon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    /* =====================================================================
       ۳. افکت ذره‌ای متحرک
       ===================================================================== */
    var canvas = document.getElementById('particles-canvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particlesArray = [];
        var numberOfParticles = 60;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        var Particle = function() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
        };
        
        Particle.prototype.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        };
        
        Particle.prototype.draw = function() {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        };
        
        function initParticles() {
            for (var i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }

    /* =====================================================================
       ۴. افکت تایپ اتوماتیک
       ===================================================================== */
    var typedTextSpan = document.getElementById("typed-output");
    
    function resetTyping() {
        if (typedTextSpan) {
            typedTextSpan.textContent = '';
            textArrayIndex = 0;
            charIndex = 0;
            clearTimeout(typeTimeout);
            clearTimeout(eraseTimeout);
            startTyping();
        }
    }
    
    function startTyping() {
        if (!typedTextSpan) return;
        typeTimeout = setTimeout(type, 500);
    }
    
    function type() {
        var textArray = translations[currentLang].typing_texts;
        if (!textArray) return;
        
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            typeTimeout = setTimeout(type, 80);
        } else {
            eraseTimeout = setTimeout(erase, 2500);
        }
    }
    
    function erase() {
        var textArray = translations[currentLang].typing_texts;
        if (!textArray) return;
        
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            eraseTimeout = setTimeout(erase, 40);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            typeTimeout = setTimeout(type, 600);
        }
    }
    
    if (typedTextSpan) {
        typeTimeout = setTimeout(type, 500);
    }

    /* =====================================================================
       ۵. افکت سه‌بعدی کارت‌ها
       ===================================================================== */
    var cards = document.querySelectorAll('.service-card');
    for (var i = 0; i < cards.length; i++) {
        (function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left - (rect.width / 2);
                var y = e.clientY - rect.top - (rect.height / 2);
                card.style.transform = 'perspective(1000px) rotateX(' + (-y / 12) + 'deg) rotateY(' + (x / 12) + 'deg) translateY(-8px)';
            });
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        })(cards[i]);
    }

    /* =====================================================================
       ۶. نوار مهارت‌ها
       ===================================================================== */
    var progressBars = document.querySelectorAll('.progress');
    if (progressBars.length > 0) {
        setTimeout(function() {
            for (var i = 0; i < progressBars.length; i++) {
                progressBars[i].style.width = progressBars[i].getAttribute('data-width');
            }
        }, 400);
    }

    /* =====================================================================
       ۷. اسلایدر قبل و بعد
       ===================================================================== */
    var sliderContainer = document.querySelector('.before-after-container');
    if (sliderContainer) {
        var resizeWrapper = sliderContainer.querySelector('.resize-img-wrapper');
        var handle = sliderContainer.querySelector('.handle-bar');
        
        function moveSlider(x) {
            var rect = sliderContainer.getBoundingClientRect();
            var position = ((x - rect.left) / rect.width) * 100;
            if (position < 0) position = 0;
            if (position > 100) position = 100;
            handle.style.left = position + '%';
            resizeWrapper.style.width = position + '%';
        }
        
        sliderContainer.addEventListener('mousemove', function(e) {
            moveSlider(e.clientX);
        });
        sliderContainer.addEventListener('touchmove', function(e) {
            moveSlider(e.touches[0].clientX);
        });
    }

    /* =====================================================================
       ۸. فیلتر گالری
       ===================================================================== */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length > 0) {
        for (var i = 0; i < filterBtns.length; i++) {
            filterBtns[i].addEventListener('click', function() {
                for (var j = 0; j < filterBtns.length; j++) {
                    filterBtns[j].classList.remove('active');
                }
                this.classList.add('active');
                var filterValue = this.getAttribute('data-filter');
                
                for (var k = 0; k < galleryItems.length; k++) {
                    if (filterValue === 'all' || galleryItems[k].getAttribute('data-category') === filterValue) {
                        galleryItems[k].classList.remove('hidden');
                    } else {
                        galleryItems[k].classList.add('hidden');
                    }
                }
            });
        }
    }

    /* =====================================================================
       ۹. لایت‌باکس
       ===================================================================== */
    var lightbox = document.getElementById('portfolio-lightbox');
    if (lightbox) {
        var lightboxImg = document.getElementById('lightbox-img');
        var lightboxTitle = document.getElementById('lightbox-title');
        var lightboxTech = document.getElementById('lightbox-tech-tags');
        var lightboxDesc = document.getElementById('lightbox-desc');
        var closeBtn = document.querySelector('.lightbox-close');
        
        for (var i = 0; i < galleryItems.length; i++) {
            galleryItems[i].addEventListener('click', function() {
                lightboxImg.src = this.querySelector('.portfolio-img').src;
                lightboxTitle.textContent = this.getAttribute('data-title');
                lightboxTech.textContent = this.getAttribute('data-tech');
                lightboxDesc.textContent = this.getAttribute('data-desc');
                lightbox.classList.add('show');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                lightbox.classList.remove('show');
            });
        }
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
            }
        });
    }

    /* =====================================================================
       ۱۰. انیمیشن اسکرول
       ===================================================================== */
    var reveals = document.querySelectorAll(".reveal");
    function revealOnScroll() {
        for (var i = 0; i < reveals.length; i++) {
            if (reveals[i].getBoundingClientRect().top < window.innerHeight - 30) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    /* =====================================================================
       ۱۱. فرم تماس
       ===================================================================== */
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var isValid = true;
            var nameInput = document.getElementById('name');
            var emailInput = document.getElementById('email');
            var messageInput = document.getElementById('message');
            
            document.getElementById('name-error').textContent = '';
            document.getElementById('email-error').textContent = '';
            document.getElementById('message-error').textContent = '';
            document.getElementById('form-success').style.display = 'none';
            
            if (!nameInput.value.trim()) {
                document.getElementById('name-error').textContent = translations[currentLang].form_error_name || 'لطفاً نام خود را وارد کنید.';
                isValid = false;
            }
            if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                document.getElementById('email-error').textContent = translations[currentLang].form_error_email || 'آدرس ایمیل نامعتبر است.';
                isValid = false;
            }
            if (!messageInput.value.trim()) {
                document.getElementById('message-error').textContent = translations[currentLang].form_error_message || 'متن پیام نمی‌تواند خالی باشد.';
                isValid = false;
            }
            
            if (!isValid) return;
            
            var btn = contactForm.querySelector('.submit-btn');
            var originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (translations[currentLang].form_sending || 'در حال ارسال...');
            
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameInput.value, email: emailInput.value, message: messageInput.value })
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.success) {
                    document.getElementById('form-success').style.display = 'block';
                    document.getElementById('form-success').textContent = translations[currentLang].form_success || 'پیام شما با موفقیت ارسال شد!';
                    contactForm.reset();
                } else {
                    alert(translations[currentLang].form_fail || 'ارسال ناموفق بود');
                }
            })
            .catch(function(error) {
                console.log(error);
                alert(translations[currentLang].form_error_connection || 'خطا در اتصال');
            })
            .finally(function() {
                btn.innerHTML = originalContent;
            });
        });
    }

    console.log('✅ سایت آماده است! زبان فعلی: ' + currentLang);
});