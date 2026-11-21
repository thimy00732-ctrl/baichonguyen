// ===== TRẠNG THÁI =====
let nguoiDungHienTai = null;
let viecDangXem = null;

// Pagination state
let paginationState = {
  viec: { page: 1, limit: 10, hasMore: true },
  bai: { page: 1, limit: 10, hasMore: true },
  mentor: { page: 1, limit: 12, hasMore: true }
};

// ===== DEBOUNCE (trì hoãn gọi API khi gõ) =====
let _debounceViec = null;
let _debounceBai = null;
let _debounceMentor = null;

function debounceTimKiemViec() {
  clearTimeout(_debounceViec);
  _debounceViec = setTimeout(() => taiDanhSachViec(), 500);
}
function debounceTimKiemBai() {
  clearTimeout(_debounceBai);
  _debounceBai = setTimeout(() => taiDanhSachBai(), 500);
}
function debounceTimKiemMentor() {
  clearTimeout(_debounceMentor);
  _debounceMentor = setTimeout(() => taiDanhSachMentor(), 500);
}

// Xóa bộ lọc
function xoaTimKiemViec() {
  document.getElementById('timKiemViec').value = '';
  document.getElementById('loaiViecLoc').value = '';
  document.getElementById('diaDiemViecLoc').value = '';
  const kq = document.getElementById('ketQuaViec');
  if (kq) kq.style.display = 'none';
  taiDanhSachViec();
}
function xoaTimKiemBai() {
  document.getElementById('timKiemBai').value = '';
  document.getElementById('danhMucBaiLoc').value = '';
  const kq = document.getElementById('ketQuaBai');
  if (kq) kq.style.display = 'none';
  taiDanhSachBai();
}
function xoaTimKiemMentor() {
  document.getElementById('timKiemMentor').value = '';
  document.getElementById('chuyenNganhMentor').value = '';
  document.getElementById('kyNangMentor').value = '';
  const kq = document.getElementById('ketQuaMentor');
  if (kq) kq.style.display = 'none';
  taiDanhSachMentor();
}

// Hiển thị kết quả tìm kiếm
function hienKetQuaViec(soLuong) {
  const kq = document.getElementById('ketQuaViec');
  const so = document.getElementById('soKetQuaViec');
  if (!kq || !so) return;
  so.textContent = soLuong;
  kq.style.display = soLuong >= 0 ? 'flex' : 'none';
}
function hienKetQuaBai(soLuong) {
  const kq = document.getElementById('ketQuaBai');
  const so = document.getElementById('soKetQuaBai');
  if (!kq || !so) return;
  so.textContent = soLuong;
  kq.style.display = soLuong >= 0 ? 'flex' : 'none';
}
function hienKetQuaMentor(soLuong) {
  const kq = document.getElementById('ketQuaMentor');
  const so = document.getElementById('soKetQuaMentor');
  if (!kq || !so) return;
  so.textContent = soLuong;
  kq.style.display = soLuong >= 0 ? 'flex' : 'none';
}

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) kiemTraXacThuc();
  else hienTrangAuth();
});

async function kiemTraXacThuc() {
  const kq = await layThongTinToiAPI();
  if (kq?.user) {
    nguoiDungHienTai = kq.user;
    hienUngDung(kq);
  } else {
    localStorage.removeItem('token');
    hienTrangAuth();
  }
}

function hienTrangAuth() {
  document.getElementById('trang-auth').classList.add('active');
  document.getElementById('ungDung').classList.add('an');
}

function hienUngDung(duLieu) {
  document.getElementById('trang-auth').classList.remove('active');
  document.getElementById('ungDung').classList.remove('an');
  const ten = duLieu.profile?.fullName || duLieu.user.email.split('@')[0];
  document.getElementById('avatarNhoBienThuc').textContent = ten.charAt(0).toUpperCase();
  document.getElementById('tenNguoiDung').textContent = ten;
  const roles = (duLieu.user.roles || []).map(r => typeof r === 'string' ? r : r.roleName);
  if (roles.includes('Admin')) document.getElementById('nav-quantri-li').classList.remove('an');
  hienTrang('trang-chu');
  taiThongKe();
}

// ===== TOAST =====
function hienToast(noidung, loai = 'thanh-cong') {
  const toast = document.getElementById('toast');
  const icons = { 'thanh-cong': '✅', 'loi': '❌', 'thongbao': 'ℹ️', 'canh-bao': '⚠️' };
  const mau = { 'thanh-cong': '#1a1a2e', 'loi': '#e74c3c', 'thongbao': '#3498db', 'canh-bao': '#f39c12' };
  document.getElementById('toastIcon').textContent = icons[loai] || '✅';
  document.getElementById('toastText').textContent = noidung;
  toast.style.background = mau[loai] || '#1a1a2e';
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.transform = 'translateY(120px)'; toast.style.opacity = '0'; }, 3500);
}

// ===== ĐIỀU HƯỚNG =====
function hienTrang(trang) {
  document.querySelectorAll('.trang').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
  const el = document.getElementById(trang);
  if (el) el.classList.add('active');
  const nav = document.getElementById('nav-' + trang);
  if (nav) nav.classList.add('active');
  if (trang === 'trang-chu') { taiThongKe(); taiViecLamTrangChu(); taiBaiVietTrangChu(); }
  if (trang === 'viec-lam') taiDanhSachViec();
  if (trang === 'cong-dong') taiDanhSachBai();
  if (trang === 'mentor') taiDanhSachMentor();
  if (trang === 'ho-so') taiHoSo();
  if (trang === 'quantri') taiDuLieuAdmin();
}

// ===== AUTH =====
function chuyenForm() {
  document.getElementById('formDangNhap').classList.toggle('an');
  document.getElementById('formDangKy').classList.toggle('an');
}

async function dangNhap() {
  const email = document.getElementById('emailDangNhap').value.trim();
  const matKhau = document.getElementById('matKhauDangNhap').value;
  if (!email || !matKhau) return hienToast('Vui lòng nhập đầy đủ thông tin', 'loi');
  console.log('Đang đăng nhập với:', email);
  const kq = await dangNhapAPI(email, matKhau);
  console.log('Kết quả đăng nhập:', kq);
  if (kq?.token) {
    localStorage.setItem('token', kq.token);
    hienToast('Đăng nhập thành công!');
    kiemTraXacThuc();
  } else hienToast(kq?.message || 'Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.', 'loi');
}

async function dangKy() {
  const hoTen = document.getElementById('hoTenDangKy').value.trim();
  const email = document.getElementById('emailDangKy').value.trim();
  const matKhau = document.getElementById('matKhauDangKy').value;
  const vaiTro = document.getElementById('vaiTroDangKy').value;
  if (!hoTen || !email || !matKhau || !vaiTro) return hienToast('Vui lòng điền đầy đủ thông tin', 'loi');
  if (matKhau.length < 6) return hienToast('Mật khẩu phải có ít nhất 6 ký tự', 'loi');
  const kq = await dangKyAPI(email, matKhau, hoTen, vaiTro);
  if (kq?.token) {
    localStorage.setItem('token', kq.token);
    hienToast('Đăng ký thành công! Chào mừng bạn 🎉');
    kiemTraXacThuc();
  } else hienToast(kq?.message || 'Đăng ký thất bại', 'loi');
}

