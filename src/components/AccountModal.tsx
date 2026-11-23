import { FormEvent, useEffect, useState } from 'react';
import { Heart, LogOut, ShoppingBag, User, X } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  isSignedIn: boolean;
  userName: string;
  userEmail: string;
  wishlistCount: number;
  cartCount: number;
  onClose: () => void;
  onSignIn: (name: string, email: string) => void;
  onSignOut: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
}

export function AccountModal({
  isOpen,
  isSignedIn,
  userName,
  userEmail,
  wishlistCount,
  cartCount,
  onClose,
  onSignIn,
  onSignOut,
  onOpenWishlist,
  onOpenCart,
}: AccountModalProps) {
  const [nameInput, setNameInput] = useState('Aarav Mehta');
  const [emailInput, setEmailInput] = useState('aarav.mehta@auramax-client.in');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    onSignIn(nameInput.trim(), emailInput.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Client Account"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#F8F6F2] text-[#0F0F0E] p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-[#EAE5DC] transition-colors"
          aria-label="Close account window"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSignedIn ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-[#6E6A63] mb-1">
                Private Client Access
              </p>
              <h2 className="font-display text-3xl font-medium">
                Sign In to AURA MAX
              </h2>
            </div>

            <p className="text-sm text-[#6E6A63]">
              Personalize your storefront session and prefill your client details at checkout.
            </p>

            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-[#262421] transition-colors"
            >
              Continue to Client Profile
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-5 border-b border-[#0F0F0E]/10">
              <div className="w-12 h-12 bg-[#0F0F0E] text-[#F8F6F2] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-medium truncate">
                  {userName}
                </h2>
                <p className="text-xs text-[#6E6A63] truncate">{userEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
                className="p-4 bg-white border border-[#0F0F0E]/10 hover:border-[#0F0F0E] transition-colors text-left"
              >
                <Heart className="w-4 h-4 text-[#0F0F0E] mb-2" aria-hidden="true" />
                <span className="block font-display text-2xl font-medium tabular-nums">
                  {wishlistCount}
                </span>
                <span className="block text-[11px] tracking-[0.1em] uppercase text-[#6E6A63]">
                  Saved Wishlist
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="p-4 bg-white border border-[#0F0F0E]/10 hover:border-[#0F0F0E] transition-colors text-left"
              >
                <ShoppingBag className="w-4 h-4 text-[#0F0F0E] mb-2" aria-hidden="true" />
                <span className="block font-display text-2xl font-medium tabular-nums">
                  {cartCount}
                </span>
                <span className="block text-[11px] tracking-[0.1em] uppercase text-[#6E6A63]">
                  Items in Bag
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="w-full py-3 border border-[#0F0F0E]/25 text-xs tracking-[0.14em] uppercase font-medium hover:border-[#0F0F0E] flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
