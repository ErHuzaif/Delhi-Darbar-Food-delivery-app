export type MenuItem = {
  id: string;
  name: string;
  price: number;
  veg: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  image: string;
  items: MenuItem[];
};

export type FlatItem = MenuItem & {
  category: string;
  image: string;
};

function m(name: string, price: number, veg: boolean): MenuItem {
  return {
    id: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    price,
    veg,
  };
}

/**
 * Category photos are appetizing placeholders — swap these URLs
 * for real restaurant photography whenever you're ready.
 */
export const CATEGORIES: MenuCategory[] = [
  {
    id: "wazwaan-thali",
    name: "Wazwaan Thali",
    image:
      "https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [m("Wazwaan Thali", 799, false)],
  },
  {
    id: "tea-coffee",
    name: "Tea & Coffee",
    image:
      "https://images.pexels.com/photos/12865880/pexels-photo-12865880.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Tea Set", 100, true),
      m("Coffee Set", 120, true),
      m("Lemon Tea", 80, true),
      m("Kehwa Saffron", 40, true),
      m("Mineral Water", 20, true),
      m("Fresh Lemon Water", 20, true),
    ],
  },
  {
    id: "lassi-curd",
    name: "Lassi & Curd",
    image:
      "https://images.pexels.com/photos/6808666/pexels-photo-6808666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [m("Lassi (Sweet & Salt)", 30, true), m("Plain Curd", 50, true)],
  },
  {
    id: "snacks-salads",
    name: "Snacks & Salads",
    image:
      "https://images.pexels.com/photos/7515220/pexels-photo-7515220.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Butter Toast", 30, true),
      m("Veg Sandwich", 50, true),
      m("Bread Omelette", 80, false),
    ],
  },
  {
    id: "rice-biryani",
    name: "Rice & Biryani",
    image:
      "https://images.pexels.com/photos/9609840/pexels-photo-9609840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Rice (Basmati)", 120, true),
      m("Zeera Rice", 150, true),
      m("Chicken Biryani", 360, false),
      m("Chicken Pulao", 400, false),
      m("Mutton Biryani", 420, false),
      m("Kabab Biryani", 420, false),
      m("Mutton Pulao", 500, false),
      m("Cheese Biryani or Pulao", 250, true),
      m("Veg Biryani or Pulao", 250, true),
      m("Peas Pulao", 320, true),
    ],
  },
  {
    id: "kashmiri-wazwan",
    name: "Kashmiri Wazwan",
    image:
      "https://images.pexels.com/photos/9609846/pexels-photo-9609846.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Rista (4 pieces)", 600, false),
      m("Rogan Josh (4 pieces)", 640, false),
      m("Mirchi Kurma (4 pieces)", 640, false),
      m("Goshtaba (4 pieces)", 640, false),
      m("Mutton Yakhni (4 pieces)", 640, false),
      m("Danwal Kurma (4 pieces)", 640, false),
      m("Badam Kurma (advance order only)", 700, false),
      m("Methi", 250, false),
      m("Tabak Maaz, Small", 300, false),
      m("Tabak Maaz, Big", 450, false),
      m("Aabgosh, 1 piece (advance order only)", 700, false),
      m("Shami Kabab, 4 pieces (advance order only)", 800, false),
      m("Dani (advance order only)", 400, false),
      m("Mutton Kanti", 350, false),
      m("Mutton Kabab", 300, false),
      m("Kabab Kanti", 320, false),
      m("Waza Paneer", 300, true),
      m("Mutton Tikka", 350, false),
      m("Mutton Champ", 650, false),
      m("Chicken Kabab", 180, false),
    ],
  },
  {
    id: "indian-mutton-special",
    name: "Indian Mutton Special",
    image:
      "https://images.pexels.com/photos/28674566/pexels-photo-28674566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Mutton Curry", 350, false),
      m("Mutton Do Pyaza", 350, false),
      m("Mutton Keema", 350, false),
      m("Mutton Shahi Kurma", 400, false),
      m("Mutter Keema", 340, true),
      m("Mutton Masala", 350, false),
    ],
  },
  {
    id: "chicken-special",
    name: "Chicken Special",
    image:
      "https://images.pexels.com/photos/20408437/pexels-photo-20408437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Delhi Darbar Special (Chicken Noor Jahan)", 900, false),
      m("Chicken Kanti, half chicken used", 400, false),
      m("Chicken Kanti Boneless", 360, false),
      m("Chicken Kanti Boneless, Half", 220, false),
      m("Butter Chicken, Full", 800, false),
      m("Butter Chicken, Half", 450, false),
      m("Chicken Curry, Full", 650, false),
      m("Chicken Curry, Half", 350, false),
      m("Chicken Masala, Full", 800, false),
      m("Chicken Masala, Half", 400, false),
      m("Chicken Do Pyaza, Full", 700, false),
      m("Chicken Do Pyaza, Half", 350, false),
      m("Chicken Fry, Full", 600, false),
      m("Chicken Fry, Half", 300, false),
      m("Chicken Kurma, Full", 700, false),
      m("Chicken Kurma, Half", 350, false),
      m("Garlic Chicken", 700, false),
    ],
  },
  {
    id: "tandoori-special",
    name: "Tandoori Special",
    image:
      "https://images.pexels.com/photos/28674556/pexels-photo-28674556.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Plain Naan", 70, true),
      m("Butter Naan", 90, true),
      m("Garlic Naan", 100, true),
      m("Cheese Naan", 120, true),
      m("Aloo Paratha", 80, true),
      m("Mix Paratha", 80, true),
      m("Gobi Paratha", 80, true),
      m("Butter Roti", 20, true),
      m("Plain Roti", 15, true),
      m("Keema Naan", 200, false),
      m("Tandoori Chicken, Full", 600, false),
      m("Tandoori Chicken, Half", 300, false),
      m("Chicken Tikka", 350, false),
    ],
  },
  {
    id: "vegetable-special",
    name: "Vegetable Special",
    image:
      "https://images.pexels.com/photos/11188417/pexels-photo-11188417.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Tomato Paneer", 300, true),
      m("Mutter Paneer", 280, true),
      m("Butter Paneer Masala", 400, true),
      m("Shahi Paneer", 400, true),
      m("Mutter Mushroom", 240, true),
      m("White Mushroom", 260, true),
      m("Mix Vegetable", 220, true),
      m("Vegetable Raita", 80, true),
      m("Aloo Mutter", 220, true),
      m("Aloo Gobi", 220, true),
      m("Yellow Dal", 200, true),
      m("Butter Dal", 220, true),
    ],
  },
  {
    id: "chinese-special",
    name: "Chinese Special",
    image:
      "https://images.pexels.com/photos/28573375/pexels-photo-28573375.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640",
    items: [
      m("Chicken Fried Rice", 400, false),
      m("Mutton Fried Rice", 450, false),
      m("Egg Fried Rice", 250, false),
      m("Cheese Fried Rice", 250, true),
      m("Veg Fried Rice", 220, true),
      m("Chilly Chicken, Full", 700, false),
      m("Chilly Chicken, Half", 400, false),
    ],
  },
];

const FLAT: FlatItem[] = CATEGORIES.flatMap((c) =>
  c.items.map((i) => ({ ...i, category: c.name, image: c.image })),
);

export function menuItemById(id: string): FlatItem | undefined {
  return FLAT.find((i) => i.id === id);
}

export const ALL_ITEMS: FlatItem[] = FLAT;