function dangXuat() {
  localStorage.removeItem('token');
  nguoiDungHienTai = null;
  hienTrangAuth();
  hienToast('Đã đăng xuất thành công', 'thongbao');
}

// ===== THỐNG KÊ =====
async function taiThongKe() {
  const tk = await layThongKeAPI();
  if (!tk) return;
  ['heroTongNguoi','tkNguoi','qtTongNguoi'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=tk.totalUsers||0; });
  ['heroTongViec','tkViec','qtTongViec'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=tk.totalJobs||0; });
  ['heroTongBai','tkBai'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=tk.totalPosts||0; });
  if(document.getElementById('qtViecChoDuyet')) document.getElementById('qtViecChoDuyet').textContent=tk.pendingJobs||0;
  if(document.getElementById('qtBaiChoDuyet')) document.getElementById('qtBaiChoDuyet').textContent=tk.pendingPosts||0;
  const mentors = await layDanhSachMentorAPI({});
  const soMentor = mentors?.length || 0;
  ['heroTongMentor','tkMentor'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=soMentor; });
}

// ===== TÌM KIẾM HERO =====
function timKiemHero() {
  const q = document.getElementById('timKiemHero').value.trim();
  if (!q) return;
  document.getElementById('timKiemViec').value = q;
  hienTrang('viec-lam');
  taiDanhSachViec();
}

// ===== VIỆC LÀM =====
function nhanLoaiViec(loai) {
  const map = { 'Internship':'Internship', 'Full-time':'Full-time', 'Part-time':'Part-time' };
  return map[loai] || loai;
}

function batTatFormViec() {
  const form = document.getElementById('formViecLam');
  if (form) form.classList.toggle('an');
}

function batTatFormBai() {
  const form = document.getElementById('formBaiViet');
  if (form) form.classList.toggle('an');
}

function batTatDangKyMentor() {
  alert('Feature đăng ký mentor đang được phát triển');
}

function batTatThongBao() {
  const dropdown = document.getElementById('hopThongBao');
  if (dropdown) dropdown.classList.toggle('an');
}

function anFormMentor() {
  const form = document.getElementById('formYeuCauMentor');
  if (form) form.classList.add('an');
}

