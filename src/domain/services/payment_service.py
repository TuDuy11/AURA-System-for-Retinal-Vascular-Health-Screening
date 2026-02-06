from typing import Dict, Optional
from infrastructure.repositories.payment_repository import PaymentRepository
from datetime import datetime
import random
import string

class PaymentService:
    """Service xử lý logic thanh toán"""
    
    def __init__(self, payment_repository: PaymentRepository = None):
        self.payment_repository = payment_repository or PaymentRepository()
    
    def create_payment(self, user_id: int, amount: float, currency: str = "VND",
                      method: str = "momo", provider: str = "momo") -> Dict:
        """
        Tạo thanh toán mới
        
        Args:
            user_id: ID của user
            amount: Số tiền
            currency: Loại tiền (VND, USD, ...)
            method: Phương thức thanh toán (momo, vnpay, cash)
            provider: Nhà cung cấp thanh toán
            
        Returns:
            Dict chứa thông tin thanh toán
        """
        if amount <= 0:
            raise ValueError("Số tiền phải lớn hơn 0")
        
        payment = self.payment_repository.create(
            user_id=user_id,
            amount=amount,
            currency=currency,
            method=method,
            provider=provider
        )
        return payment
    
    def process_payment(self, payment_id: int, transaction_code: str) -> Optional[Dict]:
        """
        Xử lý thanh toán (sau khi nhận xác nhận từ gateway)
        
        Args:
            payment_id: ID của thanh toán
            transaction_code: Mã giao dịch từ gateway
            
        Returns:
            Dict chứa thông tin thanh toán đã cập nhật
        """
        payment = self.payment_repository.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Không tìm thấy thanh toán với ID {payment_id}")
        
        updated_payment = self.payment_repository.update_status(
            payment_id=payment_id,
            status="completed",
            transaction_code=transaction_code
        )
        return updated_payment
    
    def cancel_payment(self, payment_id: int) -> Optional[Dict]:
        """
        Hủy thanh toán
        
        Args:
            payment_id: ID của thanh toán
            
        Returns:
            Dict chứa thông tin thanh toán đã hủy
        """
        payment = self.payment_repository.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Không tìm thấy thanh toán với ID {payment_id}")
        
        if payment["status"] != "pending":
            raise ValueError(f"Chỉ có thể hủy thanh toán ở trạng thái 'pending'")
        
        updated_payment = self.payment_repository.update_status(
            payment_id=payment_id,
            status="cancelled"
        )
        return updated_payment
    
    def refund_payment(self, payment_id: int) -> Optional[Dict]:
        """
        Hoàn tiền cho thanh toán
        
        Args:
            payment_id: ID của thanh toán
            
        Returns:
            Dict chứa thông tin thanh toán đã refund
        """
        payment = self.payment_repository.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Không tìm thấy thanh toán với ID {payment_id}")
        
        if payment["status"] != "completed":
            raise ValueError(f"Chỉ có thể hoàn tiền cho thanh toán đã hoàn tất")
        
        updated_payment = self.payment_repository.update_status(
            payment_id=payment_id,
            status="refunded"
        )
        return updated_payment
    
    def get_payment_details(self, payment_id: int) -> Optional[Dict]:
        """Lấy chi tiết thanh toán"""
        payment = self.payment_repository.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Không tìm thấy thanh toán với ID {payment_id}")
        return payment
    
    def get_user_payments(self, user_id: int, limit: int = 100, offset: int = 0) -> Dict:
        """
        Lấy danh sách thanh toán của user
        
        Args:
            user_id: ID của user
            limit: Số lượng tối đa
            offset: Vị trí bắt đầu
            
        Returns:
            Dict chứa danh sách thanh toán và thông tin tóm tắt
        """
        payments = self.payment_repository.find_by_user_id(user_id, limit, offset)
        summary = self.payment_repository.get_user_payments_summary(user_id)
        
        return {
            "payments": payments,
            "summary": summary,
            "count": len(payments)
        }
    
    def get_all_payments(self, limit: int = 100, offset: int = 0) -> Dict:
        """Lấy tất cả thanh toán (dành cho admin)"""
        payments = self.payment_repository.get_all_payments(limit, offset)
        return {
            "payments": payments,
            "count": len(payments)
        }
    
    def generate_payment_url(self, payment_id: int, method: str = "momo") -> str:
        """
        Tạo URL thanh toán cho các gateway khác nhau
        
        Args:
            payment_id: ID của thanh toán
            method: Phương thức thanh toán
            
        Returns:
            URL thanh toán
        """
        payment = self.payment_repository.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Không tìm thấy thanh toán với ID {payment_id}")
        
        if method == "momo":
            # Tạo URL Momo thanh toán
            # Trong thực tế, bạn sẽ gọi API Momo để lấy URL thực
            return f"https://pay.momo.vn/payment/{payment_id}?amount={payment['amount']}"
        
        elif method == "vnpay":
            # Tạo URL VNPay thanh toán
            return f"https://sandbox.vnpayment.vn/paymentgateway?amount={payment['amount']}&orderId={payment_id}"
        
        else:
            raise ValueError(f"Phương thức thanh toán '{method}' không được hỗ trợ")
