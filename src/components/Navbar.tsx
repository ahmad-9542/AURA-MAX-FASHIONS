import { FormEvent, useState } from 'react';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { AuraMaxLogo } from './AuraMaxLogo';

export type NavDestination =
  | 'home'
  | 'shop-all'
  | 'men'
  | 'women'
  | 'footwear'
  | 'accessories'
  | 'contact'
  | 'product-detail'
  | 'checkout';

interface NavbarProps {
  activeNav: NavDestination;
  onNavigate: (dest: NavDestination) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  cartCount: number;
  wishlistCount: number;
  isSignedIn: boolean;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

const NAV_ITEMS: { id: NavDestination; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'shop-all', label: 'Shop All' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({
  activeNav,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  wishlistCount,
  isSignedIn,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
}: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10">
      {/* Slim ivory announcement strip */}
      <div className="bg-[#F8F6F2] text-[#0B0B0A] text-[11px] tracking-[0.14em] uppercase py-1.5 px-4 text-center border-b border-[#0B0B0A]/10">
        <span className="whitespace-nowrap">
          Complimentary Express Shipping Above ₹4,999
        </span>
        <span
          className="hidden sm:inline mx-2.5 text-[#0B0B0A]/35"
          aria-hidden="true"
        >
          ·
        </span>
        <span className="hidden sm:inline whitespace-nowrap">
          30-Day Effortless Returns
        </span>
      </div>

      {/* Main 3-zone obsidian navigation row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between gap-4 lg:gap-6">
        {/* Mobile menu button + Clickable Official Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 text-[#F8F6F2] hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('home');
            }}
            aria-label="AURA MAX Home"
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <AuraMaxLogo size="nav" interactive />
          </button>
        </div>

        {/* Center Navigation Links (desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] tracking-[0.06em]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#C4C8CE] hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#F8F6F2] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            className="inline-flex items-center justify-center w-10 h-10 text-[#F8F6F2] hover:bg-white/10 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Search catalog"
            aria-expanded={searchOpen}
          >
            <Search className="w-[18px] h-[18px] stroke-[1.6]" />
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative inline-flex items-center justify-center w-10 h-10 text-[#F8F6F2] hover:bg-white/10 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={`Open wishlist (${wishlistCount} saved items)`}
          >
            <Heart className="w-[18px] h-[18px] stroke-[1.6]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 bg-[#F8F6F2] text-[#0B0B0A] text-[10px] font-semibold tabular-nums flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            className="relative inline-flex items-center justify-center w-10 h-10 text-[#F8F6F2] hover:bg-white/10 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={
              isSignedIn ? 'Open client account' : 'Sign in to client account'
            }
          >
            <User className="w-[18px] h-[18px] stroke-[1.6]" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 h-10 px-2.5 sm:px-3 text-[#F8F6F2] hover:bg-white/10 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={`Open shopping bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.6]" />
            <span className="text-xs font-medium tabular-nums whitespace-nowrap">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#141413] px-4 sm:px-8 lg:px-12 py-3.5">
          <form
            onSubmit={handleSearchFormSubmit}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <Search
              className="w-4 h-4 text-[#C4C8CE] shrink-0"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search blazers, kurtis, sneakers, watches, sunglasses..."
              autoFocus
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#C4C8CE]/70 py-1.5 border-b border-white/25 focus:border-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-xs text-[#C4C8CE] hover:text-white px-2 py-1 whitespace-nowrap"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#F8F6F2] text-[#0B0B0A] text-xs tracking-[0.12em] uppercase font-semibold hover:bg-white transition-colors whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-white/10 bg-[#0B0B0A] px-6 py-5 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 text-sm tracking-[0.06em] border-b border-white/10 flex items-center justify-between ${
                  isActive ? 'text-white font-semibold' : 'text-[#C4C8CE]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
