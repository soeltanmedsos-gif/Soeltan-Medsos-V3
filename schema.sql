-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Soeltan Medsos E-Commerce System
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    sub_platform TEXT,
    name TEXT NOT NULL,
    description TEXT,
    price INT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster platform filtering
CREATE INDEX idx_products_platform ON products(platform);
CREATE INDEX idx_products_active ON products(is_active);

-- ============================================
-- 2. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id) ON DELETE SET NULL,
    purchase_code TEXT UNIQUE NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_name TEXT,
    target_link TEXT,
    quantity INT NOT NULL DEFAULT 1,
    amount INT NOT NULL,
    status_payment TEXT DEFAULT 'pending' CHECK (status_payment IN ('pending', 'waiting_payment', 'paid', 'deny', 'expire', 'refund')),
    status_seller TEXT DEFAULT 'pending' CHECK (status_seller IN ('pending', 'process', 'done')),
    snap_token TEXT,
    snap_redirect_url TEXT,
    midtrans_order_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX idx_orders_purchase_code ON orders(purchase_code);
CREATE INDEX idx_orders_status_payment ON orders(status_payment);
CREATE INDEX idx_orders_status_seller ON orders(status_seller);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 3. ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookup
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ============================================
-- 4. PAYMENT LOGS TABLE
-- ============================================
CREATE TABLE payment_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    transaction_id TEXT,
    transaction_status TEXT,
    payment_type TEXT,
    raw_webhook JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for order lookup
CREATE INDEX idx_payment_logs_order_id ON payment_logs(order_id);
CREATE INDEX idx_payment_logs_created_at ON payment_logs(created_at DESC);

-- ============================================
-- 5. SETTINGS TABLE (for app configuration)
-- ============================================
CREATE TABLE settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. TRIGGER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. DEFAULT DATA - ADMIN USER
-- Password: admin123 (bcrypt hash)
-- CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!
-- ============================================
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@soeltanmedsos.com', '$2b$10$VcysvHV2jzrvouWKX5m9eOS.oliTDQLbDcXRdclKo0A5fFDa/Vm1q', 'Super Admin', 'superadmin');

-- ============================================
-- 8. DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (key, value, description) VALUES
('admin_whatsapp', '082352835382', 'WhatsApp admin untuk konfirmasi pesanan'),
('company_name', 'Soeltan Medsos', 'Nama perusahaan'),
('midtrans_is_production', 'false', 'Mode produksi Midtrans (true/false)');

-- ============================================
-- 9. SAMPLE PRODUCTS (from service.json)
-- Import langsung dari service.json via backend
-- ============================================

-- TikTok Services
INSERT INTO products (platform, name, description, price) VALUES
('TikTok', 'Tiktok Share', '(MAX 100K)', 3),
('TikTok', 'Tiktok Share (Refil 7 Days)', '(MAX 100K)(Refil 7 Days)', 5),
('TikTok', 'Tiktok Share (INSTAN)', '(MAX 100K)(Refil 30 Days)(Non Drop)', 6),
('TikTok', 'Tiktok Coment Like', '(MAX 100K)(Super Fast)', 6),
('TikTok', 'Tiktok Rondom Coment', '(Start Time 1 - 4 Hour)', 26),
('TikTok', 'Tiktok Costume Coment', '(Kirim costume komen ke admin untuk di proses)', 40),
('TikTok', 'Tiktok Costume Coment Indoneisa', '(Kirim costume komen ke admin untuk di proses)', 380),
('TikTok', 'Tiktok Folowers Mix', '(MAX 200K)(7 Days Refil)', 50),
('TikTok', 'Tiktok Folowers Real Accounts (HQ)', '(MAX 300K)(15 Days Refil)', 55),
('TikTok', 'Tiktok Folowers HQ Accounts (Real)', '(MAX 300K)(30 Days Refil)', 70),
('TikTok', 'Tiktok Followers Indonesia', '(30 Days Refil)(500/day)(MAX 5K)', 99),
('TikTok', 'Tiktok Like Indonesia (HQ)', '(15k/Days)(No Refil)', 20),
('TikTok', 'Tiktok Like (SuperInstan)', '(7 Days Refil)', 2),
('TikTok', 'Tiktok Like (HQ & Real Profil)', '(30 Days Refil)(SuperInstan)', 3),
('TikTok', 'Tiktok Story Like', '(MAX 100K)(NO REFIL)', 12),
('TikTok', 'Tiktok Story View', '(MAX 100K)(NO REFIL)', 12),
('TikTok', 'Tiktok View Bonus Like', '(FAST)(NO REFIL)(RONDOM COUNTRY)(DROP 0-5%)', 6),
('TikTok', 'Tiktok View (FAST)', '(Instan Start)(Non Drop)(Unlimited)', 1);

