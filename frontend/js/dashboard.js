/* ========= LOAD DASHBOARD ========= */

async function loadDashboard() {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const { response, data } = await apiRequest("/api/users/me");

  if (!response.ok) {
    clearToken();
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-role").innerText =
    `Role: ${data.role.name}`;

  renderPermissions(data.role.permissions);
  renderActions(data.role.permissions);
}

/* ========= RENDER PERMISSIONS ========= */

function renderPermissions(perms) {
  const container = document.getElementById("permissions");
  container.innerHTML = "";

  perms.forEach(p => {
    const el = document.createElement("p");
    el.textContent = p.name;
    container.appendChild(el);
  });
}

/* ========= RENDER ACTION BUTTONS ========= */

function renderActions(perms) {
  const names = perms.map(p => p.name);
  const actions = document.getElementById("actions");
  actions.innerHTML = "";

  if (names.includes("DELETE_USER")) {
    const btn = document.createElement("button");
    btn.textContent = "View Users";
    btn.className = "primary-btn";
    btn.onclick = loadUsers;
    actions.appendChild(btn);
  }

  if (names.includes("CREATE_PERMISSION")) {
    const btn = document.createElement("button");
    btn.textContent = "Create Permission";
    btn.className = "primary-btn";
    btn.onclick = showCreatePermissionForm;
    actions.appendChild(btn);
  }

  if (names.includes("CREATE_ROLE")) {
    const btn = document.createElement("button");
    btn.textContent = "Create Role";
    btn.className = "primary-btn";
    btn.onclick = showCreateRoleForm;
    actions.appendChild(btn);
  }

  if (names.includes("ASSIGN_ROLE")) {
    const btn = document.createElement("button");
    btn.textContent = "Assign Role";
    btn.className = "primary-btn";
    btn.onclick = showAssignRoleForm;
    actions.appendChild(btn);
  }
}

/* ========= USERS ========= */

async function loadUsers() {
  const { response, data } = await apiRequest("/api/users");

  if (!response.ok) {
    alert(data.message);
    return;
  }

  const container = document.getElementById("users-container");
  container.innerHTML = "<h3>All Users</h3>";

  data.users.forEach(user => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${user.email} - ${user.role?.name || "N/A"}
      <button onclick="deleteUser('${user._id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function deleteUser(id) {
  if (!confirm("Delete user?")) return;

  const { response, data } = await apiRequest(`/api/users/${id}`, "DELETE");

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert("User deleted");
  loadUsers();
}

/* ========= CREATE PERMISSION ========= */

function showCreatePermissionForm() {
  const container = document.getElementById("users-container");

  container.innerHTML = `
    <h3>Create Permission</h3>
    <input type="text" id="perm-name" placeholder="Permission name"><br><br>
    <button onclick="createPermission()" class="primary-btn">Create</button>
  `;
}

async function createPermission() {
  const name = document.getElementById("perm-name").value;

  const { response, data } = await apiRequest(
    "/api/permissions",
    "POST",
    { name }
  );

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert("Permission created");
  loadDashboard();
}

/* ========= CREATE ROLE ========= */

async function showCreateRoleForm() {
  const { response, data } = await apiRequest("/api/permissions");

  if (!response.ok) {
    alert("Cannot load permissions");
    return;
  }

  const container = document.getElementById("users-container");

  let checkboxes = "";

  data.permissions.forEach(p => {
    checkboxes += `
      <div>
        <input type="checkbox" value="${p._id}">
        ${p.name}
      </div>
    `;
  });

  container.innerHTML = `
    <h3>Create Role</h3>
    <input type="text" id="role-name" placeholder="Role name"><br><br>
    ${checkboxes}
    <br>
    <button onclick="createRole()" class="primary-btn">Create Role</button>
  `;
}

async function createRole() {
  const name = document.getElementById("role-name").value;

  const checked = document.querySelectorAll(
    "#users-container input[type='checkbox']:checked"
  );

  const permissionIds = Array.from(checked).map(cb => cb.value);

  const { response, data } = await apiRequest(
    "/api/roles",
    "POST",
    { name, permissions: permissionIds }
  );

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert("Role created");
  loadDashboard();
}

/* ========= ASSIGN ROLE ========= */

async function showAssignRoleForm() {
  const usersRes = await apiRequest("/api/users");
  const rolesRes = await apiRequest("/api/roles");

  if (!usersRes.response.ok || !rolesRes.response.ok) {
    alert("Failed to load users or roles");
    return;
  }

  const users = usersRes.data.users;
  const roles = rolesRes.data.roles;

  const container = document.getElementById("users-container");

  const userOptions = users
    .map(u => `<option value="${u._id}">${u.email}</option>`)
    .join("");

  const roleOptions = roles
    .map(r => `<option value="${r.name}">${r.name}</option>`)
    .join("");

  container.innerHTML = `
    <h3>Assign Role</h3>
    <select id="assign-user">${userOptions}</select>
    <select id="assign-role">${roleOptions}</select>
    <button onclick="assignRole()" class="primary-btn">Assign</button>
  `;
}

async function assignRole() {
  const userId = document.getElementById("assign-user").value;
  const roleName = document.getElementById("assign-role").value;

  const { response, data } = await apiRequest(
    "/api/users/assign-role",
    "PATCH",
    { userId, roleName }
  );

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert("Role assigned");
  loadDashboard();
}

/* ========= LOGOUT ========= */

document.getElementById("logout-btn").onclick = () => {
  clearToken();
  window.location.href = "login.html";
};

/* ========= INIT ========= */

loadDashboard();