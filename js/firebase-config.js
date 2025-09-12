// Firebase Configuration
// Replace these values with your actual Firebase project configuration

const firebaseConfig = {
    apiKey: "AIzaSyAFL846dXZXI-0o1KEZHP50N3ob9J1HsCg",
    authDomain: "prime-edu-paltform.firebaseapp.com",
    projectId: "prime-edu-paltform",
    storageBucket: "prime-edu-paltform.firebasestorage.app",
    messagingSenderId: "1027985711634",
    appId: "1:1027985711634:web:a336a58cc29b895d5baecb",
    measurementId: "G-XDH95PCNSS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

// Export for use in other files
window.firebaseDB = db;
window.firebaseAuth = auth;
