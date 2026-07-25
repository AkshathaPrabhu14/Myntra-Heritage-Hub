const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const passportRoutes = require('./routes/passportRoutes');
const Product = require('./models/Product');

// Load env configuration
dotenv.config();

// Sample heritage products seed data
const seedProducts = [
  {
    name: "Hand-spun Kashmiri Pashmina Shawl",
    description: "Authentic hand-woven Pashmina shawl made from ultra-fine cashmere wool sourced from Ladakh. Features delicate hand embroidery by master weavers.",
    price: 8500, discount: 15,
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1601244005535-a48f21917443?w=800&auto=format&fit=crop&q=80"],
    state: "jammu & kashmir", craft: "Pashmina Weaving", category: "Accessories", material: "Cashmere Wool",
    rating: 4.8, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Ghulam Ahmad Dar", giRegistryNumber: "GI/JK/2013/543",
    story: "Each Pashmina shawl is hand-spun from the ultra-fine undercoat of the Changthangi goat, found only at altitudes above 14,000 feet in Ladakh. The craft has been passed down through five generations of the Dar family, who use ancient ring-test methods to verify authenticity — a genuine Pashmina can pass through a finger ring.",
    history: "Pashmina weaving dates back to the 15th century when Sultan Zain-ul-Abidin invited Central Asian weavers to the Valley. The word 'Pashmina' derives from the Persian 'Pashm' meaning soft gold.",
    preparationProcess: "Raw Pashm fibre is hand-cleaned, de-haired, hand-spun on a wooden spinning wheel (Yinder), then woven on a traditional handloom over 3-4 days per shawl.",
    craftingTime: "3-4 weeks", careInstructions: "Dry clean only. Store in muslin cloth with lavender sachets. Avoid direct sunlight.",
    authenticityDetails: "GI certified by Government of India. Each piece comes with a tamper-proof QR code label from the Craft Development Institute, Srinagar.",
    giCertificateInfo: "Registered under Geographical Indications of Goods Act, 1999. Certificate No. 543.",
    rawMaterials: "100% Changthangi Cashmere Fibre, Natural Vegetable Dyes",
    artisanCommunity: "Kashmir Pashmina Weavers Cooperative, Srinagar",
    sizes: ["Free Size"], stock: 8,
    reviews: [{ userName: "Priya M.", rating: 5, comment: "Absolutely exquisite quality. The softness is unreal." }]
  },
  {
    name: "Pure Mysore Silk Zari Saree",
    description: "Royal pure crepe silk saree with authentic 24k gold plated zari border, handloom woven in the historic looms of Mysore.",
    price: 12500, discount: 10,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"],
    state: "karnataka", craft: "Mysore Silk", category: "Traditional Wear", material: "Crepe Silk",
    rating: 4.9, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Venkatesh Iyer", giRegistryNumber: "GI/KA/2005/014",
    story: "Mysore Silk sarees have adorned royalty since the days of the Wodeyar dynasty. Each saree is handloom woven with 24-karat gold zari threads, a tradition preserved by the Karnataka Silk Industries Corporation.",
    history: "Tipu Sultan established the first silk reeling unit in 1785. The modern KSIC was founded in 1912 under the patronage of the Maharaja of Mysore.",
    preparationProcess: "Pure mulberry silk threads are degummed, dyed with certified colors, and then woven on traditional pit looms with real gold-plated silver zari for borders and pallav.",
    craftingTime: "2-3 weeks", careInstructions: "Dry clean recommended. Store folded in muslin cloth. Iron on low heat with a pressing cloth.",
    authenticityDetails: "KSIC certified with hologram tag. Each saree carries a unique serial number verifiable on the KSIC website.",
    giCertificateInfo: "GI Tag No. 14, registered under Geographical Indications Act, 1999.",
    rawMaterials: "Pure Mulberry Silk, 24k Gold-Plated Silver Zari, Certified Dyes",
    artisanCommunity: "Mysore Silk Weavers Cooperative Society",
    sizes: ["Free Size"], stock: 12,
    reviews: [{ userName: "Lakshmi R.", rating: 5, comment: "The gold zari is stunning. Perfect for my daughter's wedding." }]
  },
  {
    name: "Jaipur Blue Pottery Glazed Vase",
    description: "Exquisite hand-painted ceramic pottery flower vase featuring classic royal cobalt blue floral designs from Jaipur.",
    price: 1899, discount: 20,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80"],
    state: "rajasthan", craft: "Blue Pottery", category: "Home Decor", material: "Ceramic Clay",
    rating: 4.6, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Gopal Saini", giRegistryNumber: "GI/RJ/2008/276",
    story: "Jaipur Blue Pottery is distinguished by the use of Egyptian paste — a mixture of quartz stone powder, glass, and multani mitti. The cobalt oxide gives it the signature deep blue. This vase was hand-shaped without a potter's wheel.",
    history: "Introduced to Jaipur in the early 17th century by Mughal artisans, Blue Pottery is a fusion of Turko-Persian and Rajasthani craft traditions.",
    preparationProcess: "Quartz and glass powders are mixed with gum to form dough, shaped by hand, sun-dried for 3 days, hand-painted with cobalt oxide designs, glazed, and kiln-fired at 800°C.",
    craftingTime: "1-2 weeks", careInstructions: "Hand wash gently. Not microwave or oven safe. Display away from high-traffic areas.",
    authenticityDetails: "Each piece is signed by the artisan on the base. Accompanied by a Rajasthan Handicrafts Board certificate.",
    giCertificateInfo: "GI Tag No. 276, registered 2008.",
    rawMaterials: "Quartz Stone Powder, Raw Glaze, Cobalt Oxide, Multani Mitti, Gum Katira",
    artisanCommunity: "Jaipur Blue Pottery Art Centre, Jaipur",
    sizes: ["Standard"], stock: 15,
    reviews: [{ userName: "Ananya K.", rating: 5, comment: "Beautiful centerpiece for my dining table. The blue is mesmerizing." }]
  },
  {
    name: "Channapatna Wooden Toy Horse",
    description: "Traditional wooden rocking toy painted with natural organic vegetable dyes, completely safe and handcrafted in Channapatna.",
    price: 999, discount: 5,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80"],
    state: "karnataka", craft: "Channapatna Toys", category: "Handicrafts", material: "Ivory Wood",
    rating: 4.5, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Ramesh Babu", giRegistryNumber: "GI/KA/2005/015",
    story: "Channapatna toys date back to the reign of Tipu Sultan, who invited Persian artisans to train local craftsmen. Today, these lathe-turned ivory-wood toys are painted with vegetable dyes, making them completely safe for children.",
    history: "Over 200 years old, this craft was revived in the 1970s through a UNIDO-Government of India collaboration with Japanese toy experts.",
    preparationProcess: "Ivory wood (Wrightia tinctoria) is seasoned for 6 months, then lathe-turned into shapes, sanded smooth, painted with lac and vegetable dyes, and finished with shellac polish.",
    craftingTime: "3-5 days", careInstructions: "Wipe with a dry cloth. Keep away from water. Safe for children above 3 years.",
    authenticityDetails: "CHANNAPATNA GI tag certified. Each toy carries the CRDT (Channapatna Rural Development Trust) label.",
    giCertificateInfo: "GI Tag No. 15, registered 2005.",
    rawMaterials: "Ivory Wood (Wrightia Tinctoria), Natural Lac Dyes, Shellac",
    artisanCommunity: "Channapatna Toy Artisans Association",
    sizes: ["Standard"], stock: 30,
    reviews: [{ userName: "Deepak S.", rating: 4, comment: "Lovely traditional toy. My daughter adores it." }]
  },
  {
    name: "Kanchipuram Brocade Bridal Saree",
    description: "Intricately hand-woven heavy silk saree with grand temple borders and gold-zari thread embroidery from Tamil Nadu.",
    price: 18500, discount: 12,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80"],
    state: "tamil nadu", craft: "Kanchipuram Silk", category: "Traditional Wear", material: "Mulberry Silk",
    rating: 4.9, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Sundaram Pillai", giRegistryNumber: "GI/TN/2005/022",
    story: "Kanchipuram sarees are considered the queen of all sarees. The body and border are woven separately using a three-shuttle technique, then interlocked — a skill mastered by the Devanga community over 400 years.",
    history: "Legend credits the sage Markanda as the master weaver who wove fabric from lotus fibre. Historical records show Kanchipuram weaving flourishing under the Pallava dynasty (3rd-9th century).",
    preparationProcess: "Pure mulberry silk is twisted, starched, dyed, and then woven on a traditional pit loom using the korvai technique to interlock body and border.",
    craftingTime: "15-45 days", careInstructions: "Dry clean only. Store in muslin with silica gel sachets. Refold periodically to prevent permanent creases.",
    authenticityDetails: "Silk Mark certified by the Central Silk Board of India. Each saree has a GST-embossed hologram.",
    giCertificateInfo: "GI Tag No. 22, registered 2005.",
    rawMaterials: "Pure Mulberry Silk, Real Gold Zari, Silver Threads, Natural Dyes",
    artisanCommunity: "Kanchipuram Handloom Weavers Cooperative Society",
    sizes: ["Free Size"], stock: 6,
    reviews: [{ userName: "Meena T.", rating: 5, comment: "Heirloom quality. The temple border detailing is breathtaking." }]
  },
  {
    name: "Tanjore Gold Leaf Ganesha Painting",
    description: "Classic devotional Tanjore painting embossed with real 22k gold leaf sheets and semi-precious Jaipur gemstones, framed in teak wood.",
    price: 9500, discount: 10,
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=80"],
    state: "tamil nadu", craft: "Tanjore Paintings", category: "Artifacts", material: "Teak Wood Frame",
    rating: 4.7, isGITagged: true, isEcoFriendly: false, availability: "In Stock",
    artisanName: "S. Rajendran", giRegistryNumber: "GI/TN/2007/102",
    story: "Tanjore paintings are among the most important forms of classical South Indian art. This painting uses real 22-karat gold foil, semi-precious gemstones, and a unique gesso work technique that gives the painting a three-dimensional effect.",
    history: "Originating in the Maratha court of Thanjavur in the 16th century, these paintings were commissioned by Nayak rulers to adorn temple walls and palace halls.",
    preparationProcess: "A cloth is pasted on a wooden base, coated with limestone and tamarind paste (gesso). The figure is sketched, embossed with gesso for 3D effect, then layered with gold foil and studded with gemstones.",
    craftingTime: "3-6 weeks", careInstructions: "Keep away from moisture. Dust gently with a soft brush. Avoid direct sunlight to preserve gold lustre.",
    authenticityDetails: "Comes with a certificate of authenticity from the Thanjavur Painting Artists Association.",
    giCertificateInfo: "GI Tag No. 102, registered 2007.",
    rawMaterials: "Teak Wood, Limestone, Tamarind Paste, 22k Gold Foil, Semi-Precious Stones, Natural Pigments",
    artisanCommunity: "Thanjavur Art Gallery Painters Guild",
    sizes: ["12x15 inches", "18x24 inches"], stock: 5,
    reviews: [{ userName: "Vijay N.", rating: 5, comment: "The gold work is genuine and the detailing is incredible." }]
  },
  {
    name: "Aranmula Valkannadi Metal Mirror",
    description: "A mysterious front-surface metal alloy reflection mirror, handmade in the village of Aranmula, Kerala. No glass used.",
    price: 5500, discount: 5,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80"],
    state: "kerala", craft: "Aranmula Mirror", category: "Artifacts", material: "Metal Alloy",
    rating: 4.8, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Vishnu Achari", giRegistryNumber: "GI/KL/2004/005",
    story: "The Aranmula Kannadi is the world's only metal mirror that reflects without distortion. The exact alloy composition (believed to be a mix of copper and tin) is a closely guarded family secret, passed only within 5 artisan families.",
    history: "Dating back over 500 years, these mirrors were traditionally made as offerings for the Aranmula Parthasarathy Temple. The craft nearly died out in the 20th century before a revival effort.",
    preparationProcess: "A secret alloy is melted, poured into molds, cooled, then polished for 4-5 days using progressively finer abrasives until a perfect reflection is achieved.",
    craftingTime: "2-3 weeks", careInstructions: "Polish with a soft cloth periodically. Avoid chemical cleaners. Handle with care — the alloy surface is delicate.",
    authenticityDetails: "Only 5 families worldwide know the secret formula. Each mirror is individually numbered.",
    giCertificateInfo: "GI Tag No. 5, one of the first GI tags registered in India (2004).",
    rawMaterials: "Proprietary Copper-Tin Alloy, Coconut Shell Charcoal (for polishing)",
    artisanCommunity: "Aranmula Metal Mirror Heritage Artisans, Pathanamthitta",
    sizes: ["4 inch", "6 inch", "8 inch"], stock: 4,
    reviews: [{ userName: "Smitha J.", rating: 5, comment: "A true piece of living heritage. The reflection quality is remarkable." }]
  },
  {
    name: "Handloomed Kasavu Cotton Saree",
    description: "Elegant fine cotton saree with a thick golden-thread border, traditionally handloomed in Balaramapuram, Kerala.",
    price: 2499, discount: 15,
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80"],
    state: "kerala", craft: "Kerala Kasavu", category: "Handloom", material: "Fine Cotton",
    rating: 4.4, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Krishnan Nair", giRegistryNumber: "GI/KL/2009/317",
    story: "The Kasavu saree is the quintessential attire of Kerala, worn during Onam and Vishu festivals. Its understated elegance — pure white with a golden border — symbolizes purity and prosperity.",
    history: "Balaramapuram weaving has over 200 years of documented history, with royal patronage from the Travancore kings.",
    preparationProcess: "Fine count cotton threads are hand-starched, set on pit looms, and woven with kasavu (gold-plated thread) borders using interlocking technique.",
    craftingTime: "1-2 weeks", careInstructions: "Hand wash with mild soap. Avoid bleach. Starch lightly for crispness. Iron on medium heat.",
    authenticityDetails: "Handloom Mark of India certified. Each saree carries a unique QR code for verification.",
    giCertificateInfo: "GI Tag No. 317, registered 2009.",
    rawMaterials: "Fine Count Cotton, Gold-Plated Silver Thread (Kasavu), Rice Starch",
    artisanCommunity: "Balaramapuram Handloom Weavers Cooperative",
    sizes: ["Free Size"], stock: 20,
    reviews: [{ userName: "Divya P.", rating: 4, comment: "Perfect for Onam. The gold border is so elegant." }]
  },
  {
    name: "Santiniketan Embossed Leather Tote",
    description: "Premium leather hand bag embossed with traditional folk artwork using vegetable colors, from Santiniketan, Bengal.",
    price: 1899, discount: 25,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"],
    state: "west bengal", craft: "Santiniketan Leather", category: "Accessories", material: "EIC Leather",
    rating: 4.3, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Tapan Karmakar", giRegistryNumber: "GI/WB/2010/382",
    story: "Santiniketan leather work was pioneered by students of Rabindranath Tagore's Visva-Bharati University. The craft merges Japanese leather-tooling techniques with Kantha motifs.",
    history: "Nandalal Bose introduced the batik-on-leather technique in the 1920s at Kala Bhavan, Santiniketan.",
    preparationProcess: "Vegetable-tanned leather is dampened, embossed with metal dies, hand-painted with natural dyes, and finished with a protective lacquer coat.",
    craftingTime: "5-7 days", careInstructions: "Wipe with a damp cloth. Apply leather conditioner every 3 months. Avoid prolonged sun exposure.",
    authenticityDetails: "Each bag carries the Santiniketan Leather Artisans mark with a serial number.",
    giCertificateInfo: "GI Tag No. 382, registered 2010.",
    rawMaterials: "Vegetable-Tanned EIC Leather, Natural Dyes, Protective Lacquer",
    artisanCommunity: "Santiniketan Charmasilpa Samity (Leather Craft Society)",
    sizes: ["Medium", "Large"], stock: 10,
    reviews: [{ userName: "Rina B.", rating: 4, comment: "Love the Kantha-inspired embossing. Great everyday bag." }]
  },
  {
    name: "Nakshi Kantha Embroidered Dupatta",
    description: "Detailed running-stitch embroidery on raw handloom tussar silk representing scenes of rural Bengal folklore.",
    price: 3200, discount: 10,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"],
    state: "west bengal", craft: "Kantha Stitch", category: "Textiles", material: "Tussar Silk",
    rating: 4.6, isGITagged: false, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Mamata Khatun", giRegistryNumber: "",
    story: "Kantha is one of the oldest forms of embroidery in South Asia. Rural women of Bengal traditionally stitched discarded sarees together with running stitches to create quilts, each telling a unique folklore story.",
    history: "References to Kantha appear in Krishnadas Kaviraj's 16th-century Chaitanya Charitamrita. The revival movement began in the 1940s.",
    preparationProcess: "Layers of old cotton sarees or tussar silk are stacked, then stitched together with colored threads in intricate running-stitch patterns depicting rural scenes.",
    craftingTime: "2-4 weeks", careInstructions: "Hand wash in cold water with mild detergent. Dry flat in shade. Iron on reverse side.",
    authenticityDetails: "Handmade by women self-help groups in Bolpur, Birbhum district.",
    giCertificateInfo: "GI application pending.",
    rawMaterials: "Tussar Silk, Colored Cotton Threads, Natural Dyes",
    artisanCommunity: "Bolpur Kantha Women's Self-Help Group, Birbhum",
    sizes: ["Free Size"], stock: 14,
    reviews: [{ userName: "Sudha C.", rating: 5, comment: "Each stitch tells a story. Absolutely unique piece of art." }]
  },
  {
    name: "Phulkari Embroidered Dupatta",
    description: "Vibrant flower-motif embroidery completely covering the fabric surface, handcrafted by women artisans in Punjab.",
    price: 1599, discount: 18,
    image: "https://images.unsplash.com/photo-1583391265517-35bbdad01209?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1583391265517-35bbdad01209?w=800&auto=format&fit=crop&q=80"],
    state: "punjab", craft: "Phulkari", category: "Traditional Wear", material: "Georgette",
    rating: 4.5, isGITagged: true, isEcoFriendly: false, availability: "In Stock",
    artisanName: "Gurpreet Kaur", giRegistryNumber: "GI/PB/2012/448",
    story: "Phulkari, meaning 'flower work', is embroidered from the wrong side of the fabric using darn stitch — the pattern emerges on the right side. A Bagh (garden) variant covers the entire surface.",
    history: "Phulkari has roots in Vedic times and is mentioned in the Heer Ranjha folklore of Waris Shah (1766). Every Punjabi bride traditionally receives a Phulkari dupatta.",
    preparationProcess: "Pat (untwisted silk floss) threads are darned on khaddar or georgette from the reverse side using counting stitches, creating geometric and floral patterns.",
    craftingTime: "2-3 weeks", careInstructions: "Dry clean only. Do not wring. Store flat to avoid thread pull.",
    authenticityDetails: "Certified by Punjab Small Industries Corporation.",
    giCertificateInfo: "GI Tag No. 448, registered 2012.",
    rawMaterials: "Georgette Fabric, Pat Silk Floss Threads",
    artisanCommunity: "Phulkari Women Artisans Group, Patiala",
    sizes: ["Free Size"], stock: 18,
    reviews: [{ userName: "Harleen G.", rating: 5, comment: "The colors are so vibrant! Perfect addition to my collection." }]
  },
  {
    name: "Sambalpuri Handloom Ikat Saree",
    description: "Famous tie-dye ikkat weave cotton saree with classic border designs, handloomed in Sambalpur, Odisha.",
    price: 4999, discount: 10,
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop&q=80"],
    state: "odisha", craft: "Sambalpuri Ikat", category: "Handloom", material: "Pure Cotton",
    rating: 4.7, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Biswanath Meher", giRegistryNumber: "GI/OD/2005/019",
    story: "Sambalpuri Ikat involves a resist-dyeing technique where threads are tie-dyed before weaving. The motifs — Shankha (conch), Chakra (wheel), and Phula (flower) — carry deep cultural significance.",
    history: "Archaeological evidence suggests Ikat weaving in Odisha dates back to the 12th century. The Bhulia and Meher communities have preserved this craft for generations.",
    preparationProcess: "Warp and weft threads are tied in precise patterns with waterproof material, dyed in successive color baths, then handwoven to reveal the pre-determined design.",
    craftingTime: "3-4 weeks", careInstructions: "Hand wash separately in cold water. First wash may release excess dye. Dry in shade.",
    authenticityDetails: "Odisha Handloom Board certified. Carries the Indian Handloom Mark.",
    giCertificateInfo: "GI Tag No. 19, registered 2005.",
    rawMaterials: "Pure Cotton Threads, Natural and Vat Dyes, Waterproof Binding Thread",
    artisanCommunity: "Sambalpur Bhulia Weavers Cooperative Society",
    sizes: ["Free Size"], stock: 9,
    reviews: [{ userName: "Sujata D.", rating: 5, comment: "The ikat patterns are perfect. You can feel the handloom quality." }]
  },
  {
    name: "Patola Silk Double Ikat Saree",
    description: "Ultra-premium double ikat silk saree dyed in natural colors and handwoven in Patan. Looks identical on both sides.",
    price: 45000, discount: 5,
    image: "https://images.unsplash.com/photo-1610030470298-4156557ad4d0?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1610030470298-4156557ad4d0?w=800&auto=format&fit=crop&q=80"],
    state: "gujarat", craft: "Patan Patola", category: "Traditional Wear", material: "Patola Silk",
    rating: 5.0, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Rohit Salvi", giRegistryNumber: "GI/GJ/2005/012",
    story: "Patan Patola is the most elite textile of India — a single saree takes 4-6 months to weave. Both warp and weft threads are resist-dyed before weaving, creating a fabric that looks identical on both sides.",
    history: "The Salvi family of Patan has been the sole custodian of double-ikat Patola weaving for over 900 years. Only 3 families in the world know this craft.",
    preparationProcess: "Both warp and weft silk threads are individually tied and dyed multiple times in precise patterns. The dyed threads are then interlocked on a special tilted loom.",
    craftingTime: "4-6 months", careInstructions: "Dry clean only. Store in acid-free tissue paper. Never fold on same crease repeatedly.",
    authenticityDetails: "Signed by the Salvi family. Accompanied by a certificate from the Gujarat Patola Heritage Foundation.",
    giCertificateInfo: "GI Tag No. 12, registered 2005.",
    rawMaterials: "Pure Silk, Natural Vegetable Dyes (Pomegranate, Indigo, Turmeric, Lac)",
    artisanCommunity: "Salvi Family Patola Weavers, Patan",
    sizes: ["Free Size"], stock: 2,
    reviews: [{ userName: "Ritu A.", rating: 5, comment: "Investment piece. The reversible design is mind-blowing." }]
  },
  {
    name: "Muga Silk Traditional Saree",
    description: "Assamese traditional attire made of rare golden-yellow Muga Silk, handloom woven and decorated with motifs.",
    price: 22000, discount: 8,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"],
    state: "assam", craft: "Muga Silk Weaving", category: "Handloom", material: "Muga Silk",
    rating: 4.9, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Nilima Bora", giRegistryNumber: "GI/AS/2007/168",
    story: "Muga silk is the rarest and most expensive silk in the world, produced exclusively in Assam. Its natural golden lustre deepens with every wash, and the fabric can outlast the wearer.",
    history: "Ahom kings patronized Muga silk weaving since the 13th century. Every Assamese girl traditionally learns to weave on a loin loom.",
    preparationProcess: "Muga silkworms feed on Som and Sualu trees. Cocoons are reeled by hand, the threads are degummed, and then woven on traditional loin or frame looms.",
    craftingTime: "3-4 weeks", careInstructions: "Hand wash in lukewarm water with reetha (soapnut). Never use detergent. Dry in shade — sunlight enhances the golden sheen.",
    authenticityDetails: "Central Silk Board of India certified. Carries the Silk Mark label.",
    giCertificateInfo: "GI Tag No. 168, registered 2007.",
    rawMaterials: "100% Muga Silk (from Antheraea assamensis), Natural Dyes",
    artisanCommunity: "Sualkuchi Silk Weavers Association, Assam",
    sizes: ["Free Size"], stock: 5,
    reviews: [{ userName: "Gitanjali H.", rating: 5, comment: "The golden sheen is absolutely divine. Gets better with every wash." }]
  },
  {
    name: "Yeola Paithani Saree",
    description: "Handloomed pure silk saree featuring the signature oblique square design borders and a pallu embossed with detailed peacock patterns.",
    price: 14500, discount: 12,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"],
    state: "maharashtra", craft: "Paithani Weaving", category: "Traditional Wear", material: "Pure Silk",
    rating: 4.8, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Sanjay Gawade", giRegistryNumber: "GI/MH/2008/248",
    story: "Paithani sarees are Maharashtra's textile crown jewel. The pallu features a signature peacock or lotus motif woven entirely by hand. No two Paithanis are exactly alike.",
    history: "Named after the ancient town of Paithan (Pratishthana) on the banks of the Godavari, this art flourished under the Satavahana dynasty (2nd century BCE). Roman traders exchanged gold for Paithani textiles.",
    preparationProcess: "Silk threads are hand-twisted, starched, set on a traditional dobby loom, and woven using the tapestry (interlocking) technique for the pallu. A single pallu can take 15 days.",
    craftingTime: "1-3 months", careInstructions: "Dry clean only. Store with neem leaves to prevent insect damage. Air out every 3 months.",
    authenticityDetails: "Maharashtra State Handloom Corporation certified. Each saree has a unique loom number.",
    giCertificateInfo: "GI Tag No. 248, registered 2008.",
    rawMaterials: "Pure Silk, Gold and Silver Zari, Natural Dyes",
    artisanCommunity: "Yeola Paithani Vinkar Sahakari Sanstha",
    sizes: ["Free Size"], stock: 7,
    reviews: [{ userName: "Ashwini P.", rating: 5, comment: "The peacock pallu is a masterpiece. Worth every rupee." }]
  },
  {
    name: "Sandalwood Hand-Carved Ganesha",
    description: "Finely detailed religious figurine carved from fragrant, premium heartwood sandalwood of Shimoga forest reserves.",
    price: 18500, discount: 10,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80"],
    state: "karnataka", craft: "Sandalwood Carving", category: "Artifacts", material: "Sandalwood",
    rating: 4.9, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Nagaraj Gudigar", giRegistryNumber: "GI/KA/2005/016",
    story: "Karnataka sandalwood is the finest in the world. This figurine is carved from heartwood aged 30-60 years, which retains its fragrance for decades. The Gudigar community has preserved this art for over 400 years.",
    history: "Sandalwood carving in Mysore received royal patronage from the Wodeyar dynasty. Tipu Sultan's famous sandalwood throne was crafted by the same artisan lineage.",
    preparationProcess: "Seasoned sandalwood billets are rough-shaped, then meticulously hand-carved using chisels and gouges. Final detailing uses micro-chisels. The piece is polished with fine sandpaper and finished with natural oils.",
    craftingTime: "4-8 weeks", careInstructions: "Keep in a display case away from direct sunlight. Occasionally rub with a drop of sandalwood oil. Never apply varnish.",
    authenticityDetails: "Government of Karnataka Forest Department certificate of origin. CITES compliant for international shipping.",
    giCertificateInfo: "GI Tag No. 16, registered 2005.",
    rawMaterials: "Mysore Sandalwood Heartwood (Santalum album), Natural Sandalwood Oil",
    artisanCommunity: "Mysore Sandalwood Carving Artisans Guild, Sagar",
    sizes: ["6 inch", "8 inch", "12 inch"], stock: 3,
    reviews: [{ userName: "Karthik V.", rating: 5, comment: "The fragrance fills the entire room. Exquisite craftsmanship." }]
  },
  {
    name: "Kashmiri Hand-Carved Walnut Jewellery Box",
    description: "Multi-compartment storage box for jewellery, meticulously carved out of seasoned walnut wood by Kashmiri craftsmen.",
    price: 3200, discount: 15,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80"],
    state: "jammu & kashmir", craft: "Walnut Wood Carving", category: "Accessories", material: "Walnut Wood",
    rating: 4.7, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Manzoor Ahmad Bhat", giRegistryNumber: "GI/JK/2012/455",
    story: "Kashmiri walnut wood carving is renowned for its intricate vine and chinar leaf patterns. Each jewellery box takes weeks of meticulous hand-carving by master craftsmen who learn this art from childhood.",
    history: "The art was introduced to Kashmir by Persian and Central Asian artisans in the 15th century during Sultan Zain-ul-Abidin's reign.",
    preparationProcess: "Walnut wood is seasoned for 2 years, then rough-shaped on a lathe. Detailed carving is done using over 30 different chisels. Final polishing uses walnut oil and beeswax.",
    craftingTime: "2-4 weeks", careInstructions: "Dust with a soft cloth. Apply walnut oil or beeswax every 6 months. Keep away from extreme heat and humidity.",
    authenticityDetails: "J&K Handicrafts Department certified. Each piece has a unique artisan ID tag.",
    giCertificateInfo: "GI Tag No. 455, registered 2012.",
    rawMaterials: "Seasoned Kashmir Walnut Wood, Beeswax, Walnut Oil",
    artisanCommunity: "Rainawari Wood Carvers Cooperative, Srinagar",
    sizes: ["Small (6x4 inch)", "Medium (8x6 inch)", "Large (10x8 inch)"], stock: 11,
    reviews: [{ userName: "Nidhi S.", rating: 5, comment: "The detailing is phenomenal. A perfect gift for my mother." }]
  },
  {
    name: "Sanganeri Block Print Cotton Dohar",
    description: "Soft three-layered pure cotton summer blanket featuring traditional hand-stamped block print motifs from Sanganer.",
    price: 2199, discount: 10,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"],
    state: "rajasthan", craft: "Sanganeri Block Printing", category: "Home Decor", material: "Mulmul Cotton",
    rating: 4.6, isGITagged: true, isEcoFriendly: true, availability: "In Stock",
    artisanName: "Dinesh Chhipa", giRegistryNumber: "GI/RJ/2010/375",
    story: "Sanganeri block printing uses hand-carved teak wood blocks to stamp intricate floral patterns onto fine mulmul cotton. The Chhipa community has practiced this art for over 500 years.",
    history: "Sanganer, near Jaipur, has been a printing centre since the 16th century. The town's alkaline water from the Saraswati river is uniquely suited for fixing natural dyes.",
    preparationProcess: "Cotton fabric is washed, sun-bleached, and then printed using hand-carved teak blocks dipped in natural dyes. Each color layer requires a separate block and drying cycle.",
    craftingTime: "1-2 weeks", careInstructions: "Machine wash cold on gentle cycle. Use mild detergent. Tumble dry low. Colors may soften beautifully with age.",
    authenticityDetails: "Rajasthan Handloom Board certified. Block printing is done manually — no screen printing.",
    giCertificateInfo: "GI Tag No. 375, registered 2010.",
    rawMaterials: "Mulmul Cotton, Teak Wood Blocks, Natural Dyes (Indigo, Pomegranate, Turmeric)",
    artisanCommunity: "Sanganer Block Printers Cooperative, Jaipur",
    sizes: ["Single", "Double", "King"], stock: 22,
    reviews: [{ userName: "Pooja M.", rating: 4, comment: "So soft and breathable. Perfect summer blanket with beautiful prints." }]
  }
];

