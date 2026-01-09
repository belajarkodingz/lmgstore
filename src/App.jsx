import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Search,
  ShoppingBag,
  User,
  Flame,
  Crown,
  ShieldCheck,
  Youtube,
  Sparkles,
  MessageCircle,
  ArrowLeft,
  X,
  Copy,
  Check,
  Sun,
  Moon,
} from "lucide-react";

const TELEGRAM_USERNAME = "shellexec64decoder";

const currencyIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

const CATEGORIES = [
  { key: "all", label: "Semua", icon: Sparkles },
  { key: "google", label: "Google One", icon: ShieldCheck },
  { key: "chatgpt", label: "ChatGPT", icon: Crown },
  { key: "canva", label: "Canva", icon: Sparkles },
  { key: "youtube", label: "YouTube", icon: Youtube },
];

const PRODUCTS = [
  {
    id: "g1-2tb-1y",
    category: "google",
    title: "Google One 2TB",
    badge: "1 Tahun",
    price: 50000,
    period: "1 Tahun",
    desc: "Google One 2TB untuk Drive/Photos/Gmail. Cocok untuk backup file & foto.",
    features: ["2TB storage", "Backup aman", "Support admin"],
  },
  {
    id: "cgp-1y",
    category: "chatgpt",
    title: "ChatGPT Plus",
    badge: "1 Tahun",
    price: 50000,
    period: "1 Tahun",
    desc: "ChatGPT Plus paket 1 tahun. Proses cepat sesuai metode yang kamu sediakan.",
    features: ["Premium access", "Fast response", "Support admin"],
  },
  {
    id: "yt-1m",
    category: "youtube",
    title: "YouTube Premium",
    badge: "1 Bulan",
    price: 30000,
    period: "1 Bulan",
    desc: "YouTube Premium 1 bulan: bebas iklan + background play (tergantung paket/region).",
    features: ["No Ads", "Background play", "Support admin"],
  },
  {
    id: "canva-1m",
    category: "canva",
    title: "Canva Pro",
    badge: "1 Bulan",
    price: 30000,
    period: "1 Bulan",
    desc: "Canva Pro 1 bulan: template premium dan export lebih lengkap.",
    features: ["Template premium", "Brand kit", "Support admin"],
  },
];

function classNames(...v) {
  return v.filter(Boolean).join(" ");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function Toast({ show, text }) {
  if (!show) return null;
  return <div className="toast">{text}</div>;
}

function Pill({ active, children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={classNames("pill", active ? "pill--active" : "pill--idle")}
      type="button"
    >
      {Icon ? <Icon size={16} /> : null}
      <span>{children}</span>
    </button>
  );
}

function Header({ query, setQuery, theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="header__top">
        <div className="brand">
          <div className="brand__logo">LMG</div>
          <div className="brand__text">
            <div className="brand__title">LMG Store</div>
            <div className="brand__sub">Premium Accounts • Fast Delivery</div>
          </div>
        </div>

        <button className="chipIcon" type="button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="searchWrap">
        <Search size={18} />
        <input
          className="searchInput"
          placeholder="Cari produk…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query?.length ? (
          <button className="clearBtn" type="button" onClick={() => setQuery("")} aria-label="Clear search">
            <X size={16} />
          </button>
        ) : null}
      </div>
    </header>
  );
}

function Banner() {
  return (
    <section className="banner">
      <div className="banner__left">
        <div className="banner__tag">
          <Flame size={16} />
          <span>Order via Telegram</span>
        </div>
        <h2 className="banner__title">Akun Premium Murah</h2>
        <p className="banner__desc">
          Pilih produk lalu order ke Telegram <b>@{TELEGRAM_USERNAME}</b>.
        </p>
      </div>

      <div className="banner__right">
        <div className="banner__chip">Fast</div>
        <div className="banner__chip banner__chip--outline">Trusted</div>
      </div>
    </section>
  );
}

function ProductCard({ item, onOpen }) {
  return (
    <button className="product" onClick={() => onOpen(item)} type="button">
      <div className="product__top">
        <div className="product__badge">{item.badge}</div>
        <div className="product__icon">
          {item.category === "google" && <ShieldCheck size={18} />}
          {item.category === "chatgpt" && <Crown size={18} />}
          {item.category === "canva" && <Sparkles size={18} />}
          {item.category === "youtube" && <Youtube size={18} />}
        </div>
      </div>

      <div className="product__title">{item.title}</div>

      <div className="product__meta">
        <span className="muted">{item.period}</span>
        <span className="dot" />
        <span className="price">{currencyIDR(item.price)}</span>
      </div>

      <div className="product__cta">
        <span className="link">Detail</span>
        <ShoppingBag size={16} />
      </div>
    </button>
  );
}