function moFormYeuCauMentor(alumniId, tenMentor) {
  const form = document.getElementById('formYeuCauMentor');
  if (form) {
    form.classList.remove('an');
    document.getElementById('alumniIdYeuCau').value = alumniId;
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

async function guiYeuCauMentor() {
  const alumniId = document.getElementById('alumniIdYeuCau').value;
  const chuDe = document.getElementById('chuDeMentor').value.trim();
  const noiDung = document.getElementById('noiDungMentor').value.trim();
  
  if (!chuDe || !noiDung) return hienToast('Vui lòng điền đầy đủ thông tin', 'loi');
  
  const kq = await guiYeuCauMentorAPI({ alumniId, topic: chuDe, message: noiDung });
  if (kq) {
    hienToast('Đã gửi yêu cầu mentor thành công!');
    anFormMentor();
    document.getElementById('chuDeMentor').value = '';
    document.getElementById('noiDungMentor').value = '';
  } else {
    hienToast('Gửi yêu cầu thất bại', 'loi');
  }
}

function hienFormSuaHoSo() {
  const formHien = document.getElementById('hienThiHoSo');
  const formSua = document.getElementById('formSuaHoSo');
  if (formHien && formSua) {
    formHien.classList.toggle('an');
    formSua.classList.toggle('an');
  }
}

async function capNhatHoSo() {
  const data = {
    fullName: document.getElementById('suaTen')?.value,
    studentId: document.getElementById('suaMSSV')?.value,
    major: document.getElementById('suaNganh')?.value,
    graduationYear: document.getElementById('suaNam')?.value,
    currentCompany: document.getElementById('suaCongTy')?.value,
    jobTitle: document.getElementById('suaChucVu')?.value,
    phone: document.getElementById('suaDienThoai')?.value,
    linkedIn: document.getElementById('suaLinkedIn')?.value,
    skills: document.getElementById('suaSkills')?.value?.split(',').map(s => s.trim()),
    bio: document.getElementById('suaBio')?.value
  };
  
  const kq = await capNhatHoSoAPI(data);
  if (kq) {
    hienToast('Cập nhật hồ sơ thành công!');
    hienFormSuaHoSo();
    taiHoSo();
  } else {
    hienToast('Cập nhật thất bại', 'loi');
  }
}

async function taiHoSo() {
  const kq = await layThongTinToiAPI();
  if (!kq) return;
  
  const profile = kq.profile || {};
  
  // Update display elements
  if (document.getElementById('hosoTen')) document.getElementById('hosoTen').textContent = profile.fullName || 'Chưa cập nhật';
  if (document.getElementById('hosoEmail')) document.getElementById('hosoEmail').textContent = kq.user?.email || '';
  if (document.getElementById('avatarLon')) document.getElementById('avatarLon').textContent = (profile.fullName || 'U').charAt(0).toUpperCase();
  
  // Profile info
  if (document.getElementById('tt-ten')) document.getElementById('tt-ten').textContent = profile.fullName || '--';
  if (document.getElementById('tt-email')) document.getElementById('tt-email').textContent = kq.user?.email || '--';
  if (document.getElementById('tt-mssv')) document.getElementById('tt-mssv').textContent = profile.studentId || '--';
  if (document.getElementById('tt-nganh')) document.getElementById('tt-nganh').textContent = profile.major || '--';
  if (document.getElementById('tt-nam')) document.getElementById('tt-nam').textContent = profile.graduationYear || '--';
  if (document.getElementById('tt-congty')) document.getElementById('tt-congty').textContent = profile.currentCompany || '--';
  if (document.getElementById('tt-chucvu')) document.getElementById('tt-chucvu').textContent = profile.jobTitle || '--';
  if (document.getElementById('tt-dienthoai')) document.getElementById('tt-dienthoai').textContent = profile.phone || '--';
  
  // Fill form
  if (document.getElementById('suaTen')) document.getElementById('suaTen').value = profile.fullName || '';
  if (document.getElementById('suaMSSV')) document.getElementById('suaMSSV').value = profile.studentId || '';
  if (document.getElementById('suaNganh')) document.getElementById('suaNganh').value = profile.major || '';
  if (document.getElementById('suaNam')) document.getElementById('suaNam').value = profile.graduationYear || '';
  if (document.getElementById('suaCongTy')) document.getElementById('suaCongTy').value = profile.currentCompany || '';
  if (document.getElementById('suaChucVu')) document.getElementById('suaChucVu').value = profile.jobTitle || '';
  if (document.getElementById('suaDienThoai')) document.getElementById('suaDienThoai').value = profile.phone || '';
  if (document.getElementById('suaLinkedIn')) document.getElementById('suaLinkedIn').value = profile.linkedIn || '';
  if (document.getElementById('suaSkills')) document.getElementById('suaSkills').value = (profile.skills || []).join(', ');
  if (document.getElementById('suaBio')) document.getElementById('suaBio').value = profile.bio || '';
}

function taiDuLieuAdmin() {
  // Admin features placeholder
  console.log('Admin dashboard loaded');
}

function tinhHanNop(deadline) {
  const now = new Date(), dl = new Date(deadline);
  const ngay = Math.ceil((dl - now) / 86400000);
  if (ngay < 0) return { text:'Đã hết hạn', gap:true };
  if (ngay === 0) return { text:'Hết hạn hôm nay!', gap:true };
  if (ngay <= 3) return { text:`Còn ${ngay} ngày`, gap:true };
  return { text:`Còn ${ngay} ngày`, gap:false };
}

function taoTheViec(viec) {
  const hn = tinhHanNop(viec.deadline);
  const chu = (viec.creatorId?.email || 'N/A').charAt(0).toUpperCase();
  return `
  <div class="the-viec" onclick="xemChiTietViec('${viec._id}')">
    <div class="viec-dau">
      <div class="logo-cty">${chu}</div>
      <div class="viec-info">
        <div class="viec-tieude">${viec.title}</div>
        <div class="viec-cty">🏢 ${viec.creatorId?.email || 'Nhà tuyển dụng'}</div>
        <div class="viec-tags">
          <span class="tag tag-xanh">${nhanLoaiViec(viec.jobType)}</span>
          <span class="tag tag-xam">📍 ${viec.location}</span>
          ${viec.benefits ? `<span class="tag tag-cam">💰 ${viec.benefits.substring(0,40)}...</span>` : ''}
          ${viec.status==='Pending'?'<span class="tag tag-vang">⏳ Chờ duyệt</span>':''}
        </div>
        <div style="color:var(--xam-5);font-size:13px">📋 ${(viec.requirements||'').substring(0,100)}...</div>
      </div>
    </div>
    <div class="viec-chan">
      <span class="han-nop ${hn.gap?'gap':''}">⏰ ${hn.text}</span>
      <div class="nhom-nut-viec">
        <button class="btn btn-vien btn-nho" onclick="event.stopPropagation();xemChiTietViec('${viec._id}')">Xem chi tiết</button>
        ${viec.status==='Approved' ? `<button class="btn btn-xanh btn-nho" onclick="event.stopPropagation();moModalUngTuyen('${viec._id}','${viec.title.replace(/'/g,"\\'")}')">📤 Ứng tuyển</button>` : ''}
      </div>
    </div>
  </div>`;
}

async function taiDanhSachViec() {
  const tim = document.getElementById('timKiemViec')?.value.trim() || '';
  const loai = document.getElementById('loaiViecLoc')?.value || '';
  const diaDiem = document.getElementById('diaDiemViecLoc')?.value.trim() || '';
  const container = document.getElementById('danhSachViec');
  container.innerHTML = '<div class="dang-tai"><div class="vong-quay"></div> Đang tải danh sách việc làm...</div>';

  const params = {
    page: paginationState.viec.page,
    limit: paginationState.viec.limit
  };
  if (tim) params.search = tim;
  if (loai) params.jobType = loai;
  if (diaDiem) params.location = diaDiem;

  const kq = await layDanhSachViecAPI(params);
  const ds = kq?.jobs || kq || [];

  if (!ds || ds.length === 0) {
    hienKetQuaViec(0);
    container.innerHTML = `<div class="rong">
      <div class="rong-hinh"><svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="25" width="100" height="70" rx="10" fill="#e8f0fe"/>
        <rect x="30" y="38" width="60" height="8" rx="4" fill="#1a73e8" opacity=".3"/>
        <rect x="30" y="52" width="80" height="6" rx="3" fill="#1a73e8" opacity=".2"/>
        <rect x="30" y="64" width="50" height="6" rx="3" fill="#1a73e8" opacity=".15"/>
        <circle cx="105" cy="40" r="16" fill="#fff" stroke="#e8f0fe" stroke-width="2"/>
        <text x="105" y="45" text-anchor="middle" font-size="14">🔍</text>
      </svg></div>
      <h3>Không tìm thấy việc làm phù hợp</h3>
      <p>Thử thay đổi từ khóa hoặc xóa bộ lọc</p>
    </div>`;
    return;
  }

  hienKetQuaViec(kq.total || ds.length);
  const html = ds.map(taoTheViec).join('');
  
  // Thêm pagination controls nếu có
  let paginationHtml = '';
  if (kq.totalPages > 1) {
    paginationHtml = `<div class="phan-trang">
      ${kq.page > 1 ? `<button class="btn btn-xam" onclick="chuyenTrangViec(${kq.page - 1})">← Trang trước</button>` : ''}
      <span class="thongtin-trang">Trang ${kq.page} / ${kq.totalPages}</span>
      ${kq.hasMore ? `<button class="btn btn-xam" onclick="chuyenTrangViec(${kq.page + 1})">Trang sau →</button>` : ''}
    </div>`;
  }
  
  container.innerHTML = html + paginationHtml;
}

function chuyenTrangViec(page) {
  paginationState.viec.page = page;
  taiDanhSachViec();
  document.getElementById('danhSachViec').scrollIntoView({ behavior: 'smooth' });
}

async function taiViecLamTrangChu() {
  const container = document.getElementById('viecLamTrangChu');
  if (!container) return;
  const ds = await layDanhSachViecAPI({});
  if (!ds || ds.length===0) { container.innerHTML='<div class="rong"><div>Chưa có việc làm</div></div>'; return; }
  container.innerHTML = ds.slice(0,3).map(taoTheViec).join('');
}

function batTatFormViec() {
  const form = document.getElementById('formViecLam');
  form.classList.toggle('an');
  if (!form.classList.contains('an')) form.scrollIntoView({behavior:'smooth'});
}

async function taoViecLam() {
  const dl = {
    title: document.getElementById('tieuDeViec').value.trim(),
    position: document.getElementById('viTriViec').value.trim(),
    description: document.getElementById('moTaViec').value.trim(),
    requirements: document.getElementById('yeuCauViec').value.trim(),
    jobType: document.getElementById('hinhThucViec').value,
    location: document.getElementById('diaDiemViec').value.trim(),
    benefits: document.getElementById('quyenLoiViec').value.trim(),
    applicationMethod: document.getElementById('cachUngTuyenViec').value.trim(),
    deadline: new Date(document.getElementById('hanViec').value).toISOString()
  };
  if (!dl.title||!dl.position||!dl.description||!dl.requirements||!dl.jobType||!dl.location||!dl.applicationMethod||!dl.deadline)
    return hienToast('Vui lòng điền đầy đủ các trường bắt buộc (*)', 'loi');
  const kq = await taoViecLamAPI(dl);
  if (kq?.jobPosting) { hienToast('Đăng tin thành công! Chờ quản trị viên duyệt.'); batTatFormViec(); taiDanhSachViec(); }
  else hienToast(kq?.message || 'Không thể đăng tin. Bạn cần có vai trò Nhà tuyển dụng.', 'loi');
}

// Chi tiết việc làm
async function xemChiTietViec(id) {
  const viec = await layChiTietViecAPI(id);
  if (!viec) return hienToast('Không thể tải chi tiết', 'loi');
  viecDangXem = viec;
  document.getElementById('tieuDeChiTiet').textContent = viec.title;
  const hn = tinhHanNop(viec.deadline);
  document.getElementById('noiDungChiTiet').innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
      <span class="tag tag-xanh">${nhanLoaiViec(viec.jobType)}</span>
      <span class="tag tag-xam">📍 ${viec.location}</span>
      <span class="tag ${hn.gap?'tag-do':'tag-xam'}">⏰ ${hn.text}</span>
      <span class="tag tag-xam">👤 ${viec.applicationCount||0} ứng viên</span>
    </div>
    <div style="margin-bottom:20px"><strong>Mô tả công việc:</strong><p style="margin-top:8px;line-height:1.75;color:#374151">${viec.description}</p></div>
    <div style="margin-bottom:20px"><strong>Yêu cầu kỹ năng:</strong><p style="margin-top:8px;line-height:1.75;color:#374151">${viec.requirements}</p></div>
    ${viec.benefits ? `<div style="margin-bottom:20px"><strong>Quyền lợi:</strong><p style="margin-top:8px;line-height:1.75;color:#374151">${viec.benefits}</p></div>` : ''}
    <div style="background:var(--xanh-nhat);padding:16px;border-radius:10px;margin-bottom:16px">
      <strong>📧 Cách ứng tuyển:</strong><br>
      <span style="color:var(--xanh);margin-top:6px;display:block">${viec.applicationMethod}</span>
    </div>
    <p style="font-size:13px;color:var(--xam-5)">📅 Hạn ứng tuyển: <strong>${new Date(viec.deadline).toLocaleDateString('vi-VN')}</strong></p>`;
  document.getElementById('btnUngTuyenChiTiet').onclick = () => { dongModalChiTiet(); moModalUngTuyen(viec._id, viec.title); };
  document.getElementById('modalChiTietViec').classList.remove('an');
}

function dongModalChiTiet() { document.getElementById('modalChiTietViec').classList.add('an'); }

// Ứng tuyển
function moModalUngTuyen(viecId, tenViec) {
  document.getElementById('viecLamIdUngTuyen').value = viecId;
  document.getElementById('tenViecUngTuyen').textContent = tenViec;
  document.getElementById('linkCVUngTuyen').value = '';
  document.getElementById('thuGioiThieuUngTuyen').value = '';
  document.getElementById('modalUngTuyen').classList.remove('an');
}
function dongModalUngTuyen() { document.getElementById('modalUngTuyen').classList.add('an'); }

async function guiHoSoUngTuyen() {
  const viecId = document.getElementById('viecLamIdUngTuyen').value;
  const cvUrl = document.getElementById('linkCVUngTuyen').value.trim();
  const thuGioiThieu = document.getElementById('thuGioiThieuUngTuyen').value.trim();
  if (!cvUrl) return hienToast('Vui lòng nhập link CV của bạn', 'loi');
  const kq = await ungTuyenAPI({jobId:viecId, cvUrl, coverLetter:thuGioiThieu});
  if (kq?.application) { hienToast('Nộp hồ sơ thành công! 🎉'); dongModalUngTuyen(); }
  else hienToast(kq?.message || 'Nộp hồ sơ thất bại', 'loi');
}

// ===== BÀI VIẾT =====
const danhMucBai = {
  'Experience': { nhan:'💡 Kinh nghiệm', nen:'#e8f9f0', mau:'#00b14f' },
  'Question': { nhan:'❓ Câu hỏi', nen:'#ebf5fd', mau:'#3498db' },
  'CareerAdvice': { nhan:'🎯 Tư vấn nghề nghiệp', nen:'#fff4ec', mau:'#f37021' },
  'JobShare': { nhan:'💼 Chia sẻ việc làm', nen:'#f5f0ff', mau:'#8e44ad' }
};

function taoTheBai(bai) {
  const dm = danhMucBai[bai.category] || { nhan:bai.category, nen:'#f3f4f6', mau:'#6b7280' };
  const tac = bai.authorId?.email || 'Ẩn danh';
  const chu = tac.charAt(0).toUpperCase();
  return `
  <div class="the-bai" id="bai-${bai._id}">
    <div class="bai-dau">
      <div class="avatar-bai">${chu}</div>
      <div class="bai-tacgia">
        <div class="ten">${tac}</div>
        <div class="thoigian">${formatThoiGian(bai.createdAt)}</div>
      </div>
      <span class="tag" style="margin-left:auto;background:${dm.nen};color:${dm.mau}">${dm.nhan}</span>
    </div>
    <div class="bai-tieude">${bai.title}</div>
    <div class="bai-noidung">${bai.content}</div>
    <div class="bai-chan">
      <button class="nut-tuongtac ${bai._likedByMe ? 'da-thich' : ''}" onclick="thichBai('${bai._id}', this)">
        ❤️ <span class="so-thich">${bai.likeCount||0}</span> Thích
      </button>
      <button class="nut-tuongtac" onclick="batTatBinhLuan('${bai._id}')">
        💬 <span id="soBinhLuan-${bai._id}">${bai.commentCount||0}</span> Bình luận
      </button>
      <button class="nut-tuongtac" onclick="baoCaoNoiDung('Post','${bai._id}')">🚩 Báo cáo</button>
    </div>

    <!-- Khung bình luận (ẩn mặc định) -->
    <div class="khung-binhluan an" id="khungBL-${bai._id}">
      <!-- Danh sách bình luận -->
      <div class="ds-binhluan" id="dsBL-${bai._id}">
        <div style="text-align:center;color:var(--xam-5);padding:12px;font-size:13px">Đang tải bình luận...</div>
      </div>
      <!-- Form nhập bình luận mới -->
      <div class="form-binhluan">
        <div class="avatar-nho" id="avatarBL-${bai._id}">U</div>
        <div class="o-nhap-bl">
          <input type="text" class="input-binhluan" id="inputBL-${bai._id}"
            placeholder="Viết bình luận..."
            onkeydown="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); guiBinhLuan('${bai._id}'); }">
          <button class="btn-gui-bl" onclick="guiBinhLuan('${bai._id}')">Gửi</button>
        </div>
      </div>
    </div>
  </div>`;
}

// Bật/tắt khung bình luận
async function batTatBinhLuan(baiId) {
  const khung = document.getElementById('khungBL-' + baiId);
  const dangAn = khung.classList.contains('an');

  if (dangAn) {
    khung.classList.remove('an');
    // Set avatar người dùng
    const chu = nguoiDungHienTai?.email?.charAt(0).toUpperCase() || 'U';
    const avEl = document.getElementById('avatarBL-' + baiId);
    if (avEl) avEl.textContent = chu;
    // Tải bình luận
    await taiDanhSachBinhLuan(baiId);
  } else {
    khung.classList.add('an');
  }
}

// Tải danh sách bình luận
async function taiDanhSachBinhLuan(baiId) {
  const container = document.getElementById('dsBL-' + baiId);
  if (!container) return;

  const kq = await layChiTietBaiAPI(baiId);
  const binhLuans = kq?.comments || [];

  if (binhLuans.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--xam-5);padding:14px;font-size:13px">Chưa có bình luận nào. Hãy là người đầu tiên! 💬</div>';
    return;
  }

  container.innerHTML = binhLuans.map(bl => {
    const chu = bl.userId?.email?.charAt(0).toUpperCase() || 'U';
    return `
    <div class="muc-binhluan">
      <div class="avatar-bl">${chu}</div>
      <div class="noidung-bl">
        <div class="ten-bl">${bl.userId?.email || 'Ẩn danh'}</div>
        <div class="text-bl">${bl.content}</div>
        <div class="thoigian-bl">${formatThoiGian(bl.createdAt)}</div>
      </div>
    </div>`;
  }).join('');

  // Cuộn xuống cuối danh sách bình luận
  container.scrollTop = container.scrollHeight;
}