const User = require('./models/User');

// Seeder function
const seedDatabase = async () => {
  try {

    // 1. Ensure all products in DB have images array containing at least image
    const allDbProducts = await Product.find();
    for (const p of allDbProducts) {
      if ((!p.images || p.images.length === 0) && p.image) {
        p.images = [p.image];
        await p.save();
      }
    }

    // 2. Only insert initial seed products if the product database is completely empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      console.log('Initial seed products inserted.');
    } else {
      // Update existing products with full stories & gallery images if missing, without recreating deleted ones
      for (const seedItem of seedProducts) {
        const existing = await Product.findOne({ name: seedItem.name });
        if (existing) {
          let changed = false;
          if (!existing.images || existing.images.length === 0) {
            existing.images = seedItem.images && seedItem.images.length > 0 ? seedItem.images : [seedItem.image];
            changed = true;
          }
          if (existing.artisanName === 'Local Artisan Cooperative' && seedItem.artisanName !== 'Local Artisan Cooperative') {
            existing.artisanName = seedItem.artisanName;
            changed = true;
          }
          if (!existing.history && seedItem.history) {
            existing.history = seedItem.history;
            changed = true;
          }
          if (!existing.story || existing.story.startsWith('This handcrafted product represents')) {
            if (seedItem.story) {
              existing.story = seedItem.story;
              changed = true;
            }
          }
          if (changed) {
            await existing.save();
          }
        }
      }
    }

    // Ensure default admin and user accounts exist with correct passwords
    await User.deleteMany({
      $or: [
        { email: 'admin@myntra.com' },
        { phone: '9876543210' },
        { email: 'user@myntra.com' },
        { phone: '9123456789' },
      ],
    });

    await User.create({
      name: 'Heritage Admin',
      email: 'admin@myntra.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Default Admin account created (admin@myntra.com / admin123)');

    await User.create({
      name: 'Heritage Shopper',
      email: 'user@myntra.com',
      phone: '9123456789',
      password: 'user123',
      role: 'user',
    });
    console.log('Default User account created (user@myntra.com / user123)');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Connect to DB and seed
connectDB().then(() => {
  seedDatabase();
});

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/passport', passportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server backend is healthy and running' });
});

// Error routing fallback
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
