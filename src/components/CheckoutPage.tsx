import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Info,
  Landmark,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react';
import { BRAND_CONTACT } from '../data/catalog';
import { CartItem } from '../types';
import { formatINR } from '../utils/format';
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from './CartDrawer';
import { AuraMaxLogo } from './AuraMaxLogo';
import { SmartImage } from './SmartImage';

interface CheckoutPageProps {
  items: CartItem[];
  defaultName: string;
  defaultEmail: string;
  onBackToShopping: () => void;
  onOpenCartDrawer: () => void;
}

type PaymentOption =
  | 'UPI (GPay / PhonePe / Paytm)'
  | 'Credit / Debit Card'
  | 'Net Banking'
  | 'Cash on Delivery';

export function CheckoutPage({
  items,
  defaultName,
  defaultEmail,
  onBackToShopping,
  onOpenCartDrawer,
}: CheckoutPageProps) {
  const [fullName, setFullName] = useState(defaultName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(defaultEmail || '');

  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>(
    'UPI (GPay / PhonePe / Paytm)'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderPrepared, setOrderPrepared] = useState(false);

  const totalMrp = items.reduce(
    (sum, item) =>
      sum + Math.max(item.product.originalPrice, item.product.price) * item.quantity,
    0
  );
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalDiscount = Math.max(0, totalMrp - subtotal);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : STANDARD_SHIPPING_FEE;
  const finalTotal = subtotal + shippingCost;

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg('Your shopping bag is currently empty.');
      return;
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    if (cleanedPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^[0-9]{6}$/.test(pinCode.trim())) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !houseNo.trim() ||
      !street.trim() ||
      !city.trim() ||
      !stateName.trim()
    ) {
      setErrorMsg('Please complete all customer and delivery address fields.');
      return;
    }

    setOrderPrepared(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappSummary = encodeURIComponent(
    `Hello AURA MAX Concierge, I would like to place an order:\n` +
      items
        .map(
          (i) =>
            `• ${i.product.name} (${i.size}, ${i.color.name}) x${i.quantity} — ${formatINR(i.product.price * i.quantity)}`
        )
        .join('\n') +
      `\nTotal Payable: ${formatINR(finalTotal)}\nPayment Method: ${paymentMethod}\nCustomer: ${fullName} (${phone})\nAddress: ${houseNo}, ${street}, ${city}, ${stateName} - ${pinCode}`
  );

  return (
    <div className="bg-[#F8F6F2] text-[#0F0F0E] min-h-[75vh]">
      {/* Dark Architectural Header */}
      <div className="bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <button
              type="button"
              onClick={onBackToShopping}
              className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#C4C8CE] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Continue Shopping</span>
            </button>

            <button
              type="button"
              onClick={onOpenCartDrawer}
              className="text-xs tracking-[0.14em] uppercase text-[#C4C8CE] underline underline-offset-4 hover:text-white"
            >
              Edit Bag Items ({totalCount})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-2">
            <AuraMaxLogo size="sm" />
            <p className="text-xs tracking-[0.22em] uppercase text-[#C4C8CE]">
              {BRAND_CONTACT.tagline}
            </p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-white">
            Checkout &amp; Order Review
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        {items.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16 px-6 bg-white border border-[#0F0F0E]/12">
            <h2 className="font-display text-3xl text-[#0F0F0E] mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-sm text-[#6E6A63] mb-6">
              Select garments, footwear, or accessories from the AURA MAX catalog before proceeding to checkout.
            </p>
            <button
              type="button"
              onClick={onBackToShopping}
              className="px-7 py-3.5 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left 7 Cols: Customer Details, Delivery Address, Payment Method OR Honest Gateway Notice */}
            <div className="lg:col-span-7">
              {orderPrepared ? (
                <div className="bg-white border border-[#0F0F0E]/15 p-6 sm:p-10 space-y-6">
                  <div className="bg-[#0B0B0A] text-[#F8F6F2] px-5 py-3.5 flex items-center justify-between gap-4">
                    <AuraMaxLogo size="xs" />
                    <span className="text-[11px] tracking-[0.22em] uppercase text-[#C4C8CE]">
                      {BRAND_CONTACT.tagline}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 bg-[#EAE5DC] text-[#0F0F0E]">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <p className="font-semibold">
                        Order Details Validated · Live Payment Gateway Not Connected
                      </p>
                      <p className="text-[#262421] leading-relaxed">
                        Because AURA MAX is currently running as a storefront preview without a live merchant payment gateway (such as Razorpay or Stripe) or order database backend configured, <strong>no payment has been charged and no automated order has been submitted.</strong>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm border-b border-[#0F0F0E]/10 pb-6">
                    <h2 className="font-display text-2xl font-medium">
                      Prepared Dispatch Specification
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-[#F8F6F2] border border-[#0F0F0E]/10">
                        <span className="block uppercase tracking-[0.12em] text-[#6E6A63] mb-1">
                          Client
                        </span>
                        <span className="block font-semibold text-[#0F0F0E]">
                          {fullName}
                        </span>
                        <span className="block text-[#262421] mt-0.5 tabular-nums">
                          {phone}
                        </span>
                        <span className="block text-[#6E6A63] mt-0.5 break-all">
                          {email}
                        </span>
                      </div>

                      <div className="p-3.5 bg-[#F8F6F2] border border-[#0F0F0E]/10">
                        <span className="block uppercase tracking-[0.12em] text-[#6E6A63] mb-1">
                          Delivery Destination
                        </span>
                        <span className="block text-[#262421] leading-relaxed">
                          {houseNo}, {street}, {city}, {stateName} — PIN {pinCode}
                        </span>
                        <span className="block font-medium text-[#0F0F0E] mt-1">
                          Selected Method: {paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real Human Concierge Order Handoff */}
                  <div className="space-y-3">
                    <p className="text-xs text-[#6E6A63]">
                      To finalize this purchase directly with our Indian concierge team, send your validated bag summary via WhatsApp or Email:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`${BRAND_CONTACT.whatsappHref}?text=${whatsappSummary}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" aria-hidden="true" />
                        <span>Send Order via WhatsApp</span>
                      </a>

                      <a
                        href={`${BRAND_CONTACT.emailHref}?subject=${encodeURIComponent(`AURA MAX Order Request (${fullName})`)}&body=${whatsappSummary}`}
                        className="inline-flex items-center gap-2 px-5 py-3 border border-[#0F0F0E]/25 text-[#0F0F0E] text-xs tracking-[0.14em] uppercase font-semibold hover:border-[#0F0F0E] transition-colors"
                      >
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        <span>Email Order Summary</span>
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOrderPrepared(false)}
                    className="text-xs underline underline-offset-4 text-[#0F0F0E] hover:text-[#6E6A63]"
                  >
                    Edit Customer or Delivery Details
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-8">
                  {errorMsg && (
                    <div
                      role="alert"
                      className="p-4 bg-[#0B0B0A] text-[#F8F6F2] text-xs flex items-center gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-[#C4C8CE] shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Section 1: Customer Details */}
                  <div className="bg-white border border-[#0F0F0E]/12 p-6 sm:p-8 space-y-5">
                    <div>
                      <span className="text-[11px] tracking-[0.18em] uppercase text-[#6E6A63]">
                        Step 01
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#0F0F0E]">
                        Customer Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="chk-name"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          Full Name
                        </label>
                        <input
                          id="chk-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Aarav Mehta"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="chk-phone"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          Phone Number
                        </label>
                        <input
                          id="chk-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 95425 93036"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm tabular-nums focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="chk-email"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="chk-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@example.com"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Delivery Address */}
                  <div className="bg-white border border-[#0F0F0E]/12 p-6 sm:p-8 space-y-5">
                    <div>
                      <span className="text-[11px] tracking-[0.18em] uppercase text-[#6E6A63]">
                        Step 02
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#0F0F0E]">
                        Delivery Address
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="chk-house"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          House / Flat No.
                        </label>
                        <input
                          id="chk-house"
                          type="text"
                          required
                          value={houseNo}
                          onChange={(e) => setHouseNo(e.target.value)}
                          placeholder="Flat 402, Obsidian Tower"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="chk-street"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          Street / Locality
                        </label>
                        <input
                          id="chk-street"
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Banjara Hills Road No. 12"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="chk-city"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          City
                        </label>
                        <input
                          id="chk-city"
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Hyderabad"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="chk-state"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          State
                        </label>
                        <input
                          id="chk-state"
                          type="text"
                          required
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="Telangana"
                          className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="chk-pin"
                          className="block text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] mb-1.5"
                        >
                          PIN Code
                        </label>
                        <input
                          id="chk-pin"
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="500034"
                          className="w-full sm:w-56 px-3.5 py-2.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm tabular-nums focus:outline-none focus:border-[#0F0F0E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Payment Method */}
                  <div className="bg-white border border-[#0F0F0E]/12 p-6 sm:p-8 space-y-5">
                    <div>
                      <span className="text-[11px] tracking-[0.18em] uppercase text-[#6E6A63]">
                        Step 03
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#0F0F0E]">
                        Payment Method Selection
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          {
                            id: 'UPI (GPay / PhonePe / Paytm)',
                            sub: 'Instant QR / VPA verification',
                            icon: Smartphone,
                          },
                          {
                            id: 'Credit / Debit Card',
                            sub: 'Visa, Mastercard, RuPay, Amex',
                            icon: CreditCard,
                          },
                          {
                            id: 'Net Banking',
                            sub: 'All major Indian banks supported',
                            icon: Landmark,
                          },
                          {
                            id: 'Cash on Delivery',
                            sub: 'Zero convenience surcharge',
                            icon: Truck,
                          },
                        ] as const
                      ).map((opt) => {
                        const Icon = opt.icon;
                        const selected = paymentMethod === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`p-4 text-left border transition-colors flex items-start gap-3 ${
                              selected
                                ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E]'
                                : 'bg-[#F8F6F2] text-[#0F0F0E] border-[#0F0F0E]/15 hover:border-[#0F0F0E]'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <span className="block text-xs font-semibold">
                                {opt.id}
                              </span>
                              <span
                                className={`block text-[11px] mt-0.5 ${
                                  selected ? 'text-[#C4C8CE]' : 'text-[#6E6A63]'
                                }`}
                              >
                                {opt.sub}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.18em] uppercase font-semibold hover:bg-[#262421] transition-colors"
                    >
                      Validate &amp; Review Order · {formatINR(finalTotal)}
                    </button>

                    <p className="text-[11px] text-[#6E6A63] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        No payment is processed online until a live merchant payment gateway is connected.
                      </span>
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Right 5 Cols: Order Summary */}
            <aside className="lg:col-span-5 bg-white border border-[#0F0F0E]/12 overflow-hidden lg:sticky lg:top-24">
              <div className="bg-[#0B0B0A] text-[#F8F6F2] px-6 py-4 flex items-center justify-between">
                <AuraMaxLogo size="xs" />
                <span className="text-[11px] tracking-[0.16em] uppercase text-[#C4C8CE]">
                  {BRAND_CONTACT.tagline}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#0F0F0E]/10 pb-4">
                  <h2 className="font-display text-2xl font-medium">
                    Order Summary
                  </h2>
                  <span className="text-xs text-[#6E6A63] tabular-nums">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-3.5 pb-4 border-b border-[#0F0F0E]/10 last:border-b-0 last:pb-0"
                  >
                    <div className="w-16 h-20 bg-[#EAE5DC] shrink-0 overflow-hidden">
                      <SmartImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top"
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F0F0E] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#6E6A63] mt-0.5">
                        Size {item.size} · {item.color.name} · Qty {item.quantity}
                      </p>
                      <p className="text-xs font-semibold text-[#0F0F0E] mt-1.5 tabular-nums">
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#0F0F0E]/10 space-y-2.5 text-sm">
                <div className="flex justify-between text-[#6E6A63]">
                  <span>Original MRP</span>
                  <span className="tabular-nums text-[#0F0F0E]">
                    {formatINR(totalMrp)}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-[#262421]">
                    <span>Archive Discount</span>
                    <span className="tabular-nums font-medium">
                      − {formatINR(totalDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E6A63]">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#0F0F0E]">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E6A63]">
                  <span>Express Insured Shipping</span>
                  <span className="tabular-nums text-[#0F0F0E]">
                    {shippingCost === 0
                      ? 'Complimentary'
                      : formatINR(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-[#0F0F0E] pt-3 border-t border-[#0F0F0E]/15">
                  <span>Final Total (Incl. GST)</span>
                  <span className="tabular-nums">{formatINR(finalTotal)}</span>
                </div>
              </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
