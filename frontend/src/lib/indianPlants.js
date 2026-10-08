// High quality, verified real-life photographs of LIVING plants (trees, branches, leaves, vines)
// Stored locally in frontend/public/plants/ to ensure guaranteed, realistic living plant visuals
// (Never food plates, burgers, dried sticks, powders, or processed spices)
export const REAL_PLANT_PHOTOS = {
  // Palms & Big Plants
  "Coconut Palm": "/plants/coconut.jpg",
  "Areca Palm": "/plants/areca.jpg",
  "Lipstick Palm": "/plants/lipstick_palm.jpg",
  "Palmyra Palm": "/plants/palmyra.jpg",
  "Bamboo": "/plants/bamboo.jpg",
  "Banana": "/plants/banana.jpg",

  // Fruit Trees (Living branches with leaves & fruits)
  "Mango": "/plants/mango.jpg",
  "Guava": "/plants/guava.jpg", // Real living guava tree branch with leaves and guava fruit (NOT a burger)
  "Papaya": "/plants/papaya.jpg",
  "Lemon": "/plants/lemon.jpg",
  "Pomegranate": "/plants/pomegranate.jpg",
  "Jackfruit": "/plants/jackfruit.jpg",

  // Courtyard & Sacred Flowers (Living bushes & blooming plants)
  "Hibiscus": "/plants/hibiscus.jpg",
  "Jasmine": "/plants/jasmine.jpg",
  "Rose": "/plants/rose.jpg",
  "Marigold": "/plants/marigold.jpg",
  "Bougainvillea": "/plants/bougainvillea.jpg",
  "Plumeria": "/plants/champa.jpg",
  "Lotus": "/plants/lotus.jpg",

  // Kitchen Spices (LIVING GREEN PLANTS & VINES, NOT DRIED STICKS OR POWDER)
  "Curry Leaf": "/plants/curry_leaf.jpg", // Living curry leaf shrub with fresh leaves
  "Cardamom": "/plants/cardamom.jpg",   // Living green cardamom plant in plantation
  "Turmeric": "/plants/turmeric.jpg",   // Living green broad-leaved turmeric plant
  "Black Pepper": "/plants/black_pepper.jpg", // Real living green pepper vine on tree
  "Cinnamon": "/plants/cinnamon.jpg",   // Real living cinnamon evergreen tree with leaves (NOT dried bark sticks)
  "Clove": "/plants/clove.jpg",         // Real living clove tree with leaves and buds (NOT dried spice nails)
  "Ginger": "/plants/ginger.jpg",       // Real lush green living ginger plant in garden soil (NOT dried root)

  // Medicinal & Home Plants (Living potted / garden plants)
  "Tulsi": "/plants/tulsi.jpg",
  "Neem": "/plants/neem.jpg",
  "Aloe Vera": "/plants/aloe_vera.jpg",
  "Giloy": "/plants/giloy.jpg",
  "Money Plant": "/plants/money_plant.jpg",
};

export function getPlantImage(name = "") {
  const n = name.toLowerCase();
  if (n.includes("coconut") || n.includes("nariyal")) return REAL_PLANT_PHOTOS["Coconut Palm"];
  if (n.includes("areca") || n.includes("betel") || n.includes("supari")) return REAL_PLANT_PHOTOS["Areca Palm"];
  if (n.includes("lipstick") || n.includes("sealing wax") || n.includes("maharajah") || n.includes("cyrtostachys")) return REAL_PLANT_PHOTOS["Lipstick Palm"];
  if (n.includes("palmyra") || n.includes("borassus") || n.includes("tadgola") || n.includes("taad")) return REAL_PLANT_PHOTOS["Palmyra Palm"];
  if (n.includes("bamboo") || n.includes("baans")) return REAL_PLANT_PHOTOS["Bamboo"];
  if (n.includes("banana") || n.includes("plantain") || n.includes("kela") || n.includes("musa")) return REAL_PLANT_PHOTOS["Banana"];
  if (n.includes("mango") || n.includes("aam") || n.includes("mangifera")) return REAL_PLANT_PHOTOS["Mango"];
  if (n.includes("guava") || n.includes("amrood") || n.includes("psidium")) return REAL_PLANT_PHOTOS["Guava"];
  if (n.includes("papaya") || n.includes("papita") || n.includes("carica")) return REAL_PLANT_PHOTOS["Papaya"];
  if (n.includes("lemon") || n.includes("lime") || n.includes("nimbu") || n.includes("citrus")) return REAL_PLANT_PHOTOS["Lemon"];
  if (n.includes("pomegranate") || n.includes("anaar") || n.includes("anar") || n.includes("punica")) return REAL_PLANT_PHOTOS["Pomegranate"];
  if (n.includes("jackfruit") || n.includes("kathal") || n.includes("artocarpus")) return REAL_PLANT_PHOTOS["Jackfruit"];
  if (n.includes("hibiscus") || n.includes("gudhal") || n.includes("jaswand")) return REAL_PLANT_PHOTOS["Hibiscus"];
  if (n.includes("jasmine") || n.includes("mogra") || n.includes("chameli")) return REAL_PLANT_PHOTOS["Jasmine"];
  if (n.includes("rose") || n.includes("gulab") || n.includes("rosa")) return REAL_PLANT_PHOTOS["Rose"];
  if (n.includes("marigold") || n.includes("genda") || n.includes("tagetes")) return REAL_PLANT_PHOTOS["Marigold"];
  if (n.includes("bougainvillea")) return REAL_PLANT_PHOTOS["Bougainvillea"];
  if (n.includes("plumeria") || n.includes("champa")) return REAL_PLANT_PHOTOS["Plumeria"];
  if (n.includes("lotus") || n.includes("kamal") || n.includes("nelumbo")) return REAL_PLANT_PHOTOS["Lotus"];
  if (n.includes("curry") || n.includes("kadi patta") || n.includes("murraya")) return REAL_PLANT_PHOTOS["Curry Leaf"];
  if (n.includes("cardamom") || n.includes("elaichi") || n.includes("elettaria")) return REAL_PLANT_PHOTOS["Cardamom"];
  if (n.includes("turmeric") || n.includes("haldi") || n.includes("curcuma")) return REAL_PLANT_PHOTOS["Turmeric"];
  if (n.includes("pepper") || n.includes("kali mirch") || n.includes("piper")) return REAL_PLANT_PHOTOS["Black Pepper"];
  if (n.includes("cinnamon") || n.includes("dalchini") || n.includes("cinnamomum")) return REAL_PLANT_PHOTOS["Cinnamon"];
  if (n.includes("clove") || n.includes("laung") || n.includes("syzygium")) return REAL_PLANT_PHOTOS["Clove"];
  if (n.includes("ginger") || n.includes("adrak") || n.includes("zingiber")) return REAL_PLANT_PHOTOS["Ginger"];
  if (n.includes("tulsi") || n.includes("basil") || n.includes("ocimum")) return REAL_PLANT_PHOTOS["Tulsi"];
  if (n.includes("neem") || n.includes("azadirachta")) return REAL_PLANT_PHOTOS["Neem"];
  if (n.includes("aloe") || n.includes("ghritkumari")) return REAL_PLANT_PHOTOS["Aloe Vera"];
  if (n.includes("giloy") || n.includes("guduchi") || n.includes("tinospora")) return REAL_PLANT_PHOTOS["Giloy"];
  if (n.includes("money") || n.includes("pothos") || n.includes("epipremnum")) return REAL_PLANT_PHOTOS["Money Plant"];
  return null;
}

