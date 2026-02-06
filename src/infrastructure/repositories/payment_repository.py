from typing import Optional, List, Dict
from datetime import datetime
from infrastructure.models.payment_model import PaymentModel
from infrastructure.databases.mssql import SessionLocal

class PaymentRepository:
    """Repository để quản lý Payment trong database"""
    
    def __init__(self, session=None):
        self.session = session or SessionLocal()
    
    def create(self, user_id: int, amount: float, currency: str = "VND", 
               method: str = None, provider: str = None) -> Dict:
        """Tạo thanh toán mới"""
        payment = PaymentModel(
            user_id=user_id,
            amount=amount,
            currency=currency,
            method=method,
            provider=provider,
            status="pending",
            owner_type="user"
        )
        self.session.add(payment)
        self.session.commit()
        return self._to_dict(payment)
    
    def find_by_id(self, payment_id: int) -> Optional[Dict]:
        """Tìm thanh toán theo ID"""
        payment = self.session.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
        return self._to_dict(payment) if payment else None
    
    def find_by_user_id(self, user_id: int, limit: int = 100, offset: int = 0) -> List[Dict]:
        """Tìm tất cả thanh toán của user"""
        payments = self.session.query(PaymentModel).filter(
            PaymentModel.user_id == user_id
        ).limit(limit).offset(offset).all()
        return [self._to_dict(p) for p in payments]
    
    def find_by_transaction_code(self, transaction_code: str) -> Optional[Dict]:
        """Tìm thanh toán theo transaction code"""
        payment = self.session.query(PaymentModel).filter(
            PaymentModel.transaction_code == transaction_code
        ).first()
        return self._to_dict(payment) if payment else None
    
    def update_status(self, payment_id: int, status: str, transaction_code: str = None) -> Optional[Dict]:
        """Cập nhật trạng thái thanh toán"""
        payment = self.session.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
        if payment:
            payment.status = status
            if status == "completed":
                payment.paid_at = datetime.utcnow()
            if transaction_code:
                payment.transaction_code = transaction_code
            self.session.commit()
            return self._to_dict(payment)
        return None
    
    def get_user_payments_summary(self, user_id: int) -> Dict:
        """Lấy tóm tắt thanh toán của user"""
        from sqlalchemy import func
        
        payments = self.session.query(PaymentModel).filter(
            PaymentModel.user_id == user_id
        ).all()
        
        total_paid = sum(float(p.amount) for p in payments if p.status == "completed")
        total_pending = sum(float(p.amount) for p in payments if p.status == "pending")
        
        return {
            "total_payments": len(payments),
            "total_paid": total_paid,
            "total_pending": total_pending,
            "completed_count": len([p for p in payments if p.status == "completed"]),
            "pending_count": len([p for p in payments if p.status == "pending"])
        }
    
    def get_all_payments(self, limit: int = 100, offset: int = 0) -> List[Dict]:
        """Lấy tất cả thanh toán (dành cho admin)"""
        payments = self.session.query(PaymentModel).limit(limit).offset(offset).all()
        return [self._to_dict(p) for p in payments]
    
    def _to_dict(self, payment: PaymentModel) -> Dict:
        """Chuyển Payment object thành dictionary"""
        if not payment:
            return None
        return {
            "id": payment.id,
            "user_id": payment.user_id,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "method": payment.method,
            "provider": payment.provider,
            "transaction_code": payment.transaction_code,
            "status": payment.status,
            "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
            "created_at": payment.created_at.isoformat() if payment.created_at else None
        }
    
    def close(self):
        """Đóng session"""
        self.session.close()
