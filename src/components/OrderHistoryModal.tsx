import React, { useEffect, useState } from "react";
import { X, Package, Calendar, RefreshCw, ShoppingBag, ShieldCheck, LogOut } from "lucide-react";
import { getUserOrders, cancelTossPayment } from "../services/orderService";
import { OrderDetails, UserSession } from "../types";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  currentLang: "ko" | "vi";
  onLogout: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  userSession,
  currentLang,
  onLogout,
}) => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userSession.uid) return;

    const fetchOrders = async () => {
      setLoading(true);
      const data = await getUserOrders(userSession.uid!);
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [isOpen, userSession.uid]);

  if (!isOpen) return null;

  const handleCancel = async (order: OrderDetails) => {
    if (!order.paymentKey) {
      alert(currentLang === "ko" ? "결제 키 정보가 존재하지 않습니다." : "No payment key available.");
      return;
    }

    const reason = prompt(
      currentLang === "ko" ? "취소 사유를 입력하세요:" : "Enter cancellation reason:",
      "고객 요청 취소"
    );
    if (!reason) return;

    setCancellingOrderId(order.orderId);
    try {
      await cancelTossPayment(order.orderId, order.paymentKey, reason);
      alert(currentLang === "ko" ? "결제가 취소되었습니다." : "Payment cancelled successfully.");
      
      // Refresh order list
      if (userSession.uid) {
        const data = await getUserOrders(userSession.uid);
        setOrders(data);
      }
    } catch (err: any) {
      alert(err?.message || "취소 요청 실패");
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">
              {currentLang === "ko" ? "마이페이지 & 주문/결제 내역" : "My Account & Order History"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User Info Profile Box */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{userSession.name || "회원"}</p>
              <p className="text-xs text-gray-600">{userSession.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 uppercase">
                {userSession.provider || "email"}
              </span>
            </div>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              {currentLang === "ko" ? "로그아웃" : "Logout"}
            </button>
          </div>

          {/* Orders Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              {currentLang === "ko" ? "최근 주문 내역 (Firestore)" : "Recent Orders"}
            </h4>

            {loading ? (
              <div className="py-10 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs text-gray-500">
                  {currentLang === "ko" ? "주문 내역을 불러오는 중..." : "Loading orders..."}
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500 font-medium">
                  {currentLang === "ko" ? "주문 내역이 없습니다." : "No orders found."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                      <div>
                        <span className="text-xs font-bold text-gray-900">
                          {order.orderName}
                        </span>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          ID: {order.orderId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            order.status === "PAID"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status === "PAID"
                            ? currentLang === "ko"
                              ? "결제 완료"
                              : "PAID"
                            : order.status === "CANCELLED"
                            ? currentLang === "ko"
                              ? "결제 취소됨"
                              : "CANCELLED"
                            : order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.nameKO}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {currentLang === "ko" ? item.product.nameKO : item.product.nameVI}
                            </p>
                            <p className="text-gray-400 text-[11px]">
                              수량: {item.quantity} | ₩{(item.product.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-blue-600">
                          ₩{order.totalAmount.toLocaleString()}
                        </span>

                        {order.status === "PAID" && (
                          <button
                            onClick={() => handleCancel(order)}
                            disabled={cancellingOrderId === order.orderId}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition border border-red-200 disabled:opacity-50"
                          >
                            {cancellingOrderId === order.orderId
                              ? "취소 처리 중..."
                              : currentLang === "ko"
                              ? "결제 취소 API"
                              : "Cancel Payment"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
