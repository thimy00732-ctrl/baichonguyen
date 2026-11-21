// ===== HANDSHAKE-STYLE CARD RENDERERS =====

// Job Card - Handshake style
function taoTheViec(viec) {
  const hn = tinhHanNop(viec.deadline);
  const chu = (viec.creatorId?.email || 'Company').charAt(0).toUpperCase();
  const company = viec.creatorId?.email?.split('@')[0] || 'Company';
  
  return `
    <div class="card" onclick="xemChiTietViec('${viec._id}')">
      <div class="card-header">
        <div class="card-icon" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;font-size:24px">
          ${chu}
        </div>
        <div class="card-info">
          <div class="card-title">${viec.title}</div>
          <div class="card-subtitle">${company}</div>
        </div>
      </div>
      <div class="card-body">
        ${(viec.description || '').substring(0, 150)}${viec.description?.length > 150 ? '...' : ''}
      </div>
      <div class="card-tags">
        <span class="tag tag-primary">${nhanLoaiViec(viec.jobType)}</span>
        <span class="tag tag-primary">📍 ${viec.location}</span>
        ${viec.status === 'Pending' ? '<span class="tag tag-warning">⏳ Pending</span>' : ''}
      </div>
      <div class="card-footer">
        <span style="font-size:13px;color:var(--gray-600)">
          ${hn.gap ? '🔴' : '⏰'} ${hn.text}
        </span>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();xemChiTietViec('${viec._id}')">
            View
          </button>
          ${viec.status === 'Approved' ? 
            `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();moModalUngTuyen('${viec._id}','${viec.title.replace(/'/g, "\\'")}')">
              Apply
            </button>` : ''
          }
        </div>
      </div>
    </div>
  `;
}

// Post Card - Handshake style
function taoTheBai(bai) {
  const chu = (bai.authorId?.email || 'User').charAt(0).toUpperCase();
  const author = bai.authorId?.email?.split('@')[0] || 'Anonymous';
  const catMap = {
    'Experience': '💡 Experience',
    'Question': '❓ Question',
    'CareerAdvice': '🎯 Career Advice',
    'JobShare': '💼 Job Share'
  };
  
  return `
    <div class="card" onclick="xemChiTietBai && xemChiTietBai('${bai._id}')">
      <div class="card-header">
        <div class="card-icon" style="background:linear-gradient(135deg,#10B981,#059669);color:white">
          ${chu}
        </div>
        <div class="card-info">
          <div class="card-subtitle">${author}</div>
          <div style="font-size:12px;color:var(--gray-500)">
            ${new Date(bai.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div class="card-title" style="margin:12px 0 8px">${bai.title}</div>
      <div class="card-body">
        ${(bai.content || '').substring(0, 180)}${bai.content?.length > 180 ? '...' : ''}
      </div>
      <div class="card-tags">
        <span class="tag tag-success">${catMap[bai.category] || bai.category}</span>
        ${bai.status === 'Pending' ? '<span class="tag tag-warning">⏳ Pending</span>' : ''}
      </div>
      <div class="card-footer">
        <div style="display:flex;gap:16px;font-size:13px;color:var(--gray-600)">
          <span>❤️ ${bai.likeCount || 0}</span>
          <span>💬 ${bai.commentCount || 0}</span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();thichBai('${bai._id}', this)">
          Like
        </button>
      </div>
    </div>
  `;
}

// Mentor Card - Handshake style
function taoTheMentor(mentor) {
  const chu = (mentor.fullName || 'Mentor').charAt(0).toUpperCase();
  const skills = mentor.skills || [];
  const userId = mentor.userId?._id || mentor.userId || '';
  
  return `
    <div class="card">
      <div style="text-align:center;margin-bottom:16px">
        <div style="width:80px;height:80px;margin:0 auto 12px;background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:32px;font-weight:700">
          ${chu}
        </div>
        <div class="card-title" style="margin:0 0 4px">${mentor.fullName || 'Anonymous'}</div>
        <div class="card-subtitle">${mentor.jobTitle || 'Position not set'}</div>
        <div style="font-size:13px;color:var(--primary);margin-top:4px">
          ${mentor.currentCompany || 'Company not set'}
        </div>
      </div>
      <div class="card-tags" style="justify-content:center;margin-bottom:16px">
        ${skills.slice(0, 3).map(s => `<span class="tag tag-primary">${s}</span>`).join('')}
        ${skills.length > 3 ? `<span class="tag tag-primary">+${skills.length - 3}</span>` : ''}
      </div>
      <div style="font-size:13px;color:var(--gray-600);text-align:center;margin-bottom:16px">
        📚 ${mentor.major || 'N/A'} • 🎓 ${mentor.graduationYear || 'N/A'}
      </div>
      <button class="btn btn-primary" style="width:100%" 
        onclick="moFormYeuCauMentor('${userId}','${(mentor.fullName || '').replace(/'/g, "\\'")}')">
        Request mentorship
      </button>
    </div>
  `;
}

// Empty State - Modern style
function taoTrangRong(icon, title, description) {
  return `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;
}

// Override existing render functions if on handshake page
if (window.location.pathname.includes('handshake') || document.querySelector('.hero-modern')) {
  console.log('🎨 Handshake style loaded');
}
