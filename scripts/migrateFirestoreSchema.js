/**
 * Firestore Schema Migration Script
 * Moves typing status from rooms/<roomId>/typing/<userId> to rooms/<roomId>/users/<userId>/isTyping
 * Run this script once to migrate all rooms.
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import firebaseConfig from "../src/firebase/config";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function migrateRooms() {
  const roomsRef = ref(db, "rooms");
  const roomsSnap = await get(roomsRef);
  if (!roomsSnap.exists()) {
    console.log("No rooms found.");
    return;
  }
  const rooms = roomsSnap.val();
  for (const roomId of Object.keys(rooms)) {
    const typingRef = ref(db, `rooms/${roomId}/typing`);
    const typingSnap = await get(typingRef);
    if (!typingSnap.exists()) continue;
    const typingData = typingSnap.val();
    for (const userId of Object.keys(typingData)) {
      const isTyping = typingData[userId];
      const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
      await update(userRef, { isTyping });
    }
    // Optionally: remove old typing node
    // await remove(typingRef);
    console.log(`Migrated typing for room ${roomId}`);
  }
  console.log("Migration complete.");
}

migrateRooms().catch(console.error);
