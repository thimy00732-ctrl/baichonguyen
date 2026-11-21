// Main App Logic
let currentUser = null;
let currentPage = 'auth';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

// Check authentication status
async function checkAuth() {
  authToken = localStorage.getItem('token');
  
  if (authToken) {
    const user = await getMeAPI();
    if (user) {
      currentUser = user.user;
      showPage('home');
      loadStatistics();
    } else {
      showPage('auth');
    }
  } else {
    showPage('auth');
  }
}

// Show page
function showPage(page, event = null) {
  if (event) event.preventDefault();
  
  if (page === 'auth' && authToken) {
    return;
  }

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const pageElement = document.getElementById(page + '-page');
  if (pageElement) {
    pageElement.classList.add('active');
    currentPage = page;

    // Load page data
    if (page === 'jobs') loadJobs();
    if (page === 'posts') loadPosts();
    if (page === 'mentors') loadMentors();
    if (page === 'profile') loadProfile();
  }
}

// Alert function
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.main-content');
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
}

// === AUTHENTICATION ===

function toggleForm(event) {
  event.preventDefault();
  document.getElementById('loginForm').classList.toggle('hidden');
  document.getElementById('registerForm').classList.toggle('hidden');
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAlert('Please enter email and password', 'error');
    return;
  }

  const result = await loginAPI(email, password);
  if (result && result.token) {
    authToken = result.token;
    localStorage.setItem('token', authToken);
    currentUser = result.user;
    showAlert('Login successful', 'success');
    checkAuth();
  } else {
    showAlert('Login failed', 'error');
  }
}

async function register() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const fullName = document.getElementById('regFullName').value;
  const role = document.getElementById('regRole').value;

  if (!email || !password || !fullName || !role) {
    showAlert('Please fill all fields', 'error');
    return;
  }

  const result = await registerAPI(email, password, fullName, role);
  if (result && result.token) {
    authToken = result.token;
    localStorage.setItem('token', authToken);
    currentUser = result.user;
    showAlert('Registration successful', 'success');
    checkAuth();
  } else {
    showAlert('Registration failed', 'error');
  }
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('token');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  showPage('auth');
}

// === JOBS ===

async function loadJobs() {
  const jobs = await getJobsAPI({ status: 'Approved' });
  if (!jobs) return;

  const jobsList = document.getElementById('jobsList');
  jobsList.innerHTML = '';

  jobs.forEach(job => {
    const jobCard = createJobCard(job);
    jobsList.appendChild(jobCard);
  });
}

function createJobCard(job) {
  const div = document.createElement('div');
  div.className = 'job-card';
  
  const deadline = new Date(job.deadline).toLocaleDateString('vi-VN');
  
  div.innerHTML = `
    <h3>${job.title}</h3>
    <div class="job-meta">
      <span>📍 ${job.location}</span>
      <span>💼 ${job.jobType}</span>
      <span>⏰ Hạn: ${deadline}</span>
    </div>
    <p>${job.description.substring(0, 200)}...</p>
    <div class="job-footer">
      <div>
        <strong>Yêu cầu:</strong> ${job.requirements.substring(0, 100)}...
      </div>
      <button onclick="applyJob('${job._id}')" class="btn btn-primary">Ứng Tuyển</button>
    </div>
  `;
  
  return div;
}

async function applyJob(jobId) {
  const cvUrl = prompt('Nhập link CV của bạn:');
  if (!cvUrl) return;

  const result = await applyJobAPI({
    jobId,
    cvUrl,
    coverLetter: ''
  });

  if (result) {
    showAlert('Application submitted successfully', 'success');
  } else {
    showAlert('Application failed', 'error');
  }
}

function showCreateJobForm() {
  document.getElementById('createJobForm').classList.remove('hidden');
}

function hideCreateJobForm() {
  document.getElementById('createJobForm').classList.add('hidden');
}

async function createJob() {
  const jobData = {
    title: document.getElementById('jobTitle').value,
    position: document.getElementById('jobPosition').value,
    description: document.getElementById('jobDescription').value,
    requirements: document.getElementById('jobRequirements').value,
    jobType: document.getElementById('jobJobType').value,
    location: document.getElementById('jobLocation').value,
    benefits: document.getElementById('jobBenefits').value,
    applicationMethod: document.getElementById('jobApplicationMethod').value,
    deadline: new Date(document.getElementById('jobDeadline').value).toISOString()
  };

  if (!jobData.title || !jobData.position || !jobData.description) {
    showAlert('Please fill all required fields', 'error');
    return;
  }

  const result = await createJobAPI(jobData);
  if (result) {
    showAlert('Job posted (pending approval)', 'success');
    hideCreateJobForm();
  } else {
    showAlert('Failed to create job', 'error');
  }
}

function searchJobs() {
  // Implement search functionality
}

function filterJobs() {
  // Implement filter functionality
}

// === POSTS ===

async function loadPosts() {
  const posts = await getPostsAPI();
  if (!posts) return;

  const postsList = document.getElementById('postsList');
  postsList.innerHTML = '';

  posts.forEach(post => {
    const postCard = createPostCard(post);
    postsList.appendChild(postCard);
  });
}

function createPostCard(post) {
  const div = document.createElement('div');
  div.className = 'post-card';
  
  const createdDate = new Date(post.createdAt).toLocaleDateString('vi-VN');
  
  div.innerHTML = `
    <div class="post-header">
      <div>
        <h3>${post.title}</h3>
        <span class="post-category">${post.category}</span>
      </div>
      <div class="post-meta">${createdDate}</div>
    </div>
    <div class="post-content">
      ${post.content.substring(0, 300)}...
    </div>
    <div class="post-footer">
      <span>❤️ ${post.likeCount}</span>
      <span>💬 ${post.commentCount}</span>
    </div>
    <div class="post-actions">
      <button onclick="likePost('${post._id}')" class="btn">👍 Like</button>
      <button onclick="commentPost('${post._id}')" class="btn">💬 Comment</button>
    </div>
  `;
  
  return div;
}

