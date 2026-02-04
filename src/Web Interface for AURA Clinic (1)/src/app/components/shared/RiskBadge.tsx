import { AlertCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReviewStatus = 'pending' | 'ai-only' | 'doctor-validated';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const configs = {
    low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: CheckCircle,
      label: 'Nguy cơ thấp'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: AlertCircle,
      label: 'Nguy cơ trung bình'
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
      icon: AlertTriangle,
      label: 'Nguy cơ cao'
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: AlertTriangle,
      label: 'Nghiêm trọng'
    }
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} font-medium text-sm ${className}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: ReviewStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const configs = {
    'pending': {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: Clock,
      label: 'Chờ duyệt'
    },
    'ai-only': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: AlertCircle,
      label: 'AI phân tích'
    },
    'doctor-validated': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: CheckCircle,
      label: 'Bác sĩ xác nhận'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} font-medium text-sm ${className}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}
