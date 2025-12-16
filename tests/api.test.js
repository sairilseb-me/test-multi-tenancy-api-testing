import { test, expect } from '@playwright/test';

async function loginAndGetToken(request, baseURL) {
  const response = await request.post(`${baseURL}/api/v1/login`, {
    // TODO: adjust this body to match your AuthController@login
    data: {
      email: 'admin@example.com',
      password: 'password'
    }
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  // TODO: adjust based on login response structure
  // e.g. body.token, body.data.token, etc.
  const token = body.token;
  expect(token).toBeTruthy();

  return token;
}

test.describe('Public API endpoints', () => {
  test('GET /api/test', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/api/test`);
    await expect(response.ok()).toBeTruthy();
    await expect(response.status()).toBe(200);

    const text = await response.text();
    await expect(text).toBe('API Test route is working fine.');
  });
});

test.describe('Authenticated API endpoints', () => {
  test('GET /api/user', async ({ request, baseURL }) => {
    const token = await loginAndGetToken(request, baseURL);
    const response = await request.get(`${baseURL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await expect(response.ok()).toBeTruthy();
    await expect(response.status()).toBe(200);

    const user = await response.json();
    expect(user).toBeTruthy();
  });

  test('GET /api/v1/tenants', async ({ request, baseURL }) => {
    const token = await loginAndGetToken(request, baseURL);
    const response = await request.get(`${baseURL}/api/v1/tenants`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('POST /api/v1/tenants', async ({ request, baseURL }) => {
    const token = await loginAndGetToken(request, baseURL);
    const response = await request.post(`${baseURL}/api/v1/tenants`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        // TODO: adjust fields to match your Tenant model + validation
        name: 'Test Tenant',
        domain: 'test-tenant.local'
      }
    });

    await expect(response.ok()).toBeTruthy();
    const tenant = await response.json();
    expect(tenant.id).toBeTruthy();
  });

  test('GET /api/v1/employees', async ({ request, baseURL }) => {
    const token = await loginAndGetToken(request, baseURL);
    const response = await request.get(`${baseURL}/api/v1/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/v1/users', async ({ request, baseURL }) => {
    const token = await loginAndGetToken(request, baseURL);
    const response = await request.get(`${baseURL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  // Example of full CRUD for tenants (adjust IDs & payloads as needed)
  test('CRUD /api/v1/tenants', async ({ request, baseURL }) => {
    const token = await loginAndGetToken(request, baseURL);
    const authHeaders = { Authorization: `Bearer ${token}` };

    // CREATE
    const createRes = await request.post(`${baseURL}/api/v1/tenants`, {
      headers: authHeaders,
      data: {
        name: 'CRUD Tenant',
        domain: 'crud-tenant.local'
      }
    });
    await expect(createRes.ok()).toBeTruthy();
    const created = await createRes.json();
    const tenantId = created.id;
    expect(tenantId).toBeTruthy();

    // READ (show)
    const showRes = await request.get(`${baseURL}/api/v1/tenants/${tenantId}`, {
      headers: authHeaders
    });
    await expect(showRes.ok()).toBeTruthy();

    // UPDATE
    const updateRes = await request.put(`${baseURL}/api/v1/tenants/${tenantId}`, {
      headers: authHeaders,
      data: {
        name: 'CRUD Tenant Updated'
      }
    });
    await expect(updateRes.ok()).toBeTruthy();

    // DELETE
    const deleteRes = await request.delete(`${baseURL}/api/v1/tenants/${tenantId}`, {
      headers: authHeaders
    });
    await expect(deleteRes.ok()).toBeTruthy();
  });
});

test.describe('Auth endpoint', () => {
  test('POST /api/v1/login', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/api/v1/login`, {
      data: {
        // TODO: use a real user
        email: 'admin@example.com',
        password: 'password'
      }
    });

    await expect(response.ok()).toBeTruthy();
    const body = await response.json();

    // Adjust assertion based on response structure
    expect(body).toBeTruthy();
  });
});