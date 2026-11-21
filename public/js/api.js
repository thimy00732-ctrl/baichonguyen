// API Helper Functions
const API_BASE = 'http://localhost:5000/api';

let authToken = localStorage.getItem('token');

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken ? `Bearer ${authToken}` : ''
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(API_BASE + endpoint, options);
    const result = await response.json();

    if (!response.ok && response.status === 401) {
      // Token expired or invalid
      logout();
      return null;
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    showAlert(`Error: ${error.message}`, 'error');
    return null;
  }
}

// Authentication APIs
async function loginAPI(email, password) {
  return await apiCall('/auth/login', 'POST', { email, password });
}

async function registerAPI(email, password, fullName, role) {
  return await apiCall('/auth/register', 'POST', { email, password, fullName, role });
}

async function getMeAPI() {
  return await apiCall('/auth/me');
}

// User APIs
async function updateProfileAPI(data) {
  return await apiCall('/users/profile', 'PUT', data);
}

async function getProfileAPI(userId) {
  return await apiCall(`/users/profile/${userId}`);
}

async function getAlumniListAPI(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiCall(`/users/alumni?${query}`);
}

async function updateMentorStatusAPI(isMentorAvailable) {
  return await apiCall('/users/mentor-status', 'PUT', { isMentorAvailable });
}

// Job APIs
async function createJobAPI(jobData) {
  return await apiCall('/jobs', 'POST', jobData);
}

async function getJobsAPI(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiCall(`/jobs?${query}`);
}

async function getJobDetailAPI(jobId) {
  return await apiCall(`/jobs/${jobId}`);
}

async function updateJobAPI(jobId, data) {
  return await apiCall(`/jobs/${jobId}`, 'PUT', data);
}

async function closeJobAPI(jobId) {
  return await apiCall(`/jobs/${jobId}/close`, 'PUT', {});
}

// Application APIs
async function applyJobAPI(applicationData) {
  return await apiCall('/applications', 'POST', applicationData);
}

async function getMyApplicationsAPI() {
  return await apiCall('/applications/my-applications');
}

async function getJobApplicationsAPI(jobId) {
  return await apiCall(`/applications/job/${jobId}`);
}

async function updateApplicationStatusAPI(appId, status) {
  return await apiCall(`/applications/${appId}/status`, 'PUT', { status });
}

async function withdrawApplicationAPI(appId) {
  return await apiCall(`/applications/${appId}/withdraw`, 'PUT', {});
}

// Post APIs
async function createPostAPI(postData) {
  return await apiCall('/posts', 'POST', postData);
}

async function getPostsAPI(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiCall(`/posts?${query}`);
}

async function getPostDetailAPI(postId) {
  return await apiCall(`/posts/${postId}`);
}

async function updatePostAPI(postId, data) {
  return await apiCall(`/posts/${postId}`, 'PUT', data);
}

async function createCommentAPI(postId, content) {
  return await apiCall(`/posts/${postId}/comments`, 'POST', { content });
}

async function likePostAPI(postId) {
  return await apiCall(`/posts/${postId}/like`, 'POST', {});
}

// Mentor APIs
async function getMentorsAPI(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiCall(`/mentors?${query}`);
}

async function sendMentorRequestAPI(mentorData) {
  return await apiCall('/mentors/request', 'POST', mentorData);
}

async function getReceivedMentorRequestsAPI() {
  return await apiCall('/mentors/received-requests');
}

async function getSentMentorRequestsAPI() {
  return await apiCall('/mentors/sent-requests');
}

async function respondMentorRequestAPI(requestId, status) {
  return await apiCall(`/mentors/request/${requestId}/respond`, 'PUT', { status });
}

// Admin APIs
async function approveJobAPI(jobId, status, rejectionReason) {
  return await apiCall(`/admin/jobs/${jobId}/approve`, 'PUT', { status, rejectionReason });
}

async function approvePostAPI(postId, status) {
  return await apiCall(`/admin/posts/${postId}/approve`, 'PUT', { status });
}

async function verifyRecruiterAPI(recruiterId, isVerified) {
  return await apiCall(`/admin/recruiters/${recruiterId}/verify`, 'PUT', { isVerified });
}

async function lockUserAPI(userId, accountStatus) {
  return await apiCall(`/admin/users/${userId}/lock`, 'PUT', { accountStatus });
}

async function resolveReportAPI(reportId, status, resolutionNote) {
  return await apiCall(`/admin/reports/${reportId}/resolve`, 'PUT', { status, resolutionNote });
}

async function getReportsAPI() {
  return await apiCall('/admin/reports');
}

async function getAuditLogsAPI() {
  return await apiCall('/admin/audit-logs');
}

async function getStatisticsAPI() {
  return await apiCall('/admin/statistics');
}
