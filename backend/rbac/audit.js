// Audit Logging for Permission Changes and Access Attempts
// ...existing code...

const fs = require('fs');
const path = require('path');
const auditLogPath = path.join(__dirname, 'audit.log');

function logAudit(userId, action, target, route) {
  const entry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    target,
    route
  };
  fs.appendFileSync(auditLogPath, JSON.stringify(entry) + '\n');
}

function getAuditLogs() {
  if (!fs.existsSync(auditLogPath)) return [];
  return fs.readFileSync(auditLogPath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

module.exports = { logAudit, getAuditLogs };
