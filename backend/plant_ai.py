from __future__ import annotations
import os
import json
import logging
import httpx
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logger = logging.getLogger(__name__)

# ==============================================================================
# EASY-TO-UNDERSTAND PLANT CARE REPOSITORY FOR INDIAN SUBCONTINENT PLANTS
# Contains Palms, Fruits, Flowers, Kitchen Spices, and Healing Plants.
# Written in simple, everyday English that any plant lover or farmer can understand.
# ==============================================================================
EXPANDED_BOTANICAL_KNOWLEDGE = [
    # --- 1. PALMS & BIG UTILITY PLANTS ---
    {
        "name": "Coconut Palm (Nariyal)",
        "scientific_name": "Cocos nucifera",
        "family": "Palm Family (Arecaceae)",
        "category": "Palm & Tree",
        "role": "Revered as 'Kalpavriksha' (the wish-fulfilling tree) across India. It gives sweet coconut water, cooking oil, nutritious coconut meat, coir fibers for ropes and door mats, and strong leaves used for roofing thatch.",
        "description": "A tall, beautiful coconut tree that grows 20 to 30 meters high with a slender trunk and long arching green leaves. It loves warm sunshine, coastal breezes, and sandy or moist soil.",
        "common_issues": ["Brown leaf spots", "Crown rot from heavy rains", "Rhinoceros beetle bug holes", "Red palm weevil in stem"],
        "problem_cause": "Damp rainy weather or burrowing beetles damage the soft growing shoot right at the top of the tree. When water settles inside, fungus causes the young center leaves to rot and turn brown.",
        "remedies": [
            "Carefully clean away rotten leaf fibers at the top, and apply organic neem cake powder mixed with coarse sand in the leaf bases to keep beetles away.",
            "Spray mild copper water or organic Bordeaux mixture on the crown leaves to stop mold and fungus.",
            "Pour beneficial soil compost tea (Trichoderma) around the base of the trunk to strengthen root health.",
        ],
        "precautions": [
            "Plant coconut trees at least 25 feet apart so every palm gets full sunshine all day long.",
            "Make sure rainwater drains away freely and never stays standing around the base of the trunk.",
            "Feed the tree annually with compost and natural wood ash (potash) to keep fronds tough and healthy.",
            "Avoid making cuts or wounds on the tree trunk, which attract harmful insects.",
        ],
    },
    {
        "name": "Areca Palm / Supari (Areca catechu)",
        "scientific_name": "Areca catechu",
        "family": "Palm Family (Arecaceae)",
        "category": "Palm & Tree",
        "role": "A valuable plantation tree in Karnataka, Kerala, and Assam. Produces betel nuts (supari) used in Indian hospitality and ceremonies. Its fallen leaf sheaths are pressed into biodegradable, eco-friendly plates and bowls.",
        "description": "A slender, graceful palm tree reaching 15 to 20 meters tall with a smooth grey trunk and vibrant dark-green feather leaves. It grows best in warm tropical weather with rich soil and partial shade when young.",
        "common_issues": ["Monsoon fruit rot (Koleroga)", "Yellow leaf disease", "Foot rot near root base", "Tiny leaf bugs"],
        "problem_cause": "Heavy monsoon rains splash mold fungus onto developing nut bunches. The nuts turn water-soaked, rot, and fall off before ripening.",
        "remedies": [
            "Spray mild organic Bordeaux mixture over developing nut bunches before heavy monsoon rains arrive.",
            "Cover nut bunches with breathable rain hoods or eco-friendly covers to shield them from heavy rain splash.",
            "Dig a shallow drainage trench around the tree base to stop soggy water from gathering at the roots.",
        ],
        "precautions": [
            "Keep drainage channels clear between rows so water flows away smoothly during rains.",
            "Add neem cake mixed with organic compost around the roots once a year.",
            "Collect and remove any fallen rotting nuts from the ground so mold does not spread.",
        ],
    },
    {
        "name": "Lipstick Palm (Sealing Wax / Maharajah Palm)",
        "scientific_name": "Cyrtostachys renda",
        "family": "Palm Family (Arecaceae)",
        "category": "Palm & Tree",
        "role": "An ornamental clumping palm cultivated in warm, humid parts of India. It is admired for its bright red crownshafts and leaf stalks against long, feather-shaped green leaves. It is native to Southeast Asian rainforests, not native to India.",
        "description": "Several slender stems grow in a cluster, with vivid red leaf bases and midribs and arching green fronds. It needs warmth, humidity, bright filtered light or partial shade, and soil kept consistently moist; protect it from drought and cool conditions.",
        "common_issues": ["Scale insects", "Red spider mites, especially indoors", "Leaf browning from dry air or drought stress", "Yellowing from growing stress"],
        "problem_cause": "This palm is sensitive to dry air and drying soil, which can brown the leaves. Scale insects or red spider mites may appear, particularly on indoor plants; it is generally considered disease-free.",
        "remedies": [
            "Check stems and leaf undersides for scale insects or fine mite webbing; rinse the foliage and isolate an affected potted plant.",
            "If pests remain, use a product labeled for ornamental palms and follow its label directions; test it on a small area first.",
            "Keep the root zone evenly moist and raise humidity, while using a container with drainage so water does not stagnate around the roots.",
        ],
        "precautions": [
            "Grow in a warm, sheltered, humid location; protect the palm from cool drafts and cold weather.",
            "Provide bright filtered light or partial shade and avoid harsh exposure when the plant is young.",
            "Use rich loamy soil and keep it evenly moist; do not let the root ball dry out.",
            "Inspect leaf undersides and stems regularly for scale insects and red spider mites.",
        ],
    },
    {
        "name": "Palmyra Palm (Taad / Tadgola)",
        "scientific_name": "Borassus flabellifer",
        "family": "Palm Family (Arecaceae)",
        "category": "Palm & Tree",
        "role": "Known as the 'Tree of Life' in Southern India. Produces refreshing ice apples (tadgola/nungu), sweet natural neera sap, palm jaggery, strong natural fiber, and termite-resistant timber.",
        "description": "A very sturdy, drought-resistant tree with a dark, textured trunk and a rounded crown of stiff, fan-shaped green leaves. It can survive hot dry summers and thrives in open fields.",
        "common_issues": ["Leaf caterpillars", "Center shoot browning", "Black mold on leaves", "Waterlogging stress"],
        "problem_cause": "Standing rainwater during cyclonic storms or leaf-eating caterpillars chew through the fronds, leaving the young spear shoot open to fungal rot.",
        "remedies": [
            "Spray mild neem oil or copper solution if brown spots appear on the center spear leaf.",
            "Remove dried or damaged outer leaves to let fresh air reach the crown.",
        ],
        "precautions": [
            "Plant along field borders and farm banks where it acts as a natural windbreak and holds soil firmly.",
            "Ensure the ground does not stay submerged in water for weeks at a time.",
        ],
    },
    {
        "name": "Bamboo (Baans)",
        "scientific_name": "Bambusa vulgaris",
        "family": "Grass Family (Poaceae)",
        "category": "Utility Plant",
        "role": "Known as 'Green Gold' of India. Provides sustainable building poles, fencing, paper pulp, baskets, handicrafts, and delicious tender bamboo shoots used in traditional curries. Its roots protect riverbanks from washing away.",
        "description": "A very fast-growing giant grass that grows in lush clumps with golden or green hollow woody canes. It produces lots of light feathery green leaves and thrives in warm, moist climates.",
        "common_issues": ["Stem borer beetles", "Leaf rust spots", "Drying shoot tips", "Overcrowded clump center"],
        "problem_cause": "Too many old canes crowded tightly together block sunlight and fresh air. Humid damp weather then allows fungus rust spots to spread onto leaves.",
        "remedies": [
            "Cut away old, dead canes from the middle of the clump to let fresh breeze and bright sunlight inside.",
            "Spray mild organic copper water or neem spray on new shoots if leaf spotting begins.",
        ],
        "precautions": [
            "Thin out clumps annually to keep plants healthy and well-spaced.",
            "Harvest mature bamboo canes during dry winter months when natural plant starch is lowest.",
        ],
    },
    {
        "name": "Banana Plant (Kela)",
        "scientific_name": "Musa paradisiaca",
        "family": "Banana Family (Musaceae)",
        "category": "Fruit Plant",
        "role": "One of India's most beloved fruit plants. Every part is used: sweet nutritious bananas, raw cooking bananas, edible banana flowers, tender inner stem core, and broad green leaves used for traditional feast meals.",
        "description": "A lush, giant leafy plant with an upright fleshy trunk formed by tightly wrapped leaf stalks, crowned by huge glossy green leaves and large hanging bunches of bananas.",
        "common_issues": ["Leaf streak spots (Sigatoka)", "Yellowing wilt", "Stem weevil beetles", "Torn leaves from wind"],
        "problem_cause": "Warm rainy weather spreads leaf spot mold onto wet leaves, creating brown drying streaks that stop the leaves from making food for the fruit bunch.",
        "remedies": [
            "Trim off heavily spotted dry leaves and discard them away from the garden.",
            "Spray organic neem seed oil or mild copper spray during cloudy, rainy weeks.",
            "Pour neem cake tea around the base to deter soil beetles.",
        ],
        "precautions": [
            "Plant on raised soil beds so extra water runs off easily and never pools around the roots.",
            "Grow in a sheltered, sunny spot protected from strong gusty winds that tear broad leaves.",
            "Feed regularly with composted cow manure and wood ash for big healthy banana bunches.",
        ],
    },

    # --- 2. MANGO & FRUIT TREES ---
    {
        "name": "Mango Tree (Aam)",
        "scientific_name": "Mangifera indica",
        "family": "Cashew Family (Anacardiaceae)",
        "category": "Fruit Tree",
        "role": "The National Fruit of India and 'King of Fruits' (famous for Alphonso, Kesar, Dasheri, and Banganapalli). Fresh mango leaves are strung across doorways as auspicious festive torans.",
        "description": "A grand, shady evergreen tree that can live for hundreds of years. Features deep green leathery leaves that start out bronze-pink when young, and huge fragrant clusters of tiny sweet flowers in spring.",
        "common_issues": ["Black spot on leaves and fruit (Anthracnose)", "White powdery leaf coating", "Tiny hopping bugs on flower clusters", "Tip drying"],
        "problem_cause": "Cloudy, damp, or misty weather allows anthracnose fungus to grow, causing dark sunken spots on leaves and flowers. This makes blossoms drop early and stains the skin of growing mangoes.",
        "remedies": [
            "Spray mild copper water (copper oxychloride) or neem oil spray when flower clusters first open and after baby fruits appear.",
            "Spray baking soda water (1 teaspoon per liter) or wettable sulfur if white powder coats the leaves.",
            "Spray organic neem oil early in the morning to remove tiny hopping bugs from flower shoots.",
        ],
        "precautions": [
            "Prune congested inner branches after summer harvest (August-September) so sunlight reaches all parts of the tree.",
            "Rake up and discard fallen dry leaves around the tree base to stop fungal spores from overwintering.",
            "Do not spray water over flowers and opening buds; water only at the soil line.",
            "Add compost and natural manure around the drip line every year after monsoon season.",
        ],
    },
    {
        "name": "Guava Tree (Amrood)",
        "scientific_name": "Psidium guajava",
        "family": "Myrtle Family (Myrtaceae)",
        "category": "Fruit Tree",
        "role": "Known as the 'Apple of the Tropics' in India (famous for Allahabad Safeda and Sardar varieties). Loaded with Vitamin C and dietary fiber. Fresh guava leaves are chewed in home remedies to soothe gums and toothache.",
        "description": "A lovely small fruit tree with smooth, peeling reddish-brown bark, fragrant white blossoms, and sweet round fruits with crunchy edible seeds. Very easy to grow in home gardens and orchards.",
        "common_issues": ["Sudden wilting of branches", "Fruit fly worms inside fruit", "Dark spots on fruit skin", "Yellowing leaves"],
        "problem_cause": "Heavy waterlogged clay soil can rot the root hairs, making branches suddenly wilt and leaves turn yellow. Fruit flies lay eggs under fruit skin when guava starts to ripen.",
        "remedies": [
            "Add organic bio-fungicide (Trichoderma) mixed with compost to the root basin to heal roots.",
            "Tie breathable paper bags or cloth pouches over growing guavas about one month after flowering to keep fruit flies away.",
            "Spray mild neem oil or copper water for dark skin spots.",
        ],
        "precautions": [
            "Ensure the tree is planted in well-draining soil where water never stays stagnant.",
            "Prune back tips by 20% after harvest to encourage strong new fruiting shoots.",
            "Collect fallen overripe fruits from the soil every day so fruit flies do not multiply.",
        ],
    },
    {
        "name": "Papaya Plant (Papita)",
        "scientific_name": "Carica papaya",
        "family": "Papaya Family (Caricaceae)",
        "category": "Fruit Plant",
        "role": "A fast-growing tropical fruit loved across India. Rich in digestive enzymes (papain) and vitamins. Fresh papaya leaf juice is widely prepared at home to help raise blood platelets during viral fevers.",
        "description": "A fast-growing, semi-woody plant with a straight green trunk, giant deeply-lobed umbrella leaves on long hollow stems, and large sweet melon-like fruits clustered along the upper trunk.",
        "common_issues": ["Yellow mosaic leaf curling (Virus)", "Stem rot at ground level", "Root rot from damp soil", "Tiny aphids under leaves"],
        "problem_cause": "Too much water sitting around the stem base rots the soft trunk. Tiny sap-sucking aphids also transmit leaf curl virus between plants, making leaves look stunted and yellow.",
        "remedies": [
            "Keep the soil around the base slightly raised so water always drains away from the trunk.",
            "Spray mild neem soap water on leaf undersides weekly to wash away aphids and whiteflies.",
            "Remove and discard severely virus-stunted plants to protect other healthy papayas.",
        ],
        "precautions": [
            "Always plant papaya on a raised mound of soil; standing water for even one day can rot papaya roots.",
            "Grow in full all-day sunshine with rich, sandy compost soil.",
            "Add a handful of neem cake around the base every two months to keep root pests away.",
        ],
    },
    {
        "name": "Lemon Tree (Nimbu)",
        "scientific_name": "Citrus aurantiifolia",
        "family": "Citrus Family (Rutaceae)",
        "category": "Fruit Tree",
        "role": "An absolute must-have in every Indian kitchen. Fresh nimbu juice is squeezed into dals, curries, and drinks daily, and whole lemons are used to make delicious Indian pickles (nimbu ka achaar).",
        "description": "A bushy, thorny evergreen small tree with fragrant shiny green leaves, sweet-smelling white flowers, and lots of juicy, tart green-and-yellow lemons. Perfect for backyard gardens and large terrace pots.",
        "common_issues": ["Rough brown spots with yellow rings (Canker)", "Curled silvery leaf tracks (Leaf miner)", "Yellow leaves with green veins", "Branch dieback"],
        "problem_cause": "Tiny caterpillars tunnel through leaf layers, creating silvery tracks. Bacteria then enter these wounds during wet weather, causing rough corky brown spots on leaves and lemons.",
        "remedies": [
            "Trim off branches with rough brown canker spots before rainy weather, and spray with mild copper water.",
            "Spray neem oil spray (1 teaspoon per liter of water with a drop of liquid soap) early in the morning to repel leaf miner caterpillars.",
            "Add composted cow dung and a spoon of Epsom salts (magnesium) to fix pale yellowing leaves.",
        ],
        "precautions": [
            "Place in full sunshine where it gets at least 6 hours of bright light every day.",
            "Water deeply, but let the top 2 inches of soil dry before watering again.",
            "Apply a paste of lime and turmeric or Bordeaux mixture on the lower trunk once a year.",
        ],
    },
    {
        "name": "Pomegranate Tree (Anar)",
        "scientific_name": "Punica granatum",
        "family": "Loosestrife Family (Lythraceae)",
        "category": "Fruit Tree",
        "role": "A prized Indian fruit (famous Bhagwa variety) packed with ruby-red juicy seeds (arils). Widely recommended in Ayurvedic nutrition for boosting hemoglobin, strengthening digestion, and improving heart health.",
        "description": "A bushy, drought-hardy small tree with slender branches, glossy narrow green leaves, bright orange-red trumpet flowers, and thick-skinned fruits filled with sweet red jewel-like seeds.",
        "common_issues": ["Black oily spots on skin and leaves (Bacterial blight)", "Butterfly caterpillar bore holes in fruit", "Fruit cracking", "Root rot"],
        "problem_cause": "Rain and warm humidity allow bacteria to cause dark spots that crack the fruit skin. Pomegranate butterflies also lay eggs on flowers, and the baby caterpillars bore holes into growing fruit.",
        "remedies": [
            "Wrap developing pomegranates with thin paper or cloth bags right after the flower petals fall off.",
            "Spray mild copper spray on leaves if dark spots begin to appear.",
            "Water regularly on a steady schedule; uneven watering causes pomegranate skins to split open.",
        ],
        "precautions": [
            "Use clean, sterilized pruning shears when cutting branches.",
            "Keep the tree pruned to an open vase shape so sunshine and wind dry leaves quickly.",
            "Avoid planting in heavy clay that retains cold water.",
        ],
    },
    {
        "name": "Jackfruit Tree (Kathal)",
        "scientific_name": "Artocarpus heterophyllus",
        "family": "Mulberry Family (Moraceae)",
        "category": "Fruit Tree",
        "role": "The largest tree fruit in the world, state fruit of Kerala and Tamil Nadu. Raw green jackfruit is loved as a hearty vegetable meat substitute, while golden ripe pods (kathal/chakka) are sweet and aromatic.",
        "description": "A grand evergreen tree with dense glossy dark-green leaves and a thick trunk. Giant prickly fruits grow directly on the main trunk and heavy lower branches.",
        "common_issues": ["Soft black blossom rot", "Stem boring bugs", "Leaf spot mold", "Root rot from stagnant water"],
        "problem_cause": "High monsoon humidity and rain make fungus attack baby flowers and small fruitlets, turning them black, soft, and watery.",
        "remedies": [
            "Spray mild copper water or organic Bordeaux spray onto opening flowers during wet spells.",
            "Remove and throw away any blackened small fruitlets hanging from the trunk.",
        ],
        "precautions": [
            "Plant in deep, well-draining soil with plenty of room to grow.",
            "Prune dead interior twigs to keep good air movement around the lower trunk.",
        ],
    },

    # --- 3. COURTYARD & SACRED FLOWERS ---
    {
        "name": "Hibiscus (Gudhal / Jaswand)",
        "scientific_name": "Hibiscus rosa-sinensis",
        "family": "Mallow Family (Malvaceae)",
        "category": "Flowering Plant",
        "role": "The sacred flower of Indian homes and temples, offered to Lord Ganesha and Goddess Kali. Fresh hibiscus flowers and leaves are infused in pure coconut oil to make hair oil that strengthens roots and stops hair fall.",
        "description": "A bushy garden shrub with shiny dark-green toothed leaves and large, radiant flowers with a long pollen stem in red, pink, yellow, and orange. Loves warm Indian sunshine and flowers all year.",
        "common_issues": ["White cottony bugs (Mealybugs)", "Yellow leaves", "Flower buds falling off before opening", "Tiny green aphids"],
        "problem_cause": "White mealybugs cluster like tiny cotton balls on tender shoots and flower buds, sucking sap and making leaves curl and flower buds drop off.",
        "remedies": [
            "Wash away cottony mealybugs with a strong spray of water, then spray 2 tablespoons organic neem oil mixed with 1 teaspoon mild liquid soap in water.",
            "Dab stubborn white bugs directly with a cotton bud dipped in rubbing alcohol.",
            "Give the plant compost and a pinch of Epsom salt (magnesium) to turn pale yellow leaves rich dark green.",
        ],
        "precautions": [
            "Give at least 5 to 6 hours of direct sunshine every single day; hibiscus will not bloom in shade.",
            "Water when the top layer of soil feels dry, but make sure pots have drainage holes so roots never sit in standing water.",
            "Prune back long leggy branches in early spring to encourage plenty of fresh blooming shoots.",
        ],
    },
    {
        "name": "Jasmine (Mogra / Chameli)",
        "scientific_name": "Jasminum sambac",
        "family": "Olive Family (Oleaceae)",
        "category": "Flowering Plant",
        "role": "One of India's most cherished fragrant flowers. Woven into traditional festive hair garlands (gajras), offered in daily temple prayers, and used in perfumes and cooling herbal teas.",
        "description": "A climbing or bushy green shrub with shiny oval leaves and star-shaped pure white blossoms that give off a heavenly sweet perfume, especially in the evening and night.",
        "common_issues": ["Leaf browning and spots", "Tiny red spider mites under leaves", "Bud-eating caterpillars", "Yellowing leaves"],
        "problem_cause": "Warm humid spells cause leaf spots, or tiny spider mites hide under leaves during dry weather, sucking juices and making leaves look dusty and pale.",
        "remedies": [
            "Spray neem oil spray thoroughly under the leaves to clear away tiny mites.",
            "Prune back dried shoots after each blooming cycle to spur new fragrant flower buds.",
            "Spray mild copper water if leaves get dark brown spots.",
        ],
        "precautions": [
            "Prune heavily (cut back stems by half) in late winter (January-February) for masses of sweet summer flowers.",
            "Grow in full bright sunshine in soil mixed with cow dung compost and wood ash.",
            "Water the soil at the base; do not spray water directly over open flower petals.",
        ],
    },
    {
        "name": "Rose (Gulab)",
        "scientific_name": "Rosa indica",
        "family": "Rose Family (Rosaceae)",
        "category": "Flowering Plant",
        "role": "The queen of garden flowers across India. Used in worship, fragrant garlands, pure rose water (Gulab Jal), and traditional sweet rose petal preserve (Gulkand) known in Ayurveda for cooling body heat.",
        "description": "A thorny woody shrub with serrated leaves, sharp thorns along stems, and gorgeous fragrant blossoms with velvety layered petals in red, pink, yellow, and white.",
        "common_issues": ["Black spots on leaves with yellow edges", "White powder on leaves (Powdery mildew)", "Stem dying back from top", "Tiny thrips curling new leaves"],
        "problem_cause": "Water sitting on leaves overnight allows black spot mold to germinate, making leaves turn yellow and drop off. Fungus also causes pruned stem tips to turn black and die downward.",
        "remedies": [
            "Prune blackened dying canes 2 inches below the dark area at an outward slant, and seal the cut with a pinch of turmeric paste.",
            "Spray baking soda spray (1 teaspoon baking soda + few drops mild soap per liter of water) for white powdery mildew.",
            "Spray neem oil in the evening to clear away tiny thrips and aphids.",
        ],
        "precautions": [
            "Always water roses at the soil level; keep foliage dry so black spot mold cannot grow.",
            "Rake away and discard fallen dead leaves from the soil surface.",
            "Leave enough space between plants so gentle breezes dry the leaves quickly.",
            "Feed with composted cow manure or bone meal every month for big blooms.",
        ],
    },
    {
        "name": "Marigold (Genda)",
        "scientific_name": "Tagetes erecta",
        "family": "Daisy Family (Asteraceae)",
        "category": "Flowering Plant",
        "role": "The festival flower of India, seen in every celebration from Diwali to weddings. Farmers plant marigolds around vegetables because its roots naturally keep harmful soil worms (nematodes) away.",
        "description": "A hardy, aromatic annual plant with feathery dark-green leaves and ruffled round flower pom-poms in vibrant sunny yellow, golden orange, and copper red.",
        "common_issues": ["Brown leaf spots", "Damping off in young seedlings", "Faded small blooms", "Spider mites in dry heat"],
        "problem_cause": "Damp rainy weather causes brown leaf spots, or old dead flowers left on the plant rot and sap energy from new incoming buds.",
        "remedies": [
            "Pluck off old faded flowers (deadheading) every week to make the plant produce continuous new blooms.",
            "Remove and throw away lower brown spotted leaves.",
            "Spray mild neem oil or copper water if spots spread.",
        ],
        "precautions": [
            "Keep seedlings spaced 1 foot apart so air circulates freely.",
            "Grow in full, unfiltered bright sunshine in well-draining soil.",
            "Water when the top soil dries out; do not let the pot sit in soggy mud.",
        ],
    },
    {
        "name": "Bougainvillea",
        "scientific_name": "Bougainvillea spectabilis",
        "family": "Four O'Clock Family (Nyctaginaceae)",
        "category": "Flowering Plant",
        "role": "India's favorite vibrant climbing plant seen over archways, terrace railings, and boundary walls. Loved for its brilliant colors, low water needs, and non-stop blooms that survive hot Indian summers.",
        "description": "A vigorous woody climbing vine with sharp thorns, oval green leaves, and huge clusters of paper-thin colorful flower petals (bracts) in hot pink, purple, red, orange, and white.",
        "common_issues": ["Lots of green leaves but zero flowers", "Yellow leaves from overwatering", "Caterpillars chewing leaves"],
        "problem_cause": "Too much water and fertilizer causes the plant to grow only leafy green foliage and stops it from blooming. Bougainvillea blooms best when soil dries out between waterings.",
        "remedies": [
            "Reduce watering: let the soil dry out thoroughly until the leaves slightly droop before giving water to trigger massive flowering.",
            "Add a handful of wood ash or potassium compost to boost blooms.",
            "Hand-pick green caterpillars or spray neem oil.",
        ],
        "precautions": [
            "Plant in the hottest, sunniest spot you have (at least 6 to 8 hours of direct sunshine daily).",
            "Make sure the soil drains rapidly; bougainvillea hates wet feet.",
            "Prune lightly after each blooming flush to maintain a bushy shape and trigger new flower clusters.",
        ],
    },
    {
        "name": "Champa (Plumeria)",
        "scientific_name": "Plumeria rubra",
        "family": "Dogbane Family (Apocynaceae)",
        "category": "Flowering Plant",
        "role": "The sacred temple tree of India (Champa). Its thick, star-like flowers with sweet exotic fragrance are offered in prayers, floated in decorative brass urli bowls, and worn in hair.",
        "description": "A small succulent tree with smooth grey bark, thick fleshy branches, long leathery leaves at branch tips, and intensely sweet-scented flowers in creamy white, yellow, and deep pink.",
        "common_issues": ["Orange-yellow powder on leaf backs (Rust)", "Soft black rot at branch tips", "Leaves dropping in winter"],
        "problem_cause": "Humid rainy weather creates orange rust fungus powder on leaf undersides. Soft rot at branch tips occurs when fleshy stems get waterlogged in cold or damp soil.",
        "remedies": [
            "Spray mild copper water or sulfur water under leaves to clear orange rust powder.",
            "Cut off any soft, mushy black branch tips with clean shears, and dust the cut with turmeric or cinnamon powder.",
            "Note that leaf drop in winter is normal dormancy; the tree will grow fresh green leaves in spring.",
        ],
        "precautions": [
            "Grow in full bright sunshine and fast-draining gritty soil.",
            "Water sparingly; allow the soil to dry out completely between waterings.",
            "Cut back watering drastically during cold winter months.",
        ],
    },
    {
        "name": "Indian Lotus (Kamal)",
        "scientific_name": "Nelumbo nucifera",
        "family": "Lotus Family (Nelumbonaceae)",
        "category": "Water Plant",
        "role": "The National Flower of India. Sacred symbol of purity, beauty, and wisdom associated with Goddess Lakshmi and Goddess Saraswati. Every part is eaten or used: lotus seeds (makhana), lotus root (kamal kakdi), and broad leaves.",
        "description": "A breathtaking aquatic water plant rooted in rich pond mud. Giant umbrella-shaped leaves rise above the water surface, along with magnificent multi-petaled fragrant blossoms in soft pink and white.",
        "common_issues": ["Rotting leaf edges", "Green pond algae choking water", "Aphids on flower buds", "Leaves browning from lack of sun"],
        "problem_cause": "Stagnant, dirty water or lack of direct sunshine causes leaves to rot. Water needs regular fresh topping and open sunshine.",
        "remedies": [
            "Keep water clean and gently topped up in the tub or pond.",
            "Add small harmless guppy fish to eat mosquito larvae and algae without bothering the plant.",
            "Wash tiny aphids off leaves with a gentle spray of water.",
        ],
        "precautions": [
            "Place the lotus tub where it gets full all-day sunshine (at least 6 hours).",
            "Feed monthly with slow-release fertilizer balls pushed deep into the bottom mud near the tub edge.",
            "Never let the water dry out completely.",
        ],
    },

    # --- 4. KITCHEN SPICES & PLANTATIONS ---
    {
        "name": "Curry Leaf (Kadi Patta)",
        "scientific_name": "Murraya koenigii",
        "family": "Citrus Family (Rutaceae)",
        "category": "Kitchen Herb & Spice",
        "role": "Essential aromatic seasoning herb of Indian kitchens. Fresh leaves are sizzled in oil (tadka) for dals, chutneys, and curries. Rich in natural iron and antioxidants, widely used to promote hair growth and good digestion.",
        "description": "An aromatic small tree or bushy plant with lush green compound leaves made of 11 to 21 fragrant leaflets, small white flowers, and dark berries. Very popular in home gardens across India.",
        "common_issues": ["Curling leaf tips", "Tiny bugs under young shoots (Psyllids)", "Black powder on leaves (Sooty mold)", "Yellowing leaves"],
        "problem_cause": "Tiny sap-sucking bugs attack tender new leaf tips, making them curl tightly and leaving sticky residue that turns into harmless but unsightly black powder.",
        "remedies": [
            "Spray organic neem oil (1 teaspoon neem oil + a few drops mild soap in 1 liter water) on young shoots in the evening.",
            "Wash leaves gently with clean water to rinse off sticky residue and black mold.",
            "Prune curled dried branch tips to trigger fresh, healthy, aromatic new shoots.",
            "Feed with diluted sour buttermilk or compost tea every two weeks for dark green leaves.",
        ],
        "precautions": [
            "Trim branch tips regularly (harvest from the top) to keep the plant bushy instead of a single tall stick.",
            "Give at least 5 to 6 hours of bright sunlight every day.",
            "Do not overwater; allow the top layer of soil to dry before adding more water.",
        ],
    },
    {
        "name": "Cardamom (Elaichi)",
        "scientific_name": "Elettaria cardamomum",
        "family": "Ginger Family (Zingiberaceae)",
        "category": "Spice",
        "role": "The 'Queen of Spices'. Famous commercial spice grown in the cool misty rainforests of the Western Ghats (Kerala, Karnataka). Used in Indian sweets, biryanis, masala chai, and traditional mouth fresheners.",
        "description": "A tall reed-like perennial plant growing 2 to 4 meters high from underground roots, with long spear-shaped green leaves and creeping flowering shoots along the soil that bear fragrant green pods.",
        "common_issues": ["Yellow stripe mosaic virus", "Root rot in waterlogged soil", "Tiny pod thrips", "Drying clump shoots"],
        "problem_cause": "Tiny aphids spread viral stripes onto leaves, or heavy monsoon water standing around roots rots the fleshy underground rhizomes.",
        "remedies": [
            "Spray neem soap solution on leaf shoots to keep sap-sucking aphids and thrips away.",
            "Add beneficial compost fungus (Trichoderma) to the root zone to stop root rot.",
            "Remove and discard severely virus-striped clumps so it does not spread.",
        ],
        "precautions": [
            "Grow in partial shade under taller trees (50% filtered sunlight); protect from harsh direct afternoon sun.",
            "Ensure excellent drainage trenches so monsoon rainwater never sits still in the soil.",
            "Mulch soil heavily with fallen dry forest leaves to keep roots cool and moist.",
        ],
    },
    {
        "name": "Turmeric (Haldi)",
        "scientific_name": "Curcuma longa",
        "family": "Ginger Family (Zingiberaceae)",
        "category": "Spice & Medicinal",
        "role": "The golden spice of India. Powerful natural anti-inflammatory and antiseptic containing curcumin. Essential for every Indian curry, auspicious wedding rituals (haldi ceremony), skincare, and warm golden milk (haldi doodh).",
        "description": "A leafy plant with broad emerald green leaves rising directly from aromatic golden-yellow finger roots underground. Very easy to grow in home gardens and pots during the warm monsoon season.",
        "common_issues": ["Brown leaf blotches", "Soft root rot underground", "Leaf shoot drying", "Pale leaves"],
        "problem_cause": "Heavy damp humidity causes brown leaf blotch spots. If pots or beds do not drain well, underground turmeric rhizomes can rot in wet mud.",
        "remedies": [
            "Spray mild copper water or neem spray on the leaves when brown spots first appear.",
            "Mix organic Trichoderma bio-compost into the soil around the roots to keep underground fingers healthy.",
            "Pick off and discard heavily spotted dry outer leaves.",
        ],
        "precautions": [
            "Plant seed rhizomes in loose, well-draining sandy loam soil mixed with rich compost.",
            "Mulch the soil bed with dry leaves or straw to preserve moisture and suppress weeds.",
            "Do not allow water to stand in the pot or garden bed.",
        ],
    },
    {
        "name": "Black Pepper (Kali Mirch)",
        "scientific_name": "Piper nigrum",
        "family": "Pepper Family (Piperaceae)",
        "category": "Spice",
        "role": "The 'King of Spices' and 'Black Gold' native to the Malabar coast of Kerala. The world's most popular table spice; enhances nutrient absorption and adds warm pungent flavor to Indian cooking.",
        "description": "A perennial climbing vine with glossy heart-shaped green leaves that climbs up tree trunks or poles using small aerial roots, producing hanging spikes of small round peppercorns.",
        "common_issues": ["Quick wilt (Sudden drooping of vine)", "Root rot from soggy soil", "Leaf spots", "Slow growth"],
        "problem_cause": "Heavy monsoon rains can cause water to collect at the base of the vine, rotting root collars and making the entire vine suddenly droop and drop its leaves.",
        "remedies": [
            "Pour mild organic Bordeaux mixture or copper water into the root basin at the base of the vine.",
            "Add neem cake and Trichoderma compost to the root zone to protect roots from soil mold.",
            "Trim lower leaves and trailing vines that touch wet soil.",
        ],
        "precautions": [
            "Plant on raised soil mounds so rain water slopes away from the base of the vine.",
            "Grow against a sturdy tree trunk or trellis with dappled partial shade.",
            "Add 1 kg of neem cake around each vine annually.",
        ],
    },
    {
        "name": "Cinnamon (Dalchini)",
        "scientific_name": "Cinnamomum verum",
        "family": "Laurel Family (Lauraceae)",
        "category": "Spice",
        "role": "A prized aromatic sweet spice tree native to southern India. The sweet fragrant inner bark is peeled, dried into quills, and used in garam masala, biryanis, desserts, and soothing herbal teas.",
        "description": "An evergreen tree with thick textured bark, glossy aromatic leaves, and fragrant sweet inner bark. Grown in coastal and hill plantations of South India.",
        "common_issues": ["Pink mold on branch forks", "Leaf browning", "Stem dieback"],
        "problem_cause": "Prolonged monsoon humidity encourages pink mold to grow in branch forks, killing the tender bark and causing branch tips to dry up.",
        "remedies": [
            "Prune dried branches 4 inches below the damage and dab the cut with turmeric or copper paste.",
            "Spray mild copper water on the canopy during dry weather breaks.",
        ],
        "precautions": [
            "Give enough spacing between trees so breezy wind dries leaves and branches quickly.",
            "Inspect branch forks during rainy monsoon months.",
        ],
    },
    {
        "name": "Clove (Laung)",
        "scientific_name": "Syzygium aromaticum",
        "family": "Myrtle Family (Myrtaceae)",
        "category": "Spice",
        "role": "A prized warming spice of Indian cuisine and Ayurvedic medicine. Dried unopened flower buds are packed with eugenol oil, widely used for soothing toothache, freshening breath, and flavoring curries and chai.",
        "description": "A slow-growing evergreen tree with smooth grey bark and shiny aromatic dark green leaves. Clusters of unopened flower buds start green, turn pink, and are picked and dried into dark brown cloves.",
        "common_issues": ["Stem browning", "Leaf spot mold", "Root rot in clay soil"],
        "problem_cause": "Excess water staying around the roots or cold damp winds can cause fungal leaf spotting and stem drying.",
        "remedies": [
            "Spray mild copper water or organic neem extract on leaves if spots appear.",
            "Improve drainage around the tree base with compost and coarse sand.",
        ],
        "precautions": [
            "Plant in warm, humid tropical climates with rich, well-draining red soil.",
            "Protect young saplings from harsh hot winds and direct midday sun.",
        ],
    },
    {
        "name": "Ginger (Adrak)",
        "scientific_name": "Zingiber officinale",
        "family": "Ginger Family (Zingiberaceae)",
        "category": "Spice & Medicinal",
        "role": "Daily essential in Indian cooking (Adrak / Sonth). Adds zesty warmth to curries, chai, and chutneys. Celebrated in Ayurveda for curing cold, cough, and upset stomach.",
        "description": "A slender perennial plant with upright reed-like stems and narrow green leaves that grow from knobby, aromatic underground rhizomes. Super easy to grow in backyard pots.",
        "common_issues": ["Soft root rot underground", "Yellowing and wilting leaves", "Leaf tip drying"],
        "problem_cause": "Overwatering or soggy soil causes underground ginger roots to turn mushy and rot, making the above-ground green shoots turn yellow and fall over.",
        "remedies": [
            "Let the top 2 inches of soil dry before watering; ginger roots need moist but never waterlogged soil.",
            "Add beneficial compost bio-fungicide (Trichoderma) to the potting soil.",
            "Ensure pots have big drainage holes so excess water drains out immediately.",
        ],
        "precautions": [
            "Grow in loose, fluffy potting mix with 40% compost and 30% sand or perlite.",
            "Place in bright indirect sunlight or gentle morning sun.",
            "Harvest fresh ginger when leaves start naturally turning yellow after 8 to 9 months.",
        ],
    },

    # --- 5. MEDICINAL & HOME PLANTS ---
    {
        "name": "Tulsi (Holy Basil)",
        "scientific_name": "Ocimum sanctum",
        "family": "Mint Family (Lamiaceae)",
        "category": "Medicinal & Sacred",
        "role": "The most revered healing plant in Indian homes, worshipped daily in courtyard 'Tulsi Chaura'. Supreme Ayurvedic adaptogen: fresh leaves are chewed or brewed into kadha tea for coughs, respiratory health, and immunity.",
        "description": "A fragrant bushy herb growing 30 to 60 cm tall with green or purple leaves filled with sweet clove-like herbal aroma, and small purple flower spikes (manjari) at branch tips.",
        "common_issues": ["Yellow wilting leaves", "White powdery coating", "Tiny caterpillars curling leaves", "Black bugs on tender stems"],
        "problem_cause": "Water staying in the pot rots the root hairs, or lack of sunlight makes leaves yellow and weak. Cloudy damp air can cause white powdery mold.",
        "remedies": [
            "Pinch off dry purple seed clusters (manjari) regularly to keep the plant bushy, green, and full of fresh leaves.",
            "Spray diluted sour buttermilk (1 part buttermilk to 4 parts water) or mild baking soda spray for white powdery mold.",
            "Spray neem oil or mild soap spray for tiny black bugs.",
            "Ensure pot has clear bottom drainage so excess water escapes freely.",
        ],
        "precautions": [
            "Place in full bright direct sunlight (at least 4 to 6 hours daily); tulsi will deteriorate quickly in dark indoor corners.",
            "Use a breathable terracotta clay pot with a good drainage hole.",
            "Water in the morning; never let soil stay soggy at night.",
        ],
    },
    {
        "name": "Neem Tree",
        "scientific_name": "Azadirachta indica",
        "family": "Mahogany Family (Meliaceae)",
        "category": "Medicinal Tree",
        "role": "Known as the 'Village Pharmacy' of India. Every part is beneficial: neem leaves purify skin, neem seed oil is the gold standard of organic insect repellent, and fresh neem twigs are used as natural antibacterial toothbrushes (daatun).",
        "description": "A very tough, fast-growing shade tree that thrives across India. Features graceful feathery leaves with curved serrated edges, small fragrant white flowers, and yellow fruit berries.",
        "common_issues": ["Branch tip drying (Dieback)", "Tiny sap-sucking bugs", "Leaf browning"],
        "problem_cause": "Humid rainy weather can cause branch tips to dry back, or small sap-sucking insects can attack tender new shoots.",
        "remedies": [
            "Prune dried twig tips 6 inches below the dry spot and seal cut with turmeric paste.",
            "Spray mild copper water if leaves get brown fungal spots.",
        ],
        "precautions": [
            "Plant in deep, well-draining soil with full open sunshine.",
            "Water moderately; mature neem trees are drought-proof and need very little water.",
        ],
    },
    {
        "name": "Aloe Vera (Ghritkumari)",
        "scientific_name": "Aloe barbadensis",
        "family": "Aloe Family (Asphodelaceae)",
        "category": "Medicinal Succulent",
        "role": "One of India's favorite healing balcony plants. Thick fleshy leaves contain clear cooling gel used to heal burns, soothe sunburn, hydrate skin, and make Ayurvedic health juice.",
        "description": "A stemless succulent plant with thick, fleshy, spiked green leaves filled with soothing clear gel. Thrives with minimal care on sunny Indian balconies and window sills.",
        "common_issues": ["Soft mushy leaves that collapse", "Brown sunburn spots", "White cottony bugs tucked in leaf bases"],
        "problem_cause": "Overwatering is the number one cause: roots rot in soggy wet soil, making the thick fleshy leaves turn soft, watery, and mushy at the base.",
        "remedies": [
            "Stop watering immediately! Take plant out of wet soil, trim off any black mushy roots, let it dry on paper for 2 days, and repot in dry gritty soil.",
            "Mix 50% coarse sand or gravel into the potting soil so water drains out instantly.",
            "Move away from scorching hot afternoon summer sun if leaves turn reddish-brown.",
        ],
        "precautions": [
            "Water only once every 2 to 3 weeks on the 'soak and dry' method: water thoroughly, then wait until soil is completely dry before watering again.",
            "Keep in bright indirect sunlight or soft morning sunshine.",
            "Always use a pot with bottom drainage holes.",
        ],
    },
    {
        "name": "Giloy (Guduchi)",
        "scientific_name": "Tinospora cordifolia",
        "family": "Moonseed Family (Menispermaceae)",
        "category": "Medicinal Vine",
        "role": "Known as 'Amrita' (root of immortality) in Ayurveda. Famous climbing medicinal vine prepared as kadha juice to boost immune strength, fight chronic fevers, and detoxify the body.",
        "description": "A vigorous climbing vine with lovely heart-shaped green leaves, textured grey bark, and long hanging aerial roots. Traditionally grown climbing on a neem tree for maximum herbal potency.",
        "common_issues": ["Leaf spots during monsoon", "Stem drying", "Root rot from damp soil"],
        "problem_cause": "Overwatering in pots with poor drainage rots the fleshy stem roots, or cloudy humid weather creates spots on heart-shaped leaves.",
        "remedies": [
            "Spray mild neem oil or copper spray for leaf spots.",
            "Provide a sturdy wooden trellis, wall support, or tree for the vine to climb.",
        ],
        "precautions": [
            "Plant in well-draining soil and never let water stand still around roots.",
            "Provide partial or full sunshine for lush green growth.",
        ],
    },
    {
        "name": "Money Plant (Pothos)",
        "scientific_name": "Epipremnum aureum",
        "family": "Arum Family (Araceae)",
        "category": "Household Plant",
        "role": "The most beloved indoor plant in Indian homes. Symbolizes good luck and prosperity in Vastu, purifies indoor air, and thrives effortlessly in soil pots or glass water bottles on window sills.",
        "description": "An evergreen climbing or trailing vine with glossy, heart-shaped leaves splashed with cheerful golden-yellow patterns. Very easy to grow and propagate from cuttings.",
        "common_issues": ["Yellow leaves", "Brown dry leaf tips", "Limp wilting stems", "White mealybugs"],
        "problem_cause": "Overwatering or soil staying continuously wet deprives roots of oxygen, making lower leaves turn bright yellow and drop. Dry air or direct scorching sun browns leaf edges.",
        "remedies": [
            "Wait until the top half of the soil feels dry to the touch before watering again.",
            "Trim yellow leaves near the stem using clean scissors.",
            "Wipe leaves with a damp cloth or spray with diluted neem water to keep them clean and glossy.",
        ],
        "precautions": [
            "Keep in bright, indirect sunlight; harsh direct sun scorches leaves, while deep darkness slows growth.",
            "Make sure the pot has good bottom drainage holes.",
            "Mist leaves occasionally during dry hot months for healthy green leaves.",
        ],
    },
]

