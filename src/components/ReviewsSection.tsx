import React, { useState } from 'react';
import { Star, MessageSquarePlus, X, CheckCircle2, Sparkles, MapPin, CornerDownRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerReview } from '../types';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Review form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [productBought, setProductBought] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Filter public visible reviews
  const visibleReviews = reviews.filter((r) => r.status !== 'Hidden');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    addReview({
      customerName: name.trim(),
      city: city.trim() || 'Pakistan',
      rating,
      comment: comment.trim(),
      productBought: productBought.trim() || 'Handmade Crochet Piece',
      status: 'Approved',
      verifiedPurchase: true,
      featured: true,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setName('');
      setCity('');
      setProductBought('');
      setComment('');
    }, 1800);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#EAE3DA]" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>Kind Words From Customers</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
              Loved Across Pakistan
            </h2>
            <p className="text-sm text-[#6B5B52] mt-1.5">
              Read authentic feedback from happy clients, gift-givers, and bouquet collectors.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            id="share-review-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#9B86BD] bg-[#FAF8F5] hover:bg-[#EBE1F5] text-[#604284] text-xs font-semibold tracking-wide transition-all shadow-xs self-start sm:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#9B86BD]" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#EAE3DA] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D5C6E6] transition-colors"
            >
              <div className="space-y-3">
                {/* Star rating and verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-[#2C2420] ml-1.5">
                      {rev.rating}.0
                    </span>
                  </div>

                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Order
                    </span>
                  )}
                </div>

                {/* Review body */}
                <p className="text-xs text-[#5C4D44] leading-relaxed italic">
                  “{rev.comment}”
                </p>

                {/* Official Brand Reply if exists */}
                {rev.adminReply && (
                  <div className="p-3 rounded-2xl bg-[#F3EEF9] border border-[#DFCFF0] text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#604284] text-[11px]">
                      <CornerDownRight className="w-3 h-3 text-[#9B86BD]" />
                      <span>Chorchelia Craft:</span>
                    </div>
                    <p className="text-[#4A3E37] text-xs pl-4">
                      {rev.adminReply}
                    </p>
                  </div>
                )}
              </div>

              {/* Author & City */}
              <div className="pt-3 border-t border-[#EAE3DA] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#2C2420]">
                    {rev.customerName}
                  </h4>
                  {rev.productBought && (
                    <p className="text-[10px] text-[#8C7A70] line-clamp-1">
                      {rev.productBought}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-[#745699] bg-[#EBE1F5] px-2.5 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3" />
                  <span>{rev.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Share Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EAE3DA] relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#6B5B52] hover:bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#2C2420] mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-[#7C6C63] mb-5">
              Your words support our small handmade crochet studio.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-in zoom-in" />
                <h4 className="font-serif text-lg font-bold text-[#2C2420]">
                  Thank You for Your Review!
                </h4>
                <p className="text-xs text-[#6B5B52]">
                  Your kind words have been added to our feedback board.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#2C2420] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] text-xs focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2420] mb-1">
                      City in Pakistan
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lahore"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] text-xs focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2C2420] mb-1">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] text-xs focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#2C2420] mb-1">
                    Product Ordered (Optional)
                  </label>
                  <input
                    type="text"
                    value={productBought}
                    onChange={(e) => setProductBought(e.target.value)}
                    placeholder="e.g. Eternal Pastel Bouquet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] text-xs focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2C2420] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked about the craftsmanship and packaging..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DA] text-xs focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