// Gửi bình luận mới
async function guiBinhLuan(baiId) {
  const input = document.getElementById('inputBL-' + baiId);
  const nd = input?.value.trim();
  if (!nd) return;

  input.value = '';
  input.disabled = true;

  const kq = await taoBinhLuanAPI(baiId, nd);
  input.disabled = false;
  input.focus();

  if (kq) {
    // Cập nhật số bình luận
    const soEl = document.getElementById('soBinhLuan-' + baiId);
    if (soEl) soEl.textContent = parseInt(soEl.textContent || 0) + 1;
    // Tải lại danh sách
    await taiDanhSachBinhLuan(baiId);
  } else {
    hienToast('Không gửi được bình luận', 'loi');
  }
}
  const tim = document.getElementById('timKiemBai')?.value.trim() || '';
  const dm = document.getElementById('danhMucBaiLoc')?.value || '';
  const container = document.getElementById('danhSachBai');
  container.innerHTML = '<div class="dang-tai"><div class="vong-quay"></div> Đang tải bài viết...</div>';

  const params = {};
  if (tim) params.search = tim;
  if (dm) params.category = dm;

  const ds = await layDanhSachBaiAPI(params);

  if (!ds || ds.length === 0) {
    hienKetQuaBai(0);
    container.innerHTML = `<div class="rong">
      <div class="rong-hinh"><svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="110" height="90" rx="12" fill="#e8f0fe"/>
        <circle cx="40" cy="42" r="14" fill="#1a73e8" opacity=".25"/>
        <text x="40" y="47" text-anchor="middle" font-size="13">👤</text>
        <rect x="60" y="34" width="55" height="6" rx="3" fill="#1a73e8" opacity=".3"/>
        <rect x="60" y="45" width="40" height="5" rx="2.5" fill="#1a73e8" opacity=".2"/>
        <rect x="20" y="66" width="100" height="6" rx="3" fill="#1a73e8" opacity=".15"/>
        <rect x="20" y="77" width="80" height="6" rx="3" fill="#1a73e8" opacity=".12"/>
        <rect x="20" y="88" width="90" height="6" rx="3" fill="#1a73e8" opacity=".1"/>
      </svg></div>
      <h3>Không tìm thấy bài viết</h3>
      <p>Thử thay đổi từ khóa hoặc danh mục</p>
    </div>`;
    return;
  }

  hienKetQuaBai(ds.length);
  container.innerHTML = ds.map(taoTheBai).join('');
}

