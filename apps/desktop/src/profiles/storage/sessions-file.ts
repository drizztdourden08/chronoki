/* @layer shared-storage @kind logic */
const sessionsFile = (id: string): string => `profiles/${id}/sessions.json`;

export { sessionsFile };
