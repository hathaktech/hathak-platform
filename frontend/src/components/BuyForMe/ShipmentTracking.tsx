'use client';

import React, { useState } from 'react';
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Search, ExternalLink } from 'lucide-react';
import { TrackingInfo } from '@/types/buyme';

interface ShipmentTrackingProps {
  onTrack: (trackingInfo: TrackingInfo) => void;
  isLoading?: boolean;
}

export default function ShipmentTracking({ onTrack, isLoading = false }: ShipmentTrackingProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingResult, setTrackingResult] = useState<TrackingInfo | null>(null);

  const carriers = [
    { id: 'ups', name: 'UPS', website: 'https://www.ups.com/track' },
    { id: 'fedex', name: 'FedEx', website: 'https://www.fedex.com/fedextrack' },
    { id: 'dhl', name: 'DHL', website: 'https://www.dhl.com/tracking' },
    { id: 'usps', name: 'USPS', website: 'https://tools.usps.com/go/TrackConfirmAction' },
    { id: 'amazon', name: 'Amazon Logistics', website: 'https://www.amazon.com/tracking' },
    { id: 'ontrac', name: 'OnTrac', website: 'https://www.ontrac.com/tracking' },
    { id: 'lasership', name: 'LaserShip', website: 'https://www.lasership.com/track' },
    { id: 'other', name: 'Other', website: '' }
  ];

  const trackingStatuses = [
    { status: 'pending', label: 'Pending', color: 'text-warning', icon: Clock },
    { status: 'processing', label: 'Processing', color: 'text-info', icon: Package },
    { status: 'shipped', label: 'Shipped', color: 'text-primary-1', icon: Package },
    { status: 'in_transit', label: 'In Transit', color: 'text-primary-1', icon: MapPin },
    { status: 'out_for_delivery', label: 'Out for Delivery', color: 'text-accent-default', icon: MapPin },
    { status: 'delivered', label: 'Delivered', color: 'text-success', icon: CheckCircle },
    { status: 'exception', label: 'Exception', color: 'text-danger', icon: AlertCircle }
  ];

  const handleTrack = async () => {
    if (!trackingNumber.trim() || !carrier) {
      setError('Please enter tracking number and select carrier');
      return;
    }

    setIsTracking(true);
    setError(null);

    try {
      // Simulate API call to track shipment
      // In a real implementation, this would call your backend API
      const response = await fetch('/api/logistics/track-shipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
          carrier
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track shipment');
      }

      const result: TrackingInfo = await response.json();
      setTrackingResult(result);
      onTrack(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track shipment');
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return trackingStatuses.find(s => s.status === status) || trackingStatuses[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-1 bg-opacity-10 rounded-lg">
          <Package className="w-6 h-6 text-primary-1" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Shipment Tracking</h2>
      </div>

      <div className="space-y-6">
        {/* Tracking Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-neutral-700 mb-2">
              Tracking Number *
            </label>
            <input
              type="text"
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
              placeholder="Enter tracking number"
              disabled={isTracking || isLoading}
            />
          </div>

          <div>
            <label htmlFor="carrier" className="block text-sm font-medium text-neutral-700 mb-2">
              Carrier *
            </label>
            <select
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-transparent"
              disabled={isTracking || isLoading}
            >
              <option value="">Select Carrier</option>
              {carriers.map(carrierOption => (
                <option key={carrierOption.id} value={carrierOption.id}>
                  {carrierOption.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTrack}
            disabled={isTracking || isLoading || !trackingNumber.trim() || !carrier}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-1 text-white font-medium rounded-lg hover:bg-primary-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTracking ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Tracking...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Track Shipment
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger" />
            <span className="text-danger">{error}</span>
          </div>
        )}

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-4">
            {/* Status Overview */}
            <div className="p-6 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Tracking Information</h3>
                  <p className="text-sm text-neutral-600">Tracking #: {trackingResult.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-600">Carrier</div>
                  <div className="font-medium text-neutral-900 capitalize">{trackingResult.carrier}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(() => {
                  const statusInfo = getStatusInfo(trackingResult.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${statusInfo.color.replace('text-', 'bg-').replace('-', '-')} bg-opacity-10`}>
                        <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                      </div>
                      <div>
                        <div className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</div>
                        <div className="text-sm text-neutral-600">
                          Last updated: {formatDate(trackingResult.lastUpdate)}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {trackingResult.estimatedDelivery && (
                <div className="mt-4 p-3 bg-primary-1 bg-opacity-10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-1" />
                    <span className="text-sm font-medium text-primary-1">
                      Estimated Delivery: {formatDate(trackingResult.estimatedDelivery)}
                    </span>
                  </div>
                </div>
              )}

              {trackingResult.trackingUrl && (
                <div className="mt-4">
                  <a
                    href={trackingResult.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-1 hover:text-primary-2 font-medium text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Track on carrier website
                  </a>
                </div>
              )}
            </div>

            {/* Tracking History */}
            <div>
              <h4 className="text-md font-medium text-neutral-900 mb-3">Tracking History</h4>
              <div className="space-y-3">
                {/* This would typically come from the API response */}
                <div className="flex items-start gap-3 p-3 bg-white border border-neutral-200 rounded-lg">
                  <div className="w-2 h-2 bg-primary-1 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900">Package in transit</div>
                    <div className="text-sm text-neutral-600">New York, NY</div>
                    <div className="text-xs text-neutral-500">Dec 15, 2023 at 2:30 PM</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white border border-neutral-200 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900">Package shipped</div>
                    <div className="text-sm text-neutral-600">Los Angeles, CA</div>
                    <div className="text-xs text-neutral-500">Dec 14, 2023 at 9:15 AM</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white border border-neutral-200 rounded-lg">
                  <div className="w-2 h-2 bg-neutral-300 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900">Label created</div>
                    <div className="text-sm text-neutral-600">Los Angeles, CA</div>
                    <div className="text-xs text-neutral-500">Dec 13, 2023 at 4:45 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="border-t border-neutral-200 pt-6">
          <h4 className="text-md font-medium text-neutral-900 mb-3">Quick Track Links</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {carriers.slice(0, 4).map(carrierOption => (
              <a
                key={carrierOption.id}
                href={carrierOption.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-neutral-200 rounded-lg hover:border-primary-1 hover:bg-primary-1 hover:bg-opacity-5 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700">{carrierOption.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