async function taiBaiVietTrangChu() {
  const container = document.getElementById('baiVietTrangChu');
  if (!container) return;
  const ds = await layDanhSachBaiAPI({});
  if (!ds || ds.length===0) { container.innerHTML='<div class="rong"><div>Chưa có bài viết</div></div>'; return; }
  container.innerHTML = ds.slice(0,2).map(taoTheBai).join('');
}

function batTatFormBai() {
  const form = document.getElementById('formBaiViet');
  form.classList.toggle('an');
  if (!form.classList.contains('an')) form.scrollIntoView({behavior:'smooth'});
}

async function taoBaiViet() {
  const dm = document.getElementById('danhMucBai').value;
  const tieude = document.getElementById('tieuDeBai').value.trim();
  const noidung = document.getElementById('noiDungBai').value.trim();
  if (!dm||!tieude||!noidung) return hienToast('Vui lòng điền đầy đủ thông tin', 'loi');
  const kq = await taoBaiVietAPI({category:dm, title:tieude, content:noidung});
  if (kq?.post) { hienToast('Đăng bài thành công! Chờ quản trị viên duyệt.'); batTatFormBai(); taiDanhSachBai(); }
  else hienToast(kq?.message || 'Đăng bài thất bại', 'loi');
}

async function thichBai(id, btn) {
  const kq = await thichBaiAPI(id);
  if (kq?.post) {
    // Cập nhật số thích trên nút luôn, không reload cả trang
    const soEl = btn?.querySelector('.so-thich');
    if (soEl) soEl.textContent = kq.post.likeCount || 0;
    if (kq.message?.includes('unliked')) {
      btn?.classList.remove('da-thich');
    } else {
      btn?.classList.add('da-thich');
    }
  }
}

function baoCaoNoiDung(loai, id) {
  const lydo = prompt('🚩 Lý do báo cáo:');
  if (lydo?.trim()) taoBaoCaoAPI(loai, id, lydo).then(kq => { if(kq) hienToast('Đã gửi báo cáo! Quản trị viên sẽ xem xét.'); });
}

// ===== MENTOR =====
function taoTheMentor(mentor) {
  const chu = mentor.fullName ? mentor.fullName.charAt(0).toUpperCase() : '?';
  const ky = mentor.skills || [];
  const userId = mentor.userId?._id || mentor.userId || '';
  return `
  <div class="the-mentor">
    <div class="avatar-mentor">${chu}</div>
    <div class="mentor-ten">${mentor.fullName||'Ẩn danh'}</div>
    <div class="mentor-chucvu">${mentor.jobTitle||'Chưa cập nhật'}</div>
    <div class="mentor-cty">🏢 ${mentor.currentCompany||'Chưa cập nhật'}</div>
    <div class="mentor-skills">
      ${ky.slice(0,4).map(s=>`<span class="tag tag-xanh">${s}</span>`).join('')}
      ${ky.length>4?`<span class="tag tag-xam">+${ky.length-4}</span>`:''}
    </div>
    <div class="mentor-info">📚 ${mentor.major||'N/A'} • 🎓 ${mentor.graduationYear||'N/A'}</div>
    <button class="btn btn-xanh" style="width:100%" onclick="moFormYeuCauMentor('${userId}','${(mentor.fullName||'').replace(/'/g,"\\'")}')">
      📩 Gửi Yêu Cầu Tư Vấn
    </button>
  </div>`;
}

async function taiDanhSachMentor() {
  const tim = document.getElementById('timKiemMentor')?.value.trim() || '';
  const nganh = document.getElementById('chuyenNganhMentor')?.value.trim() || '';
  const kynang = document.getElementById('kyNangMentor')?.value.trim() || '';
  const container = document.getElementById('danhSachMentor');
  container.innerHTML = '<div class="dang-tai"><div class="vong-quay"></div> Đang tải danh sách mentor...</div>';

  const params = {};
  if (tim) params.search = tim;
  if (nganh) params.major = nganh;
  if (kynang) params.skills = kynang;

  const ds = await layDanhSachMentorAPI(params);

  if (!ds || ds.length === 0) {
    hienKetQuaMentor(0);
    container.innerHTML = `<div class="rong">
      <div class="rong-hinh"><svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="52" r="28" fill="#e8f0fe"/>
        <circle cx="50" cy="42" r="14" fill="#1a73e8" opacity=".3"/>
        <ellipse cx="50" cy="66" rx="20" ry="9" fill="#1a73e8" opacity=".15"/>
        <circle cx="105" cy="48" r="22" fill="#dbeafe"/>
        <circle cx="105" cy="40" r="11" fill="#1a73e8" opacity=".3"/>
        <ellipse cx="105" cy="60" rx="16" ry="7" fill="#1a73e8" opacity=".15"/>
        <path d="M78 54 L84 54" stroke="#1a73e8" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 2"/>
      </svg></div>
      <h3>Không tìm thấy mentor</h3>
      <p>Thử thay đổi từ khóa hoặc xóa bộ lọc</p>
    </div>`;
    return;
  }

  hienKetQuaMentor(ds.length);
  container.innerHTML = ds.map(taoTheMentor).join('');
}

