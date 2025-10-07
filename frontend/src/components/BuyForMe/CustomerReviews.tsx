'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, Filter, ChevronDown, User, CheckCircle, Globe, Package } from 'lucide-react';
import { Review } from '@/types/buyme';

interface CustomerReviewsProps {
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export default function CustomerReviews({ 
  reviews = [], 
  averageRating = 4.8, 
  totalReviews = 1247 
}: CustomerReviewsProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      _id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: '👩‍💼',
      rating: 5,
      title: 'Amazing service!',
      comment: 'Got my favorite Japanese skincare products delivered right to my door. The team was so helpful throughout the process and kept me updated every step of the way.',
      productName: 'SK-II Facial Treatment Essence',
      storeName: 'Amazon Japan',
      verified: true,
      createdAt: '2023-12-10T10:30:00Z',
      helpful: 23
    },
    {
      _id: '2',
      userId: 'user2',
      userName: 'Ahmed Al-Rashid',
      userAvatar: '👨‍💻',
      rating: 5,
      title: 'Finally found those exclusive sneakers!',
      comment: 'Finally found a way to get those exclusive sneakers from the US. HatHak made it so easy and the delivery was super fast! Highly recommended.',
      productName: 'Nike Air Jordan 1 Retro High',
      storeName: 'Nike US',
      verified: true,
      createdAt: '2023-12-08T15:45:00Z',
      helpful: 18
    },
    {
      _id: '3',
      userId: 'user3',
      userName: 'Maria Garcia',
      userAvatar: '👩‍🎨',
      rating: 5,
      title: 'Perfect solution for international shopping',
      comment: 'I love shopping from international stores but shipping was always a problem. HatHak solved that completely. The customer service is excellent!',
      productName: 'Zara Winter Coat',
      storeName: 'Zara Spain',
      verified: true,
      createdAt: '2023-12-05T09:20:00Z',
      helpful: 15
    },
    {
      _id: '4',
      userId: 'user4',
      userName: 'David Chen',
      userAvatar: '👨‍🔬',
      rating: 4,
      title: 'Great service with minor delays',
      comment: 'Overall great service! The product arrived as described, though there was a slight delay in shipping. Customer support was very responsive.',
      productName: 'Apple MacBook Pro',
      storeName: 'Apple Store US',
      verified: true,
      createdAt: '2023-12-03T14:15:00Z',
      helpful: 12
    },
    {
      _id: '5',
      userId: 'user5',
      userName: 'Emma Thompson',
      userAvatar: '👩‍🏫',
      rating: 5,
      title: 'Exceeded my expectations',
      comment: 'The team went above and beyond to help me get a limited edition book from a UK bookstore. Communication was excellent throughout.',
      productName: 'Limited Edition Harry Potter Book',
      storeName: 'Waterstones UK',
      verified: true,
      createdAt: '2023-12-01T11:30:00Z',
      helpful: 9
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  const filteredReviews = displayReviews.filter(review => {
    if (filterRating === null) return true;
    return review.rating === filterRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'helpful':
        return b.helpful - a.helpful;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    displayReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-1 bg-opacity-10 rounded-lg">
          <Star className="w-6 h-6 text-primary-1" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Customer Reviews</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-neutral-900 mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-neutral-600">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 w-8">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / displayReviews.length) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm text-neutral-600 w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-700">Filter by rating:</span>
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-1 focus:border-transparent"
              >
                <option value="">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-1 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="helpful">Most helpful</option>
                <option value="rating">Highest rating</option>
              </select>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {visibleReviews.map((review) => (
              <div key={review._id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{review.userAvatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-neutral-900">{review.userName}</h4>
                      {review.verified && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-xs text-success font-medium">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-neutral-600">{formatDate(review.createdAt)}</span>
                    </div>

                    <h5 className="font-medium text-neutral-900 mb-2">{review.title}</h5>
                    <p className="text-neutral-600 mb-3">{review.comment}</p>

                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{review.productName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{review.storeName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-neutral-600 hover:text-primary-1 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {sortedReviews.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="flex items-center gap-2 px-6 py-3 border border-primary-1 text-primary-1 font-medium rounded-lg hover:bg-primary-1 hover:text-white transition-colors mx-auto"
              >
                {showAllReviews ? (
                  <>
                    <ChevronDown className="w-4 h-4 rotate-180" />
                    Show Less Reviews
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show All {sortedReviews.length} Reviews
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
