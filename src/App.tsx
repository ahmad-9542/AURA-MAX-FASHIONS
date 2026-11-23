import { useEffect, useState } from 'react';
import { AccountModal } from './components/AccountModal';
import { BestSellersSection } from './components/BestSellersSection';
import { CampaignSection } from './components/CampaignSection';
import { CartDrawer } from './components/CartDrawer';
import { CategoryGrid } from './components/CategoryGrid';
import { CheckoutPage } from './components/CheckoutPage';
import { CinematicIntro } from './components/CinematicIntro';
import { CollectionsSection } from './components/CollectionsSection';
import { ContactPage } from './components/ContactPage';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import {
  AccessoriesShowcaseSection,
  FootwearShowcaseSection,
  NewArrivalsSection,
  RecommendedProductsSection,
  TrendingNowSection,
} from './components/HomepageSections';
import { NavDestination, Navbar } from './components/Navbar';
import { PolicyModal } from './components/PolicyModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ScrollReveal } from './components/ScrollReveal';
import { ShopAllPage } from './components/ShopAllPage';
import { Showroom3D } from './components/Showroom3D';
import { StyleSaleBanner } from './components/StyleSaleBanner';
import { TrustAndNewsletter } from './components/TrustAndNewsletter';
import { WishlistDrawer } from './components/WishlistDrawer';
import { PRODUCTS } from './data/catalog';
import {
  CartItem,
  CollectionName,
  ColorOption,
  Department,
  PolicyKey,
  Product,
  ProductSize,
  SortOption,
} from './types';

const CART_STORAGE_KEY = 'auramax_cart_v2';
const WISHLIST_STORAGE_KEY = 'auramax_wishlist_v2';

type AppView = 'home' | 'shop-all' | 'product-detail' | 'checkout' | 'contact';

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Array<{
        productId: string;
        size: ProductSize;
        colorName: string;
        quantity: number;
      }>;
      if (Array.isArray(parsed)) {
        const hydrated: CartItem[] = [];
        for (const entry of parsed) {
          const prod = PRODUCTS.find((p) => p.id === entry.productId);
          if (!prod || prod.stockStatus === 'Out of Stock') continue;
          const size = prod.sizes.includes(entry.size)
            ? entry.size
            : prod.sizes[0];
          const color =
            prod.colors.find((c) => c.name === entry.colorName) ??
            prod.colors[0];
          const qty = Math.max(1, Math.min(10, Number(entry.quantity) || 1));
          hydrated.push({
            key: `${prod.id}__${size}__${color.name}`,
            product: prod,
            size,
            color,
            quantity: qty,
          });
        }
        return hydrated;
      }
    }
  } catch {
    // ignore storage errors
  }
  const seedProduct = PRODUCTS[0];
  return [
    {
      key: `${seedProduct.id}__M__${seedProduct.colors[0].name}`,
      product: seedProduct,
      size: 'M',
      color: seedProduct.colors[0],
      quantity: 1,
    },
  ];
}

function loadInitialWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        const validIds = parsed.filter((id) =>
          PRODUCTS.some((p) => p.id === id)
        );
        return validIds;
      }
    }
  } catch {
    // ignore storage errors
  }
  return ['amx-wm-01', 'amx-fw-01', 'amx-ac-01'];
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  const [view, setView] = useState<AppView>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | 'All'
  >('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | 'All'
  >('All');
  const [selectedCollection, setSelectedCollection] = useState<
    CollectionName | 'All'
  >('All');
  const [onlySale, setOnlySale] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [wishlistIds, setWishlistIds] = useState<string[]>(loadInitialWishlist);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [previousView, setPreviousView] = useState<AppView>('home');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    try {
      const compact = cart.map((item) => ({
        productId: item.product.id,
        size: item.size,
        colorName: item.color.name,
        quantity: item.quantity,
      }));
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(compact));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistIds)
      );
    } catch {
      // ignore storage quota errors
    }
  }, [wishlistIds]);

  const openShopAll = (opts?: {
    department?: Department | 'All';
    subCategory?: string | 'All';
    collection?: CollectionName | 'All';
    saleOnly?: boolean;
    sortNewest?: boolean;
  }) => {
    setSelectedDepartment(opts?.department ?? 'All');
    setSelectedSubCategory(opts?.subCategory ?? 'All');
    setSelectedCollection(opts?.collection ?? 'All');
    setOnlySale(Boolean(opts?.saleOnly));
    setSortBy(opts?.sortNewest ? 'newest' : 'featured');
    setView('shop-all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (dest: NavDestination) => {
    if (dest === 'home') {
      setView('home');
      setSelectedDepartment('All');
      setSelectedSubCategory('All');
      setSelectedCollection('All');
      setOnlySale(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (dest === 'shop-all') {
      openShopAll({ department: 'All' });
      return;
    }
    if (dest === 'men') {
      openShopAll({ department: 'Men' });
      return;
    }
    if (dest === 'women') {
      openShopAll({ department: 'Women' });
      return;
    }
    if (dest === 'footwear') {
      openShopAll({ department: 'Footwear' });
      return;
    }
    if (dest === 'accessories') {
      openShopAll({ department: 'Accessories' });
      return;
    }
    if (dest === 'contact') {
      setView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (view !== 'product-detail') {
      setPreviousView(view);
    }
    setActiveProduct(product);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addItemToCartState = (
    product: Product,
    size: ProductSize,
    color: ColorOption,
    quantity: number
  ) => {
    if (product.stockStatus === 'Out of Stock') return;
    const key = `${product.id}__${size}__${color.name}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { key, product, size, color, quantity }];
    });
  };

  const handleAddToCart = (
    product: Product,
    size: ProductSize,
    color: ColorOption,
    quantity: number
  ) => {
    if (product.stockStatus === 'Out of Stock') return;
    addItemToCartState(product, size, color, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = (
    product: Product,
    size: ProductSize,
    color: ColorOption,
    quantity: number
  ) => {
    if (product.stockStatus === 'Out of Stock') return;
    addItemToCartState(product, size, color, quantity);
    setIsCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: Product, size?: ProductSize) => {
    if (product.stockStatus === 'Out of Stock') {
      handleSelectProduct(product);
      return;
    }
    const chosenSize =
      size ??
      (product.sizes.includes('M')
        ? 'M'
        : product.sizes.includes('UK 9')
          ? 'UK 9'
          : product.sizes[0]);
    const defaultColor = product.colors[0];
    handleAddToCart(product, chosenSize, defaultColor, 1);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleMoveWishlistToBag = (product: Product) => {
    if (product.stockStatus === 'Out of Stock') return;
    handleQuickAdd(product);
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
    setIsWishlistOpen(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const activeNavDestination: NavDestination =
    view === 'shop-all'
      ? selectedDepartment === 'Men'
        ? 'men'
        : selectedDepartment === 'Women'
          ? 'women'
          : selectedDepartment === 'Footwear'
            ? 'footwear'
            : selectedDepartment === 'Accessories'
              ? 'accessories'
              : 'shop-all'
      : view === 'contact'
        ? 'contact'
        : view === 'checkout'
          ? 'checkout'
          : view === 'product-detail'
            ? 'product-detail'
            : 'home';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#0F0F0E]">
      {!introDone && <CinematicIntro onComplete={() => setIntroDone(true)} />}
      <CustomCursor />

      <Navbar
        activeNav={activeNavDestination}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => {
          setView('shop-all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        isSignedIn={isSignedIn}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <main className="flex-1">
        {view === 'contact' && (
          <ContactPage onBackToStorefront={() => handleNavigate('home')} />
        )}

        {view === 'shop-all' && (
          <ShopAllPage
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedSubCategory={selectedSubCategory}
            onSubCategoryChange={setSelectedSubCategory}
            selectedCollection={selectedCollection}
            onCollectionChange={setSelectedCollection}
            onlySale={onlySale}
            onOnlySaleChange={setOnlySale}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            wishlistIds={wishlistIds}
            onSelectProduct={handleSelectProduct}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onBackToStorefront={() => handleNavigate('home')}
          />
        )}

        {view === 'product-detail' && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            isWishlisted={wishlistIds.includes(activeProduct.id)}
            wishlistIds={wishlistIds}
            onBack={() => {
              setView(
                previousView === 'product-detail' ? 'shop-all' : previousView
              );
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {view === 'checkout' && (
          <CheckoutPage
            items={cart}
            defaultName={userName}
            defaultEmail={userEmail}
            onBackToShopping={() => openShopAll({ department: 'All' })}
            onOpenCartDrawer={() => setIsCartOpen(true)}
          />
        )}

        {view === 'home' && (
          <>
            <HeroSection
              onShopCollection={() => openShopAll({ department: 'All' })}
              onShopMen={() => openShopAll({ department: 'Men' })}
              onShopWomen={() => openShopAll({ department: 'Women' })}
            />

            <Showroom3D
              onSelectProduct={handleSelectProduct}
              onQuickAdd={(product) => handleQuickAdd(product)}
            />

            <CategoryGrid
              onSelectDepartment={(dept, subCat) =>
                openShopAll({
                  department: dept,
                  subCategory: subCat ?? 'All',
                })
              }
              onOpenShopAll={() => openShopAll({ department: 'All' })}
            />

            <NewArrivalsSection
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onOpenShopAll={openShopAll}
            />

            <TrendingNowSection
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onOpenShopAll={openShopAll}
            />

            <CampaignSection
              onExploreCampaign={() =>
                openShopAll({ collection: 'Minimalist Classics' })
              }
            />

            <CollectionsSection
              onSelectCollection={(collection) =>
                openShopAll({ collection })
              }
            />

            <FootwearShowcaseSection
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onOpenShopAll={openShopAll}
            />

            <ScrollReveal>
              <StyleSaleBanner
                onShopSale={() => openShopAll({ saleOnly: true })}
              />
            </ScrollReveal>

            <BestSellersSection
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
            />

            <AccessoriesShowcaseSection
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onOpenShopAll={openShopAll}
            />

            <RecommendedProductsSection
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onOpenShopAll={openShopAll}
            />

            <ScrollReveal>
              <TrustAndNewsletter onOpenContact={() => handleNavigate('contact')} />
            </ScrollReveal>
          </>
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => handleNavigate('contact')}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreShopAll={() => openShopAll({ department: 'All' })}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        products={wishlistProducts}
        onClose={() => setIsWishlistOpen(false)}
        onMoveToBag={handleMoveWishlistToBag}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
      />

      <AccountModal
        isOpen={isAccountOpen}
        isSignedIn={isSignedIn}
        userName={userName}
        userEmail={userEmail}
        wishlistCount={wishlistIds.length}
        cartCount={cartCount}
        onClose={() => setIsAccountOpen(false)}
        onSignIn={(name, email) => {
          setUserName(name);
          setUserEmail(email);
          setIsSignedIn(true);
        }}
        onSignOut={() => {
          setIsSignedIn(false);
          setUserName('');
          setUserEmail('');
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <PolicyModal
        policyKey={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
}