function moFormYeuCauMentor(alumniId, ten) {
  document.getElementById('alumniIdYeuCau').value = alumniId;
  document.getElementById('chuDeMentor').value = '';
  document.getElementById('noiDungMentor').value = '';
  document.getElementById('formYeuCauMentor').classList.remove('an');
  document.getElementById('formYeuCauMentor').scrollIntoView({behavior:'smooth'});
  hienToast(`Đang gửi yêu cầu cho mentor ${ten}`, 'thongbao');
}

function anFormMentor() { document.getElementById('formYeuCauMentor').classList.add('an'); }

async function guiYeuCauMentor() {
  const alumniId = document.getElementById('alumniIdYeuCau').value;
  const chuDe = document.getElementById('chuDeMentor').value.trim();
  const noiDung = document.getElementById('noiDungMentor').value.trim();
  if (!chuDe||!noiDung) return hienToast('Vui lòng điền đầy đủ chủ đề và nội dung', 'loi');
  if (!alumniId) return hienToast('Không tìm thấy thông tin mentor', 'loi');
  const kq = await guiYeuCauMentorAPI({alumniId, topic:chuDe, message:noiDung});
  if (kq?.mentorshipRequest) { hienToast('Gửi yêu cầu thành công! Mentor sẽ phản hồi sớm 🎉'); anFormMentor(); }
  else hienToast(kq?.message || 'Gửi yêu cầu thất bại', 'loi');
}

async function batTatDangKyMentor() {
  const hs = await layThongTinToiAPI();
  const isMentor = hs?.profile?.isMentorAvailable || false;
  const kq = await capNhatTrangThaiMentorAPI(!isMentor);
  if (kq) { hienToast(isMentor ? 'Đã tắt trạng thái Mentor' : 'Đã đăng ký làm Mentor! 🌟'); taiDanhSachMentor(); }
}

// ===== HỒ SƠ =====
async function taiHoSo() {
  const kq = await layThongTinToiAPI();
  if (!kq) return;
  const { user, profile } = kq;
  const ten = profile?.fullName || user.email.split('@')[0];
  const roles = (user.roles||[]).map(r=>typeof r==='string'?r:r.roleName);
  document.getElementById('avatarLon').textContent = ten.charAt(0).toUpperCase();
  document.getElementById('hosoTen').textContent = ten;
  document.getElementById('hosoVaiTro').textContent = roles.join(', ') || 'Chưa xác định';
  document.getElementById('hosoEmail').textContent = user.email;
  // Hiện block nhận yêu cầu nếu là Alumni
  if (roles.includes('Alumni')) {
    document.getElementById('blockYeuCauNhanDuoc').style.display = 'block';
    taiYeuCauNhanDuoc();
  }
  // Thông tin chi tiết
  document.getElementById('tt-ten').textContent = profile?.fullName||'--';
  document.getElementById('tt-email').textContent = user.email;
  document.getElementById('tt-mssv').textContent = profile?.studentCode||'--';
  document.getElementById('tt-nganh').textContent = profile?.major||'--';
  document.getElementById('tt-nam').textContent = profile?.graduationYear||'--';
  document.getElementById('tt-congty').textContent = profile?.currentCompany||'--';
  document.getElementById('tt-chucvu').textContent = profile?.jobTitle||'--';
  document.getElementById('tt-dienthoai').textContent = profile?.phone||'--';
  document.getElementById('tt-gioithieu').textContent = profile?.bio||'Chưa có giới thiệu.';
  const cvLink = document.getElementById('tt-cv-link');
  cvLink.href = profile?.defaultCvUrl||'#';
  cvLink.textContent = profile?.defaultCvUrl||'Chưa cập nhật';
  const kyNangEl = document.getElementById('tt-kynang');
  const ky = profile?.skills||[];
  kyNangEl.innerHTML = ky.length ? ky.map(s=>`<span class="tag tag-xanh">${s}</span>`).join('') : '<span style="color:var(--xam-5)">Chưa cập nhật</span>';
  // Điền form sửa
  if (profile) {
    document.getElementById('suaTen').value = profile.fullName||'';
    document.getElementById('suaMSSV').value = profile.studentCode||'';
    document.getElementById('suaNganh').value = profile.major||'';
    document.getElementById('suaNamTN').value = profile.graduationYear||'';
    document.getElementById('suaCongTy').value = profile.currentCompany||'';
    document.getElementById('suaChucVu').value = profile.jobTitle||'';
    document.getElementById('suaDienThoai').value = profile.phone||'';
    document.getElementById('suaCV').value = profile.defaultCvUrl||'';
    document.getElementById('suaKyNang').value = (profile.skills||[]).join(', ');
    document.getElementById('suaGioiThieu').value = profile.bio||'';
    document.getElementById('suaMentor').checked = profile.isMentorAvailable||false;
  }
  // Hồ sơ ứng tuyển
  const apps = await layHoSoCuaToiAPI();
  if (apps?.length) {
    document.getElementById('soUngTuyen').textContent = apps.length;
    document.getElementById('danhSachUngTuyenCuaToi').innerHTML = apps.map(a=>`
      <div style="padding:10px 0;border-bottom:1px solid var(--xam-1)">
        <div style="font-weight:500;font-size:13px;margin-bottom:4px">${a.jobId?.title||'Việc làm'}</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="nhan-tt ${a.status==='Accepted'?'nhan-xanh':a.status==='Rejected'?'nhan-do':'nhan-vang'}">${dichTrangThaiUngTuyen(a.status)}</span>
          ${a.status==='Submitted'||a.status==='Reviewing' ? `<button class="btn btn-xam btn-nho" onclick="rutHoSo('${a._id}')">Rút hồ sơ</button>` : ''}
        </div>
      </div>`).join('');
  }
  // Yêu cầu mentor đã gửi
  const yeucau = await layYeuCauDaGuiAPI();
  if (yeucau?.length) {
    document.getElementById('danhSachYeuCauMentor').innerHTML = yeucau.map(r=>`
      <div style="padding:10px 0;border-bottom:1px solid var(--xam-1)">
        <div style="font-weight:500;font-size:13px;margin-bottom:4px">${r.topic}</div>
        <span class="nhan-tt ${r.status==='Accepted'?'nhan-xanh':r.status==='Rejected'?'nhan-do':'nhan-vang'}">${dichTrangThaiMentor(r.status)}</span>
      </div>`).join('');
  }
}

async function taiYeuCauNhanDuoc() {
  const ds = await layYeuCauNhanDuocAPI();
  if (!ds?.length) return;
  document.getElementById('danhSachYeuCauNhanDuoc').innerHTML = ds.map(r=>`
    <div style="padding:12px 0;border-bottom:1px solid var(--xam-1)">
      <div style="font-weight:500;font-size:13px">${r.topic}</div>
      <div style="font-size:12px;color:var(--xam-5);margin:4px 0">Từ: ${r.studentId?.email||'--'}</div>
      <div style="font-size:13px;color:var(--xam-7);margin-bottom:10px">${r.message?.substring(0,100)}...</div>
      ${r.status==='Pending' ? `
        <div style="display:flex;gap:8px">
          <button class="btn btn-xanh btn-nho" onclick="phanHoiMentor('${r._id}','Accepted')">✅ Chấp nhận</button>
          <button class="btn btn-do btn-nho" onclick="phanHoiMentor('${r._id}','Rejected')">❌ Từ chối</button>
        </div>` : `<span class="nhan-tt ${r.status==='Accepted'?'nhan-xanh':'nhan-do'}">${dichTrangThaiMentor(r.status)}</span>`}
    </div>`).join('');
}