SPICE_KNOWLEDGE = EXPANDED_BOTANICAL_KNOWLEDGE

# Alternate names commonly used in India. Keep aliases exact after normalization so
# a partial string (for example, "rose" inside an unrelated label) cannot select
# the wrong plant profile.
_PLANT_ALIASES = {
    "Cocos nucifera": ["coconut", "coconut palm", "nariyal"],
    "Areca catechu": ["areca", "areca palm", "supari", "betel nut palm"],
    "Cyrtostachys renda": ["lipstick palm", "sealing wax palm", "maharajah palm", "red sealing wax palm", "cyrtostachys lakka"],
    "Borassus flabellifer": ["palmyra", "palmyra palm", "taad", "tad", "tadgola", "nungu"],
    "Bambusa vulgaris": ["bamboo", "baans"],
    "Musa paradisiaca": ["banana", "banana plant", "kela"],
    "Mangifera indica": ["mango", "mango tree", "aam"],
    "Psidium guajava": ["guava", "guava tree", "amrood"],
    "Carica papaya": ["papaya", "papaya plant", "papita"],
    "Citrus aurantiifolia": ["lemon", "lemon tree", "lime", "nimbu"],
    "Punica granatum": ["pomegranate", "anar", "anaar"],
    "Artocarpus heterophyllus": ["jackfruit", "jackfruit tree", "kathal"],
    "Hibiscus rosa-sinensis": ["hibiscus", "gudhal", "jaswand"],
    "Jasminum sambac": ["jasmine", "mogra", "chameli"],
    "Rosa indica": ["rose", "rose plant", "gulab"],
    "Tagetes erecta": ["marigold", "genda"],
    "Bougainvillea spectabilis": ["bougainvillea"],
    "Plumeria rubra": ["champa", "plumeria"],
    "Nelumbo nucifera": ["lotus", "indian lotus", "kamal"],
    "Murraya koenigii": ["curry leaf", "curry leaves", "kadi patta", "karivepaku"],
    "Elettaria cardamomum": ["cardamom", "elaichi", "elachi"],
    "Curcuma longa": ["turmeric", "haldi"],
    "Piper nigrum": ["black pepper", "pepper", "kali mirch"],
    "Cinnamomum verum": ["cinnamon", "dalchini"],
    "Syzygium aromaticum": ["clove", "laung"],
    "Zingiber officinale": ["ginger", "adrak"],
    "Ocimum sanctum": ["tulsi", "holy basil", "ocimum tenuiflorum"],
    "Azadirachta indica": ["neem", "neem tree"],
    "Aloe barbadensis": ["aloe vera", "aloe", "ghritkumari"],
    "Tinospora cordifolia": ["giloy", "guduchi", "amrita"],
    "Epipremnum aureum": ["money plant", "pothos", "devil's ivy"],
}


