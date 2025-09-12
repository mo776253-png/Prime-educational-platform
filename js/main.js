(function ($) {
    "use strict";
    // Set Details button link on course detail page based on ?course= param
    $(document).ready(function () {
        var enrollBtn = document.getElementById('enroll-btn');
        if (!enrollBtn) return;

        var params = new URLSearchParams(window.location.search);
        var courseKey = (params.get('course') || '').toLowerCase();

        var courseToFormUrl = {
            'math-est-1': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog',
            'math-est-2': 'https://docs.google.com/forms/d/EXAMPLE_MATH_EST_2/viewform',
            'english-est-1': 'https://docs.google.com/forms/d/EXAMPLE_ENGLISH_EST_1/viewform',
            'biology-est-1': 'https://docs.google.com/forms/d/EXAMPLE_BIOLOGY_EST_1/viewform',
            'biology-est-2': 'https://docs.google.com/forms/d/EXAMPLE_BIOLOGY_EST_2/viewform',
            'chemistry-est-2': 'https://docs.google.com/forms/d/EXAMPLE_CHEMISTRY_EST_2/viewform'
        };

        // Course content page mapping
        var courseToContentUrl = {
            'math-est-1': 'course-content-math-est-1.html',
            'math-est-2': 'course-content-math-est-2.html',
            'english-est-1': 'course-content-english-est-1.html',
            'biology-est-1': 'course-content-biology-est-1.html',
            'biology-est-2': 'course-content-biology-est-2.html',
            'chemistry-est-2': 'course-content-chemistry-est-2.html'
        };

        var fallbackUrl = 'https://docs.google.com/forms';
        var targetUrl = courseToFormUrl[courseKey] || fallbackUrl;

        // Also add the course key as a query for tracking, if present
        try {
            var url = new URL(targetUrl);
            if (courseKey) {
                url.searchParams.set('course', courseKey);
            }
            enrollBtn.href = url.toString();
        } catch (e) {
            enrollBtn.href = targetUrl;
        }

        // Auth-gate: require login before proceeding to enroll
        var usersKey = 'ptp_users';
        function loadUsers(){
            try{ return JSON.parse(localStorage.getItem(usersKey)) || []; }catch(e){ return []; }
        }
        function isLoggedIn() {
            return !!localStorage.getItem('ptp_user_email');
        }

        function completeLogin(username) {
            localStorage.setItem('ptp_user_email', username);
            localStorage.setItem('current_user', username);
        }

        function checkCourseAccessAndRedirect() {
            var currentUser = localStorage.getItem('current_user');
            if (!currentUser) {
                openAuthModal();
                return;
            }

            var params = new URLSearchParams(window.location.search);
            var courseKey = (params.get('course') || '').toLowerCase();
            
            if (!courseKey) {
                // Try to determine course from current page
                var currentPage = window.location.pathname.split('/').pop();
                var courseMapping = {
                    'detail.html': 'math-est-1',
                    'detail2.html': 'math-est-2',
                    'detail3.html': 'english-est-1',
                    'detail4.html': 'biology-est-1',
                    'detail5.html': 'biology-est-2',
                    'detail6.html': 'chemistry-est-2'
                };
                courseKey = courseMapping[currentPage];
            }

            if (!courseKey) {
                alert('Unable to determine course. Please try again.');
                return;
            }

            // Check if user has access to this course
            if (typeof checkCourseAccess === 'function' && checkCourseAccess(currentUser, courseKey)) {
                // User has access - redirect to course content
                var contentUrl = courseToContentUrl[courseKey];
                if (contentUrl) {
                    window.location.href = contentUrl;
                } else {
                    alert('Course content not available yet.');
                }
            } else {
                // User doesn't have access - redirect to Google form
                var formUrl = courseToFormUrl[courseKey] || 'https://docs.google.com/forms';
                try {
                    var url = new URL(formUrl);
                    if (courseKey) {
                        url.searchParams.set('course', courseKey);
                    }
                    window.open(url.toString(), '_blank');
                } catch (e) {
                    window.open(formUrl, '_blank');
                }
            }
        }

        function openAuthModal() {
            var $modal = $('#authModal');
            if ($modal.length) {
                $modal.modal('show');
            }
        }

        // Intercept details click - check if user is logged in and has access
        $(enrollBtn).on('click', function (e) {
            if (!isLoggedIn()) {
                e.preventDefault();
                openAuthModal();
            } else {
                // User is logged in, check if they have course access
                e.preventDefault();
                checkCourseAccessAndRedirect();
            }
        });

        // Handle auth form submit (validate using users managed from admin.html)
        $('#authForm').on('submit', function (e) {
            e.preventDefault();
            var username = ($('#authEmail').val() || '').trim();
            var password = ($('#authPassword').val() || '').trim();
            if (!username || !password) {
                $('#authError').text('Please enter username and password.').show();
                return;
            }
            var users = loadUsers();
            var found = users.find(function(u){ return u.username === username && u.password === password; });
            if(!found){
                $('#authError').text('Invalid username or password.').show();
                return;
            }
            // Success: mark as logged in
            completeLogin(username);
            $('#authError').hide();
            $('#authModal').modal('hide');
            // Check course access and redirect accordingly
            checkCourseAccessAndRedirect();
        });

        // Make functions available globally
        window.checkCourseAccessAndRedirect = checkCourseAccessAndRedirect;
    });
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Courses carousel
    $(".courses-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        loop: true,
        dots: false,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
    });


    // Related carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });
    
})(jQuery);

