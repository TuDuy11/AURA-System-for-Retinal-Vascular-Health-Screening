# Payment Integration Guide for Frontend

Hướng dẫn tích hợp hệ thống thanh toán vào frontend AURA.

## Overview

Frontend cần tương tác với Payment API để:
1. Tạo thanh toán
2. Lấy danh sách thanh toán
3. Redirect đến cổng thanh toán
4. Xử lý callback từ cổng thanh toán

## Installation

### 1. Cài đặt dependencies (nếu chưa có)
```bash
npm install axios  # hoặc fetch API
```

## Service Layer

Tạo file `src/services/paymentService.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999/api/payments';

interface CreatePaymentRequest {
  amount: number;
  method: 'momo' | 'vnpay' | 'cash';
  currency?: string;
}

interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  transaction_code?: string;
  paid_at?: string;
  created_at: string;
}

export class PaymentService {
  // Lấy user ID từ localStorage/sessionStorage
  private getUserId(): string {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return userId;
  }

  // Tạo thanh toán mới
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    try {
      const response = await axios.post(API_BASE_URL, data, {
        headers: {
          'X-User-ID': this.getUserId(),
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Lấy chi tiết thanh toán
  async getPaymentDetails(paymentId: number): Promise<Payment> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${paymentId}`, {
        headers: {
          'X-User-ID': this.getUserId()
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Lấy danh sách thanh toán của user hiện tại
  async getMyPayments(limit = 100, offset = 0) {
    try {
      const response = await axios.get(`${API_BASE_URL}/my-payments`, {
        params: { limit, offset },
        headers: {
          'X-User-ID': this.getUserId()
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Lấy danh sách thanh toán của một user (admin)
  async getUserPayments(userId: number, limit = 100, offset = 0) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/${userId}`,
        {
          params: { limit, offset },
          headers: {
            'X-User-ID': this.getUserId()
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }

  // Lấy URL thanh toán
  async getPaymentUrl(paymentId: number, method: 'momo' | 'vnpay' = 'momo'): Promise<string> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${paymentId}/payment-url`,
        {
          params: { method },
          headers: {
            'X-User-ID': this.getUserId()
          }
        }
      );
      return response.data.data.payment_url;
    } catch (error) {
      console.error('Error getting payment URL:', error);
      throw error;
    }
  }

  // Xử lý thanh toán (sau callback từ gateway)
  async processPayment(paymentId: number, transactionCode: string): Promise<Payment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${paymentId}/process`,
        { transaction_code: transactionCode },
        {
          headers: {
            'X-User-ID': this.getUserId(),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Hủy thanh toán
  async cancelPayment(paymentId: number): Promise<Payment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${paymentId}/cancel`,
        {},
        {
          headers: {
            'X-User-ID': this.getUserId(),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling payment:', error);
      throw error;
    }
  }

  // Hoàn tiền
  async refundPayment(paymentId: number): Promise<Payment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${paymentId}/refund`,
        {},
        {
          headers: {
            'X-User-ID': this.getUserId(),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
```

## Component Examples

### 1. Payment Creation Component

```tsx
import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';

interface PaymentFormProps {
  onPaymentCreated?: (payment: any) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentCreated }) => {
  const [amount, setAmount] = useState<number>(10000);
  const [method, setMethod] = useState<'momo' | 'vnpay' | 'cash'>('momo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payment = await paymentService.createPayment({
        amount,
        method,
        currency: 'VND'
      });

      setSuccess(true);
      setAmount(10000);
      
      if (onPaymentCreated) {
        onPaymentCreated(payment);
      }

      // Redirect đến payment URL sau 1 giây
      setTimeout(async () => {
        const paymentUrl = await paymentService.getPaymentUrl(payment.id, method);
        window.location.href = paymentUrl;
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Thanh Toán</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Thanh toán đã được tạo, đang chuyển hướng...</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Số Tiền:</label>
          <div className="input-group">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1000"
              step="1000"
              required
              disabled={loading}
            />
            <span className="input-group-text">VND</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="method">Phương Thức Thanh Toán:</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            disabled={loading}
          >
            <option value="momo">Momo</option>
            <option value="vnpay">VNPay</option>
            <option value="cash">Tiền Mặt</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Đang xử lý...' : 'Thanh Toán'}
        </button>
      </form>
    </div>
  );
};
```

### 2. Payment History Component

```tsx
import React, { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';

export const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadPayments();
  }, [page]);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.getMyPayments(10, page * 10);
      setPayments(result.payments);
      setSummary(result.summary);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId: number) => {
    if (confirm('Bạn có chắc chắn muốn hoàn tiền?')) {
      try {
        await paymentService.refundPayment(paymentId);
        loadPayments();
      } catch (err) {
        alert('Lỗi hoàn tiền');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      'pending': 'badge-warning',
      'completed': 'badge-success',
      'cancelled': 'badge-danger',
      'refunded': 'badge-info'
    };
    return statusMap[status] || 'badge-secondary';
  };

  const getStatusLabel = (status: string) => {
    const labelMap: any = {
      'pending': 'Chờ xử lý',
      'completed': 'Hoàn tất',
      'cancelled': 'Đã hủy',
      'refunded': 'Đã hoàn tiền'
    };
    return labelMap[status] || status;
  };

  return (
    <div className="payment-history">
      <h2>Lịch Sử Thanh Toán</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {summary && (
        <div className="summary-cards">
          <div className="card">
            <h5>Tổng thanh toán</h5>
            <p className="text-success">{summary.total_payments}</p>
          </div>
          <div className="card">
            <h5>Đã thanh toán</h5>
            <p className="text-success">{summary.total_paid.toLocaleString()} VND</p>
          </div>
          <div className="card">
            <h5>Chờ thanh toán</h5>
            <p className="text-warning">{summary.total_pending.toLocaleString()} VND</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Số Tiền</th>
              <th>Phương Thức</th>
              <th>Trạng Thái</th>
              <th>Ngày Tạo</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td>#{payment.id}</td>
                  <td>{payment.amount.toLocaleString()} VND</td>
                  <td>{payment.method}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(payment.status)}`}>
                      {getStatusLabel(payment.status)}
                    </span>
                  </td>
                  <td>{new Date(payment.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    {payment.status === 'pending' && (
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => {/* Retry payment */}}
                      >
                        Thử lại
                      </button>
                    )}
                    {payment.status === 'completed' && (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRefund(payment.id)}
                      >
                        Hoàn tiền
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">Không có thanh toán nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>
        <span>Trang {page + 1}</span>
        <button 
          disabled={payments.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};
```

### 3. Payment Status Component

```tsx
import React, { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';

interface PaymentStatusProps {
  paymentId: number;
  onStatusChange?: (status: string) => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentId, onStatusChange }) => {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadPayment();

    if (autoRefresh) {
      const interval = setInterval(loadPayment, 5000); // Refresh mỗi 5 giây
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadPayment = async () => {
    try {
      const data = await paymentService.getPaymentDetails(paymentId);
      setPayment(data);
      
      if (onStatusChange && data.status !== payment?.status) {
        onStatusChange(data.status);
      }

      // Dừng auto-refresh nếu thanh toán đã hoàn tất
      if (data.status !== 'pending') {
        setAutoRefresh(false);
      }
    } catch (err) {
      console.error('Error loading payment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!payment) return <div>Không tìm thấy thanh toán</div>;

  const statusSteps = ['pending', 'completed'];
  const currentStepIndex = statusSteps.indexOf(payment.status);

  return (
    <div className="payment-status">
      <h3>Trạng Thái Thanh Toán</h3>

      {/* Progress Bar */}
      <div className="progress-bar">
        {statusSteps.map((step, index) => (
          <div
            key={step}
            className={`step ${index <= currentStepIndex ? 'completed' : ''}`}
          >
            <div className="step-circle">{index + 1}</div>
            <span className="step-label">
              {step === 'pending' ? 'Chờ xử lý' : 'Hoàn tất'}
            </span>
          </div>
        ))}
      </div>

      {/* Payment Info */}
      <div className="payment-info">
        <p>
          <strong>ID:</strong> {payment.id}
        </p>
        <p>
          <strong>Số Tiền:</strong> {payment.amount.toLocaleString()} VND
        </p>
        <p>
          <strong>Phương Thức:</strong> {payment.method}
        </p>
        <p>
          <strong>Trạng Thái:</strong>{' '}
          <span className={`badge badge-${payment.status}`}>
            {payment.status}
          </span>
        </p>
        {payment.transaction_code && (
          <p>
            <strong>Mã Giao Dịch:</strong> {payment.transaction_code}
          </p>
        )}
        {payment.paid_at && (
          <p>
            <strong>Thanh Toán Lúc:</strong>{' '}
            {new Date(payment.paid_at).toLocaleString('vi-VN')}
          </p>
        )}
      </div>
    </div>
  );
};
```

## Usage in Pages

### Trang thanh toán
```tsx
import { PaymentForm } from './components/PaymentForm';
import { PaymentStatus } from './components/PaymentStatus';

export default function PaymentPage() {
  const [createdPayment, setCreatedPayment] = useState<any>(null);

  return (
    <div className="payment-page">
      <PaymentForm onPaymentCreated={setCreatedPayment} />
      
      {createdPayment && (
        <PaymentStatus 
          paymentId={createdPayment.id}
          onStatusChange={(status) => {
            if (status === 'completed') {
              // Hiển thị thành công
              alert('Thanh toán thành công!');
            }
          }}
        />
      )}
    </div>
  );
}
```

### Trang lịch sử
```tsx
import { PaymentHistory } from './components/PaymentHistory';

export default function HistoryPage() {
  return <PaymentHistory />;
}
```

## Webhook Handling (Back from Payment Gateway)

Sau khi user thanh toán trên Momo/VNPay, gateway sẽ redirect back với success/failure:

```tsx
// pages/payment/callback.tsx
import { useEffect, useRouter } from 'next/router';
import { paymentService } from '@/services/paymentService';

export default function CallbackPage() {
  const router = useRouter();
  const { paymentId, transactionCode, status } = router.query;

  useEffect(() => {
    if (paymentId && transactionCode && status === 'success') {
      processPayment();
    }
  }, [paymentId, transactionCode, status]);

  const processPayment = async () => {
    try {
      await paymentService.processPayment(
        Number(paymentId),
        String(transactionCode)
      );
      router.push('/payment/success');
    } catch (error) {
      router.push('/payment/failed');
    }
  };

  return <div>Đang xử lý thanh toán...</div>;
}
```

## Error Handling

```typescript
try {
  const payment = await paymentService.createPayment({
    amount: 100000,
    method: 'momo'
  });
} catch (error: any) {
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.response?.status === 400) {
    // Show validation error
    console.error('Validation error:', error.response.data.message);
  } else {
    // Generic error
    console.error('Payment failed:', error);
  }
}
```

## Testing

Để test payment, bạn có thể:
1. Sử dụng test card dari Momo/VNPay
2. Mock API responses trong development
3. Sử dụng Postman để test endpoints

```bash
# Test tạo thanh toán
curl -X POST http://localhost:9999/api/payments \
  -H "X-User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "method": "momo"}'
```

## Next Steps

1. Implement real Momo/VNPay integration
2. Add webhook handlers cho payment gateway callbacks
3. Add payment success/error pages
4. Implement receipt generation
5. Add payment analytics dashboard

## Support

Để support, hãy contact với backend team hoặc check PAYMENT_API.md file