def _normalize_plant_id(value: str) -> str:
    """Normalize common, regional, and scientific plant names for exact lookup."""
    return " ".join("".join(ch.lower() if ch.isalnum() else " " for ch in (value or "")).split())


def _plant_record_for_name(value: str) -> dict | None:
    query = _normalize_plant_id(value)
    if not query:
        return None
    for item in EXPANDED_BOTANICAL_KNOWLEDGE:
        scientific = _normalize_plant_id(item["scientific_name"])
        primary = _normalize_plant_id(item["name"].split("(")[0])
        aliases = {_normalize_plant_id(item["name"]), primary, scientific}
        aliases.update(_normalize_plant_id(alias) for alias in _PLANT_ALIASES.get(item["scientific_name"], []))
        if query in aliases:
            return item
    return None


def _unknown_result(reason: str, plant_name: str = "", record: dict | None = None) -> dict:
    """Never manufacture a healthy diagnosis when image analysis was not completed."""
    canonical_name = record["name"] if record else (plant_name or "Unidentified plant")
    return {
        "plant_name": canonical_name,
        "scientific_name": record.get("scientific_name", "") if record else "",
        "plant_family": record.get("family", "Unknown") if record else "Unknown",
        "plant_role": record.get("role", "") if record else "",
        "plant_description": record.get("description", "") if record else "",
        "status": "Unknown",
        "health_score": 0,
        "confidence": 0,
        "diagnosis": reason,
        "problem_cause": "No reliable image-based assessment was completed.",
        "issues": ["Plant or health condition not confirmed"],
        "remedies": [],
        "precautions": [
            "Retake a clear photo in natural light, including the whole plant and a close-up of affected leaves.",
            "Avoid applying a disease-specific treatment until the plant and symptoms are confirmed.",
        ],
        "is_mock": True,
    }


