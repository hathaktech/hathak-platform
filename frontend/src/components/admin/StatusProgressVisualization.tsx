// components/admin/StatusProgressVisualization.tsx - Status Progress Visualization Component
'use client';

import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  CreditCard, 
  ShoppingCart, 
  Truck, 
  Package, 
  Camera, 
  Eye, 
  Box, 
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

export interface StatusStep {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  textColor: string;
}

// Status configuration for admin view
const ADMIN_STATUS_STEPS: StatusStep[] = [
  {
    key: 'pending',
    label: 'Pending Review',
    description: 'Request submitted and awaiting admin review',
    icon: Clock,
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  {
    key: 'under_review',
    label: 'Under Review',
    description: 'Admin is reviewing the request details',
    icon: Eye,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    key: 'approved',
    label: 'Approved',
    description: 'Request approved and ready for payment',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    key: 'payment_pending',
    label: 'Payment Pending',
    description: 'Waiting for customer payment',
    icon: CreditCard,
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  {
    key: 'payment_completed',
    label: 'Payment Completed',
    description: 'Payment received and processing',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    key: 'purchased',
    label: 'Purchased',
    description: 'Items purchased from suppliers',
    icon: ShoppingCart,
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  {
    key: 'to_be_shipped_to_box',
    label: 'Shipping to Box',
    description: 'Items being shipped to company box',
    icon: Truck,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800'
  },
  {
    key: 'arrived_to_box',
    label: 'Arrived at Box',
    description: 'Items arrived at company box',
    icon: Package,
    color: 'cyan',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800'
  },
  {
    key: 'admin_control',
    label: 'Admin Control',
    description: 'Admin inspecting and photographing items',
    icon: Camera,
    color: 'pink',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800'
  },
  {
    key: 'customer_review',
    label: 'Customer Review',
    description: 'Customer reviewing items and photos',
    icon: Eye,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    key: 'customer_approved',
    label: 'Customer Approved',
    description: 'Customer approved all items',
    icon: CheckCircle2,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    key: 'packing_choice',
    label: 'Packing Choice',
    description: 'Customer choosing packing option',
    icon: Box,
    color: 'teal',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800'
  },
  {
    key: 'packed',
    label: 'Packed',
    description: 'Items packed and ready for shipping',
    icon: Package,
    color: 'cyan',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800'
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'Items shipped to customer',
    icon: Truck,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Items delivered to customer',
    icon: CheckCircle2,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  }
];

// Status configuration for customer view (simplified)
const CUSTOMER_STATUS_STEPS: StatusStep[] = [
  {
    key: 'pending',
    label: 'Under Review',
    description: 'Your request is being reviewed',
    icon: Clock,
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  {
    key: 'approved',
    label: 'Ready to Pay',
    description: 'Your request is approved and ready for payment',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    key: 'in_progress',
    label: 'Processing',
    description: 'Your order is being processed',
    icon: Package,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    key: 'shipped',
    label: 'On the Way',
    description: 'Your order is on its way to you',
    icon: Truck,
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered',
    icon: CheckCircle2,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  }
];

// Terminal statuses (end states)
const TERMINAL_STATUSES = ['delivered', 'cancelled', 'return_requested', 'replacement_requested'];

export interface StatusProgressVisualizationProps {
  currentStatus: string;
  subStatus?: string;
  viewType?: 'admin' | 'customer';
  showDescription?: boolean;
  className?: string;
}

const StatusProgressVisualization: React.FC<StatusProgressVisualizationProps> = ({
  currentStatus,
  subStatus,
  viewType = 'admin',
  showDescription = true,
  className = ''
}) => {
  const steps = viewType === 'admin' ? ADMIN_STATUS_STEPS : CUSTOMER_STATUS_STEPS;
  
  // Find current step index
  const currentStepIndex = steps.findIndex(step => step.key === currentStatus);
  const currentSubStepIndex = subStatus ? steps.findIndex(step => step.key === subStatus) : -1;
  
  // Use sub-status if it's more specific than main status
  const activeStepIndex = currentSubStepIndex > currentStepIndex ? currentSubStepIndex : currentStepIndex;
  
  // Check if request is in terminal state
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);
  
  // Get current step
  const currentStep = steps[activeStepIndex] || steps[0];
  
  return (
    <div className={`status-progress ${className}`}>
      {/* Current Status Card */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${currentStep.bgColor} ${currentStep.textColor}`}>
          <currentStep.icon className="w-5 h-5 mr-2" />
          <div>
            <div className="font-semibold">{currentStep.label}</div>
            {showDescription && (
              <div className="text-sm opacity-90">{currentStep.description}</div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < activeStepIndex;
            const isCurrent = index === activeStepIndex;
            const isUpcoming = index > activeStepIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent 
                      ? `${step.bgColor} border-${step.color}-500 ${step.textColor} ring-2 ring-${step.color}-200`
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </div>
                  {showDescription && (
                    <div className={`text-xs mt-1 ${
                      isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  )}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 z-0
                    ${index < activeStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Timeline */}
      {viewType === 'admin' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Timeline</h4>
          <div className="space-y-2">
            {steps.slice(0, activeStepIndex + 1).map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < activeStepIndex;
              const isCurrent = index === activeStepIndex;
              
              return (
                <div key={step.key} className="flex items-center text-sm">
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full mr-3
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? `${step.bgColor} ${step.textColor}`
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {showDescription && (
                      <span className={`ml-2 ${
                        isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </span>
                    )}
                  </div>
                  {index < activeStepIndex && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Terminal Status Message */}
      {isTerminal && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {currentStatus === 'delivered' 
                ? 'Order completed successfully!' 
                : currentStatus === 'cancelled'
                  ? 'Order has been cancelled'
                  : 'Order requires attention'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{
  status: string;
  subStatus?: string;
  viewType?: 'admin' | 'customer';
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, subStatus, viewType = 'admin', size = 'md' }) => {
  const steps = viewType === 'admin' ? ADMIN_STATUS_STEPS : CUSTOMER_STATUS_STEPS;
  const step = steps.find(s => s.key === status) || steps[0];
  const Icon = step.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${step.bgColor} ${step.textColor} ${sizeClasses[size]}
    `}>
      <Icon className="w-3 h-3 mr-1" />
      {step.label}
    </span>
  );
};

// Status Filter Component
export const StatusFilter: React.FC<{
  value: string;
  onChange: (value: string) => void;
  viewType?: 'admin' | 'customer';
  includeAll?: boolean;
}> = ({ value, onChange, viewType = 'admin', includeAll = true }) => {
  const steps = viewType === 'admin' ? ADMIN_STATUS_STEPS : CUSTOMER_STATUS_STEPS;
  
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {includeAll && <option value="all">All Statuses</option>}
      {steps.map(step => (
        <option key={step.key} value={step.key}>
          {step.label}
        </option>
      ))}
    </select>
  );
};

export default StatusProgressVisualization;