// Complete 31-species dataset of plants grown across India, written in simple everyday English
export const INDIAN_SUBCONTINENT_PLANTS = [
  // Palms & Big Plants
  {
    name: "Coconut Palm (Nariyal)",
    scientific_name: "Cocos nucifera",
    family: "Palm Family (Arecaceae)",
    category: "Palm & Tree",
    role: "Revered as 'Kalpavriksha' (the wish-fulfilling tree) across India. It gives sweet coconut water, cooking oil, nutritious coconut meat, coir fibers for ropes and door mats, and strong leaves used for roofing thatch.",
    description: "A tall, beautiful coconut tree that grows 20 to 30 meters high with a slender trunk and long arching green leaves. It loves warm sunshine, coastal breezes, and sandy or moist soil.",
    common_issues: ["Brown leaf spots", "Crown rot from heavy rains", "Rhinoceros beetle bug holes", "Red palm weevil in stem"],
    problem_cause: "Damp rainy weather or burrowing beetles damage the soft growing shoot right at the top of the tree. When water settles inside, fungus causes the young center leaves to rot and turn brown.",
    remedies: [
      "Carefully clean away rotten leaf fibers at the top, and apply organic neem cake powder mixed with coarse sand in the leaf bases to keep beetles away.",
      "Spray mild copper water or organic Bordeaux mixture on the crown leaves to stop mold and fungus.",
      "Pour beneficial soil compost tea (Trichoderma) around the base of the trunk to strengthen root health.",
    ],
    precautions: [
      "Plant coconut trees at least 25 feet apart so every palm gets full sunshine all day long.",
      "Make sure rainwater drains away freely and never stays standing around the base of the trunk.",
      "Feed the tree annually with compost and natural wood ash (potash) to keep fronds tough and healthy.",
      "Avoid making cuts or wounds on the tree trunk, which attract harmful insects.",
    ],
  },
  {
    name: "Areca Palm / Supari (Areca catechu)",
    scientific_name: "Areca catechu",
    family: "Palm Family (Arecaceae)",
    category: "Palm & Tree",
    role: "A valuable plantation tree in Karnataka, Kerala, and Assam. Produces betel nuts (supari) used in Indian hospitality and ceremonies. Its fallen leaf sheaths are pressed into biodegradable, eco-friendly plates and bowls.",
    description: "A slender, graceful palm tree reaching 15 to 20 meters tall with a smooth grey trunk and vibrant dark-green feather leaves. It grows best in warm tropical weather with rich soil and partial shade when young.",
    common_issues: ["Monsoon fruit rot (Koleroga)", "Yellow leaf disease", "Foot rot near root base", "Tiny leaf bugs"],
    problem_cause: "Heavy monsoon rains splash mold fungus onto developing nut bunches. The nuts turn water-soaked, rot, and fall off before ripening.",
    remedies: [
      "Spray mild organic Bordeaux mixture over developing nut bunches before heavy monsoon rains arrive.",
      "Cover nut bunches with breathable rain hoods or eco-friendly covers to shield them from heavy rain splash.",
      "Dig a shallow drainage trench around the tree base to stop soggy water from gathering at the roots.",
    ],
    precautions: [
      "Keep drainage channels clear between rows so water flows away smoothly during rains.",
      "Add neem cake mixed with organic compost around the roots once a year.",
      "Collect and remove any fallen rotting nuts from the ground so mold does not spread.",
    ],
  },
  {
    name: "Lipstick Palm (Sealing Wax / Maharajah Palm)",
    scientific_name: "Cyrtostachys renda",
    family: "Palm Family (Arecaceae)",
    category: "Palm & Tree",
    role: "An ornamental clumping palm cultivated in warm, humid parts of India. It is admired for its bright red crownshafts and leaf stalks against long, feather-shaped green leaves. It is native to Southeast Asian rainforests, not native to India.",
    description: "Several slender stems grow in a cluster, with vivid red leaf bases and midribs and arching green fronds. It needs warmth, humidity, bright filtered light or partial shade, and soil kept consistently moist; protect it from drought and cool conditions.",
    common_issues: ["Scale insects", "Red spider mites, especially indoors", "Leaf browning from dry air or drought stress", "Yellowing from growing stress"],
    problem_cause: "This palm is sensitive to dry air and drying soil, which can brown the leaves. Scale insects or red spider mites may appear, particularly on indoor plants; it is generally considered disease-free.",
    remedies: [
      "Check stems and leaf undersides for scale insects or fine mite webbing; rinse the foliage and isolate an affected potted plant.",
      "If pests remain, use a product labeled for ornamental palms and follow its label directions; test it on a small area first.",
      "Keep the root zone evenly moist and raise humidity, while using a container with drainage so water does not stagnate around the roots.",
    ],
    precautions: [
      "Grow in a warm, sheltered, humid location; protect the palm from cool drafts and cold weather.",
      "Provide bright filtered light or partial shade and avoid harsh exposure when the plant is young.",
      "Use rich loamy soil and keep it evenly moist; do not let the root ball dry out.",
      "Inspect leaf undersides and stems regularly for scale insects and red spider mites.",
    ],
  },
  {
    name: "Palmyra Palm (Taad / Tadgola)",
    scientific_name: "Borassus flabellifer",
    family: "Palm Family (Arecaceae)",
    category: "Palm & Tree",
    role: "Known as the 'Tree of Life' in Southern India. Produces refreshing ice apples (tadgola/nungu), sweet natural neera sap, palm jaggery, strong natural fiber, and termite-resistant timber.",
    description: "A very sturdy, drought-resistant tree with a dark, textured trunk and a rounded crown of stiff, fan-shaped green leaves. It can survive hot dry summers and thrives in open fields.",
    common_issues: ["Leaf caterpillars", "Center shoot browning", "Black mold on leaves", "Waterlogging stress"],
    problem_cause: "Standing rainwater during cyclonic storms or leaf-eating caterpillars chew through the fronds, leaving the young spear shoot open to fungal rot.",
    remedies: [
      "Spray mild neem oil or copper solution if brown spots appear on the center spear leaf.",
      "Remove dried or damaged outer leaves to let fresh air reach the crown.",
    ],
    precautions: [
      "Plant along field borders and farm banks where it acts as a natural windbreak and holds soil firmly.",
      "Ensure the ground does not stay submerged in water for weeks at a time.",
    ],
  },
  {
    name: "Bamboo (Baans)",
    scientific_name: "Bambusa vulgaris",
    family: "Grass Family (Poaceae)",
    category: "Utility Plant",
    role: "Known as 'Green Gold' of India. Provides sustainable building poles, fencing, paper pulp, baskets, handicrafts, and delicious tender bamboo shoots used in traditional curries. Its roots protect riverbanks from washing away.",
    description: "A very fast-growing giant grass that grows in lush clumps with golden or green hollow woody canes. It produces lots of light feathery green leaves and thrives in warm, moist climates.",
    common_issues: ["Stem borer beetles", "Leaf rust spots", "Drying shoot tips", "Overcrowded clump center"],
    problem_cause: "Too many old canes crowded tightly together block sunlight and fresh air. Humid damp weather then allows fungus rust spots to spread onto leaves.",
    remedies: [
      "Cut away old, dead canes from the middle of the clump to let fresh breeze and bright sunlight inside.",
      "Spray mild organic copper water or neem spray on new shoots if leaf spotting begins.",
    ],
    precautions: [
      "Thin out clumps annually to keep plants healthy and well-spaced.",
      "Harvest mature bamboo canes during dry winter months when natural plant starch is lowest.",
    ],
  },
  {
    name: "Banana Plant (Kela)",
    scientific_name: "Musa paradisiaca",
    family: "Banana Family (Musaceae)",
    category: "Fruit Plant",
    role: "One of India's most beloved fruit plants. Every part is used: sweet nutritious bananas, raw cooking bananas, edible banana flowers, tender inner stem core, and broad green leaves used for traditional feast meals.",
    description: "A lush, giant leafy plant with an upright fleshy trunk formed by tightly wrapped leaf stalks, crowned by huge glossy green leaves and large hanging bunches of bananas.",
    common_issues: ["Leaf streak spots (Sigatoka)", "Yellowing wilt", "Stem weevil beetles", "Torn leaves from wind"],
    problem_cause: "Warm rainy weather spreads leaf spot mold onto wet leaves, creating brown drying streaks that stop the leaves from making food for the fruit bunch.",
    remedies: [
      "Trim off heavily spotted dry leaves and discard them away from the garden.",
      "Spray organic neem seed oil or mild copper spray during cloudy, rainy weeks.",
      "Pour neem cake tea around the base to deter soil beetles.",
    ],
    precautions: [
      "Plant on raised soil beds so extra water runs off easily and never pools around the roots.",
      "Grow in a sheltered, sunny spot protected from strong gusty winds that tear broad leaves.",
      "Feed regularly with composted cow manure and wood ash for big healthy banana bunches.",
    ],
  },

  // Fruit Trees
  {
    name: "Mango Tree (Aam)",
    scientific_name: "Mangifera indica",
    family: "Cashew Family (Anacardiaceae)",
    category: "Fruit Tree",
    role: "The National Fruit of India and 'King of Fruits' (famous for Alphonso, Kesar, Dasheri, and Banganapalli). Fresh mango leaves are strung across doorways as auspicious festive torans.",
    description: "A grand, shady evergreen tree that can live for hundreds of years. Features deep green leathery leaves that start out bronze-pink when young, and huge fragrant clusters of tiny sweet flowers in spring.",
    common_issues: ["Black spot on leaves and fruit (Anthracnose)", "White powdery leaf coating", "Tiny hopping bugs on flower clusters", "Tip drying"],
    problem_cause: "Cloudy, damp, or misty weather allows anthracnose fungus to grow, causing dark sunken spots on leaves and flowers. This makes blossoms drop early and stains the skin of growing mangoes.",
    remedies: [
      "Spray mild copper water (copper oxychloride) or neem oil spray when flower clusters first open and after baby fruits appear.",
      "Spray baking soda water (1 teaspoon per liter) or wettable sulfur if white powder coats the leaves.",
      "Spray organic neem oil early in the morning to remove tiny hopping bugs from flower shoots.",
    ],
    precautions: [
      "Prune congested inner branches after summer harvest (August-September) so sunlight reaches all parts of the tree.",
      "Rake up and discard fallen dry leaves around the tree base to stop fungal spores from overwintering.",
      "Do not spray water over flowers and opening buds; water only at the soil line.",
      "Add compost and natural manure around the drip line every year after monsoon season.",
    ],
  },
  {
    name: "Guava Tree (Amrood)",
    scientific_name: "Psidium guajava",
    family: "Myrtle Family (Myrtaceae)",
    category: "Fruit Tree",
    role: "Known as the 'Apple of the Tropics' in India (famous for Allahabad Safeda and Sardar varieties). Loaded with Vitamin C and dietary fiber. Fresh guava leaves are chewed in home remedies to soothe gums and toothache.",
    description: "A lovely small fruit tree with smooth, peeling reddish-brown bark, fragrant white blossoms, and sweet round fruits with crunchy edible seeds. Very easy to grow in home gardens and orchards.",
    common_issues: ["Sudden wilting of branches", "Fruit fly worms inside fruit", "Dark spots on fruit skin", "Yellowing leaves"],
    problem_cause: "Heavy waterlogged clay soil can rot the root hairs, making branches suddenly wilt and leaves turn yellow. Fruit flies lay eggs under fruit skin when guava starts to ripen.",
    remedies: [
      "Add organic bio-fungicide (Trichoderma) mixed with compost to the root basin to heal roots.",
      "Tie breathable paper bags or cloth pouches over growing guavas about one month after flowering to keep fruit flies away.",
      "Spray mild neem oil or copper water for dark skin spots.",
    ],
    precautions: [
      "Ensure the tree is planted in well-draining soil where water never stays stagnant.",
      "Prune back tips by 20% after harvest to encourage strong new fruiting shoots.",
      "Collect fallen overripe fruits from the soil every day so fruit flies do not multiply.",
    ],
  },
  {
    name: "Papaya Plant (Papita)",
    scientific_name: "Carica papaya",
    family: "Papaya Family (Caricaceae)",
    category: "Fruit Plant",
    role: "A fast-growing tropical fruit loved across India. Rich in digestive enzymes (papain) and vitamins. Fresh papaya leaf juice is widely prepared at home to help raise blood platelets during viral fevers.",
    description: "A fast-growing, semi-woody plant with a straight green trunk, giant deeply-lobed umbrella leaves on long hollow stems, and large sweet melon-like fruits clustered along the upper trunk.",
    common_issues: ["Yellow mosaic leaf curling (Virus)", "Stem rot at ground level", "Root rot from damp soil", "Tiny aphids under leaves"],
    problem_cause: "Too much water sitting around the stem base rots the soft trunk. Tiny sap-sucking aphids also transmit leaf curl virus between plants, making leaves look stunted and yellow.",
    remedies: [
      "Keep the soil around the base slightly raised so water always drains away from the trunk.",
      "Spray mild neem soap water on leaf undersides weekly to wash away aphids and whiteflies.",
      "Remove and discard severely virus-stunted plants to protect other healthy papayas.",
    ],
    precautions: [
      "Always plant papaya on a raised mound of soil; standing water for even one day can rot papaya roots.",
      "Grow in full all-day sunshine with rich, sandy compost soil.",
      "Add a handful of neem cake around the base every two months to keep root pests away.",
    ],
  },
  {
    name: "Lemon Tree (Nimbu)",
    scientific_name: "Citrus aurantiifolia",
    family: "Citrus Family (Rutaceae)",
    category: "Fruit Tree",
    role: "An absolute must-have in every Indian kitchen. Fresh nimbu juice is squeezed into dals, curries, and drinks daily, and whole lemons are used to make delicious Indian pickles (nimbu ka achaar).",
    description: "A bushy, thorny evergreen small tree with fragrant shiny green leaves, sweet-smelling white flowers, and lots of juicy, tart green-and-yellow lemons. Perfect for backyard gardens and large terrace pots.",
    common_issues: ["Rough brown spots with yellow rings (Canker)", "Curled silvery leaf tracks (Leaf miner)", "Yellow leaves with green veins", "Branch dieback"],
    problem_cause: "Tiny caterpillars tunnel through leaf layers, creating silvery tracks. Bacteria then enter these wounds during wet weather, causing rough corky brown spots on leaves and lemons.",
    remedies: [
      "Trim off branches with rough brown canker spots before rainy weather, and spray with mild copper water.",
      "Spray neem oil spray (1 teaspoon per liter of water with a drop of liquid soap) early in the morning to repel leaf miner caterpillars.",
      "Add composted cow dung and a spoon of Epsom salts (magnesium) to fix pale yellowing leaves.",
    ],
    precautions: [
      "Place in full sunshine where it gets at least 6 hours of bright light every day.",
      "Water deeply, but let the top 2 inches of soil dry before watering again.",
      "Apply a paste of lime and turmeric or Bordeaux mixture on the lower trunk once a year.",
    ],
  },
  {
    name: "Pomegranate Tree (Anar)",
    scientific_name: "Punica granatum",
    family: "Loosestrife Family (Lythraceae)",
    category: "Fruit Tree",
    role: "A prized Indian fruit (famous Bhagwa variety) packed with ruby-red juicy seeds (arils). Widely recommended in Ayurvedic nutrition for boosting hemoglobin, strengthening digestion, and improving heart health.",
    description: "A bushy, drought-hardy small tree with slender branches, glossy narrow green leaves, bright orange-red trumpet flowers, and thick-skinned fruits filled with sweet red jewel-like seeds.",
    common_issues: ["Black oily spots on skin and leaves (Bacterial blight)", "Butterfly caterpillar bore holes in fruit", "Fruit cracking", "Root rot"],
    problem_cause: "Rain and warm humidity allow bacteria to cause dark spots that crack the fruit skin. Pomegranate butterflies also lay eggs on flowers, and the baby caterpillars bore holes into growing fruit.",
    remedies: [
      "Wrap developing pomegranates with thin paper or cloth bags right after the flower petals fall off.",
      "Spray mild copper spray on leaves if dark spots begin to appear.",
      "Water regularly on a steady schedule; uneven watering causes pomegranate skins to split open.",
    ],
    precautions: [
      "Use clean, sterilized pruning shears when cutting branches.",
      "Keep the tree pruned to an open vase shape so sunshine and wind dry leaves quickly.",
      "Avoid planting in heavy clay that retains cold water.",
    ],
  },
  {
    name: "Jackfruit Tree (Kathal)",
    scientific_name: "Artocarpus heterophyllus",
    family: "Mulberry Family (Moraceae)",
    category: "Fruit Tree",
    role: "The largest tree fruit in the world, state fruit of Kerala and Tamil Nadu. Raw green jackfruit is loved as a hearty vegetable meat substitute, while golden ripe pods (kathal/chakka) are sweet and aromatic.",
    description: "A grand evergreen tree with dense glossy dark-green leaves and a thick trunk. Giant prickly fruits grow directly on the main trunk and heavy lower branches.",
    common_issues: ["Soft black blossom rot", "Stem boring bugs", "Leaf spot mold", "Root rot from stagnant water"],
    problem_cause: "High monsoon humidity and rain make fungus attack baby flowers and small fruitlets, turning them black, soft, and watery.",
    remedies: [
      "Spray mild copper water or organic Bordeaux spray onto opening flowers during wet spells.",
      "Remove and throw away any blackened small fruitlets hanging from the trunk.",
    ],
    precautions: [
      "Plant in deep, well-draining soil with plenty of room to grow.",
      "Prune dead interior twigs to keep good air movement around the lower trunk.",
    ],
  },

  // Courtyard & Sacred Flowers
  {
    name: "Hibiscus (Gudhal / Jaswand)",
    scientific_name: "Hibiscus rosa-sinensis",
    family: "Mallow Family (Malvaceae)",
    category: "Flowering Plant",
    role: "The sacred flower of Indian homes and temples, offered to Lord Ganesha and Goddess Kali. Fresh hibiscus flowers and leaves are infused in pure coconut oil to make hair oil that strengthens roots and stops hair fall.",
    description: "A bushy garden shrub with shiny dark-green toothed leaves and large, radiant flowers with a long pollen stem in red, pink, yellow, and orange. Loves warm Indian sunshine and flowers all year.",
    common_issues: ["White cottony bugs (Mealybugs)", "Yellow leaves", "Flower buds falling off before opening", "Tiny green aphids"],
    problem_cause: "White mealybugs cluster like tiny cotton balls on tender shoots and flower buds, sucking sap and making leaves curl and flower buds drop off.",
    remedies: [
      "Wash away cottony mealybugs with a strong spray of water, then spray 2 tablespoons organic neem oil mixed with 1 teaspoon mild liquid soap in water.",
      "Dab stubborn white bugs directly with a cotton bud dipped in rubbing alcohol.",
      "Give the plant compost and a pinch of Epsom salt (magnesium) to turn pale yellow leaves rich dark green.",
    ],
    precautions: [
      "Give at least 5 to 6 hours of direct sunshine every single day; hibiscus will not bloom in shade.",
      "Water when the top layer of soil feels dry, but make sure pots have drainage holes so roots never sit in standing water.",
      "Prune back long leggy branches in early spring to encourage plenty of fresh blooming shoots.",
    ],
  },
  {
    name: "Jasmine (Mogra / Chameli)",
    scientific_name: "Jasminum sambac",
    family: "Olive Family (Oleaceae)",
    category: "Flowering Plant",
    role: "One of India's most cherished fragrant flowers. Woven into traditional festive hair garlands (gajras), offered in daily temple prayers, and used in perfumes and cooling herbal teas.",
    description: "A climbing or bushy green shrub with shiny oval leaves and star-shaped pure white blossoms that give off a heavenly sweet perfume, especially in the evening and night.",
    common_issues: ["Leaf browning and spots", "Tiny red spider mites under leaves", "Bud-eating caterpillars", "Yellowing leaves"],
    problem_cause: "Warm humid spells cause leaf spots, or tiny spider mites hide under leaves during dry weather, sucking juices and making leaves look dusty and pale.",
    remedies: [
      "Spray neem oil spray thoroughly under the leaves to clear away tiny mites.",
      "Prune back dried shoots after each blooming cycle to spur new fragrant flower buds.",
      "Spray mild copper water if leaves get dark brown spots.",
    ],
    precautions: [
      "Prune heavily (cut back stems by half) in late winter (January-February) for masses of sweet summer flowers.",
      "Grow in full bright sunshine in soil mixed with cow dung compost and wood ash.",
      "Water the soil at the base; do not spray water directly over open flower petals.",
    ],
  },
  {
    name: "Rose (Gulab)",
    scientific_name: "Rosa indica",
    family: "Rose Family (Rosaceae)",
    category: "Flowering Plant",
    role: "The queen of garden flowers across India. Used in worship, fragrant garlands, pure rose water (Gulab Jal), and traditional sweet rose petal preserve (Gulkand) known in Ayurveda for cooling body heat.",
    description: "A thorny woody shrub with serrated leaves, sharp thorns along stems, and gorgeous fragrant blossoms with velvety layered petals in red, pink, yellow, and white.",
    common_issues: ["Black spots on leaves with yellow edges", "White powder on leaves (Powdery mildew)", "Stem dying back from top", "Tiny thrips curling new leaves"],
    problem_cause: "Water sitting on leaves overnight allows black spot mold to germinate, making leaves turn yellow and drop off. Fungus also causes pruned stem tips to turn black and die downward.",
    remedies: [
      "Prune blackened dying canes 2 inches below the dark area at an outward slant, and seal the cut with a pinch of turmeric paste.",
      "Spray baking soda spray (1 teaspoon baking soda + few drops mild soap per liter of water) for white powdery mildew.",
      "Spray neem oil in the evening to clear away tiny thrips and aphids.",
    ],
    precautions: [
      "Always water roses at the soil level; keep foliage dry so black spot mold cannot grow.",
      "Rake away and discard fallen dead leaves from the soil surface.",
      "Leave enough space between plants so gentle breezes dry the leaves quickly.",
      "Feed with composted cow manure or bone meal every month for big blooms.",
    ],
  },
  {
    name: "Marigold (Genda)",
    scientific_name: "Tagetes erecta",
    family: "Daisy Family (Asteraceae)",
    category: "Flowering Plant",
    role: "The festival flower of India, seen in every celebration from Diwali to weddings. Farmers plant marigolds around vegetables because its roots naturally keep harmful soil worms (nematodes) away.",
    description: "A hardy, aromatic annual plant with feathery dark-green leaves and ruffled round flower pom-poms in vibrant sunny yellow, golden orange, and copper red.",
    common_issues: ["Brown leaf spots", "Damping off in young seedlings", "Faded small blooms", "Spider mites in dry heat"],
    problem_cause: "Damp rainy weather causes brown leaf spots, or old dead flowers left on the plant rot and sap energy from new incoming buds.",
    remedies: [
      "Pluck off old faded flowers (deadheading) every week to make the plant produce continuous new blooms.",
      "Remove and throw away lower brown spotted leaves.",
      "Spray mild neem oil or copper water if spots spread.",
    ],
    precautions: [
      "Keep seedlings spaced 1 foot apart so air circulates freely.",
      "Grow in full, unfiltered bright sunshine in well-draining soil.",
      "Water when the top soil dries out; do not let the pot sit in soggy mud.",
    ],
  },
  {
    name: "Bougainvillea",
    scientific_name: "Bougainvillea spectabilis",
    family: "Four O'Clock Family (Nyctaginaceae)",
    category: "Flowering Plant",
    role: "India's favorite vibrant climbing plant seen over archways, terrace railings, and boundary walls. Loved for its brilliant colors, low water needs, and non-stop blooms that survive hot Indian summers.",
    description: "A vigorous woody climbing vine with sharp thorns, oval green leaves, and huge clusters of paper-thin colorful flower petals (bracts) in hot pink, purple, red, orange, and white.",
    common_issues: ["Lots of green leaves but zero flowers", "Yellow leaves from overwatering", "Caterpillars chewing leaves"],
    problem_cause: "Too much water and fertilizer causes the plant to grow only leafy green foliage and stops it from blooming. Bougainvillea blooms best when soil dries out between waterings.",
    remedies: [
      "Reduce watering: let the soil dry out thoroughly until the leaves slightly droop before giving water to trigger massive flowering.",
      "Add a handful of wood ash or potassium compost to boost blooms.",
      "Hand-pick green caterpillars or spray neem oil.",
    ],
    precautions: [
      "Plant in the hottest, sunniest spot you have (at least 6 to 8 hours of direct sunshine daily).",
      "Make sure the soil drains rapidly; bougainvillea hates wet feet.",
      "Prune lightly after each blooming flush to maintain a bushy shape and trigger new flower clusters.",
    ],
  },
  {
    name: "Champa (Plumeria)",
    scientific_name: "Plumeria rubra",
    family: "Dogbane Family (Apocynaceae)",
    category: "Flowering Plant",
    role: "The sacred temple tree of India (Champa). Its thick, star-like flowers with sweet exotic fragrance are offered in prayers, floated in decorative brass urli bowls, and worn in hair.",
    description: "A small succulent tree with smooth grey bark, thick fleshy branches, long leathery leaves at branch tips, and intensely sweet-scented flowers in creamy white, yellow, and deep pink.",
    common_issues: ["Orange-yellow powder on leaf backs (Rust)", "Soft black rot at branch tips", "Leaves dropping in winter"],
    problem_cause: "Humid rainy weather creates orange rust fungus powder on leaf undersides. Soft rot at branch tips occurs when fleshy stems get waterlogged in cold or damp soil.",
    remedies: [
      "Spray mild copper water or sulfur water under leaves to clear orange rust powder.",
      "Cut off any soft, mushy black branch tips with clean shears, and dust the cut with turmeric or cinnamon powder.",
      "Note that leaf drop in winter is normal dormancy; the tree will grow fresh green leaves in spring.",
    ],
    precautions: [
      "Grow in full bright sunshine and fast-draining gritty soil.",
      "Water sparingly; allow the soil to dry out completely between waterings.",
      "Cut back watering drastically during cold winter months.",
    ],
  },
  {
    name: "Indian Lotus (Kamal)",
    scientific_name: "Nelumbo nucifera",
    family: "Lotus Family (Nelumbonaceae)",
    category: "Water Plant",
    role: "The National Flower of India. Sacred symbol of purity, beauty, and wisdom associated with Goddess Lakshmi and Goddess Saraswati. Every part is eaten or used: lotus seeds (makhana), lotus root (kamal kakdi), and broad leaves.",
    description: "A breathtaking aquatic water plant rooted in rich pond mud. Giant umbrella-shaped leaves rise above the water surface, along with magnificent multi-petaled fragrant blossoms in soft pink and white.",
    common_issues: ["Rotting leaf edges", "Green pond algae choking water", "Aphids on flower buds", "Leaves browning from lack of sun"],
    problem_cause: "Stagnant, dirty water or lack of direct sunshine causes leaves to rot. Water needs regular fresh topping and open sunshine.",
    remedies: [
      "Keep water clean and gently topped up in the tub or pond.",
      "Add small harmless guppy fish to eat mosquito larvae and algae without bothering the plant.",
      "Wash tiny aphids off leaves with a gentle spray of water.",
    ],
    precautions: [
      "Place the lotus tub where it gets full all-day sunshine (at least 6 hours).",
      "Feed monthly with slow-release fertilizer balls pushed deep into the bottom mud near the tub edge.",
      "Never let the water dry out completely.",
    ],
  },

  // Kitchen Spices
  {
    name: "Curry Leaf (Kadi Patta)",
    scientific_name: "Murraya koenigii",
    family: "Citrus Family (Rutaceae)",
    category: "Kitchen Herb & Spice",
    role: "Essential aromatic seasoning herb of Indian kitchens. Fresh leaves are sizzled in oil (tadka) for dals, chutneys, and curries. Rich in natural iron and antioxidants, widely used to promote hair growth and good digestion.",
    description: "An aromatic small tree or bushy plant with lush green compound leaves made of 11 to 21 fragrant leaflets, small white flowers, and dark berries. Very popular in home gardens across India.",
    common_issues: ["Curling leaf tips", "Tiny bugs under young shoots (Psyllids)", "Black powder on leaves (Sooty mold)", "Yellowing leaves"],
    problem_cause: "Tiny sap-sucking bugs attack tender new leaf tips, making them curl tightly and leaving sticky residue that turns into harmless but unsightly black powder.",
    remedies: [
      "Spray organic neem oil (1 teaspoon neem oil + a few drops mild soap in 1 liter water) on young shoots in the evening.",
      "Wash leaves gently with clean water to rinse off sticky residue and black mold.",
      "Prune curled dried branch tips to trigger fresh, healthy, aromatic new shoots.",
      "Feed with diluted sour buttermilk or compost tea every two weeks for dark green leaves.",
    ],
    precautions: [
      "Trim branch tips regularly (harvest from the top) to keep the plant bushy instead of a single tall stick.",
      "Give at least 5 to 6 hours of bright sunlight every day.",
      "Do not overwater; allow the top layer of soil to dry before adding more water.",
    ],
  },
  {
    name: "Cardamom (Elaichi)",
    scientific_name: "Elettaria cardamomum",
    family: "Ginger Family (Zingiberaceae)",
    category: "Spice",
    role: "The 'Queen of Spices'. Famous commercial spice grown in the cool misty rainforests of the Western Ghats (Kerala, Karnataka). Used in Indian sweets, biryanis, masala chai, and traditional mouth fresheners.",
    description: "A tall reed-like perennial plant growing 2 to 4 meters high from underground roots, with long spear-shaped green leaves and creeping flowering shoots along the soil that bear fragrant green pods.",
    common_issues: ["Yellow stripe mosaic virus", "Root rot in waterlogged soil", "Tiny pod thrips", "Drying clump shoots"],
    problem_cause: "Tiny aphids spread viral stripes onto leaves, or heavy monsoon water standing around roots rots the fleshy underground rhizomes.",
    remedies: [
      "Spray neem soap solution on leaf shoots to keep sap-sucking aphids and thrips away.",
      "Add beneficial compost fungus (Trichoderma) to the root zone to stop root rot.",
      "Remove and discard severely virus-striped clumps so it does not spread.",
    ],
    precautions: [
      "Grow in partial shade under taller trees (50% filtered sunlight); protect from harsh direct afternoon sun.",
      "Ensure excellent drainage trenches so monsoon rainwater never sits still in the soil.",
      "Mulch soil heavily with fallen dry forest leaves to keep roots cool and moist.",
    ],
  },
  {
    name: "Turmeric (Haldi)",
    scientific_name: "Curcuma longa",
    family: "Ginger Family (Zingiberaceae)",
    category: "Spice & Medicinal",
    role: "The golden spice of India. Powerful natural anti-inflammatory and antiseptic containing curcumin. Essential for every Indian curry, auspicious wedding rituals (haldi ceremony), skincare, and warm golden milk (haldi doodh).",
    description: "A leafy plant with broad emerald green leaves rising directly from aromatic golden-yellow finger roots underground. Very easy to grow in home gardens and pots during the warm monsoon season.",
    common_issues: ["Brown leaf blotches", "Soft root rot underground", "Leaf shoot drying", "Pale leaves"],
    problem_cause: "Heavy damp humidity causes brown leaf blotch spots. If pots or beds do not drain well, underground turmeric rhizomes can rot in wet mud.",
    remedies: [
      "Spray mild copper water or neem spray on the leaves when brown spots first appear.",
      "Mix organic Trichoderma bio-compost into the soil around the roots to keep underground fingers healthy.",
      "Pick off and discard heavily spotted dry outer leaves.",
    ],
    precautions: [
      "Plant seed rhizomes in loose, well-draining sandy loam soil mixed with rich compost.",
      "Mulch the soil bed with dry leaves or straw to preserve moisture and suppress weeds.",
      "Do not allow water to stand in the pot or garden bed.",
    ],
  },
  {
    name: "Black Pepper (Kali Mirch)",
    scientific_name: "Piper nigrum",
    family: "Pepper Family (Piperaceae)",
    category: "Spice",
    role: "The 'King of Spices' and 'Black Gold' native to the Malabar coast of Kerala. The world's most popular table spice; enhances nutrient absorption and adds warm pungent flavor to Indian cooking.",
    description: "A perennial climbing vine with glossy heart-shaped green leaves that climbs up tree trunks or poles using small aerial roots, producing hanging spikes of small round peppercorns.",
    common_issues: ["Quick wilt (Sudden drooping of vine)", "Root rot from soggy soil", "Leaf spots", "Slow growth"],
    problem_cause: "Heavy monsoon rains can cause water to collect at the base of the vine, rotting root collars and making the entire vine suddenly droop and drop its leaves.",
    remedies: [
      "Pour mild organic Bordeaux mixture or copper water into the root basin at the base of the vine.",
      "Add neem cake and Trichoderma compost to the root zone to protect roots from soil mold.",
      "Trim lower leaves and trailing vines that touch wet soil.",
    ],
    precautions: [
      "Plant on raised soil mounds so rain water slopes away from the base of the vine.",
      "Grow against a sturdy tree trunk or trellis with dappled partial shade.",
      "Add 1 kg of neem cake around each vine annually.",
    ],
  },
  {
    name: "Cinnamon (Dalchini)",
    scientific_name: "Cinnamomum verum",
    family: "Laurel Family (Lauraceae)",
    category: "Spice",
    role: "A prized aromatic sweet spice tree native to southern India. The sweet fragrant inner bark is peeled, dried into quills, and used in garam masala, biryanis, desserts, and soothing herbal teas.",
    description: "An evergreen tree with thick textured bark, glossy aromatic leaves, and fragrant sweet inner bark. Grown in coastal and hill plantations of South India.",
    common_issues: ["Pink mold on branch forks", "Leaf browning", "Stem dieback"],
    problem_cause: "Prolonged monsoon humidity encourages pink mold to grow in branch forks, killing the tender bark and causing branch tips to dry up.",
    remedies: [
      "Prune dried branches 4 inches below the damage and dab the cut with turmeric or copper paste.",
      "Spray mild copper water on the canopy during dry weather breaks.",
    ],
    precautions: [
      "Give enough spacing between trees so breezy wind dries leaves and branches quickly.",
      "Inspect branch forks during rainy monsoon months.",
    ],
  },
  {
    name: "Clove (Laung)",
    scientific_name: "Syzygium aromaticum",
    family: "Myrtle Family (Myrtaceae)",
    category: "Spice",
    role: "A prized warming spice of Indian cuisine and Ayurvedic medicine. Dried unopened flower buds are packed with eugenol oil, widely used for soothing toothache, freshening breath, and flavoring curries and chai.",
    description: "A slow-growing evergreen tree with smooth grey bark and shiny aromatic dark green leaves. Clusters of unopened flower buds start green, turn pink, and are picked and dried into dark brown cloves.",
    common_issues: ["Stem browning", "Leaf spot mold", "Root rot in clay soil"],
    problem_cause: "Excess water staying around the roots or cold damp winds can cause fungal leaf spotting and stem drying.",
    remedies: [
      "Spray mild copper water or organic neem extract on leaves if spots appear.",
      "Improve drainage around the tree base with compost and coarse sand.",
    ],
    precautions: [
      "Plant in warm, humid tropical climates with rich, well-draining red soil.",
      "Protect young saplings from harsh hot winds and direct midday sun.",
    ],
  },
  {
    name: "Ginger (Adrak)",
    scientific_name: "Zingiber officinale",
    family: "Ginger Family (Zingiberaceae)",
    category: "Spice & Medicinal",
    role: "Daily essential in Indian cooking (Adrak / Sonth). Adds zesty warmth to curries, chai, and chutneys. Celebrated in Ayurveda for curing cold, cough, and upset stomach.",
    description: "A slender perennial plant with upright reed-like stems and narrow green leaves that grow from knobby, aromatic underground rhizomes. Super easy to grow in backyard pots.",
    common_issues: ["Soft root rot underground", "Yellowing and wilting leaves", "Leaf tip drying"],
    problem_cause: "Overwatering or soggy soil causes underground ginger roots to turn mushy and rot, making the above-ground green shoots turn yellow and fall over.",
    remedies: [
      "Let the top 2 inches of soil dry before watering; ginger roots need moist but never waterlogged soil.",
      "Add beneficial compost bio-fungicide (Trichoderma) to the potting soil.",
      "Ensure pots have big drainage holes so excess water drains out immediately.",
    ],
    precautions: [
      "Grow in loose, fluffy potting mix with 40% compost and 30% sand or perlite.",
      "Place in bright indirect sunlight or gentle morning sun.",
      "Harvest fresh ginger when leaves start naturally turning yellow after 8 to 9 months.",
    ],
  },

  // Medicinal & Home Plants
  {
    name: "Tulsi (Holy Basil)",
    scientific_name: "Ocimum sanctum",
    family: "Mint Family (Lamiaceae)",
    category: "Medicinal & Sacred",
    role: "The most revered healing plant in Indian homes, worshipped daily in courtyard 'Tulsi Chaura'. Supreme Ayurvedic adaptogen: fresh leaves are chewed or brewed into kadha tea for coughs, respiratory health, and immunity.",
    description: "A fragrant bushy herb growing 30 to 60 cm tall with green or purple leaves filled with sweet clove-like herbal aroma, and small purple flower spikes (manjari) at branch tips.",
    common_issues: ["Yellow wilting leaves", "White powdery coating", "Tiny caterpillars curling leaves", "Black bugs on tender stems"],
    problem_cause: "Water staying in the pot rots the root hairs, or lack of sunlight makes leaves yellow and weak. Cloudy damp air can cause white powdery mold.",
    remedies: [
      "Pinch off dry purple seed clusters (manjari) regularly to keep the plant bushy, green, and full of fresh leaves.",
      "Spray diluted sour buttermilk (1 part buttermilk to 4 parts water) or mild baking soda spray for white powdery mold.",
      "Spray neem oil or mild soap spray for tiny black bugs.",
      "Ensure pot has clear bottom drainage so excess water escapes freely.",
    ],
    precautions: [
      "Place in full bright direct sunlight (at least 4 to 6 hours daily); tulsi will deteriorate quickly in dark indoor corners.",
      "Use a breathable terracotta clay pot with a good drainage hole.",
      "Water in the morning; never let soil stay soggy at night.",
    ],
  },
  {
    name: "Neem Tree",
    scientific_name: "Azadirachta indica",
    family: "Mahogany Family (Meliaceae)",
    category: "Medicinal Tree",
    role: "Known as the 'Village Pharmacy' of India. Every part is beneficial: neem leaves purify skin, neem seed oil is the gold standard of organic insect repellent, and fresh neem twigs are used as natural antibacterial toothbrushes (daatun).",
    description: "A very tough, fast-growing shade tree that thrives across India. Features graceful feathery leaves with curved serrated edges, small fragrant white flowers, and yellow fruit berries.",
    common_issues: ["Branch tip drying (Dieback)", "Tiny sap-sucking bugs", "Leaf browning"],
    problem_cause: "Humid rainy weather can cause branch tips to dry back, or small sap-sucking insects can attack tender new shoots.",
    remedies: [
      "Prune dried twig tips 6 inches below the dry spot and seal cut with turmeric paste.",
      "Spray mild copper water if leaves get brown fungal spots.",
    ],
    precautions: [
      "Plant in deep, well-draining soil with full open sunshine.",
      "Water moderately; mature neem trees are drought-proof and need very little water.",
    ],
  },
  {
    name: "Aloe Vera (Ghritkumari)",
    scientific_name: "Aloe barbadensis",
    family: "Aloe Family (Asphodelaceae)",
    category: "Medicinal Succulent",
    role: "One of India's favorite healing balcony plants. Thick fleshy leaves contain clear cooling gel used to heal burns, soothe sunburn, hydrate skin, and make Ayurvedic health juice.",
    description: "A stemless succulent plant with thick, fleshy, spiked green leaves filled with soothing clear gel. Thrives with minimal care on sunny Indian balconies and window sills.",
    common_issues: ["Soft mushy leaves that collapse", "Brown sunburn spots", "White cottony bugs tucked in leaf bases"],
    problem_cause: "Overwatering is the number one cause: roots rot in soggy wet soil, making the thick fleshy leaves turn soft, watery, and mushy at the base.",
    remedies: [
      "Stop watering immediately! Take plant out of wet soil, trim off any black mushy roots, let it dry on paper for 2 days, and repot in dry gritty soil.",
      "Mix 50% coarse sand or gravel into the potting soil so water drains out instantly.",
      "Move away from scorching hot afternoon summer sun if leaves turn reddish-brown.",
    ],
    precautions: [
      "Water only once every 2 to 3 weeks on the 'soak and dry' method: water thoroughly, then wait until soil is completely dry before watering again.",
      "Keep in bright indirect sunlight or soft morning sunshine.",
      "Always use a pot with bottom drainage holes.",
    ],
  },
  {
    name: "Giloy (Guduchi)",
    scientific_name: "Tinospora cordifolia",
    family: "Moonseed Family (Menispermaceae)",
    category: "Medicinal Vine",
    role: "Known as 'Amrita' (root of immortality) in Ayurveda. Famous climbing medicinal vine prepared as kadha juice to boost immune strength, fight chronic fevers, and detoxify the body.",
    description: "A vigorous climbing vine with lovely heart-shaped green leaves, textured grey bark, and long hanging aerial roots. Traditionally grown climbing on a neem tree for maximum herbal potency.",
    common_issues: ["Leaf spots during monsoon", "Stem drying", "Root rot from damp soil"],
    problem_cause: "Overwatering in pots with poor drainage rots the fleshy stem roots, or cloudy humid weather creates spots on heart-shaped leaves.",
    remedies: [
      "Spray mild neem oil or copper spray for leaf spots.",
      "Provide a sturdy wooden trellis, wall support, or tree for the vine to climb.",
    ],
    precautions: [
      "Plant in well-draining soil and never let water stand still around roots.",
      "Provide partial or full sunshine for lush green growth.",
    ],
  },
  {
    name: "Money Plant (Pothos)",
    scientific_name: "Epipremnum aureum",
    family: "Arum Family (Araceae)",
    category: "Household Plant",
    role: "The most beloved indoor plant in Indian homes. Symbolizes good luck and prosperity in Vastu, purifies indoor air, and thrives effortlessly in soil pots or glass water bottles on window sills.",
    description: "An evergreen climbing or trailing vine with glossy, heart-shaped leaves splashed with cheerful golden-yellow patterns. Very easy to grow and propagate from cuttings.",
    common_issues: ["Yellow leaves", "Brown dry leaf tips", "Limp wilting stems", "White mealybugs"],
    problem_cause: "Overwatering or soil staying continuously wet deprives roots of oxygen, making lower leaves turn bright yellow and drop. Dry air or direct scorching sun browns leaf edges.",
    remedies: [
      "Wait until the top half of the soil feels dry to the touch before watering again.",
      "Trim yellow leaves near the stem using clean scissors.",
      "Wipe leaves with a damp cloth or spray with diluted neem water to keep them clean and glossy.",
    ],
    precautions: [
      "Keep in bright, indirect sunlight; harsh direct sun scorches leaves, while deep darkness slows growth.",
      "Make sure the pot has good bottom drainage holes.",
      "Mist leaves occasionally during dry hot months for healthy green leaves.",
    ],
  },
];