-- TikTok Paket FYP
INSERT INTO products (platform, name, description, price) VALUES
('Tiktok Paket FYP', 'Tiktok FYP V1', 'PAKET FYP V1 (200.000 View)(100.000 Like)(10.000 Share)(1.000 Save/Favorit)', 98000),
('Tiktok Paket FYP', 'Tiktok FYP V2', 'PAKET FYP V2 (100.000 View)(50.000 Like)(5.000 Share)(500 Save/Favorit)', 50000),
('Tiktok Paket FYP', 'Tiktok FYP V3', 'PAKET FYP V3 (50.000 View)(10.000 Like)(3.000 Share)(3.000 Save/Favorit)', 30000);

-- Instagram Services
INSERT INTO products (platform, name, description, price) VALUES
('Instagram', 'Instagram Channel Member', '(Global)(MAX 1M)(HQ Real)(Instan)(No Refil)', 18),
('Instagram', 'Instagram Channel Member (Refil)', '(Global)(MAX 1M)(HQ Real)(Instan)(15 Days Refil)', 25),
('Instagram', 'Instagram Costume Coment', '(No Refil)(Slow)', 100),
('Instagram', 'Instagram Costume Coment Indonesia', '(No Refil)(HQ(Slow)', 330),
('Instagram', 'Instagram Followers Indonesia', '(Real Aktif)(Refil 7 Days)(MAX 3K)', 100),
('Instagram', 'Instagram Followers Less Drop', '(100k/Days)(Refil 14 Days)', 60),
('Instagram', 'Instagram Followers Less Drop (SuperFast)', '(100k/Days)(Refil 30 Days)', 90),
('Instagram', 'Instagram Like Indonesia (Fast)', '(Max 1k)(30 DayS Refil)', 15),
('Instagram', 'Instagram Like (HQ)', '(Fast)(Max 10k)(30 DayS Refil)', 8),
('Instagram', 'Instagram Like (LQ)', '(Slow)(Max 10k)(30 DayS Refil)', 5),
('Instagram', 'Instaram Reels View', '(MAX 1M)', 1),
('Instagram', 'Instaram Reels Like', '(MAX 1M)', 15),
('Instagram', 'Instagram Share', '(Speed 50k/Days)', 4),
('Instagram', 'Instagram Story View Indonesia', '(NO REFIL)', 5),
('Instagram', 'Instagram Story View (HQ)', '(All Story)(NO REFIL)', 3),
('Instagram', 'Instagram View', '(All Video Link)(No Refil)', 1),
('Instagram', 'Instagram View Live', '(Live Strem Video)(No Refil)', 200);

-- YouTube Services
INSERT INTO products (platform, name, description, price) VALUES
('YouTube', 'Youtube Like', '(Instan Start)(No Refil)(Max 1M)', 4),
('YouTube', 'Youtube Like (Refil 7 Days)', '(Instan Start)(Max 1M)', 5),
('YouTube', 'Youtube Like Short', '(No Refil)(Max 1M)', 25),
('YouTube', 'Youtube Like Short (Refil)', '(Max 1M)', 30),
('YouTube', 'Youtube Subscribers (High Drop)', '(No Komplain)(No Refil)', 25),
('YouTube', 'Youtube Subscribers (Refil 7 Days)', '(100 - 200/days)(MAX 10K)', 60),
('YouTube', 'Youtube View', '(99,9% Non Drop)(Direct+overdelivery)(max 25k/dats)', 32),
('YouTube', 'Youtube View Jam Tayang (15 min video)', '(Speed 100/Hours)(15 days refil)', 370),
('YouTube', 'Youtube View Jam Tayang (30 min video)', '(Speed 100/Hours)(15 days refil)', 480),
('YouTube', 'Youtube View Jam Tayang (60 min video)', '(Speed 100/Hours)(15 days refil)', 1300);

