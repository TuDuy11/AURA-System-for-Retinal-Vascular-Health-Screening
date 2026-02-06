# Payment API Documentation

## Overview
Hệ thống thanh toán (Payment System) cho AURA giúp quản lý các giao dịch thanh toán từ người dùng. Hỗ trợ nhiều phương thức thanh toán như Momo, VNPay, và thanh toán tiền mặt.

## Features
- ✅ Tạo thanh toán mới
- ✅ Xem chi tiết thanh toán
- ✅ Lấy danh sách thanh toán của user
- ✅ Xử lý thanh toán (sau khi gateway xác nhận)
- ✅ Hủy thanh toán
- ✅ Hoàn tiền
- ✅ Tạo URL thanh toán cho các gateway
- ✅ Quản lý admin

## Architecture

### Components

#### 1. **PaymentModel** (Database Layer)
- File: `src/infrastructure/models/payment_model.py`
- Lưu trữ dữ liệu thanh toán trong database

#### 2. **PaymentRepository** (Data Access Layer)
- File: `src/infrastructure/repositories/payment_repository.py`
- Xử lý các thao tác CRUD trên database
- Methods:
  - `create()` - Tạo thanh toán mới
  - `find_by_id()` - Tìm theo ID
  - `find_by_user_id()` - Tìm theo user ID
  - `find_by_transaction_code()` - Tìm theo mã giao dịch
  - `update_status()` - Cập nhật trạng thái
  - `get_user_payments_summary()` - Tóm tắt thanh toán của user

#### 3. **PaymentService** (Business Logic Layer)
- File: `src/domain/services/payment_service.py`
- Xử lý logic nghiệp vụ
- Methods:
  - `create_payment()` - Tạo thanh toán
  - `process_payment()` - Xử lý thanh toán
  - `cancel_payment()` - Hủy thanh toán
  - `refund_payment()` - Hoàn tiền
  - `get_payment_details()` - Lấy chi tiết
  - `get_user_payments()` - Lấy danh sách
  - `generate_payment_url()` - Tạo URL thanh toán

#### 4. **PaymentRoutes** (API Layer)
- File: `src/api/routes/payment_routes.py`
- Định nghĩa các API endpoints

#### 5. **Validators**
- File: `src/api/validators.py`
- `validate_payment_request()` - Xác thực tạo thanh toán
- `validate_process_payment_request()` - Xác thực xử lý thanh toán

## API Endpoints

### 1. Create Payment (POST)
```
POST /api/payments
```
**Description:** Tạo thanh toán mới

**Headers:**
```
X-User-ID: 123  (required)
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 100000,
  "method": "momo",
  "currency": "VND"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Thanh toán đã được tạo",
  "data": {
    "id": 1,
    "user_id": 123,
    "amount": 100000,
    "currency": "VND",
    "method": "momo",
    "provider": "momo",
    "status": "pending",
    "transaction_code": null,
    "paid_at": null,
    "created_at": "2024-02-06T10:30:00"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Số tiền phải lớn hơn 0"
}
```

---

### 2. Get Payment Details (GET)
```
GET /api/payments/<payment_id>
```
**Description:** Lấy chi tiết thanh toán

**Response (200):**
```json
{
  "status": "success",
  "message": "Chi tiết thanh toán",
  "data": {
    "id": 1,
    "user_id": 123,
    "amount": 100000,
    "currency": "VND",
    "method": "momo",
    "status": "pending",
    "created_at": "2024-02-06T10:30:00"
  }
}
```

---

### 3. Get User Payments (GET)
```
GET /api/payments/user/<user_id>?limit=100&offset=0
```
**Description:** Lấy danh sách thanh toán của user

**Query Parameters:**
- `limit` (optional, default: 100) - Số lượng tối đa
- `offset` (optional, default: 0) - Vị trí bắt đầu

**Response (200):**
```json
{
  "status": "success",
  "message": "Danh sách thanh toán của user",
  "data": {
    "payments": [
      {
        "id": 1,
        "amount": 100000,
        "status": "completed",
        "created_at": "2024-02-06T10:30:00"
      }
    ],
    "summary": {
      "total_payments": 5,
      "total_paid": 500000,
      "total_pending": 100000,
      "completed_count": 4,
      "pending_count": 1
    },
    "count": 5
  }
}
```

---

### 4. Get My Payments (GET)
```
GET /api/payments/my-payments?limit=100&offset=0
```
**Description:** Lấy danh sách thanh toán của user hiện tại (từ token)

**Headers:**
```
X-User-ID: 123 (required)
```

**Response:** Giống như endpoint 3

---

### 5. Process Payment (POST)
```
POST /api/payments/<payment_id>/process
```
**Description:** Xử lý thanh toán (sau khi gateway xác nhận)

**Request Body:**
```json
{
  "transaction_code": "MOMO20240206103000"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Thanh toán đã được xử lý thành công",
  "data": {
    "id": 1,
    "status": "completed",
    "transaction_code": "MOMO20240206103000",
    "paid_at": "2024-02-06T10:35:00"
  }
}
```

