import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { OrderDetails, OrderStatus } from "../types";

export const createOrderRecord = async (order: OrderDetails): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", order.orderId);
    await setDoc(orderRef, order);
  } catch (error) {
    console.error("Error saving order record to Firestore:", error);
    throw error;
  }
};

export const getOrderRecord = async (orderId: string): Promise<OrderDetails | null> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      return snap.data() as OrderDetails;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order record from Firestore:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<OrderDetails[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    const orders: OrderDetails[] = [];
    snap.forEach((d) => {
      orders.push(d.data() as OrderDetails);
    });
    // Sort descending by createdAt
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  paymentDetails?: { paymentKey?: string; paymentMethod?: string; approvedAt?: string }
): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      ...(paymentDetails || {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

// Confirm payment via server backend route /api/payments/confirm
export const confirmTossPayment = async (paymentKey: string, orderId: string, amount: number) => {
  const response = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "결제 승인 처리 중 오류가 발생했습니다.");
  }

  // Update order status in Firestore to PAID
  await updateOrderStatus(orderId, "PAID", {
    paymentKey,
    paymentMethod: data.data?.method || "토스페이먼츠",
    approvedAt: data.data?.approvedAt || new Date().toISOString(),
  });

  return data;
};

// Cancel payment via server backend route /api/payments/cancel
export const cancelTossPayment = async (orderId: string, paymentKey: string, cancelReason: string) => {
  const response = await fetch("/api/payments/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey,
      cancelReason,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "결제 취소 처리 중 오류가 발생했습니다.");
  }

  // Update order status in Firestore to CANCELLED
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
    cancelReason,
    updatedAt: new Date().toISOString(),
  });

  return data;
};
