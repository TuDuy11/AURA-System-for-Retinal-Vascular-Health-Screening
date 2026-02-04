import { ReactNode } from 'react';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  backButton?: {
    label: string;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, action, backButton }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {backButton && (
        <button
          onClick={backButton.onClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {backButton.label}
        </button>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>

        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 flex-shrink-0"
          >
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
