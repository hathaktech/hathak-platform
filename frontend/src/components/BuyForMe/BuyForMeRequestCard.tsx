'use client';

import React from 'react';
import { BuyMeRequest } from '@/types/buyme';
import StatusBadge from '@/components/ui/StatusBadge';
import { Package, Calendar, ExternalLink, Eye } from 'lucide-react';

interface BuyMeRequestCardProps {
  request: BuyMeRequest;
  onViewDetails?: (requestId: string) => void;
  onEdit?: (request: BuyMeRequest) => void;
  showUserInfo?: boolean;
}

export default function BuyMeRequestCard({ 
  request, 
  onViewDetails, 
  onEdit,
  showUserInfo = false 
}: BuyMeRequestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(request.productLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 
              className={`font-semibold text-gray-900 ${onEdit ? 'cursor-pointer hover:text-purple-600 transition-colors' : ''}`}
              onClick={() => onEdit && onEdit(request)}
              title={onEdit ? 'Click to edit this request' : ''}
            >
              {request.productName}
            </h3>
            <p className="text-sm text-gray-500">Request #{request._id.slice(-8)}</p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {showUserInfo && request.user && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Requested by:</span> {request.user.name}
          </p>
          <p className="text-sm text-gray-500">{request.user.email}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span>Submitted: {formatDate(request.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="w-4 h-4 text-gray-400" />
          <button
            onClick={handleLinkClick}
            className="text-blue-600 hover:text-blue-700 hover:underline truncate"
            title={request.productLink}
          >
            {request.productLink}
          </button>
        </div>
      </div>

      {request.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {request.notes}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Last updated: {formatDate(request.updatedAt)}
        </div>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(request._id)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
