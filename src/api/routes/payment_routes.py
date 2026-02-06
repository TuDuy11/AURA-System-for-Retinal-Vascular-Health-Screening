from flask import Blueprint, request, jsonify
from infrastructure.repositories.payment_repository import PaymentRepository
from domain.services.payment_service import PaymentService
from api.validators import validate_payment_request, validate_process_payment_request
from api.responses import success_response, error_response
from infrastructure.databases.mssql import SessionLocal

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payments")

# ==================== CREATE PAYMENT ====================
@payment_bp.route("", methods=["POST"])
def create_payment():
    """
    Tạo thanh toán mới
    
    Request body:
    {
        "amount": 100000,
        "method": "momo",  # momo, vnpay, cash
        "currency": "VND"  # optional, default VND
    }
    """
    try:
        data = request.get_json()
        
        # Validate request
        is_valid, error = validate_payment_request(data)
        if not is_valid:
            return error_response(error, 400)
        
        # Lấy user_id từ token (giả sử đã được xác thực)
        # Trong thực tế, bạn sẽ lấy từ JWT token
        user_id = request.headers.get("X-User-ID")
        if not user_id:
            return error_response("Bạn cần đăng nhập để tạo thanh toán", 401)
        
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return error_response("User ID không hợp lệ", 400)
        
        # Create payment
        payment_service = PaymentService()
        payment = payment_service.create_payment(
            user_id=user_id,
            amount=float(data.get("amount")),
            currency=data.get("currency", "VND"),
            method=data.get("method", "momo")
        )
        
        return success_response(
            data=payment,
            message="Thanh toán đã được tạo",
            status_code=201
        )
    
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Lỗi tạo thanh toán: {str(e)}", 500)


# ==================== GET PAYMENT DETAILS ====================
@payment_bp.route("/<int:payment_id>", methods=["GET"])
def get_payment(payment_id):
    """Lấy chi tiết thanh toán"""
    try:
        payment_service = PaymentService()
        payment = payment_service.get_payment_details(payment_id)
        
        return success_response(
            data=payment,
            message="Chi tiết thanh toán"
        )
    
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(f"Lỗi lấy chi tiết thanh toán: {str(e)}", 500)


# ==================== GET USER PAYMENTS ====================
@payment_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_payments(user_id):
    """
    Lấy danh sách thanh toán của user
    
    Query parameters:
    - limit: Số lượng tối đa (default 100)
    - offset: Vị trí bắt đầu (default 0)
    """
    try:
        limit = request.args.get("limit", 100, type=int)
        offset = request.args.get("offset", 0, type=int)
        
        # Validate pagination
        if limit < 1 or limit > 1000:
            limit = 100
        if offset < 0:
            offset = 0
        
        payment_service = PaymentService()
        result = payment_service.get_user_payments(user_id, limit, offset)
        
        return success_response(
            data=result,
            message="Danh sách thanh toán của user"
        )
    
    except Exception as e:
        return error_response(f"Lỗi lấy danh sách thanh toán: {str(e)}", 500)


# ==================== GET MY PAYMENTS ====================
@payment_bp.route("/my-payments", methods=["GET"])
def get_my_payments():
    """Lấy danh sách thanh toán của user hiện tại"""
    try:
        user_id = request.headers.get("X-User-ID")
        if not user_id:
            return error_response("Bạn cần đăng nhập", 401)
        
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return error_response("User ID không hợp lệ", 400)
        
        limit = request.args.get("limit", 100, type=int)
        offset = request.args.get("offset", 0, type=int)
        
        if limit < 1 or limit > 1000:
            limit = 100
        if offset < 0:
            offset = 0
        
        payment_service = PaymentService()
        result = payment_service.get_user_payments(user_id, limit, offset)
        
        return success_response(
            data=result,
            message="Danh sách thanh toán của bạn"
        )
    
    except Exception as e:
        return error_response(f"Lỗi lấy danh sách thanh toán: {str(e)}", 500)


# ==================== PROCESS PAYMENT ====================
@payment_bp.route("/<int:payment_id>/process", methods=["POST"])
def process_payment(payment_id):
    """
    Xử lý thanh toán (sau khi gateway xác nhận)
    
    Request body:
    {
        "transaction_code": "TRANS123456789"
    }
    """
    try:
        data = request.get_json()
        
        # Validate request
        is_valid, error = validate_process_payment_request(data)
        if not is_valid:
            return error_response(error, 400)
        
        payment_service = PaymentService()
        payment = payment_service.process_payment(
            payment_id=payment_id,
            transaction_code=data.get("transaction_code")
        )
        
        return success_response(
            data=payment,
            message="Thanh toán đã được xử lý thành công"
        )
    
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(f"Lỗi xử lý thanh toán: {str(e)}", 500)


# ==================== CANCEL PAYMENT ====================
@payment_bp.route("/<int:payment_id>/cancel", methods=["POST"])
def cancel_payment(payment_id):
    """Hủy thanh toán"""
    try:
        payment_service = PaymentService()
        payment = payment_service.cancel_payment(payment_id)
        
        return success_response(
            data=payment,
            message="Thanh toán đã bị hủy"
        )
    
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Lỗi hủy thanh toán: {str(e)}", 500)


# ==================== REFUND PAYMENT ====================
@payment_bp.route("/<int:payment_id>/refund", methods=["POST"])
def refund_payment(payment_id):
    """Hoàn tiền cho thanh toán"""
    try:
        payment_service = PaymentService()
        payment = payment_service.refund_payment(payment_id)
        
        return success_response(
            data=payment,
            message="Hoàn tiền thành công"
        )
    
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Lỗi hoàn tiền: {str(e)}", 500)


# ==================== GET PAYMENT URL ====================
@payment_bp.route("/<int:payment_id>/payment-url", methods=["GET"])
def get_payment_url(payment_id):
    """
    Lấy URL thanh toán
    
    Query parameters:
    - method: Phương thức thanh toán (momo, vnpay) - default momo
    """
    try:
        method = request.args.get("method", "momo")
        
        payment_service = PaymentService()
        url = payment_service.generate_payment_url(payment_id, method)
        
        return success_response(
            data={
                "payment_id": payment_id,
                "payment_url": url,
                "method": method
            },
            message="URL thanh toán"
        )
    
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(f"Lỗi lấy URL thanh toán: {str(e)}", 500)


# ==================== GET ALL PAYMENTS (ADMIN) ====================
@payment_bp.route("/admin/all", methods=["GET"])
def get_all_payments():
    """
    Lấy tất cả thanh toán (chỉ dành cho admin)
    
    Query parameters:
    - limit: Số lượng tối đa (default 100)
    - offset: Vị trí bắt đầu (default 0)
    """
    try:
        # Kiểm tra quyền admin (giả sử)
        # is_admin = request.headers.get("X-Is-Admin") == "true"
        # if not is_admin:
        #     return error_response("Bạn không có quyền truy cập", 403)
        
        limit = request.args.get("limit", 100, type=int)
        offset = request.args.get("offset", 0, type=int)
        
        if limit < 1 or limit > 1000:
            limit = 100
        if offset < 0:
            offset = 0
        
        payment_service = PaymentService()
        result = payment_service.get_all_payments(limit, offset)
        
        return success_response(
            data=result,
            message="Danh sách tất cả thanh toán"
        )
    
    except Exception as e:
        return error_response(f"Lỗi lấy danh sách thanh toán: {str(e)}", 500)
