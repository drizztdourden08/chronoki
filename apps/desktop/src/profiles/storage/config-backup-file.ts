/* @layer shared-storage @kind logic */
const configBackupFile = (id: string): string => `profiles/${id}/config.json.bak`;

export { configBackupFile };
