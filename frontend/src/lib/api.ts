const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper function to handle API responses
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'API Error';
    try {
      const errorData = await response.json();
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      
      // Handle validation errors
      if (response.status === 422 && errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          // Format validation errors
          errorMessage = errorData.detail.map((err: any) => 
            `${err.loc[err.loc.length - 1]}: ${err.msg}`
          ).join(', ');
        } else {
          errorMessage = errorData.detail;
        }
      } else {
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
      }
    } catch (e) {
      console.error('API Error (no JSON):', {
        status: response.status,
        statusText: response.statusText
      });
    }
    const error = new Error(errorMessage);
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

  // If token is provided, use Bearer authentication
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('Making API request:', {
    url: `${apiUrl}${endpoint}`,
    method: 'GET',
    headers: { ...headers, Authorization: token ? 'Bearer [REDACTED]' : undefined }
  });

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'GET',
    headers,
    // Only include credentials if no token is provided
    credentials: token ? 'omit' : 'include'
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

  console.log('Making POST request:', {
    url: `${apiUrl}${endpoint}`,
    method: 'POST',
    headers: { ...headers, Authorization: token ? 'Bearer [REDACTED]' : undefined },
    body: body
  });

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include'
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
    credentials: 'include'
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
    credentials: 'include'
  });
  return handleResponse(response);
}