-- Facebook Services
INSERT INTO products (platform, name, description, price) VALUES
('Facebook', 'Facebook Followers Profile', '(No Refil)(100k/Days)', 20),
('Facebook', 'Facebook Followers Profile (Refil 7 Days)', '(100k/Days)', 26),
('Facebook', 'Facebook Group Member', '(MAX 10K)(NO REFIL)', 20),
('Facebook', 'Facebook Post Like', '(NO REFIL)(Real Profil)', 20),
('Facebook', 'Facebook Post Like (Refil 7 days)', '(Real Profil)', 24),
('Facebook', 'Facebook Post Share', '(Real Profil)(7 days refil)', 10);

-- WhatsApp Services
INSERT INTO products (platform, name, description, price) VALUES
('Whatsapp', 'Whatsapp Channel Post Reaction [ 👍 ]', '(Max 1K) (Instant)', 20),
('Whatsapp', 'Whatsapp Channel Post Reaction [ ❤️ ]', '(Max 1K) (Instant)', 20),
('Whatsapp', 'Whatsapp Channel Post Reaction [ 😂 ]', '(Max 1K) (Instant)', 20),
('Whatsapp', 'Whatsapp Channel Post Reaction [ Mix 👍❤️😂😲😥🙏 ]', '(Max 50K) (Instant)', 20),
('Whatsapp', 'Whatsapp Channel Member', '(Global)(Max 50K)(HQ Profiles)(500/days)', 36);

-- Telegram Services
INSERT INTO products (platform, name, description, price) VALUES
('Telegram', 'Telegram Channel Group/Member', '(Global)(Max 100K)(7 Days Refil)(25k/days)', 21),
('Telegram', 'Telegram Post View', '(Superfast)(Max 50m)(No Refil)', 21),
('Telegram', 'Telegram Positive Reaction (Mix + Views)', '(Max 200K)(10K/days)(No Refil)', 21),
('Telegram', 'Telegram Story View', '(HQ Services)(Max: 500K)(50K/days)(No Refil)', 21);

-- Google Maps Services
INSERT INTO products (platform, name, description, price) VALUES
('Google Maps', 'Rating Only', '(HQ Services)(Max: 500K)(50K/days)(No Refil)', 6000),
('Google Maps', 'Rating dan Ulasan', '(HQ Services)(Max: 500K)(50K/days)(No Refil)', 8500),
('Google Maps', 'Rating dan Foto', '(HQ Services)(Max: 500K)(50K/days)(No Refil)', 19000);

