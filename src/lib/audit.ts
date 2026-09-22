import { AuditLog, UserProfile } from '../types';
import { db, collection, doc, setDoc } from './firebase';

const LOCAL_AUDIT_KEY = 'qhs_sbm_audit_logs_v1';

export async function recordAuditEvent(
  actor: UserProfile | null,
  action: string,
  affectedRecordType: string,
  affectedRecordId: string,
  details?: {
    previousValue?: string;
    newValue?: string;
    reason?: string;
  }
): Promise<AuditLog> {
  const newLog: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    actorId: actor?.id || 'anonymous-or-system',
    actorName: actor?.displayName || 'System / Public Guest',
    actorEmail: actor?.email || 'unauthenticated',
    actorRole: actor?.role || 'public_visitor',
    action,
    affectedRecordType,
    affectedRecordId,
    previousValue: details?.previousValue,
    newValue: details?.newValue,
    reason: details?.reason
  };

  // Save to Local Cache
  try {
    const existingStr = localStorage.getItem(LOCAL_AUDIT_KEY);
    const logs: AuditLog[] = existingStr ? JSON.parse(existingStr) : [];
    logs.unshift(newLog);
    // Keep last 1000 logs in local storage
    localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(logs.slice(0, 1000)));
  } catch (err) {
    console.warn('Local audit storage warning:', err);
  }

  // Persist to Cloud Firestore
  try {
    const logRef = doc(collection(db, 'auditLogs'), newLog.id);
    await setDoc(logRef, newLog);
  } catch (err) {
    console.info('Audit log saved locally (Firestore write handled):', err);
  }

  return newLog;
}

export function getLocalAuditLogs(): AuditLog[] {
  try {
    const existingStr = localStorage.getItem(LOCAL_AUDIT_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}
