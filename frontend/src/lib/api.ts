const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper function to handle API responses
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'API Error');
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
}

/**
 * Generic GET request
 */
export async function apiGet<T>(endpoint: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

/**
 * Generic POST request
 */
export async function apiPost<T>(endpoint: string, body: any, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

/**
 * Generic PATCH request
 */
export async function apiPatch<T>(endpoint: string, body: any, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(endpoint: string, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'DELETE',
    headers,
  });
  return handleResponse(response);
}
