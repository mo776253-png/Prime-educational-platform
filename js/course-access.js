// Course Access Control Utility
// This file provides functions to check user access to specific courses

// Course mapping for easy reference
var COURSE_MAPPING = {
    'detail.html': 'math-est-1',
    'detail2.html': 'math-est-2', 
    'detail3.html': 'english-est-1',
    'detail4.html': 'biology-est-1',
    'detail5.html': 'biology-est-2',
    'detail6.html': 'chemistry-est-2'
};

// Course content page mapping
var COURSE_CONTENT_MAPPING = {
    'math-est-1': 'course-content-math-est-1.html',
    'math-est-2': 'course-content-math-est-2.html',
    'english-est-1': 'course-content-english-est-1.html',
    'biology-est-1': 'course-content-biology-est-1.html',
    'biology-est-2': 'course-content-biology-est-2.html',
    'chemistry-est-2': 'course-content-chemistry-est-2.html'
};

function getCurrentCourseId() {
    var currentPage = window.location.pathname.split('/').pop();
    return COURSE_MAPPING[currentPage] || null;
}

function checkUserAccess(courseId) {
    // Get current user from localStorage or session
    var currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
        showAccessDenied('Please log in to access courses.');
        return false;
    }
    
    // If no courseId provided, try to detect from current page
    if (!courseId) {
        courseId = getCurrentCourseId();
    }
    
    // Check if user has active course access for specific course
    if (typeof checkCourseAccess === 'function') {
        if (!checkCourseAccess(currentUser, courseId)) {
            var activationInfo = getUserCourseActivationInfo(currentUser, courseId);
            if (activationInfo && activationInfo.expires) {
                showAccessDenied('Your access to this course has expired. Please contact administrator to renew access.');
            } else {
                showAccessDenied('You do not have access to this course. Please contact administrator.');
            }
            return false;
        }
    } else {
        // Fallback if admin functions are not loaded
        console.warn('Course access control not available. Please ensure admin.html is loaded.');
        return true;
    }
    
    return true;
}

function showAccessDenied(message) {
    // Create a modal or alert to show access denied message
    var modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Access Denied</h5>
                    <button type="button" class="close text-white" onclick="this.closest('.modal').remove()">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                    <p><strong>Contact Administrator:</strong> admin@example.com</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="window.location.href='index.html'">Go Home</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showAccessInfo(courseId) {
    var currentUser = localStorage.getItem('current_user');
    if (!currentUser) return;
    
    // If no courseId provided, try to detect from current page
    if (!courseId) {
        courseId = getCurrentCourseId();
    }
    
    if (typeof getUserCourseActivationInfo === 'function') {
        var activationInfo = getUserCourseActivationInfo(currentUser, courseId);
        if (activationInfo) {
            var courseName = getCourseName(courseId);
            var message = activationInfo.active ? 
                `Your access to ${courseName} is active. ${activationInfo.daysLeft} days remaining.` :
                `Your access to ${courseName} has expired.`;
            
            // Show a subtle notification
            var notification = document.createElement('div');
            notification.className = 'alert alert-info alert-dismissible fade show position-fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.zIndex = '9999';
            notification.innerHTML = `
                ${message}
                <button type="button" class="close" onclick="this.parentElement.remove()">
                    <span>&times;</span>
                </button>
            `;
            document.body.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
    }
}

function getCourseName(courseId) {
    var courseNames = {
        'math-est-1': 'Math Course EST 1',
        'math-est-2': 'Math Course EST 2',
        'english-est-1': 'English Course EST 1',
        'biology-est-1': 'Biology Course EST 1',
        'biology-est-2': 'Biology Course EST 2',
        'chemistry-est-2': 'Chemistry Course EST 2'
    };
    return courseNames[courseId] || 'this course';
}

// Auto-check access when page loads
document.addEventListener('DOMContentLoaded', function() {
    toggleEnrollViewButtons();
    if (checkUserAccess()) {
        showAccessInfo();
    }
});

function toggleEnrollViewButtons() {
    var enrollBtn = document.getElementById('enroll-btn');
    var viewBtn = document.getElementById('view-course-btn');
    
    if (!enrollBtn || !viewBtn) return;
    
    if (checkUserAccess()) {
        // User has access - show View Course, hide Details
        enrollBtn.style.display = 'none';
        viewBtn.style.display = 'block';
    } else {
        // User doesn't have access - show Details, hide View Course
        enrollBtn.style.display = 'block';
        viewBtn.style.display = 'none';
    }
}

function showViewCourseButton() {
    var enrollBtn = document.getElementById('enroll-btn');
    var viewBtn = document.getElementById('view-course-btn');
    
    if (enrollBtn && viewBtn) {
        enrollBtn.style.display = 'none';
        viewBtn.style.display = 'block';
    }
}

function hideViewCourseButton() {
    var enrollBtn = document.getElementById('enroll-btn');
    var viewBtn = document.getElementById('view-course-btn');
    
    if (enrollBtn && viewBtn) {
        enrollBtn.style.display = 'block';
        viewBtn.style.display = 'none';
    }
}

function viewCourseAsUser() {
    var currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
        alert('Please log in to view the course');
        return;
    }
    
    // Get current course ID from page
    var courseId = getCurrentCourseId();
    if (!courseId) {
        alert('Unable to determine course');
        return;
    }
    
    // Directly redirect to course content page (assuming user is activated)
    redirectToCourseContent(courseId);
}

function redirectToCourseContent(courseId) {
    // Get the course content page URL
    var contentUrl = COURSE_CONTENT_MAPPING[courseId];
    
    if (contentUrl) {
        // Redirect to the course content page
        window.location.href = contentUrl;
    } else {
        alert('Course content not available yet. Please contact administrator.');
    }
}

function showCourseContent() {
    // Hide the enrollment section and show course content
    var enrollSection = document.querySelector('.py-3.px-4');
    if (enrollSection) {
        enrollSection.innerHTML = `
            <div class="alert alert-success">
                <h6>Welcome to the Course!</h6>
                <p>You have access to this course content.</p>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h6>Lesson 1: Introduction</h6>
                            <p>Basic concepts and overview</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h6>Lesson 2: Advanced Topics</h6>
                            <p>Deep dive into advanced concepts</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Function to refresh button state (useful for admin panel changes)
function refreshButtonState() {
    toggleEnrollViewButtons();
}

// Make refreshButtonState available globally
window.refreshButtonState = refreshButtonState;
