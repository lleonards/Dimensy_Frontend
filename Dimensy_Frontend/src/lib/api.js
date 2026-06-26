import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('A variável VITE_API_URL é obrigatória.');
}

export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;
  const finalHeaders = { ...headers };

  if (!(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = payload?.message || 'Não foi possível concluir a requisição.';
    throw new Error(message);
  }

  return payload;
}
