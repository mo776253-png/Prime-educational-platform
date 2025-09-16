// Protected version that uses dynamic code loading
(function() {
    'use strict';
    
    var ACTIVATION_CODE_VERSION = "1.0.0";
    var AES_KEY = "Edukate2024SecretKey1234567890123456";
    
    // Wait for codes to load
    function waitForCodes(callback) {
        if (window.activationCodes) {
            callback();
        } else {
            setTimeout(function() {
                waitForCodes(callback);
            }, 100);
        }
    }
    
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
        
        for (var page in courseMapping) {
            if (currentPage === page) {
                return courseMapping[page];
            }
        }
        return null;
    }
    
    function isCourseActivated(courseId) {
        var activatedCourses = JSON.parse(localStorage.getItem('activatedCourses') || '{}');
        return activatedCourses[courseId] && 
               activatedCourses[courseId].activated && 
               activatedCourses[courseId].version === ACTIVATION_CODE_VERSION;
    }
    
    function updateButtonVisibility(courseId) {
        var enrollBtn = document.getElementById('enroll-btn');
        var activationBtn = document.getElementById('activation-btn');
        var viewCourseBtn = document.getElementById('view-course-btn');
        
        if (isCourseActivated(courseId)) {
            if (enrollBtn) enrollBtn.style.display = 'none';
            if (activationBtn) activationBtn.style.display = 'none';
            if (viewCourseBtn) viewCourseBtn.style.display = 'block';
        } else {
            if (enrollBtn) enrollBtn.style.display = 'block';
            if (activationBtn) activationBtn.style.display = 'block';
            if (viewCourseBtn) viewCourseBtn.style.display = 'none';
        }
    }
    
    function clearExpiredActivations() {
        var activatedCourses = JSON.parse(localStorage.getItem('activatedCourses') || '{}');
        var hasExpired = false;
        
        for (var courseId in activatedCourses) {
            if (activatedCourses[courseId].version !== ACTIVATION_CODE_VERSION) {
                delete activatedCourses[courseId];
                hasExpired = true;
            }
        }
        
        localStorage.setItem('activatedCourses', JSON.stringify(activatedCourses));
        
        if (hasExpired) {
            showSessionExpiredNotification();
        }
    }
    
    function showSessionExpiredNotification() {
        var notification = document.createElement('div');
        notification.className = 'alert alert-warning alert-dismissible fade show position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        notification.innerHTML = '<strong>Session Expired!</strong> Activation codes have been updated. Please re-enter your activation code.<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>';
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.remove();
        }, 5000);
    }
    
    // Wait for jQuery and codes to load, then initialize
    function waitForJQueryAndCodes(callback) {
        if (typeof $ !== 'undefined' && window.activationCodes) {
            callback();
        } else {
            setTimeout(function() {
                waitForJQueryAndCodes(callback);
            }, 100);
        }
    }
    
    // Add direct fallback for activation button (doesn't require jQuery)
    function addDirectActivationHandler() {
        var activationBtn = document.getElementById('activation-btn');
        if (activationBtn) {
            activationBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var modal = document.getElementById('activationModal');
                if (modal) {
                    modal.style.display = 'block';
                    modal.classList.add('show');
                    document.body.classList.add('modal-open');
                    
                    // Add backdrop
                    var backdrop = document.createElement('div');
                    backdrop.className = 'modal-backdrop fade show';
                    backdrop.id = 'modal-backdrop';
                    document.body.appendChild(backdrop);
                    
                    // Close modal when backdrop is clicked
                    backdrop.addEventListener('click', function() {
                        modal.style.display = 'none';
                        modal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                        backdrop.remove();
                    });
                    
                    // Close modal when close button is clicked
                    var closeBtn = modal.querySelector('.close');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', function() {
                            modal.style.display = 'none';
                            modal.classList.remove('show');
                            document.body.classList.remove('modal-open');
                            backdrop.remove();
                        });
                    }
                } else {
                    alert('Activation modal not found. Please refresh the page.');
                }
            });
        }
    }
    
    // Add direct fallback for Details button
    function addDirectDetailsHandler() {
        var detailsBtn = document.getElementById('enroll-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var href = this.getAttribute('href');
                if (!href || href === '#' || href === '') {
                    href = 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog';
                }
                
                try {
                    window.open(href, '_blank', 'noopener');
                } catch (err) {
                    window.location.href = href;
                }
            });
        }
    }
    
    // Add direct handlers immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addDirectActivationHandler();
            addDirectDetailsHandler();
        });
    } else {
        addDirectActivationHandler();
        addDirectDetailsHandler();
    }

    waitForJQueryAndCodes(function() {
        // Wait for document ready
        $(document).ready(function() {
            // Debug: Log that scripts are loaded
            console.log('Scripts loaded successfully');
            console.log('Activation codes available:', window.activationCodes);
            // Set Details button link on course detail page based on current page
            var enrollBtn = document.getElementById('enroll-btn');
            if (enrollBtn) {
                var courseId = getCurrentCourseId();
                
                var courseToFormUrl = {
                    'math-est-1': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog',
                    'math-est-2': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog',
                    'english-est-1': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog',
                    'biology-est-1': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog',
                    'biology-est-2': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog',
                    'chemistry-est-2': 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog'
                };

                var fallbackUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeO6FMQyeVrbVhYPBFhWqPBFjoQSpNeBC6p05BM1_A8sCCKrQ/viewform?usp=dialog';
                var targetUrl = courseToFormUrl[courseId] || fallbackUrl;

                // Add the course ID as a query parameter for tracking
                try {
                    var url = new URL(targetUrl);
                    if (courseId) {
                        url.searchParams.set('course', courseId);
                    }
                    enrollBtn.href = url.toString();
                } catch (e) {
                    enrollBtn.href = targetUrl;
                }

                // Force open on click if navigation is prevented elsewhere
                $('#enroll-btn').off('click.__force').on('click.__force', function(event) {
                    try {
                        // Some environments block default navigation; ensure it opens
                        var href = this.getAttribute('href');
                        if (!href || href === '#' || href === '') {
                            href = targetUrl;
                        }
                        // Always open in a new tab
                        event.preventDefault();
                        window.open(href, '_blank', 'noopener');
                    } catch (_) {
                        // As a last resort, set location
                        window.location.href = targetUrl;
                    }
                });
            }
            // Fallback: ensure Activation modal opens on click even if data attributes fail
            $('#activation-btn').on('click', function(evt) {
                try {
                    // If button is inside a link, prevent navigation
                    evt.preventDefault();
                } catch (_) {}
                
                // Force show modal with multiple methods
                try {
                    $('#activationModal').modal('show');
                } catch (e1) {
                    try {
                        // Alternative method if Bootstrap modal fails
                        $('#activationModal').show();
                        $('#activationModal').addClass('show');
                        $('body').addClass('modal-open');
                    } catch (e2) {
                        console.error('Modal failed to open:', e2);
                        // Last resort - show alert
                        alert('Activation modal failed to open. Please refresh the page and try again.');
                    }
                }
            });
            // Activation form submission
            $('#activationForm').on('submit', function(e) {
            e.preventDefault();
            
            var activationCode = $('#activationCode').val().trim().toUpperCase();
            var courseId = getCurrentCourseId();
            var validCodesForCourse = window.activationCodes[courseId] || [];
            
            // Debug: Log activation attempt
            console.log('Activation attempt:', {
                code: activationCode,
                courseId: courseId,
                validCodes: validCodesForCourse
            });
            
            // Hide previous messages
            $('#activationError').hide();
            $('#activationSuccess').hide();
            
            if (!activationCode) {
                $('#activationError').text('Please enter an activation code.').show();
                return;
            }
            
            // Check if the entered code matches any valid original code
            var isValidCode = validCodesForCourse.includes(activationCode);
            
            if (isValidCode) {
                // Valid code - show success message
                $('#activationSuccess').text('Activation successful! Course unlocked.').show();
                
                // Store activation in localStorage with version
                var activatedCourses = JSON.parse(localStorage.getItem('activatedCourses') || '{}');
                activatedCourses[courseId] = {
                    activated: true,
                    code: activationCode,
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
                $('#activationError').text('Invalid activation code. Please try again.').show();
                $('#activationCode').val('');
            }
        });
        
        // View course button click
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
            
            if (courseContentMapping[courseId]) {
                window.location.href = courseContentMapping[courseId];
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
        });
    });
    
})();
