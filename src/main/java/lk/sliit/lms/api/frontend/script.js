// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';

// DOM Elements
const coursesSection = document.getElementById('courses');
const assignmentsSection = document.getElementById('assignments');
const coursesList = document.getElementById('courses-list');
const assignmentsList = document.getElementById('assignments-list');
const notification = document.getElementById('notification');

// Show notification
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#dc2626' : '#2563eb';
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Hide all sections
function hideAllSections() {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
}

// Load courses
async function loadCourses() {
    try {
        hideAllSections();
        coursesSection.classList.remove('hidden');
        
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const courses = await response.json();
        coursesList.innerHTML = '';
        
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'card';
            courseCard.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p>Instructor: ${course.instructor}</p>
                <button onclick="enrollCourse(${course.id})">Enroll Now</button>
            `;
            coursesList.appendChild(courseCard);
        });
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Load assignments
async function loadAssignments() {
    try {
        hideAllSections();
        assignmentsSection.classList.remove('hidden');
        
        const response = await fetch(`${API_BASE_URL}/assignments`);
        if (!response.ok) throw new Error('Failed to fetch assignments');
        
        const assignments = await response.json();
        assignmentsList.innerHTML = '';
        
        assignments.forEach(assignment => {
            const assignmentCard = document.createElement('div');
            assignmentCard.className = 'card';
            assignmentCard.innerHTML = `
                <h3>${assignment.title}</h3>
                <p>${assignment.description}</p>
                <p>Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}</p>
                <button onclick="submitAssignment(${assignment.id})">Submit Assignment</button>
            `;
            assignmentsList.appendChild(assignmentCard);
        });
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Enroll in a course
async function enrollCourse(courseId) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to enroll in course');
        
        showNotification('Successfully enrolled in course!');
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Submit assignment
async function submitAssignment(assignmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to submit assignment');
        
        showNotification('Assignment submitted successfully!');
    } catch (error) {
        showNotification(error.message, true);
    }
}

// View progress
async function viewProgress() {
    try {
        const response = await fetch(`${API_BASE_URL}/progress`);
        if (!response.ok) throw new Error('Failed to fetch progress');
        
        const progress = await response.json();
        showNotification(`Overall Progress: ${progress.overall}%`);
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Load user profile
async function loadProfile() {
    try {
        hideAllSections();
        document.getElementById('profile').classList.remove('hidden');
        
        const response = await fetch(`${API_BASE_URL}/user/profile`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const profile = await response.json();
        
        // Update profile information
        document.getElementById('user-name').textContent = profile.name;
        document.getElementById('user-email').textContent = profile.email;
        document.getElementById('profile-image').src = profile.avatar || 'https://via.placeholder.com/150';
        
        // Update stats
        document.getElementById('enrolled-courses-count').textContent = profile.enrolledCourses;
        document.getElementById('completed-assignments-count').textContent = profile.completedAssignments;
        document.getElementById('average-grade').textContent = `${profile.averageGrade}%`;
        
        // Load recent activity
        loadRecentActivity();
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/activity`);
        if (!response.ok) throw new Error('Failed to fetch activity');
        
        const activities = await response.json();
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">${getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
            `;
            activityList.appendChild(activityItem);
        });
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Get icon for activity type
function getActivityIcon(type) {
    const icons = {
        'course': '📚',
        'assignment': '📝',
        'quiz': '✍️',
        'grade': '🎯'
    };
    return icons[type] || '📌';
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)} hours ago`;
    return date.toLocaleDateString();
}

// Edit profile
async function editProfile() {
    // Create a form for profile editing
    const form = document.createElement('form');
    form.innerHTML = `
        <div class="modal">
            <h3>Edit Profile</h3>
            <input type="text" id="edit-name" placeholder="Name" required>
            <input type="email" id="edit-email" placeholder="Email" required>
            <input type="file" id="edit-avatar" accept="image/*">
            <div class="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(form);
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', document.getElementById('edit-name').value);
            formData.append('email', document.getElementById('edit-email').value);
            
            const avatarFile = document.getElementById('edit-avatar').files[0];
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'PUT',
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to update profile');
            
            showNotification('Profile updated successfully!');
            closeModal();
            loadProfile();
        } catch (error) {
            showNotification(error.message, true);
        }
    };
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.parentElement.remove();
    }
}

// Download transcript
async function downloadTranscript() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/transcript`);
        if (!response.ok) throw new Error('Failed to download transcript');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Transcript downloaded successfully!');
    } catch (error) {
        showNotification(error.message, true);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Sample data for courses, assignments, quizzes, and feedback
    const courses = [
        { id: 1, title: "Introduction to Programming", description: "Learn the basics of programming." },
        { id: 2, title: "Web Development", description: "Build websites using HTML, CSS, and JavaScript." },
        { id: 3, title: "Data Structures", description: "Understand data structures and algorithms." }
    ];

    const assignments = [
        { id: 1, name: "Assignment 1", description: "Complete the first programming assignment.", courseId: 1 },
        { id: 2, name: "Web Project", description: "Create a personal website.", courseId: 2 },
        { id: 3, name: "Data Structures Quiz", description: "Take the quiz on data structures.", courseId: 3 }
    ];

    const quizzes = [
        { id: 1, name: "Quiz 1", description: "First quiz on programming basics.", courseId: 1 },
        { id: 2, name: "Quiz 2", description: "Second quiz on web development.", courseId: 2 }
    ];

    const feedbackQuestions = [
        { id: 1, question: "How would you rate the course content?" },
        { id: 2, question: "Was the instructor helpful?" }
    ];

    // Add click event listeners for navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            const section = link.getAttribute('href').substring(1);
            if (section === 'courses') {
                loadCourses();
            } else if (section === 'assignments') {
                loadAssignments();
            } else if (section === 'profile') {
                loadProfile();
            }
        });
    });
});