def _catalog_identity(record: dict) -> dict:
    """Use the local species profile as the sole source of plant identity metadata."""
    return {
        "plant_name": record["name"],
        "scientific_name": record["scientific_name"],
        "plant_family": record["family"],
        "plant_role": record["role"],
        "plant_description": record["description"],
    }


def _reject_conflicting_identity(data: dict, reason: str) -> dict:
    """Suppress species-specific advice when the model returns conflicting names."""
    data.update({
        "plant_name": "Uncertain plant identification",
        "scientific_name": "",
        "plant_family": "Unknown",
        "plant_role": "",
        "plant_description": "",
        "status": "Unknown",
        "health_score": 0,
        "confidence": min(int(data.get("confidence", 0)), 25),
        "diagnosis": reason,
        "problem_cause": "The plant identity could not be confirmed, so a plant-specific cause cannot be assigned.",
        "issues": ["Plant identity could not be confirmed from this image"],
        "remedies": [],
        "precautions": [
            "Retake a clear photo of the whole plant and a close-up of the leaves, flowers, or fruit.",
            "Do not use species-specific treatments until the plant has been identified.",
        ],
    })
    return data

VALID_STATUSES = [
    "Healthy",
    "Leaf Spot",
    "Blight",
    "Root Rot",
    "Deficiency",
    "Pest Infestation",
    "Viral",
    "Wilt",
    "Unknown",
]


