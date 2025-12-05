// Creates two users on first startup: an admin-scoped DB user and a normal app user.
const dbName = 'mydb';

const adminUser = { user: 'dbadmin', pwd: 'dbadminpassword', roles: [{ role: 'dbOwner', db: dbName }] };
const appUser = { user: 'appuser', pwd: 'apppassword', roles: [{ role: 'readWrite', db: dbName }] };

const db = db.getSiblingDB(dbName);

function ensureUser(u) {
  if (!db.getUser(u.user)) {
    db.createUser(u);
  }
}

ensureUser(adminUser);
ensureUser(appUser);
