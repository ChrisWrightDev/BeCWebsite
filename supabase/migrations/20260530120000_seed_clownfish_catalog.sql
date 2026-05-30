-- Seed Blue-Eyed Clowns shop catalog (9 tank-raised ocellaris morphs).
-- Images live in public/images/clownfish/ (Wikimedia Commons + Unsplash, see comments).
-- Run after 20260527120000_drop_clownfish_categories.sql if category columns still exist.

-- Replace existing catalog rows (order_items.clownfish_id uses ON DELETE SET NULL).
delete from public.clownfish;

insert into public.clownfish (name, description, price_cents, pattern, image_url, in_stock)
values
  (
    'Mocha Ocellaris',
    'A captive-bred color variant of Amphiprion ocellaris with a dusky brown-to-coffee body instead of bright orange, usually crossed from standard ocellaris and black-and-white Darwin lines. Classic three white bars remain with black edging; color deepens with age. Hardy, reef-safe, and peaceful—ideal for beginners.',
    900,
    'Ocellaris',
    '/images/clownfish/mocha-ocellaris.jpg',
    true
  ),
  (
    'Standard Ocellaris',
    'The classic false percula clownfish (Amphiprion ocellaris): bright orange body, three white bands narrowly outlined in black, and a hardy, reef-safe temperament. Captive-bred ocellaris are among the best starter marine fish and readily accept prepared foods and host anemones.',
    900,
    'Ocellaris',
    '/images/clownfish/standard-ocellaris.jpg',
    true
  ),
  (
    'DaVinci/Gladiator',
    'Designer ocellaris (also sold as Gladiator or Fancy clownfish) with flowing, irregular white markings instead of uniform stripes—connected bands, spots, swooshes, or smudgy “nebula” patterns. Also known as DaVinci in the hobby; no two fish are identical. Peaceful, captive-bred, and as easy to keep as wild-type ocellaris.',
    1400,
    'Designer',
    '/images/clownfish/davinci-gladiator.jpg',
    true
  ),
  (
    'Frostbite/Bullethole',
    'Premium designer ocellaris combining Frostbite and Bullethole traits: mostly white body outlined in black with orange on the face and fins. Frostbites develop a frosty blue inner hue as they mature; Bulletholes show distinctive round or broken white “bullet hole” markings. Patterns vary fish to fish.',
    1700,
    'Designer',
    '/images/clownfish/frostbite-bullethole.jpg',
    true
  ),
  (
    'Snowflakes',
    'Snowflake ocellaris display irregular, jagged white banding rather than clean stripes—the border between orange and white forms undulating, snowflake-like patterns. Each fish is unique. Captive-bred only, reef-safe, peaceful, and an excellent hardy choice for new reef keepers.',
    1300,
    'Snowflake',
    '/images/clownfish/snowflakes.jpg',
    true
  ),
  (
    'Snowstorm',
    'Snow Storm designer ocellaris inherit both Storm and Snowflake pattern genes: crisp white body, black fins, black eyes and lips, often with icy blue highlights along fin and lip edges. Created by crossing Black Storm and Black Snowflake lines. A striking, high-contrast show fish with standard ocellaris care.',
    3000,
    'Designer',
    '/images/clownfish/snowstorm.jpg',
    true
  ),
  (
    'Wyoming White',
    'An all-white ocellaris color morph with dark fins that turn jet black as the fish matures and an orange face that develops a bold black outline. A 100% ocellaris designer line (not percula). Uniform snowy white body; some individuals show a spot behind the gill plate. Hardy and reef-safe.',
    1300,
    'Designer',
    '/images/clownfish/wyoming-white.jpg',
    true
  ),
  (
    'Storms (Black, Mocha, Orange)',
    'Storm-line ocellaris with exaggerated, irregular white patterning over a dark base—available in Black Storm (deep charcoal/black), Mocha Storm (coffee-brown body with storm swirls), or Orange Storm variants. Each fish shows unique storm markings. Peaceful, captive-bred, and suitable for reef tanks with or without a host anemone.',
    1800,
    'Designer',
    '/images/clownfish/storms-black-mocha-orange.jpg',
    true
  ),
  (
    'Blue Ghost Storm',
    'Premium storm-line designer ocellaris with a pale, ghost-white body, storm-pattern genetics, and pronounced icy blue iridescence along fin edges, lips, and around the eyes—similar to the blue-tinged highlights seen on Snow Storm lines. A rare, high-end morph; hardy ocellaris temperament and reef-safe.',
    3500,
    'Designer',
    '/images/clownfish/blue-ghost-storm.jpg',
    true
  );

-- Image sources (for attribution / replacement):
-- standard-ocellaris.jpg  — Wikimedia Commons, File:Common_clownfish.jpg (GFDL)
-- mocha-ocellaris.jpg     — Wikimedia Commons, File:Clownfisch_(Amphiprion_ocellaris).jpg
-- davinci-gladiator.jpg   — Wikimedia Commons, File:A._percula.jpg (designer/Picasso-type reference)
-- snowflakes.jpg          — Wikimedia Commons, File:Amphiprion_percula_1.jpg (ocellaris aquarium photo)
-- frostbite-bullethole, snowstorm, wyoming-white, storms-black-mocha-orange, blue-ghost-storm
--                         — Unsplash (Unsplash License); replace with hatchery photos when available.
