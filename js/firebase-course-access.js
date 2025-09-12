// Firebase Course Access Management
// This file handles video URLs and course content management through Firebase

class FirebaseCourseAccess {
    constructor() {
        this.db = window.firebaseDB;
        this.auth = window.firebaseAuth;
    }

    // Get video URLs for a specific course
    async getVideoUrls(courseId) {
        try {
            const doc = await this.db.collection('courses').doc(courseId).get();
            if (doc.exists) {
                return doc.data().videoUrls || {};
            }
            return {};
        } catch (error) {
            console.error('Error getting video URLs:', error);
            return {};
        }
    }

    // Update video URLs for a specific course
    async updateVideoUrls(courseId, videoUrls) {
        try {
            await this.db.collection('courses').doc(courseId).set({
                videoUrls: videoUrls,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error updating video URLs:', error);
            return false;
        }
    }

    // Get all course data
    async getAllCourses() {
        try {
            const snapshot = await this.db.collection('courses').get();
            const courses = {};
            snapshot.forEach(doc => {
                courses[doc.id] = doc.data();
            });
            return courses;
        } catch (error) {
            console.error('Error getting courses:', error);
            return {};
        }
    }

    // Add or update a single video URL
    async updateSingleVideoUrl(courseId, videoKey, videoUrl) {
        try {
            const courseRef = this.db.collection('courses').doc(courseId);
            await courseRef.update({
                [`videoUrls.${videoKey}`]: videoUrl,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating single video URL:', error);
            return false;
        }
    }

    // Get course metadata (title, description, etc.)
    async getCourseMetadata(courseId) {
        try {
            const doc = await this.db.collection('courses').doc(courseId).get();
            if (doc.exists) {
                const data = doc.data();
                return {
                    title: data.title || courseId,
                    description: data.description || '',
                    isActive: data.isActive !== false
                };
            }
            return { title: courseId, description: '', isActive: true };
        } catch (error) {
            console.error('Error getting course metadata:', error);
            return { title: courseId, description: '', isActive: true };
        }
    }

    // Update course metadata
    async updateCourseMetadata(courseId, metadata) {
        try {
            await this.db.collection('courses').doc(courseId).set({
                ...metadata,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error updating course metadata:', error);
            return false;
        }
    }

    // Initialize default course data if it doesn't exist
    async initializeDefaultCourses() {
        const defaultCourses = {
            'math-est-1': {
                title: 'Math Course EST 1',
                description: 'Fundamental mathematics concepts and algebra',
                videoUrls: {
                    'linear-equations': 'https://drive.google.com/file/d/16i8Y3YUsfoO7x1e-AL-V2Wpsk7Fb-lpU/preview',
                    'quadratic-equations': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_2/preview',
                    'polynomial-functions': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_3/preview',
                    'systems-equations': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_4/preview',
                    'rational-expressions': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_5/preview',
                    'exponential-logarithmic': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_6/preview',
                    'complex-numbers': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_7/preview',
                    'word-problems': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_8/preview'
                },
                isActive: true
            },
            'math-est-2': {
                title: 'Math Course EST 2',
                description: 'Advanced mathematics and pre-calculus',
                videoUrls: {
                    'polynomial-division': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_49/preview',
                    'rational-functions-advanced': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_50/preview',
                    'partial-fractions': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_51/preview',
                    'complex-numbers-advanced': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_52/preview'
                },
                isActive: true
            },
            'english-est-1': {
                title: 'English Course EST 1',
                description: 'English language fundamentals',
                videoUrls: {},
                isActive: true
            }
        };

        try {
            for (const [courseId, courseData] of Object.entries(defaultCourses)) {
                const doc = await this.db.collection('courses').doc(courseId).get();
                if (!doc.exists) {
                    await this.db.collection('courses').doc(courseId).set({
                        ...courseData,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            return true;
        } catch (error) {
            console.error('Error initializing default courses:', error);
            return false;
        }
    }
}

// Initialize and make available globally
window.firebaseCourseAccess = new FirebaseCourseAccess();

// Auto-initialize default courses when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.firebaseCourseAccess) {
        window.firebaseCourseAccess.initializeDefaultCourses();
    }
});