function showCreatePostForm() {
  document.getElementById('createPostForm').classList.remove('hidden');
}

function hideCreatePostForm() {
  document.getElementById('createPostForm').classList.add('hidden');
}

async function createPost() {
  const postData = {
    category: document.getElementById('postPostCategory').value,
    title: document.getElementById('postTitle').value,
    content: document.getElementById('postContent').value
  };

  if (!postData.category || !postData.title || !postData.content) {
    showAlert('Please fill all fields', 'error');
    return;
  }

  const result = await createPostAPI(postData);
  if (result) {
    showAlert('Post created (pending approval)', 'success');
    hideCreatePostForm();
  } else {
    showAlert('Failed to create post', 'error');
  }
}

async function likePost(postId) {
  const result = await likePostAPI(postId);
  if (result) {
    loadPosts();
  }
}

function commentPost(postId) {
  const comment = prompt('Comment:');
  if (comment) {
    createCommentAPI(postId, comment).then(() => loadPosts());
  }
}

function filterPosts() {
  // Implement filter functionality
}

// === MENTORS ===

async function loadMentors() {
  const mentors = await getMentorsAPI();
  if (!mentors) return;

  const mentorsList = document.getElementById('mentorsList');
  mentorsList.innerHTML = '';

  mentors.forEach(mentor => {
    const mentorCard = createMentorCard(mentor);
    mentorsList.appendChild(mentorCard);
  });
}

function createMentorCard(mentor) {
  const div = document.createElement('div');
  div.className = 'mentor-card';
  
  const skills = mentor.skills ? mentor.skills.join(', ') : 'N/A';
  
  div.innerHTML = `
    <h3>${mentor.fullName}</h3>
    <div class="mentor-info">
      <p>${mentor.jobTitle} @ ${mentor.currentCompany || 'N/A'}</p>
      <p>Chuyên ngành: ${mentor.major}</p>
    </div>
    <div class="mentor-skills">
      ${mentor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
    </div>
    <button onclick="requestMentor('${mentor.userId}')" class="btn btn-primary">Yêu Cầu Mentor</button>
  `;
  
  return div;
}

async function requestMentor(mentorId) {
  const topic = prompt('Chủ đề tư vấn:');
  if (!topic) return;

  const message = prompt('Nội dung yêu cầu:');
  if (!message) return;

  const result = await sendMentorRequestAPI({
    alumniId: mentorId,
    topic,
    message
  });

  if (result) {
    showAlert('Mentor request sent', 'success');
  } else {
    showAlert('Failed to send request', 'error');
  }
}

function searchMentors() {
  // Implement search functionality
}

// === PROFILE ===

async function loadProfile() {
  const user = await getMeAPI();
  if (!user) return;

  const profileInfo = document.getElementById('profileInfo');
  profileInfo.innerHTML = `
    <h3>Thông Tin Hồ Sơ</h3>
    <div class="profile-field">
      <div class="profile-label">Email:</div>
      <div class="profile-value">${user.user.email}</div>
    </div>
    <div class="profile-field">
      <div class="profile-label">Họ và Tên:</div>
      <div class="profile-value">${user.profile?.fullName || 'N/A'}</div>
    </div>
    <div class="profile-field">
      <div class="profile-label">Chuyên ngành:</div>
      <div class="profile-value">${user.profile?.major || 'N/A'}</div>
    </div>
    <div class="profile-field">
      <div class="profile-label">Công ty hiện tại:</div>
      <div class="profile-value">${user.profile?.currentCompany || 'N/A'}</div>
    </div>
    <div class="profile-field">
      <div class="profile-label">Chức danh:</div>
      <div class="profile-value">${user.profile?.jobTitle || 'N/A'}</div>
    </div>
    <button onclick="showEditProfileForm()" class="btn btn-primary">Chỉnh Sửa</button>
  `;
}

function showEditProfileForm() {
  document.getElementById('editProfileForm').classList.remove('hidden');
}

function hideEditProfileForm() {
  document.getElementById('editProfileForm').classList.add('hidden');
}

async function updateProfile() {
  const profileData = {
    fullName: document.getElementById('profileFullName').value,
    major: document.getElementById('profileMajor').value,
    graduationYear: document.getElementById('profileGraduationYear').value,
    currentCompany: document.getElementById('profileCurrentCompany').value,
    jobTitle: document.getElementById('profileJobTitle').value,
    skills: document.getElementById('profileSkills').value.split(',').map(s => s.trim()),
    isMentorAvailable: document.getElementById('profileIsMentorAvailable').checked
  };

  const result = await updateProfileAPI(profileData);
  if (result) {
    showAlert('Profile updated', 'success');
    hideEditProfileForm();
    loadProfile();
  } else {
    showAlert('Update failed', 'error');
  }
}

// === STATISTICS ===

async function loadStatistics() {
  const stats = await getStatisticsAPI();
  if (!stats) return;

  document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
  document.getElementById('totalJobs').textContent = stats.totalJobs || 0;
  document.getElementById('totalPosts').textContent = stats.totalPosts || 0;
}

// === ADMIN PANEL ===

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById('admin-' + tab).classList.add('active');
  event.target.classList.add('active');
}