def _normalize_status(raw_status: str) -> str:
    if not raw_status:
        return "Unknown"
    s = raw_status.strip().title()
    if s in VALID_STATUSES:
        return s
    s_lower = s.lower()
    if "healthy" in s_lower or "normal" in s_lower or "optimal" in s_lower or "good" in s_lower:
        return "Healthy"
    if "spot" in s_lower or "cercospora" in s_lower or "blotch" in s_lower:
        return "Leaf Spot"
    if "blight" in s_lower or "anthracnose" in s_lower or "rust" in s_lower:
        return "Blight"
    if "rot" in s_lower or "damping" in s_lower:
        return "Root Rot"
    if "deficien" in s_lower or "chlorosis" in s_lower or "yellowing" in s_lower:
        return "Deficiency"
    if "pest" in s_lower or "caterpillar" in s_lower or "weevil" in s_lower or "psyllid" in s_lower or "mealy" in s_lower:
        return "Pest Infestation"
    if "virus" in s_lower or "mosaic" in s_lower or "viral" in s_lower:
        return "Viral"
    if "wilt" in s_lower or "fusarium" in s_lower:
        return "Wilt"
    return "Unknown"


def _fallback_result(plant_name: str) -> dict:
    """Return honest uncertainty when live image analysis is unavailable."""
    record = _plant_record_for_name(plant_name)
    return _unknown_result(
        "Image analysis is unavailable, so plant health was not assessed. Please try again when the analysis service is available.",
        plant_name,
        record,
    )


