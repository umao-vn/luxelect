import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { confirmTossPayment, getOrderRecord, cancelTossPayment } from "../services/orderService";
import { OrderDetails } from "../types";

interface PaymentResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: "ko" | "vi";
  paymentStatus: "success" | "fail" | null;
  queryParams: {
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    code?: string;
    message?: string;
  };
  onOrderCompleted?: () => void;
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  paymentStatus,
  queryParams,
  onOrderCompleted,
}) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);

  useEffect(() => {
    if (!isOpen || !paymentStatus) return;

    const processPayment = async () => {
      setLoading(true);
      setErrorMessage(null);

      if (paymentStatus === "fail") {
        setSuccess(false);
        setErrorMessage(
          queryParams.message ||
            (currentLang === "ko"
              ? "결제 중 오류가 발생하거나 결제가 취소되었습니다."
              : "Payment failed or was cancelled by user.")
        );
        setLoading(false);
        return;
      }

      // Success branch
      const paymentKey = queryParams.paymentKey;
      const orderId = queryParams.orderId || sessionStorage.getItem("pending_order_id");
      const amountStr = queryParams.amount || sessionStorage.getItem("pending_order_amount");
      const amount = amountStr ? Number(amountStr) : 0;

      if (!paymentKey || !orderId) {
        setSuccess(false);
        setErrorMessage(
          currentLang === "ko"
            ? "결제 승인 정보가 유효하지 않습니다."
            : "Invalid payment approval parameters."
        );
        setLoading(false);
        return;
      }

      try {
        // 1. Call backend server API to confirm Toss payment
        await confirmTossPayment(paymentKey, orderId, amount);

        // 2. Fetch updated Firestore order details
        const order = await getOrderRecord(orderId);
        setOrderDetails(order);

        setSuccess(true);
        if (onOrderCompleted) onOrderCompleted();
      } catch (err: any) {
        console.error("Payment Confirmation Error:", err);
        setSuccess(false);
        setErrorMessage(err?.message || "결제 승인 처리 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [isOpen, paymentStatus, queryParams]);

  if (!isOpen) return null;

  const handleCancelOrder = async () => {
    if (!orderDetails || !orderDetails.paymentKey) return;
    if (!cancelReason.trim()) {
      alert(currentLang === "ko" ? "취소 사유를 입력해 주세요." : "Please enter a cancel reason.");
      return;
    }

    setCancelling(true);
    try {
      await cancelTossPayment(orderDetails.orderId, orderDetails.paymentKey, cancelReason);
      alert(currentLang === "ko" ? "주문 및 결제가 성공적으로 취소되었습니다." : "Payment cancelled successfully.");
      const updated = await getOrderRecord(orderDetails.orderId);
      setOrderDetails(updated);
      setShowCancelInput(false);
    } catch (err: any) {
      alert(err?.message || "결제 취소 처리 중 오류가 발생했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 my-8">
        {loading ? (
          <div className="p-10 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <p className="text-gray-800 font-bold text-lg">
              {currentLang === "ko" ? "결제 승인을 처리하고 있습니다..." : "Confirming Payment Authorization..."}
            </p>
            <p className="text-gray-500 text-xs">
              {currentLang === "ko"
                ? "토스페이먼츠 보안 서버와 통신 중입니다. 잠시만 기다려 주세요."
                : "Communicating with Toss Payments secure server. Please wait."}
            </p>
          </div>
        ) : success ? (
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {currentLang === "ko" ? "결제가 성공적으로 완료되었습니다!" : "Payment Completed Successfully!"}
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                {currentLang === "ko" ? "주문 내역이 Firestore에 안전하게 저장되었습니다." : "Order details recorded in Firestore."}
              </p>
            </div>

            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-xl text-left text-xs space-y-2 border border-gray-100">
                <div className="flex justify-between border-b pb-2 font-medium">
                  <span className="text-gray-500">{currentLang === "ko" ? "주문 번호" : "Order ID"}</span>
                  <span className="font-bold text-gray-900">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{currentLang === "ko" ? "주문명" : "Order Name"}</span>
                  <span className="font-medium text-gray-900">{orderDetails.orderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{currentLang === "ko" ? "수령인" : "Recipient"}</span>
                  <span className="font-medium text-gray-900">{orderDetails.userName} ({orderDetails.userPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{currentLang === "ko" ? "배송지" : "Address"}</span>
                  <span className="font-medium text-gray-900">{orderDetails.userAddress}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t text-sm">
                  <span className="font-bold text-gray-900">{currentLang === "ko" ? "결제 금액" : "Paid Amount"}</span>
                  <span className="font-extrabold text-blue-600">₩{orderDetails.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>{currentLang === "ko" ? "상태" : "Status"}</span>
                  <span className="font-bold text-emerald-600">{orderDetails.status}</span>
                </div>
              </div>
            )}

            {/* Cancel Payment API Trigger Option */}
            {orderDetails && orderDetails.status === "PAID" && (
              <div className="pt-2 border-t">
                {!showCancelInput ? (
                  <button
                    onClick={() => setShowCancelInput(true)}
                    className="text-xs text-red-500 hover:text-red-700 underline font-medium"
                  >
                    {currentLang === "ko" ? "결제 취소 요청하기" : "Cancel Payment"}
                  </button>
                ) : (
                  <div className="space-y-2 text-left bg-red-50 p-3 rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-red-700">
                      {currentLang === "ko" ? "결제 취소 (서버 API 연동)" : "Cancel Payment (Server API)"}
                    </p>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder={currentLang === "ko" ? "취소 사유 입력 (예: 변심)" : "Reason for cancellation"}
                      className="w-full text-xs p-2 rounded-lg border border-red-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        {cancelling && <RefreshCw className="w-3 h-3 animate-spin" />}
                        {currentLang === "ko" ? "확인 및 취소" : "Confirm Cancel"}
                      </button>
                      <button
                        onClick={() => setShowCancelInput(false)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                      >
                        {currentLang === "ko" ? "닫기" : "Close"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <span>{currentLang === "ko" ? "쇼핑 계속하기" : "Continue Shopping"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {currentLang === "ko" ? "결제에 실패하였습니다." : "Payment Failed"}
              </h3>
              <p className="text-red-600 text-xs font-medium mt-2 bg-red-50 p-3 rounded-xl border border-red-100">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-sm transition"
            >
              {currentLang === "ko" ? "확인 및 다시 시도" : "Close & Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