-- Aplikasi Premium
INSERT INTO products (platform, sub_platform, name, description, price) VALUES
('Aplikasi Premium', 'AI', 'AI YOU SHARING 1 BULAN', 'GARANSI 1 BULAN', 20000),
('Aplikasi Premium', 'Alight Motion', 'ALIGHT MOTION PRIVATE ANDROID 12 BULAN', 'garansi 3 bulan', 6000),
('Aplikasi Premium', 'VPN', 'AVIRA VPN PRIVATE 3 BULAN', 'GARANSI 3 BULAN', 10000),
('Aplikasi Premium', 'Bstation', 'BSTATION SHARING 1 BULAN', 'garansi 25 hari', 9000),
('Aplikasi Premium', 'Canva', 'CANVA EDUCATION LIFETIME', 'GARANSI 3 BULAN', 20000),
('Aplikasi Premium', 'Canva', 'CANVA PRO HEAD 1 BULAN INVITE MAX 100', 'GARANSI 1 BULAN', 50000),
('Aplikasi Premium', 'Canva', 'CANVA PRO MEMBER 1 BULAN', 'GARANSI 7 HARI', 20000),
('Aplikasi Premium', 'Capcut', 'CAPCUT PRO SHARING 30 HARI', 'GARANSI BF 7 HARI', 25000),
('Aplikasi Premium', 'ChatGPT', 'CHATGPT 1 SHARING 1 BULAN', 'GARANSI 7 HARI', 25000),
('Aplikasi Premium', 'ChatGPT', 'CHATGPT PRIVATE 90 HARI AKUN BUYER', 'GARANSI BF', 200000),
('Aplikasi Premium', 'ChatGPT', 'CHATGPT SHARING 90 HARI', 'GARANSI BF', 140000),
('Aplikasi Premium', 'VPN', 'CODE REDEEM VPN SURFSHARK 90 HARI', 'non garansi', 15000),
('Aplikasi Premium', 'Drakor ID', 'DRAKOR ID SHARING 12 BULAN', 'garansi 6 bulan', 15000),
('Aplikasi Premium', 'Gagaoolala', 'GAGAOOLALA SHARING 1 BULAN', 'garansi 25 hari', 9000),
('Aplikasi Premium', 'Ibis Paint', 'IBIS PAINT ANDROID 1 TAHUN', 'GARANSI 6 BULAN', 24000),
('Aplikasi Premium', 'Inshot', 'INSHOT SHARING LIFETIME', 'garansi 2 bulan', 16000),
('Aplikasi Premium', 'iQIYI', 'IQIYI SHARING 1 BULAN', 'garansi 25 hari', 10000),
('Aplikasi Premium', 'Lightroom', 'LIGHTROOM 1 TAHUN', 'GARANSI 6 BULAN', 18000),
('Aplikasi Premium', 'Meitu', 'MEITU 1 BULAN ANDROID', 'GARANSI 7 HARI', 24000),
('Aplikasi Premium', 'Mubi', 'MUBI PREMIUM PRIVATE 1 BULAN', 'garansi 10 hari', 9000),
('Aplikasi Premium', 'Netflix', 'NETFLIX SINGLE SCREEN 1 BULAN', 'garansi 25 hari', 40000),
('Aplikasi Premium', 'OldRoll', 'OLDROLL SHARING LIFETIME ANDROID', 'GARANSI 6 BULAN', 17000),
('Aplikasi Premium', 'Picsart', 'PICART PRIVAT 1 BULAN', 'GARANSI 7 HARI', 7000),
('Aplikasi Premium', 'Picsart', 'PICART SHARING 1 BULAN', 'GARANSI 7 HARI', 5000),
('Aplikasi Premium', 'Picsart', 'PICSART PRO PRIVATE 1 BULAN', 'GARANSI 1 BULAN', 9000),
('Aplikasi Premium', 'PhotoRoom', 'PHOTOROOM PRO PRIVATE 7 HARI', 'Non Garansi', 5000),
('Aplikasi Premium', 'Prime Video', 'PRIME VIDEO PRIVATE 1 BULAN', 'garansi 10 hari', 14000),
('Aplikasi Premium', 'ReelShort', 'REELSHORT SHARING 1 BULAN', 'garansi 25 hari S&K Berlaku', 18000),
('Aplikasi Premium', 'Remini', 'REMINI 1 TAHUN', 'GARANSI 6 BULAN', 20000),
('Aplikasi Premium', 'AI', 'SCITE AI PREMIUM PRIVATE 7 DAY', 'NON GARANSI', 5000),
('Aplikasi Premium', 'Viki', 'VIKI PASS STANDARD PRIVATE 7 HARI', 'garansi 10 hari', 19000),
('Aplikasi Premium', 'Viki', 'VIKI PASS STANDAR PRIVATE 1 BULAN', 'garansi 10 hari', 19000),
('Aplikasi Premium', 'Viu', 'VIU PREMIUM PRIVATE 12 BULAN', 'garansi 6 bulan', 6000),
('Aplikasi Premium', 'VSCO', 'VSCO SHARING 12 BULAN ANDROID', 'GARANSI 6 BULAN', 19000),
('Aplikasi Premium', 'VSCO', 'VSCO ANDROID 1 TAHUN', 'GARANSI 6 BULAN', 20000),
('Aplikasi Premium', 'Wink', 'WINK 1 BULAN PRIVAT', 'GARANSI 25 HARI', 25000),
('Aplikasi Premium', 'Wink', 'WINK 1 BULAN SHARING', 'GARANSI 25 HARI', 20000),
('Aplikasi Premium', 'Wink', 'WINK 7 HARI SHARING', 'GARANSI 7 HARI', 12000),
('Aplikasi Premium', 'Youku', 'YOUKU SHARING 1 BULAN', 'garansi 25 hari', 9000),
('Aplikasi Premium', 'YouTube', 'YOUTUBE PREMIUM 1 BULAN', 'garansi 25 hari', 14000);

-- ============================================
-- 10. ROW LEVEL SECURITY (Optional - for production)
-- ============================================
-- Uncomment these for production use with Supabase Auth

-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NOTES:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Change admin password after first login
-- 3. Configure RLS policies for production
-- ============================================
