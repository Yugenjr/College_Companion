# Firestore Schema Migration Guide

## Overview
This guide describes the migration from the old Firestore schema (with separate `typing` node) to the new schema (with `isTyping` in each user document).

## Old Schema
```
rooms/<roomId>/meta
rooms/<roomId>/users/<userId>
rooms/<roomId>/typing/<userId>: boolean
```

## New Schema
```
rooms/<roomId>/meta
rooms/<roomId>/users/<userId>
  - username
  - joinedAt
  - lastSeen
  - isTyping: boolean
```

## Migration Steps
1. Run `scripts/migrateFirestoreSchema.js` to move typing status into user documents.
2. Refactor backend CRUD operations to use `isTyping` in user documents.
3. Ensure backward compatibility by supporting both schemas during transition.

## Rollback
If needed, restore the old typing node from user documents.

## Testing
- Verify typing indicators and user presence work for all rooms.
- Check for errors in logs and fix any migration issues.

---
For details, see `src/services/firebaseStudyArena.js` and the migration script.