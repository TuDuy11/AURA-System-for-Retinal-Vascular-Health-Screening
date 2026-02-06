import pytest
from datetime import datetime
from domain.services.payment_service import PaymentService
from infrastructure.repositories.payment_repository import PaymentRepository

class TestPaymentService:
    """Unit tests cho PaymentService"""
    
    @pytest.fixture
    def payment_service(self):
        """Setup payment service"""
        return PaymentService()
    
    def test_create_payment_success(self, payment_service):
        """Test tạo thanh toán thành công"""
        payment = payment_service.create_payment(
            user_id=1,
            amount=100000,
            method="momo"
        )
        
        assert payment is not None
        assert payment["amount"] == 100000
        assert payment["status"] == "pending"
        assert payment["user_id"] == 1
    
    def test_create_payment_invalid_amount(self, payment_service):
        """Test tạo thanh toán với số tiền không hợp lệ"""
        with pytest.raises(ValueError):
            payment_service.create_payment(
                user_id=1,
                amount=-100
            )
    
    def test_create_payment_zero_amount(self, payment_service):
        """Test tạo thanh toán với số tiền bằng 0"""
        with pytest.raises(ValueError):
            payment_service.create_payment(
                user_id=1,
                amount=0
            )
    
    def test_get_payment_details(self, payment_service):
        """Test lấy chi tiết thanh toán"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=50000
        )
        
        # Lấy chi tiết
        payment = payment_service.get_payment_details(created["id"])
        
        assert payment is not None
        assert payment["id"] == created["id"]
        assert payment["amount"] == 50000
    
    def test_get_payment_not_found(self, payment_service):
        """Test lấy thanh toán không tồn tại"""
        with pytest.raises(ValueError):
            payment_service.get_payment_details(99999)
    
    def test_cancel_payment_success(self, payment_service):
        """Test hủy thanh toán thành công"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Hủy thanh toán
        cancelled = payment_service.cancel_payment(created["id"])
        
        assert cancelled is not None
        assert cancelled["status"] == "cancelled"
    
    def test_cancel_completed_payment(self, payment_service):
        """Test hủy thanh toán đã hoàn tất (không được phép)"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Xử lý thanh toán
        payment_service.process_payment(
            created["id"],
            transaction_code="TEST123"
        )
        
        # Cố gắng hủy (sẽ fail)
        with pytest.raises(ValueError):
            payment_service.cancel_payment(created["id"])
    
    def test_process_payment_success(self, payment_service):
        """Test xử lý thanh toán thành công"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Xử lý thanh toán
        processed = payment_service.process_payment(
            created["id"],
            transaction_code="MOMO20240206"
        )
        
        assert processed is not None
        assert processed["status"] == "completed"
        assert processed["transaction_code"] == "MOMO20240206"
        assert processed["paid_at"] is not None
    
    def test_refund_payment_success(self, payment_service):
        """Test hoàn tiền thanh toán"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Xử lý thanh toán
        payment_service.process_payment(
            created["id"],
            transaction_code="TEST123"
        )
        
        # Hoàn tiền
        refunded = payment_service.refund_payment(created["id"])
        
        assert refunded is not None
        assert refunded["status"] == "refunded"
    
    def test_refund_pending_payment(self, payment_service):
        """Test hoàn tiền cho thanh toán chưa hoàn tất (không được phép)"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Cố gắng hoàn tiền (sẽ fail)
        with pytest.raises(ValueError):
            payment_service.refund_payment(created["id"])
    
    def test_get_user_payments(self, payment_service):
        """Test lấy danh sách thanh toán của user"""
        # Tạo multiple payments
        payment_service.create_payment(user_id=1, amount=100000)
        payment_service.create_payment(user_id=1, amount=50000)
        payment_service.create_payment(user_id=2, amount=75000)
        
        # Lấy thanh toán của user 1
        result = payment_service.get_user_payments(user_id=1)
        
        assert len(result["payments"]) >= 2
        assert result["summary"]["total_payments"] >= 2
    
    def test_get_all_payments(self, payment_service):
        """Test lấy tất cả thanh toán"""
        # Tạo thanh toán
        payment_service.create_payment(user_id=1, amount=100000)
        payment_service.create_payment(user_id=2, amount=50000)
        
        # Lấy tất cả
        result = payment_service.get_all_payments()
        
        assert result is not None
        assert "payments" in result
        assert "count" in result
    
    def test_generate_payment_url_momo(self, payment_service):
        """Test tạo URL thanh toán Momo"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Tạo URL
        url = payment_service.generate_payment_url(created["id"], "momo")
        
        assert url is not None
        assert "pay.momo.vn" in url
        assert str(created["id"]) in url
    
    def test_generate_payment_url_vnpay(self, payment_service):
        """Test tạo URL thanh toán VNPay"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Tạo URL
        url = payment_service.generate_payment_url(created["id"], "vnpay")
        
        assert url is not None
        assert "vnpayment.vn" in url
    
    def test_generate_invalid_payment_url(self, payment_service):
        """Test tạo URL với phương thức không hỗ trợ"""
        # Tạo thanh toán
        created = payment_service.create_payment(
            user_id=1,
            amount=100000
        )
        
        # Cố gắng tạo URL không hợp lệ
        with pytest.raises(ValueError):
            payment_service.generate_payment_url(created["id"], "invalid_method")


# Run tests: pytest src/tests/test_payment_service.py