async function phanHoiMentor(id, tt) {
  const kq = await phanHoiYeuCauMentorAPI(id, tt);
  if (kq) { hienToast(tt==='Accepted'?'Đã chấp nhận yêu cầu mentor!':'Đã từ chối yêu cầu.'); taiYeuCauNhanDuoc(); }
}

async function rutHoSo(id) {
  if (!confirm('Bạn có chắc muốn rút hồ sơ ứng tuyển này?')) return;
  const kq = await rutHoSoAPI(id);
  if (kq) { hienToast('Đã rút hồ sơ thành công'); taiHoSo(); }
}

function hienFormSuaHoSo() {
  document.getElementById('formSuaHoSo').classList.remove('an');
  document.getElementById('hienThiHoSo').classList.add('an');
}
function anFormSuaHoSo() {
  document.getElementById('formSuaHoSo').classList.add('an');
  document.getElementById('hienThiHoSo').classList.remove('an');
}

async function luuHoSo() {
  const dl = {
    fullName: document.getElementById('suaTen').value.trim(),
    studentCode: document.getElementById('suaMSSV').value.trim(),
    major: document.getElementById('suaNganh').value.trim(),
    graduationYear: parseInt(document.getElementById('suaNamTN').value)||null,
    currentCompany: document.getElementById('suaCongTy').value.trim(),
    jobTitle: document.getElementById('suaChucVu').value.trim(),
    phone: document.getElementById('suaDienThoai').value.trim(),
    defaultCvUrl: document.getElementById('suaCV').value.trim(),
    skills: document.getElementById('suaKyNang').value.split(',').map(s=>s.trim()).filter(Boolean),
    bio: document.getElementById('suaGioiThieu').value.trim(),
    isMentorAvailable: document.getElementById('suaMentor').checked
  };
  if (!dl.fullName) return hienToast('Họ và tên là bắt buộc', 'loi');
  const kq = await capNhatHoSoAPI(dl);
  if (kq?.profile) { hienToast('Cập nhật hồ sơ thành công! 🎉'); anFormSuaHoSo(); taiHoSo(); }
  else hienToast(kq?.message||'Cập nhật thất bại', 'loi');
}

// ===== THÔNG BÁO =====
function batTatThongBao() {
  document.getElementById('hopThongBao').classList.toggle('an');
  taiThongBao();
}

async function taiThongBao() {
  const ds = await layThongBaoAPI();
  const container = document.getElementById('danhSachThongBao');
  if (!ds?.length) { container.innerHTML='<p style="padding:20px;text-align:center;color:var(--xam-5)">Chưa có thông báo nào</p>'; return; }
  const chuaDoc = ds.filter(t=>!t.isRead).length;
  if (chuaDoc > 0) document.getElementById('chamThongBao').classList.remove('an');
  container.innerHTML = ds.slice(0,10).map(t=>`
    <div class="thongbao-muc ${!t.isRead?'chua-doc':''}">
      <div style="font-weight:500;font-size:13px">${t.title}</div>
      <div style="font-size:12px;color:var(--xam-5);margin-top:4px">${t.content}</div>
      <div style="font-size:11px;color:var(--xam-5);margin-top:4px">${formatThoiGian(t.createdAt)}</div>
    </div>`).join('');
}

// ===== QUẢN TRỊ =====
async function taiDuLieuAdmin() {
  taiThongKe();
  taiTinChoDuyet();
  taiBaiChoDuyet();
}

async function taiTinChoDuyet() {
  const tbody = document.getElementById('bangTinChoduyet');
  const ds = await layTinChoDuyetAPI();
  if (!ds?.length) { tbody.innerHTML='<tr><td colspan="6" class="o-trong">✅ Không có tin tuyển dụng nào chờ duyệt</td></tr>'; return; }
  tbody.innerHTML = ds.map(j=>`
    <tr>
      <td><strong>${j.title}</strong><br><small style="color:var(--xam-5)">${j.position}</small></td>
      <td style="font-size:13px">${j.creatorId?.email||'--'}</td>
      <td><span class="tag tag-xanh">${nhanLoaiViec(j.jobType)}</span></td>
      <td>📍 ${j.location}</td>
      <td style="font-size:13px">${new Date(j.deadline).toLocaleDateString('vi-VN')}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-xanh btn-nho" onclick="duyetViec('${j._id}','Approved')">✅ Duyệt</button>
          <button class="btn btn-do btn-nho" onclick="tuChoiViec('${j._id}')">❌ Từ chối</button>
        </div>
      </td>
    </tr>`).join('');
}

async function taiBaiChoDuyet() {
  const tbody = document.getElementById('bangBaiChoduyet');
  const ds = await layBaiChoDuyetAPI();
  if (!ds?.length) { tbody.innerHTML='<tr><td colspan="5" class="o-trong">✅ Không có bài viết nào chờ duyệt</td></tr>'; return; }
  tbody.innerHTML = ds.map(p=>`
    <tr>
      <td><strong>${p.title}</strong></td>
      <td style="font-size:13px">${p.authorId?.email||'--'}</td>
      <td>${danhMucBai[p.category]?.nhan||p.category}</td>
      <td style="font-size:13px">${new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-xanh btn-nho" onclick="duyetBai('${p._id}','Approved')">✅ Duyệt</button>
          <button class="btn btn-do btn-nho" onclick="duyetBai('${p._id}','Hidden')">🚫 Ẩn</button>
        </div>
      </td>
    </tr>`).join('');
}

async function taiBaoCaoViPham() {
  const tbody = document.getElementById('bangBaoCao');
  const ds = await layBaoCaoAPI();
  if (!ds?.length) { tbody.innerHTML='<tr><td colspan="5" class="o-trong">✅ Không có báo cáo vi phạm nào</td></tr>'; return; }
  tbody.innerHTML = ds.map(r=>`
    <tr>
      <td style="font-size:13px">${r.reporterId?.email||'--'}</td>
      <td><span class="nhan-tt nhan-xam">${r.targetType}</span></td>
      <td style="font-size:13px">${r.reason}</td>
      <td><span class="nhan-tt nhan-vang">Chờ xử lý</span></td>
      <td><button class="btn btn-xanh btn-nho" onclick="xulyBaoCao('${r._id}')">✅ Giải quyết</button></td>
    </tr>`).join('');
}

