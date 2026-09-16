import React, { useState } from 'react';
import { 
  Star, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  MessageSquare, 
  Sparkles, 
  CornerDownRight, 
  ShieldCheck,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerReview } from '../../types';

export const ReviewsManagerView: React.FC = () => {
  const { reviews, addReview, updateReview, deleteReview, replyToReview } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Approved' | 'Pending' | 'Featured'>('all');

  // New review modal / form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newProductBought, setNewProductBought] = useState('');

  // Active reply editor
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'Approved') return r.status === 'Approved';
    if (activeFilter === 'Pending') return r.status === 'Pending';
    if (activeFilter === 'Featured') return r.featured;
    return true;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newComment) return;

    addReview({
      customerName: newCustomerName,
      city: newCity || 'Pakistan',
      rating: newRating,
      comment: newComment,
      productBought: newProductBought || 'Handmade Crochet Creation',
      status: 'Approved',
      verifiedPurchase: true,
      featured: true,
    });

    setNewCustomerName('');
    setNewCity('');
    setNewComment('');
    setNewProductBought('');
    setIsAddOpen(false);
  };

  const handleSaveReply = (id: string) => {
    if (!replyText.trim()) return;
    replyToReview(id, replyText.trim());
    setReplyingId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="admin-reviews-manager">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold mb-2">
            <Star className="w-3.5 h-3.5 text-[#9B86BD] fill-[#9B86BD]" />
            <span>Customer Testimonials & Social Proof</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420]">
            Customer Reviews & Feedback Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#7C6C63] mt-1">
            Approve reviews, feature customer feedback on the homepage, and add official brand replies.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add WhatsApp Feedback</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by name or city..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {(['all', 'Approved', 'Featured', 'Pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
                activeFilter === tab
                  ? 'bg-[#9B86BD] text-white shadow-xs'
                  : 'bg-white text-[#5A4940] border border-[#EAE3DA] hover:bg-[#FAF8F5]'
              }`}
            >
              {tab === 'all' ? 'All Reviews' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE3DA] shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#6B5B52] hover:bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#2C2420] mb-1">
              Add Customer Review (WhatsApp Screenshot / Feedback)
            </h3>
            <p className="text-xs text-[#7C6C63] mb-4">
              Add feedback received from a customer on WhatsApp to display on the store reviews section.
            </p>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Lahore, Islamabad"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Product Purchased
                </label>
                <input
                  type="text"
                  value={newProductBought}
                  onChange={(e) => setNewProductBought(e.target.value)}
                  placeholder="e.g. Eternal Pastel Crochet Bouquet"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-[#F59E0B]"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#5A4940] ml-2">{newRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Customer Testimonial / Feedback Text
                </label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="The flowers were so neat and nicely wrapped. Arrived on time in Karachi..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#6B5B52] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#9B86BD] text-white text-xs font-semibold hover:bg-[#8063A4]"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#EAE3DA] text-xs text-[#7C6C63]">
            No reviews matching your filter criteria.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3DA] shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#2C2420]">
                      {review.customerName}
                    </span>
                    <span className="text-xs text-[#7C6C63]">({review.city})</span>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                    {review.featured && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#EBE1F5] text-[#604284] text-[10px] font-semibold">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured on Home
                      </span>
                    )}
                  </div>
                  {review.productBought && (
                    <div className="text-[11px] text-[#8C7A70] mt-0.5">
                      Purchased: <span className="font-medium text-[#4A3E37]">{review.productBought}</span>
                    </div>
                  )}
                </div>

                {/* Rating stars & status badge */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      review.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : review.status === 'Hidden'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {review.status || 'Approved'}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-[#3A2E28] leading-relaxed italic bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE3DA]">
                “{review.comment}”
              </p>

              {/* Official Admin Reply if present */}
              {review.adminReply && (
                <div className="p-3 rounded-2xl bg-[#F3EEF9] border border-[#DFCFF0] text-xs space-y-1 ml-4">
                  <div className="flex items-center gap-1.5 font-bold text-[#604284] text-[11px]">
                    <CornerDownRight className="w-3 h-3 text-[#9B86BD]" />
                    <span>Official Response from Chorchelia Craft:</span>
                  </div>
                  <p className="text-[#4A3E37] text-xs pl-4">
                    {review.adminReply}
                  </p>
                </div>
              )}

              {/* Active Reply Input */}
              {replyingId === review.id && (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DFCFF0] space-y-2 mt-2">
                  <label className="block text-xs font-semibold text-[#604284]">
                    Reply as Chorchelia Craft:
                  </label>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a sweet, professional thank you reply..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCFF0] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#6B5B52] hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveReply(review.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#9B86BD] text-white text-xs font-semibold"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EBE3] text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateReview(review.id, { featured: !review.featured })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      review.featured
                        ? 'bg-[#EBE1F5] text-[#604284] border-[#DFCFF0]'
                        : 'bg-white text-[#6B5B52] border-[#EAE3DA] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {review.featured ? '★ Featured on Home' : '☆ Feature on Home'}
                  </button>

                  <button
                    onClick={() =>
                      updateReview(review.id, {
                        status: review.status === 'Approved' ? 'Hidden' : 'Approved',
                      })
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border border-[#EAE3DA] text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#FAF8F5]"
                  >
                    {review.status === 'Approved' ? 'Hide from Public' : 'Approve & Show'}
                  </button>

                  <button
                    onClick={() => {
                      setReplyingId(review.id);
                      setReplyText(review.adminReply || '');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#745699] hover:bg-[#EBE1F5]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                    <span>{review.adminReply ? 'Edit Reply' : 'Reply to Customer'}</span>
                  </button>
                </div>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