function Modal({ open, onClose, item }) {
  const [copied, setCopied] = useState(false);

  const orderText = useMemo(() => {
    if (!item) return "";
    return (
      `Halo admin LMG Store (@${TELEGRAM_USERNAME}), saya mau order:\n\n` +
      `Produk: ${item.title}\n` +
      `Durasi: ${item.period}\n` +
      `Harga: ${currencyIDR(item.price)}\n\n` +
      `Tolong info cara prosesnya ya. Terima kasih.`
    );
  }, [item]);

  if (!open || !item) return null;

  const handleCopy = async () => {
    const ok = await copyText(orderText);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleOrder = async () => {
    await handleCopy();
    window.open(`https://t.me/${TELEGRAM_USERNAME}`, "_blank", "noreferrer");
  };

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <button className="iconBtn" onClick={onClose} type="button" aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <div className="modal__title">Detail Produk</div>
          <div style={{ width: 40 }} />
        </div>

        <div className="modal__body">
          <div className="detailTop">
            <div className="detailIcon">
              {item.category === "google" && <ShieldCheck size={22} />}
              {item.category === "chatgpt" && <Crown size={22} />}
              {item.category === "canva" && <Sparkles size={22} />}
              {item.category === "youtube" && <Youtube size={22} />}
            </div>

            <div className="detailInfo">
              <div className="detailTitle">{item.title}</div>
              <div className="detailMeta">
                <span className="detailBadge">{item.badge}</span>
                <span className="muted">{item.period}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardRow">
              <span className="muted">Harga</span>
              <span className="price">{currencyIDR(item.price)}</span>
            </div>

            <div className="divider" />

            <div className="cardRow">
              <span className="muted">Deskripsi</span>
            </div>
            <p className="para">{item.desc}</p>

            <div className="divider" />

            <div className="cardRow">
              <span className="muted">Fitur</span>
            </div>
            <ul className="list">
              {item.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="note">
            <div className="note__title">Pesan Order</div>
            <pre className="orderText">{orderText}</pre>
          </div>
        </div>

        <div className="modal__foot">
          <button className="btn btn--ghost" type="button" onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? "Tercopy" : "Copy pesan"}</span>
          </button>

          <button className="btn btn--primary" type="button" onClick={handleOrder}>
            <MessageCircle size={18} />
            <span>Order Telegram</span>
          </button>
        </div>

        <div className="modal__hint">
          Setelah kebuka Telegram: masuk chat <b>@{TELEGRAM_USERNAME}</b> lalu <b>paste</b> dan kirim.
        </div>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab, onDev }) {
  const items = [
    { key: "home", label: "Beranda", icon: Home },
    { key: "promo", label: "Promo", icon: Flame },
    { key: "orders", label: "Pesanan", icon: ShoppingBag },
    { key: "profile", label: "Akun", icon: User },
  ];

  return (
    <nav className="bottomNav">
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.key;
        const isHome = it.key === "home";

        return (
          <button
            key={it.key}
            className={classNames("navItem", active && "navItem--active")}
            onClick={() => {
              if (isHome) {
                setTab("home");
              } else {
                onDev();
                setTab(it.key);
              }
            }}
            type="button"
          >
            <Icon size={20} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [activeCat, setActiveCat] = useState("all");
  const [tab, setTab] = useState("home");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byCat = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat);
    if (!q) return byCat;
    return byCat.filter((p) => (p.title + " " + p.badge + " " + p.period).toLowerCase().includes(q));
  }, [activeCat, query]);

  const openDetail = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const showDevToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="shell">
      <div className="content">
        <Header
          query={query}
          setQuery={setQuery}
          theme={theme}
          toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        <Banner />

        <section className="section">
          <div className="section__head">
            <h3>Kategori</h3>
            <span className="mutedSmall">Pilih layanan</span>
          </div>

          <div className="pills">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Pill
                  key={c.key}
                  active={activeCat === c.key}
                  onClick={() => setActiveCat(c.key)}
                  icon={Icon}
                >
                  {c.label}
                </Pill>
              );
            })}
          </div>
        </section>

        <section className="section" id="catalog">
          <div className="section__head">
            <h3>Produk</h3>
            <span className="mutedSmall">{filtered.length} item</span>
          </div>

          <div className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} item={p} onOpen={openDetail} />
            ))}
          </div>
        </section>

        <div className="spacer" />
      </div>

      <BottomNav tab={tab} setTab={setTab} onDev={showDevToast} />

      <Modal open={open} onClose={() => setOpen(false)} item={selected} />
      <Toast show={toast} text="🚧 Fitur sedang dalam pengembangan" />
    </div>
  );
}