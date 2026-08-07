import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile } from "../types";

export const saveUserProfile = async (userProfile: Partial<UserProfile> & { uid: string }) => {
  if (!userProfile.uid) return;
  try {
    const userRef = doc(db, "users", userProfile.uid);
    const snap = await getDoc(userRef);

    const now = new Date().toISOString();
    if (snap.exists()) {
      await updateDoc(userRef, {
        ...userProfile,
        updatedAt: now,
      });
    } else {
      const newProfile: UserProfile = {
        uid: userProfile.uid,
        email: userProfile.email || "",
        displayName: userProfile.displayName || "회원",
        photoURL: userProfile.photoURL || "",
        provider: (userProfile.provider as any) || "email",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userRef, newProfile);
    }
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile from Firestore:", error);
    return null;
  }
};
