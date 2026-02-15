const BASE_URL = 'http://localhost:3002'; // User Service Port
const EMAIL = `test-${Date.now()}@example.com`;
const PASSWORD = 'password123';

const fs = require('fs');

async function request(method, path, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = {
        method,
        headers,
    };

    if (body) options.body = JSON.stringify(body);

    console.log(`\n[${method}] ${path}`);
    try {
        const res = await fetch(`${BASE_URL}${path}`, options);
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        if (!res.ok) {
            console.error('Error:', JSON.stringify(data, null, 2));
            fs.writeFileSync('scripts/rbac-error.log', JSON.stringify(data, null, 2));
        } else {
            console.log('Success:', JSON.stringify(data, null, 2));
        }
        return { status: res.status, data };
    } catch (error) {
        console.error('Fetch error:', error.message);
        return { status: 500, error: error.message };
    }
}

async function run() {
    console.log('--- Starting RBAC Test (User Service Direct) ---');
    console.log('Target: ' + BASE_URL);

    const token = null; // No auth required for internal testing right now
    console.log('Skipping Auth & Gateway - Testing User Module directly');

    // --- Roles ---

    // 3. Create Role
    const roleRes = await request('POST', '/roles', {
        name: `Admin-${Date.now()}`,
        description: 'Admin Role'
    }, token);
    const roleId = roleRes.data?.data?.id;

    // 4. List Roles
    await request('GET', '/roles?page=1&limit=10', null, token);

    if (roleId) {
        // 5. Get Role
        await request('GET', `/roles/${roleId}`, null, token);

        // 6. Update Role
        await request('PUT', `/roles/${roleId}`, { description: 'Updated Admin Role' }, token);
    }

    // --- Permissions ---

    // 7. Create Permission
    const permRes = await request('POST', '/permissions', {
        key: `create_user_${Date.now()}`,
        description: 'Permission to create user'
    }, token);
    const permId = permRes.data?.data?.id;

    // 8. List Permissions
    await request('GET', '/permissions?page=1&limit=10', null, token);

    if (permId) {
        // 9. Get Permission
        await request('GET', `/permissions/${permId}`, null, token);

        // 10. Update Permission
        await request('PUT', `/permissions/${permId}`, { description: 'Updated Description' }, token);
    }

    // --- Role Permissions ---

    if (roleId && permId) {
        // 11. Assign Permission to Role
        await request('POST', '/role-permissions/assign', {
            role_id: roleId,
            permission_ids: [permId]
        }, token);

        // 12. List Role Permissions
        await request('GET', `/role-permissions?page=1&limit=10`, null, token);
    }

    // Cleanup (Delete)
    if (roleId) {
        await request('DELETE', `/roles/${roleId}`, null, token);
    }
    if (permId) {
        await request('DELETE', `/permissions/${permId}`, null, token);
    }

    console.log('--- Test Completed ---');
}

run();