async def analyze_plant(image_base64: str, plant_name: str) -> dict:
    """Analyze plant photo with complete species information, simple everyday language, and actionable care."""
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key or not image_base64:
        return _fallback_result(plant_name)

    img_url = image_base64.strip()
    if not img_url.startswith("data:"):
        img_url = f"data:image/jpeg;base64,{img_url}"

    system_prompt = (
        "You are FLORAai, a friendly and expert plant doctor specialized in plants grown across India:\n"
        "- PALMS & BIG PLANTS: Coconut Palm (Nariyal), Areca Palm (Supari), Lipstick Palm (Sealing Wax/Maharajah Palm), Palmyra Palm (Taad/Tadgola), Bamboo (Baans), Banana Plant (Kela).\n"
        "- FRUIT TREES: Mango Tree (Aam - Alphonso, Kesar, Dasheri), Guava Tree (Amrood), Papaya Plant (Papita), Lemon Tree (Nimbu), Pomegranate Tree (Anar), Jackfruit Tree (Kathal).\n"
        "- COURTYARD & SACRED FLOWERS: Hibiscus (Gudhal / Jaswand), Jasmine (Mogra / Chameli), Rose (Gulab), Marigold (Genda), Bougainvillea, Champa (Plumeria), Indian Lotus (Kamal).\n"
        "- KITCHEN SPICES: Curry Leaf (Kadi Patta), Cardamom (Elaichi), Turmeric (Haldi), Black Pepper (Kali Mirch), Cinnamon (Dalchini), Clove (Laung), Ginger (Adrak).\n"
        "- MEDICINAL & HOME PLANTS: Tulsi (Holy Basil), Neem Tree, Aloe Vera (Ghritkumari), Giloy (Guduchi), Money Plant (Pothos).\n\n"
        "IMPORTANT LANGUAGE RULES:\n"
        "1. Write EVERYTHING in simple, clear, everyday English that any home gardener, family member, or farmer can easily understand.\n"
        "2. DO NOT use dense academic botanical words, Latin disease terms, or medical jargon (such as 'chlorosis', 'necrosis', 'etiology', 'apical meristem', 'phloem sap', 'inflorescence', 'abscission', 'monocot').\n"
        "3. Explain issues plainly: e.g. say 'leaves turning yellow' instead of 'foliar chlorosis'; say 'dry brown spots' instead of 'necrotic lesions'; say 'white cottony bugs' instead of 'mealybug infestation'; say 'mold from damp weather' instead of 'fungal sporulation'.\n"
        "4. Include common Indian names where helpful (e.g. Nariyal, Aam, Gudhal, Mogra, Kadi Patta, Haldi, Tulsi).\n\n"
        "You MUST return a valid JSON object with ALL of the following fields:\n"
        "{\n"
        '  "plant_name": "Common plant name with Indian name (e.g. Coconut Palm (Nariyal), Mango Tree (Aam), Curry Leaf (Kadi Patta), Hibiscus (Gudhal))",\n'
        '  "scientific_name": "Scientific name (e.g. Cocos nucifera, Mangifera indica, Murraya koenigii)",\n'
        '  "plant_family": "Simple family name first, then scientific in brackets (e.g. Palm Family (Arecaceae), Citrus Family (Rutaceae), Rose Family (Rosaceae), Mint Family (Lamiaceae))",\n'
        '  "plant_role": "2-3 simple sentences explaining why this plant is loved and grown in India: its uses in food, home remedies, shade, rituals, and daily life",\n'
        '  "plant_description": "2-3 easy sentences describing what the plant looks like, how tall it grows, its leaves or flowers, and how much sunlight and water it likes",\n'
        '  "status": "Exactly one of: Healthy, Leaf Spot, Blight, Root Rot, Deficiency, Pest Infestation, Viral, Wilt, Unknown",\n'
        '  "health_score": 0 to 100 integer (90-100 if green and healthy, 50-80 if mild disease/pest/yellowing, below 50 if severe rot/drying/wilting),\n'
        '  "confidence": 0 to 100 integer,\n'
        '  "diagnosis": "2-3 clear, simple sentences describing what is visible on the plant in this photo",\n'
        '  "problem_cause": "Plain English explanation of why the plant got sick: explain what caused it (e.g. damp weather mold, bugs sucking sap, too much water rotting roots, lack of sunlight) without confusing technical words",\n'
        '  "issues": ["List of 1 to 4 simple observed signs (e.g. Brown leaf spots, White cottony bugs, Curled leaf tips, Pale yellow leaves)"],\n'
        '  "remedies": ["List of 2 to 4 simple, natural home remedies (using neem oil spray, baking soda water, compost, buttermilk spray, or trimming dead parts)"],\n'
        '  "precautions": ["List of 3 to 4 easy everyday steps to keep the plant safe and healthy in the future"]\n'
        "}\n\n"
        "The user-selected plant name is only a suggestion and may be wrong; identify from visible features and say when uncertain. "
        "Do not infer a disease from plant species alone. Common issues are reference possibilities, not evidence; describe only signs actually visible and do not invent a cause. "
        "If the plant is healthy, set status='Healthy' only when the photo clearly shows healthy growth. "
        "If species identity is unclear, the photo is not a plant, or the image is too blurred or distant, set status='Unknown', health_score=0, and explain what clearer photo is needed. "
        "If a species is in the catalog below, return its exact catalog common and scientific names. If the common and scientific names do not agree, return Unknown rather than combining data from different plants."
    )

    # This is retrieval grounding from the existing botanical reference set, not
    # model training. It makes the service use one canonical identity per species.
    catalog_reference = [
        {
            "common_name": item["name"],
            "scientific_name": item["scientific_name"],
            "family": item["family"],
            "aliases": _PLANT_ALIASES.get(item["scientific_name"], []),
            "common_issues_to_consider_only_if_visible": item["common_issues"],
        }
        for item in EXPANDED_BOTANICAL_KNOWLEDGE
    ]
    system_prompt += "\n\nCATALOG REFERENCE (use exact common/scientific name pairs; these issue lists are not proof of disease):\n"
    system_prompt += json.dumps(catalog_reference, ensure_ascii=True, separators=(",", ":"))

    hint = f"The user selected {plant_name!r} as a candidate; verify it visually and report a different plant or Unknown if appropriate. " if plant_name else ""
    user_prompt = f"{hint}Analyze the attached plant image. Separate visible observations from possible causes. Provide the species identity only when the visual evidence supports it, then describe visible health symptoms and cautious next steps."

    payload = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_prompt},
                    {"type": "image_url", "image_url": {"url": img_url}},
                ],
            },
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 1600,
        "temperature": 0.2,
    }

    try:
        url = "https://integrations.emergentagent.com/llm/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code != 200:
                logger.error(f"Vision API error ({resp.status_code}): {resp.text}")
                return _fallback_result(plant_name)

            data_raw = resp.json()
            content = data_raw["choices"][0]["message"]["content"]
            data = json.loads(content)

            # Normalization and sanity validation
            data["status"] = _normalize_status(data.get("status", ""))

            score = data.get("health_score", 70)
            if isinstance(score, float) and 0.0 <= score <= 1.0:
                score = int(score * 100)
            data["health_score"] = int(max(0, min(100, int(score))))

            conf = data.get("confidence", 85)
            if isinstance(conf, float) and 0.0 <= conf <= 1.0:
                conf = int(conf * 100)
            data["confidence"] = int(max(0, min(100, int(conf))))

            if isinstance(data.get("issues"), str):
                data["issues"] = [data["issues"]]
            elif not isinstance(data.get("issues"), list):
                data["issues"] = []

            if isinstance(data.get("remedies"), str):
                data["remedies"] = [data["remedies"]]
            elif not isinstance(data.get("remedies"), list):
                data["remedies"] = []

            if isinstance(data.get("precautions"), str):
                data["precautions"] = [data["precautions"]]
            elif not isinstance(data.get("precautions"), list):
                data["precautions"] = []

            data.setdefault("plant_name", "")
            data.setdefault("scientific_name", "")
            data.setdefault("plant_family", "Plant Family")
            data.setdefault("plant_role", "A valued traditional agricultural and household plant grown widely across India.")
            data.setdefault("plant_description", "")
            data.setdefault("problem_cause", "")
            data.setdefault("diagnosis", "Plant health check completed successfully.")
            data["is_mock"] = False

            # Reject contradictory or unsupported identities instead of showing
            # one plant's care profile beside another plant's photo.
            name_record = _plant_record_for_name(str(data.get("plant_name") or ""))
            science_record = _plant_record_for_name(str(data.get("scientific_name") or ""))
            if name_record and science_record and name_record["scientific_name"] != science_record["scientific_name"]:
                logger.warning(
                    "Plant AI returned conflicting species names: %r and %r",
                    data.get("plant_name"), data.get("scientific_name"),
                )
                return _reject_conflicting_identity(
                    data,
                    "The plant name and scientific name in the analysis did not match. The scan has been marked uncertain; retake a clear photo of the whole plant and a close-up of its leaves or flowers.",
                )

            record = name_record or science_record
            if not record:
                logger.info("Plant AI identity was outside the supported reference catalog: %r", data.get("plant_name"))
                return _reject_conflicting_identity(
                    data,
                    "The plant could not be matched confidently to the current Indian plant reference catalog. Retake a clear photo or choose a matching plant from the library before using species-specific care advice.",
                )

            if data["confidence"] < 50:
                return _reject_conflicting_identity(
                    data,
                    "The photo does not provide enough visual detail to confirm the plant species. Retake a closer, well-lit photo before using plant-specific care advice.",
                )

            # Replace model-generated taxonomy and general plant information with
            # the single matching local species record; retain image observations.
            data.update(_catalog_identity(record))

            logger.info(
                f"Plant AI diagnosed: {data.get('plant_name')} ({data.get('plant_family')}) -> {data.get('status')} [Score: {data.get('health_score')}]"
            )
            return data

    except Exception as e:  # noqa: BLE001
        logger.error(f"AI analysis failed, using fallback: {e}")
        return _fallback_result(plant_name)
