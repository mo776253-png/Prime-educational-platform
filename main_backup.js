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

        // Activation Code Functionality
        function initializeActivationCode() {
            // ========================================
            // TO CHANGE ACTIVATION CODES:
            // 1. Update the validCodes object below with new codes
            // 2. INCREMENT the ACTIVATION_CODE_VERSION (e.g., "1.0.1", "1.1.0", "2.0.0")
            // 3. This will expire ALL existing user sessions
            // ========================================
            var ACTIVATION_CODE_VERSION = "1.0.9";
            
            // AES Encryption Key (keep this secret!)
            var AES_KEY = "Edukate2024SecretKey1234567890123456"; // 32 characters for AES-256
            
            // Simple AES encryption function
            function encryptAES(text, key) {
                try {
                    // Convert key to proper format
                    var keyBytes = CryptoJS.enc.Utf8.parse(key);
                    // Encrypt
                    var encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    return encrypted.toString();
                } catch (e) {
                    console.error('Encryption error:', e);
                    return null;
                }
            }
            
            // Simple AES decryption function
            function decryptAES(encryptedText, key) {
                try {
                    // Convert key to proper format
                    var keyBytes = CryptoJS.enc.Utf8.parse(key);
                    // Decrypt
                    var decrypted = CryptoJS.AES.decrypt(encryptedText, keyBytes, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    return decrypted.toString(CryptoJS.enc.Utf8);
                } catch (e) {
                    console.error('Decryption error:', e);
                    return null;
                }
            }
            
            // Define valid activation codes for each course (10 original codes each)
            var validCodes = {
                'math-est-1': [
                    'MATH7X9K2P4Q', 'EST1M3TH5X7', 'ALG3BR4X9Y2', 'CALC8U1S3V5', 'GEOM6W4E7R9',
                    'TRIG2A5S8D1', 'STAT4F7G0H3', 'PROB6J9K2L5', 'ANAL8M1N4O7', 'DIFF0P3Q6R9'
                ],
                'math-est-2': [
                    'MATH9Y2Z5A8', 'EST2B4C7D0', 'ADV3E6F9G2', 'CALC5H8I1J4', 'LINE7K0L3M6',
                    'MATR9N2O5P8', 'VECT1Q4R7S0', 'LIMI3T6U9V2', 'DERI5W8X1Y4', 'INTE7Z0A3B6'
                ],
                'english-est-1': [
                    'ENG9C2D5E8', 'EST1F4G7H0', 'LITE3I6J9K2', 'GRAM5L8M1N4', 'VOCA7O0P3Q6',
                    'READ9R2S5T8', 'WRIT1U4V7W0', 'COMP3X6Y9Z2', 'ANAL5A8B1C4', 'ESSA7D0E3F6'
                ],
                'biology-est-1': [
                    'BIO9G2H5I8', 'EST1J4K7L0', 'CELL3M6N9O2', 'DNA5P8Q1R4', 'GENE7S0T3U6',
                    'EVOL9V2W5X8', 'ECOL1Y4Z7A0', 'ANAT3B6C9D2', 'PHYS5E8F1G4', 'MOLC7H0I3J6'
                ],
                'biology-est-2': [
                    'BIO9K2L5M8', 'EST2N4O7P0', 'ADV3Q6R9S2', 'MICR5T8U1V4', 'IMMU7W0X3Y6',
                    'NEUR9Z2A5B8', 'ENDO1C4D7E0', 'REPR3F6G9H2', 'DEVE5I8J1K4', 'PHYS7L0M3N6'
                ],
                'chemistry-est-2': [
                    'CHEM9O2P5Q8', 'EST2R4S7T0', 'ADV3U6V9W2', 'ORGA5X8Y1Z4', 'INOR7A0B3C6',
                    'PHYS9D2E5F8', 'ANAL1G4H7I0', 'THER3J6K9L2', 'KINE5M8N1O4', 'ELEC7P0Q3R6'
                ]
            };

            // Get current course ID from URL or page
            function getCurrentCourseId() {
                var currentPage = window.location.pathname.split('/').pop();
                var courseMapping = {
                    'detail.html': 'math-est-1',
                    'detail2.html': 'math-est-2',
                    'detail3.html': 'english-est-1',
                    'detail4.html': 'biology-est-1',
                    'detail5.html': 'biology-est-2',
                    'detail6.html': 'chemistry-est-2'
                };
                return courseMapping[currentPage] || 'math-est-1';
            }

            // Check if course is already activated and version is valid
            function isCourseActivated(courseId) {
                var activatedCourses = JSON.parse(localStorage.getItem('activatedCourses') || '{}');
                var courseData = activatedCourses[courseId];
                
                if (!courseData || !courseData.activated) {
                    return false;
                }
                
                // Check if the activation was done with the current version
                if (courseData.version !== ACTIVATION_CODE_VERSION) {
                    // Version mismatch - session expired
                    return false;
                }
                
                return true;
            }
            
            // Clear expired activations (when version changes)
            function clearExpiredActivations() {
                var activatedCourses = JSON.parse(localStorage.getItem('activatedCourses') || '{}');
                var hasExpired = false;
                
                for (var courseId in activatedCourses) {
                    if (activatedCourses[courseId].version !== ACTIVATION_CODE_VERSION) {
                        delete activatedCourses[courseId];
                        hasExpired = true;
                    }
                }
                
                if (hasExpired) {
                    localStorage.setItem('activatedCourses', JSON.stringify(activatedCourses));
                    // Show notification about session expiry
                    showSessionExpiredNotification();
                }
            }
            
            // Show notification when sessions expire
            function showSessionExpiredNotification() {
                // Create a notification element
                var notification = $('<div class="alert alert-warning alert-dismissible fade show" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">' +
                    '<strong>Session Expired!</strong><br>' +
                    'Activation codes have been updated. Please re-enter your activation code to continue.' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>');
                
                $('body').append(notification);
                
                // Auto-remove after 10 seconds
                setTimeout(function() {
                    notification.alert('close');
                }, 10000);
            }

            // Update button visibility based on activation status
            function updateButtonVisibility(courseId) {
                var enrollBtn = $('#enroll-btn');
                var activationBtn = $('#activation-btn');
                var viewCourseBtn = $('#view-course-btn');

                if (isCourseActivated(courseId)) {
                    // Course is activated - hide Details and Activation Code, show View Course
                    enrollBtn.hide();
                    activationBtn.hide();
                    viewCourseBtn.show();
                } else {
                    // Course not activated - show Details and Activation Code, hide View Course
                    enrollBtn.show();
                    activationBtn.show();
                    viewCourseBtn.hide();
                }
            }

            // Handle activation form submission
            $('#activationForm').on('submit', function(e) {
                e.preventDefault();
                
                var activationCode = $('#activationCode').val().trim().toUpperCase();
                var courseId = getCurrentCourseId();
                var validCodesForCourse = validCodes[courseId] || [];
                
                // Hide previous messages
                $('#activationError').hide();
                $('#activationSuccess').hide();
                
                if (!activationCode) {
                    $('#activationError').text('Please enter an activation code.').show();
                    return;
                }
                
                // Encrypt the entered code and check if it matches any valid encrypted code
                var encryptedInputCode = encryptAES(activationCode, AES_KEY);
                var isValidCode = false;
                
                if (encryptedInputCode) {
                    // Check against all valid codes (encrypt each one and compare)
                    for (var i = 0; i < validCodesForCourse.length; i++) {
                        var encryptedValidCode = encryptAES(validCodesForCourse[i], AES_KEY);
                        if (encryptedInputCode === encryptedValidCode) {
                            isValidCode = true;
                            break;
                        }
                    }
                }
                
                if (isValidCode) {
                    // Valid code - show success message
                    $('#activationSuccess').text('Activation successful! Course unlocked.').show();
                    
                    // Store activation in localStorage with version (store encrypted code)
                    var activatedCourses = JSON.parse(localStorage.getItem('activatedCourses') || '{}');
                    activatedCourses[courseId] = {
                        activated: true,
                        code: encryptedInputCode, // Store encrypted version
                        version: ACTIVATION_CODE_VERSION,
                        activatedAt: new Date().toISOString()
                    };
                    localStorage.setItem('activatedCourses', JSON.stringify(activatedCourses));
                    
                    // Update button visibility immediately
                    updateButtonVisibility(courseId);
                    
                    // Close modal after 1.5 seconds
                    setTimeout(function() {
                        $('#activationModal').modal('hide');
                    }, 1500);
                    
                } else {
                    // Invalid code
                    $('#activationError').text('Invalid activation code. Please check and try again.').show();
                }
            });

            // Handle View Course button click
            $('#view-course-btn').on('click', function() {
                var courseId = getCurrentCourseId();
                var courseContentMapping = {
                    'math-est-1': 'course-content-math-est-1.html',
                    'math-est-2': 'course-content-math-est-2.html',
                    'english-est-1': 'course-content-english-est-1.html',
                    'biology-est-1': 'course-content-biology-est-1.html',
                    'biology-est-2': 'course-content-biology-est-2.html',
                    'chemistry-est-2': 'course-content-chemistry-est-2.html'
                };
                
                var contentUrl = courseContentMapping[courseId];
                if (contentUrl) {
                    window.location.href = contentUrl;
                } else {
                    alert('Course content not available yet.');
                }
            });
            
            // Clear form when modal is closed
            $('#activationModal').on('hidden.bs.modal', function() {
                $('#activationCode').val('');
                $('#activationError').hide();
                $('#activationSuccess').hide();
            });

            // Initialize button visibility on page load
            var courseId = getCurrentCourseId();
            
            // Check for expired sessions first
            clearExpiredActivations();
            
            // Update button visibility
            updateButtonVisibility(courseId);
        }
        
        // Initialize activation code functionality
        initializeActivationCode();

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

