// ===== HÀM GỌI API =====
async function goiAPI(duongDan, phuongThuc = 'GET', duLieu = null) {
  const token = localStorage.getItem('token');
  const tuyChinh = {
    method: phuongThuc,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };
  if (duLieu) tuyChinh.body = JSON.stringify(duLieu);
  try {
    const res = await fetch('/api' + duongDan, tuyChinh);
    return await res.json();
  } catch (err) {
    console.error('Lỗi API:', duongDan, err.message);
    return null;
  }
}

// ===== XÁC THỰC =====
const dangNhapAPI = (email, matKhau) => goiAPI('/auth/login', 'POST', { email, password: matKhau });
const dangKyAPI = (email, matKhau, hoTen, vaiTro) => goiAPI('/auth/register', 'POST', { email, password: matKhau, fullName: hoTen, role: vaiTro });
const layThongTinToiAPI = () => goiAPI('/auth/me');

// ===== NGƯỜI DÙNG =====
const capNhatHoSoAPI = (dl) => goiAPI('/users/profile', 'PUT', dl);
const layHoSoNguoiDungAPI = (id) => goiAPI(`/users/profile/${id}`);
const capNhatTrangThaiMentorAPI = (tt) => goiAPI('/users/mentor-status', 'PUT', { isMentorAvailable: tt });

// ===== VIỆC LÀM =====
const taoViecLamAPI = (dl) => goiAPI('/jobs', 'POST', dl);
const layDanhSachViecAPI = (params = {}) => goiAPI(`/jobs?${new URLSearchParams(params)}`);
const layChiTietViecAPI = (id) => goiAPI(`/jobs/${id}`);
const capNhatViecLamAPI = (id, dl) => goiAPI(`/jobs/${id}`, 'PUT', dl);
const dongViecLamAPI = (id) => goiAPI(`/jobs/${id}/close`, 'PUT', {});

// ===== ỨNG TUYỂN =====
const ungTuyenAPI = (dl) => goiAPI('/applications', 'POST', dl);
const layHoSoCuaToiAPI = () => goiAPI('/applications/my-applications');
const capNhatTrangThaiHoSoAPI = (id, tt) => goiAPI(`/applications/${id}/status`, 'PUT', { status: tt });
const rutHoSoAPI = (id) => goiAPI(`/applications/${id}/withdraw`, 'PUT', {});

// ===== BÀI VIẾT =====
const taoBaiVietAPI = (dl) => goiAPI('/posts', 'POST', dl);
const layDanhSachBaiAPI = (params = {}) => goiAPI(`/posts?${new URLSearchParams(params)}`);
const layChiTietBaiAPI = (id) => goiAPI(`/posts/${id}`);
const capNhatBaiVietAPI = (id, dl) => goiAPI(`/posts/${id}`, 'PUT', dl);
const taoBinhLuanAPI = (postId, nd) => goiAPI(`/posts/${postId}/comments`, 'POST', { content: nd });
const thichBaiAPI = (postId) => goiAPI(`/posts/${postId}/like`, 'POST', {});

// ===== MENTOR =====
const layDanhSachMentorAPI = (params = {}) => goiAPI(`/mentors?${new URLSearchParams(params)}`);
const guiYeuCauMentorAPI = (dl) => goiAPI('/mentors/request', 'POST', dl);
const layYeuCauNhanDuocAPI = () => goiAPI('/mentors/received-requests');
const layYeuCauDaGuiAPI = () => goiAPI('/mentors/sent-requests');
const phanHoiYeuCauMentorAPI = (id, tt) => goiAPI(`/mentors/request/${id}/respond`, 'PUT', { status: tt });

// ===== BÁO CÁO =====
const taoBaoCaoAPI = (loai, id, lydo) => goiAPI('/reports', 'POST', { targetType: loai, targetId: id, reason: lydo });
const layBaoCaoAPI = () => goiAPI('/admin/reports');

// ===== THÔNG BÁO =====
const layThongBaoAPI = () => goiAPI('/notifications');

// ===== QUẢN TRỊ =====
const duyetViecAPI = (id, tt, lydo) => goiAPI(`/admin/jobs/${id}/approve`, 'PUT', { status: tt, rejectionReason: lydo });
const duyetBaiAPI = (id, tt) => goiAPI(`/admin/posts/${id}/approve`, 'PUT', { status: tt });
const xacThucRecruiterAPI = (id, xacThuc) => goiAPI(`/admin/recruiters/${id}/verify`, 'PUT', { isVerified: xacThuc });
const khoaTaiKhoanAPI = (id, tt) => goiAPI(`/admin/users/${id}/lock`, 'PUT', { accountStatus: tt });
const xulyBaoCaoAPI = (id, tt, ghiChu) => goiAPI(`/admin/reports/${id}/resolve`, 'PUT', { status: tt, resolutionNote: ghiChu });
const layThongKeAPI = () => goiAPI('/admin/statistics');
const layNhatKyAPI = () => goiAPI('/admin/audit-logs');
const layTinChoDuyetAPI = () => goiAPI('/admin/jobs/pending');
const layBaiChoDuyetAPI = () => goiAPI('/admin/posts/pending');
const layNguoiDungAdminAPI = () => goiAPI('/admin/users');