---

### 6. Cancel Payment (POST)
```
POST /api/payments/<payment_id>/cancel
```
**Description:** Hủy thanh toán (chỉ khi trạng thái là pending)

**Response (200):**
```json
{
  "status": "success",
  "message": "Thanh toán đã bị hủy",
  "data": {
    "id": 1,
    "status": "cancelled"
  }
}
```

---

### 7. Refund Payment (POST)
```
POST /api/payments/<payment_id>/refund
```
**Description:** Hoàn tiền (chỉ khi thanh toán đã completed)

**Response (200):**
```json
{
  "status": "success",
  "message": "Hoàn tiền thành công",
  "data": {
    "id": 1,
    "status": "refunded"
  }
}
```

---

### 8. Get Payment URL (GET)
```
GET /api/payments/<payment_id>/payment-url?method=momo
```
**Description:** Lấy URL thanh toán để chuyển hướng user

**Query Parameters:**
- `method` (optional, default: "momo") - Phương thức: momo, vnpay

**Response (200):**
```json
{
  "status": "success",
  "message": "URL thanh toán",
  "data": {
    "payment_id": 1,
    "payment_url": "https://pay.momo.vn/payment/1?amount=100000",
    "method": "momo"
  }
}
```

---

### 9. Get All Payments (Admin) (GET)
```
GET /api/payments/admin/all?limit=100&offset=0
```
**Description:** Lấy tất cả thanh toán (dành cho admin)

**Response (200):**
```json
{
  "status": "success",
  "message": "Danh sách tất cả thanh toán",
  "data": {
    "payments": [
      {
        "id": 1,
        "user_id": 123,
        "amount": 100000,
        "status": "completed"
      }
    ],
    "count": 1
  }
}
```

---

## Payment Status Flow

```
pending → completed → refunded
       → cancelled
```

- **pending** - Thanh toán vừa được tạo, chờ xử lý
- **completed** - Thanh toán đã hoàn tất
- **cancelled** - Thanh toán bị hủy
- **refunded** - Thanh toán đã được hoàn tiền

## Status Codes

- `200 OK` - Request thành công
- `201 Created` - Resource được tạo
- `400 Bad Request` - Request không hợp lệ
- `401 Unauthorized` - Cần đăng nhập
- `403 Forbidden` - Không có quyền
- `404 Not Found` - Resource không tìm thấy
- `500 Internal Server Error` - Lỗi server

## Error Responses

Tất cả error responses theo format:
```json
{
  "status": "error",
  "message": "Mô tả lỗi"
}
```

## Supported Payment Methods

- **momo** - Ví Momo
- **vnpay** - VNPay
- **cash** - Tiền mặt

## Database Schema

### payments table

```sql
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL FOREIGN KEY REFERENCES users(id),
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    method VARCHAR(50),
    provider VARCHAR(50),
    transaction_code VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### Example 1: Tạo thanh toán bằng Momo
```bash
curl -X POST http://localhost:9999/api/payments \
  -H "X-User-ID: 123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "method": "momo",
    "currency": "VND"
  }'
```

### Example 2: Lấy danh sách thanh toán của user
```bash
curl -X GET "http://localhost:9999/api/payments/user/123?limit=10" \
  -H "X-User-ID: 123"
```

### Example 3: Xử lý thanh toán sau callback từ Momo
```bash
curl -X POST http://localhost:9999/api/payments/1/process \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_code": "MOMO20240206103000"
  }'
```

## Webhook Integration (Tùy chọn)

Bạn có thể thêm webhook endpoints để nhận callback từ các payment gateways:

```python
@payment_bp.route("/webhooks/momo", methods=["POST"])
def momo_webhook():
    # Handle Momo callback
    pass

@payment_bp.route("/webhooks/vnpay", methods=["POST"])
def vnpay_webhook():
    # Handle VNPay callback
    pass
```

## Future Enhancements

1. **Webhook Handling** - Tích hợp callback từ Momo/VNPay
2. **Payment History Analytics** - Phân tích dữ liệu thanh toán
3. **Subscription Management** - Quản lý subscription
4. **Refund Request System** - Hệ thống yêu cầu hoàn tiền
5. **Multi-currency Support** - Hỗ trợ nhiều loại tiền
6. **Payment Retry Logic** - Logic thử lại thanh toán
7. **Invoice Generation** - Tạo hóa đơn

## Testing

Để test các endpoints, sử dụng Postman hoặc curl. Đảm bảo:
1. Backend đang chạy trên `localhost:9999`
2. Header `X-User-ID` được gửi cho các endpoint yêu cầu
3. Content-Type là `application/json` cho POST/PUT requests

## Notes

- Tất cả số tiền tính bằng **VND** (mặc định)
- Payment URLs là placeholder - cần tích hợp thực tế với Momo/VNPay
- Admin endpoints cần kiểm tra quyền (chưa implement)
- User IDs cần từ JWT token (hiện tại sử dụng header `X-User-ID` để dễ test)
