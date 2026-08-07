import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CartItem } from "../types";

export const saveUserCart = async (userId: string, items: CartItem[]) => {
  if (!userId) return;
  try {
    const cartRef = doc(db, "carts", userId);
    await setDoc(
      cartRef,
      {
        userId,
        items,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving user cart to Firestore:", error);
  }
};

export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  if (!userId) return [];
  try {
    const cartRef = doc(db, "carts", userId);
    const snap = await getDoc(cartRef);
    if (snap.exists() && snap.data().items) {
      return snap.data().items as CartItem[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching user cart from Firestore:", error);
    return [];
  }
};
