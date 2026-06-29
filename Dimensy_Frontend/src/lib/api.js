const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro inesperado.');
  return data;
}

async function uploadImage(type, file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/upload/${type}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao fazer upload.');
  return data.url;
}

export const api = {
  // Auth
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: (token) => request('/api/auth/me', {}, token),

  // Companies
  getMyCompany: (token) => request('/api/companies/me', {}, token),
  createCompany: (body, token) => request('/api/companies', { method: 'POST', body: JSON.stringify(body) }, token),
  updateCompany: (id, body, token) => request(`/api/companies/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token),
  getPublicCompany: (slug) => request(`/api/companies/slug/${slug}`),

  // Upload
  uploadImage: (type, file, token) => uploadImage(type, file, token),

  // Branches
  getAllBranches: () => request('/api/branches'),
  getCompanyBranches: (companyId, token) => request(`/api/branches/company/${companyId}`, {}, token),
  addCompanyBranch: (companyId, body, token) => request(`/api/branches/company/${companyId}`, { method: 'POST', body: JSON.stringify(body) }, token),
  removeCompanyBranch: (companyId, branchId, token) => request(`/api/branches/company/${companyId}/${branchId}`, { method: 'DELETE' }, token),

  // Services
  getCompanyServices: (companyId, token) => request(`/api/services/company/${companyId}`, {}, token),
  addCompanyService: (companyId, body, token) => request(`/api/services/company/${companyId}`, { method: 'POST', body: JSON.stringify(body) }, token),
  toggleService: (companyId, serviceId, is_active, token) => request(`/api/services/company/${companyId}/${serviceId}`, { method: 'PATCH', body: JSON.stringify({ is_active }) }, token),
  removeService: (companyId, serviceId, token) => request(`/api/services/company/${companyId}/${serviceId}`, { method: 'DELETE' }, token),

  // Leads
  submitLead: (body) => request('/api/leads', { method: 'POST', body: JSON.stringify(body) }),
  getLeads: (companyId, token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/leads/company/${companyId}${qs ? '?' + qs : ''}`, {}, token);
  },
  getLead: (id, token) => request(`/api/leads/${id}`, {}, token),
  updateLeadStatus: (id, status, token) => request(`/api/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token),

  // Notifications
  getNotifications: (companyId, token) => request(`/api/notifications/company/${companyId}`, {}, token),
  markRead: (id, token) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }, token),
  markAllRead: (companyId, token) => request(`/api/notifications/company/${companyId}/read-all`, { method: 'PATCH' }, token),
  subscribePush: (body, token) => request('/api/notifications/subscribe', { method: 'POST', body: JSON.stringify(body) }, token),
};