async function taiNguoiDungAdmin() {
  const tbody = document.getElementById('bangNguoiDung');
  const ds = await layNguoiDungAdminAPI();
  if (!ds?.length) { tbody.innerHTML='<tr><td colspan="5" class="o-trong">Không có người dùng</td></tr>'; return; }
  tbody.innerHTML = ds.map(u=>`
    <tr>
      <td>${u.email}</td>
      <td>${(u.roles||[]).map(r=>r.roleName||r).join(', ')||'--'}</td>
      <td><span class="nhan-tt ${u.accountStatus==='Active'?'nhan-xanh':'nhan-do'}">${u.accountStatus==='Active'?'Đang hoạt động':'Đã khóa'}</span></td>
      <td style="font-size:13px">${new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
      <td>
        ${u.accountStatus==='Active'
          ? `<button class="btn btn-do btn-nho" onclick="khoaTaiKhoan('${u._id}','Locked')">🔒 Khóa</button>`
          : `<button class="btn btn-xanh btn-nho" onclick="khoaTaiKhoan('${u._id}','Active')">🔓 Mở khóa</button>`}
      </td>
    </tr>`).join('');
}

async function taiNhatKy() {
  const tbody = document.getElementById('bangNhatKy');
  const ds = await layNhatKyAPI();
  if (!ds?.length) { tbody.innerHTML='<tr><td colspan="4" class="o-trong">Chưa có nhật ký</td></tr>'; return; }
  tbody.innerHTML = ds.map(l=>`
    <tr>
      <td style="font-size:13px">${l.actorId?.email||'--'}</td>
      <td><span class="nhan-tt nhan-xam">${dich_hanh_dong(l.action)}</span></td>
      <td style="font-size:13px">${l.targetTable}</td>
      <td style="font-size:13px">${new Date(l.createdAt).toLocaleString('vi-VN')}</td>
    </tr>`).join('');
}

function chuyenTabAdmin(tab, btn) {
  document.querySelectorAll('.tab-noi-dung').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('qt-'+tab).classList.add('active');
  btn.classList.add('active');
  if (tab==='bao-cao') taiBaoCaoViPham();
  if (tab==='nguoi-dung') taiNguoiDungAdmin();
  if (tab==='nhat-ky') taiNhatKy();
}

async function duyetViec(id, tt) {
  const kq = await duyetViecAPI(id, tt);
  if (kq) { hienToast(tt==='Approved'?'Đã duyệt tin tuyển dụng! ✅':'Đã từ chối tin.'); taiTinChoDuyet(); taiThongKe(); }
}

async function tuChoiViec(id) {
  const lydo = prompt('📝 Lý do từ chối:');
  if (!lydo) return;
  const kq = await duyetViecAPI(id, 'Rejected', lydo);
  if (kq) { hienToast('Đã từ chối tin tuyển dụng.'); taiTinChoDuyet(); taiThongKe(); }
}

async function duyetBai(id, tt) {
  const kq = await duyetBaiAPI(id, tt);
  if (kq) { hienToast(tt==='Approved'?'Đã duyệt bài viết! ✅':'Đã ẩn bài viết.'); taiBaiChoDuyet(); taiThongKe(); }
}

async function xulyBaoCao(id) {
  const ghiChu = prompt('📝 Ghi chú xử lý:');
  const kq = await xulyBaoCaoAPI(id, 'Resolved', ghiChu||'Đã xử lý');
  if (kq) { hienToast('Đã xử lý báo cáo!'); taiBaoCaoViPham(); }
}

async function khoaTaiKhoan(id, tt) {
  const xacNhan = confirm(tt==='Locked' ? 'Xác nhận khóa tài khoản này?' : 'Xác nhận mở khóa tài khoản này?');
  if (!xacNhan) return;
  const kq = await khoaTaiKhoanAPI(id, tt);
  if (kq) { hienToast(tt==='Locked'?'Đã khóa tài khoản.':'Đã mở khóa tài khoản.'); taiNguoiDungAdmin(); }
}

// ===== TIỆN ÍCH =====
function formatThoiGian(ngay) {
  const now = new Date(), d = new Date(ngay);
  const giay = Math.floor((now-d)/1000);
  if (giay<60) return 'Vừa xong';
  if (giay<3600) return `${Math.floor(giay/60)} phút trước`;
  if (giay<86400) return `${Math.floor(giay/3600)} giờ trước`;
  if (giay<604800) return `${Math.floor(giay/86400)} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}

function dichTrangThaiUngTuyen(tt) {
  const map = { 'Submitted':'Đã nộp', 'Reviewing':'Đang xem xét', 'Accepted':'Được chấp nhận', 'Rejected':'Không phù hợp', 'Withdrawn':'Đã rút' };
  return map[tt] || tt;
}
function dichTrangThaiMentor(tt) {
  const map = { 'Pending':'Chờ phản hồi', 'Accepted':'Đã chấp nhận', 'Rejected':'Đã từ chối', 'Completed':'Hoàn thành' };
  return map[tt] || tt;
}
function dich_hanh_dong(hd) {
  const map = { 'Approved_JOB':'Duyệt tin tuyển dụng', 'Rejected_JOB':'Từ chối tin tuyển dụng', 'Approved_POST':'Duyệt bài viết', 'Hidden_POST':'Ẩn bài viết', 'LOCK_USER':'Khóa tài khoản', 'RESOLVE_REPORT':'Xử lý báo cáo', 'VERIFY_RECRUITER':'Xác thực nhà tuyển dụng' };
  return map[hd] || hd;
}

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-thongbao')) document.getElementById('hopThongBao')?.classList.add('an');
});

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
// Expose functions so they can be called from inline onclick handlers
window.dangNhap = dangNhap;
window.dangKy = dangKy;
window.dangXuat = dangXuat;
window.chuyenForm = chuyenForm;
window.hienTrang = hienTrang;
window.timKiemHero = timKiemHero;
window.batTatFormViec = batTatFormViec;
window.batTatFormBai = batTatFormBai;
window.batTatDangKyMentor = batTatDangKyMentor;
window.batTatThongBao = batTatThongBao;
window.xemChiTietViec = xemChiTietViec;
window.moFormYeuCauMentor = moFormYeuCauMentor;
window.guiYeuCauMentor = guiYeuCauMentor;
window.anFormMentor = anFormMentor;
window.taoViecLam = taoViecLam;
window.taoBaiViet = taoBaiViet;
window.thichBai = thichBai;
window.hienFormSuaHoSo = hienFormSuaHoSo;
window.anFormSuaHoSo = anFormSuaHoSo;
window.luuHoSo = luuHoSo;
window.debounceTimKiemViec = debounceTimKiemViec;
window.debounceTimKiemBai = debounceTimKiemBai;
window.debounceTimKiemMentor = debounceTimKiemMentor;
window.xoaTimKiemViec = xoaTimKiemViec;
window.xoaTimKiemBai = xoaTimKiemBai;
window.xoaTimKiemMentor = xoaTimKiemMentor;
window.chuyenTrangViec = chuyenTrangViec;
window.dongModalChiTiet = dongModalChiTiet;
window.moModalUngTuyen = moModalUngTuyen;
window.dongModalUngTuyen = dongModalUngTuyen;
window.guiHoSoUngTuyen = guiHoSoUngTuyen;
window.baoCaoNoiDung = baoCaoNoiDung;
window.batTatBinhLuan = batTatBinhLuan;
window.guiBinhLuan = guiBinhLuan;
window.phanHoiMentor = phanHoiMentor;
window.rutHoSo = rutHoSo;
window.chuyenTabAdmin = chuyenTabAdmin;
window.duyetViec = duyetViec;
window.tuChoiViec = tuChoiViec;
window.duyetBai = duyetBai;
window.xulyBaoCao = xulyBaoCao;
window.khoaTaiKhoan = khoaTaiKhoan;
