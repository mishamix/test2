/*
  # Create properties and inquiries tables

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (jsonb, multilingual titles)
      - `description` (jsonb, multilingual descriptions)
      - `price` (numeric)
      - `currency` (text, default 'USD')
      - `location` (text)
      - `address` (text)
      - `property_type` (text: house/apartment/villa/penthouse)
      - `status` (text: available/sold/reserved)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `area_size` (numeric, sq ft)
      - `features` (jsonb, array of features)
      - `images` (jsonb, array of image URLs)
      - `video_url` (text)
      - `is_featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `property_inquiries`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `preferred_contact` (text: email/whatsapp/telegram)
      - `status` (text: new/read/replied)
      - `created_at` (timestamp)
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Properties: public read, authenticated admin write
    - Inquiries: authenticated admin only
    - Admin users: authenticated admin only

  3. Indexes
    - properties: property_type, status, is_featured
    - property_inquiries: property_id, status
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{}',
  description jsonb NOT NULL DEFAULT '{}',
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  location text NOT NULL,
  address text,
  property_type text NOT NULL DEFAULT 'house',
  status text NOT NULL DEFAULT 'available',
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area_size numeric DEFAULT 0,
  features jsonb DEFAULT '[]',
  images jsonb DEFAULT '[]',
  video_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_inquiries table
CREATE TABLE IF NOT EXISTS property_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  preferred_contact text DEFAULT 'email',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Public can view available properties"
  ON properties FOR SELECT
  TO public
  USING (status = 'available');

CREATE POLICY "Authenticated users can manage properties"
  ON properties FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Property inquiries policies
CREATE POLICY "Authenticated users can manage inquiries"
  ON property_inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can insert inquiries"
  ON property_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Admin users policies
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON property_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON property_inquiries(status);

-- Insert sample properties
INSERT INTO properties (title, description, price, currency, location, address, property_type, status, bedrooms, bathrooms, area_size, features, images, is_featured) VALUES
(
  '{"en": "Modern Luxury Villa with Sea View", "uk": "Сучасна розкішна вілла з видом на море", "ru": "Современная роскошная вилла с видом на море", "fr": "Villa moderne de luxe avec vue sur la mer", "ar": "فيلا عصرية فاخرة بإطلالة بحرية"}',
  '{"en": "Stunning contemporary villa featuring floor-to-ceiling windows, infinity pool, smart home automation, and breathtaking ocean views. This architectural masterpiece offers the ultimate in luxury living.", "uk": "Потрясаюча сучасна вілла з вікнами від підлоги до стелі, басейном без країв, системою розумного будинку та приголомшливим видом на океан.", "ru": "Потрясающая современная вилла с окнами от пола до потолка, бесконечным бассейном, системой умного дома и захватывающим видом на океан.", "fr": "Villa contemporaine spectaculaire avec fenêtres du sol au plafond, piscine à débordement, domotique et vue imprenable sur l océan.", "ar": "فيلا معاصرة مذهلة تتميز بنوافذ من الأرض إلى السقف ومسبح لا نهائي ونظام المنزل الذكي وإطلالة خلابة على المحيط."}',
  4500000,
  'USD',
  'Dubai Marina, UAE',
  'Marina Promenade, Tower 1',
  'villa',
  'available',
  5,
  6,
  8500,
  '["Swimming Pool", "Smart Home", "Gym", "Private Garden", "Covered Parking", "Sea View", "Central A/C", "Maid Room"]',
  '["https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]',
  true
),
(
  '{"en": "Penthouse Suite in Downtown", "uk": "Пентхаус у даунтауні", "ru": "Пентхаус в центре города", "fr": "Suite Penthouse au centre-ville", "ar": "جناح بنتهاوس في وسط المدينة"}',
  '{"en": "Iconic penthouse on the 50th floor with wraparound terrace, private elevator, bespoke Italian finishes, and panoramic city skyline views. Premium location in the heart of downtown.", "uk": "Іконний пентхаус на 50-му поверсі з панорамною терасою, приватним ліфтом, італійським оздобленням та панорамним видом на місто.", "ru": "Иконический пентхаус на 50-м этаже с панорамной террасой, частным лифтом, итальянской отделкой и панорамным видом на городской пейзаж.", "fr": "Penthouse emblématique au 50ème étage avec terrasse panoramique, ascenseur privé, finitions italiennes sur mesure et vue panoramique sur la ville.", "ar": "بنتهاوس أيقوني في الطابق الخمسين مع شرفة محيطة ومصعد خاص وتشطيبات إيطالية فاخرة وإطلالة بانورامية على أفق المدينة."}',
  3200000,
  'USD',
  'Downtown Dubai, UAE',
  'Burj Khalifa Tower',
  'penthouse',
  'available',
  4,
  4,
  5200,
  '["Private Elevator", "Panoramic View", "Terrace", "Jacuzzi", "Wine Cellar", "Smart Home", "Concierge"]',
  '["https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]',
  true
),
(
  '{"en": "Contemporary Beach House", "uk": "Сучасний будинок на березі моря", "ru": "Современный дом на пляже", "fr": "Maison de plage contemporaine", "ar": "منزل شاطئي عصري"}',
  '{"en": "Direct beach access from this stunning modern beach house featuring open-plan living, chef kitchen, infinity pool, and private deck. Perfect for coastal luxury living.", "uk": "Прямий доступ до пляжу з цього приголомшливого сучасного будинку з відкритим планом, кухнею шеф-кухаря, басейном та приватною терасою.", "ru": "Прямой выход на пляж из этого потрясающего современного дома с открытой планировкой, кухней шеф-повара, бассейном и приватной террасой.", "fr": "Accès direct à la plage depuis cette magnifique maison contemporaine avec salon à aire ouverte, cuisine de chef, piscine à débordement et terrasse privée.", "ar": "وصول مباشر للشاطئ من هذا المنزل الشاطئي العصري المذهل الذي يتميز بمعيشة مفتوحة ومطبخ احترافي ومسبح لا نهائي وتراس خاص."}',
  2800000,
  'USD',
  'Palm Jumeirah, UAE',
  'Palm Jumeirah Frond M',
  'house',
  'available',
  4,
  5,
  6800,
  '["Beach Access", "Infinity Pool", "Private Deck", "Chef Kitchen", "Outdoor BBQ", "Boat Dock"]',
  '["https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]',
  true
),
(
  '{"en": "Luxury Apartment with Burj View", "uk": "Розкішна квартира з видом на Бурдж", "ru": "Роскошная квартира с видом на Бурдж", "fr": "Appartement de luxe avec vue Burj", "ar": "شقة فاخرة بإطلالة على برج خليفة"}',
  '{"en": "Elegant high-floor apartment with stunning views of Burj Khalifa, premium finishes throughout, gourmet kitchen, and world-class amenities including spa and infinity pool.", "uk": "Елегантна квартира на високому поверсі з приголомшливим видом на Бурдж-Халіфу, преміальне оздоблення, кухнею гурман та світовими зручностями.", "ru": "Элегантная квартира на высоком этаже с потрясающим видом на Бурдж-Халифу, премиальной отделкой, кухней гурман и мировыми удобствами.", "fr": "Appartement élégant en étage élevé avec vue imprenable sur Burj Khalifa, finitions haut de gamme, cuisine gastronomique et équipements de classe mondiale.", "ar": "شقة أنيقة في طابق مرتفع بإطلالة مذهلة على برج خليفة مع تشطيبات فاخرة ومطبخ راق ومرافق عالمية المستوى."}',
  1850000,
  'USD',
  'Downtown Dubai, UAE',
  'The Address Sky View',
  'apartment',
  'available',
  3,
  3,
  2800,
  '["Burj Khalifa View", "Spa Access", "Infinity Pool", "Gym", "Concierge", "Valet Parking"]',
  '["https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]',
  true
),
(
  '{"en": "Desert Oasis Estate", "uk": "Оазисна садиба в пустелі", "ru": "Оазисное поместье в пустыне", "fr": "Domaine Oasis du Désert", "ar": "عقار واحة الصحراء"}',
  '{"en": "Unique desert estate on 2 acres featuring traditional Arabian architecture, multiple courtyards, private oasis with pool, outdoor entertaining areas, and stunning desert landscape.", "uk": "Унікальна садиба на 2 акрах з традиційною арабською архітектурою, внутрішніми дворами, приватним оазисом з басейном та приголомшливим ландшафтом пустелі.", "ru": "Уникальное поместье на 2 акрах с традиционной арабской архитектурой, внутренними дворами, частным оазисом с бассейном и потрясающим ландшафтом пустыни.", "fr": "Domaine unique sur 2 hectares avec architecture arabe traditionnelle, plusieurs patios, oasis privée avec piscine et superbe paysage désertique.", "ar": "عقار صحراوي فريد على مساحة فدانين يتميز بالعمارة العربية التقليدية وعدة أفنية داخلية وواحة خاصة مع مسبح ومناطق ترفيه خارجية ومناظر صحراوية خلابة."}',
  5200000,
  'USD',
  'Al Barari, UAE',
  'Al Barari Estate',
  'villa',
  'available',
  6,
  7,
  12000,
  '["Private Pool", "Multiple Courtyards", "Desert Garden", "Outdoor Kitchen", "Staff Quarters", "Stables"]',
  '["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]',
  false
),
(
  '{"en": "Modern Studio Loft", "uk": "Сучасна студія лофт", "ru": "Современная студия-лофт", "fr": "Loft Studio Moderne", "ar": "استوديو لوفت عصري"}',
  '{"en": "Chic urban studio with industrial design elements, floor-to-ceiling windows, exposed brick, and modern finishes. Ideal for young professionals seeking city-center living.", "uk": "Шикарна міська студія з індустріальним дизайном, вікнами від підлоги до стелі, відкритою цеглою та сучасним оздобленням.", "ru": "Шикарная городская студия с индустриальным дизайном, окнами от пола до потолка, открытой кирпичной кладкой и современной отделкой.", "fr": "Studio urbain chic avec éléments de design industriel, fenêtres du sol au plafond, briques apparentes et finitions modernes.", "ar": "استوديو حضري أنيق بعناصر تصميم صناعي ونوافذ من الأرض إلى السقف وطوب مكشوف وتشطيبات عصرية."}',
  480000,
  'USD',
  'JBR Walk, Dubai',
  'JBR Murjan Tower',
  'apartment',
  'available',
  1,
  1,
  850,
  '["Sea View", "Walk-in Closet", "Smart Home", "Gym Access", "Pool Access"]',
  '["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]',
  false
);