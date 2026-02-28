import type { Category, Product } from "../types/menu.types";

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-sendvici", name: "Сендвичи" },
  { id: "cat-granola", name: "Гранола" },
  { id: "cat-topcinja", name: "Топчиња" },
  { id: "cat-palacinki", name: "Палачинки" },
  { id: "cat-kafe", name: "Кафе" },
  { id: "cat-cedeni-sokovi", name: "Цедени сокови" },
  { id: "cat-smuti", name: "Смути" },
  { id: "cat-pijaloci", name: "Пијалоци" },
  { id: "cat-maca", name: "Мача" },
  { id: "cat-omlet", name: "Омлет" },
  { id: "cat-chia", name: "Чиа" },
  { id: "cat-dodatoc", name: "ДОДАТОК" },
];

export const SEED_PRODUCTS: Product[] = [
  // Сендвичи
  { id: "prod-1", name: "Туна", description: "(туна, пченка, марула, краставица, посен, мајонез)", price: 150, categoryId: "cat-sendvici" },
  { id: "prod-2", name: "Веган", description: "(хумус, посен мајонез, краставица, домат, пченка, марула, маслинка)", price: 150, categoryId: "cat-sendvici" },
  { id: "prod-3", name: "Фета", description: "(омлет, фета сирење, краставица, домат)", price: 150, categoryId: "cat-sendvici" },
  { id: "prod-4", name: "Италиан", description: "(пилешко чадено филе, кашкавал, мајонез, домат, краставица)", price: 150, categoryId: "cat-sendvici" },
  { id: "prod-5", name: "Пилешки", description: "(пилешко, кари сос, марула, домат, краставица)", price: 170, categoryId: "cat-sendvici" },
  // Гранола
  { id: "prod-6", name: "Golden Mix", description: "(овес, чиа, гранола, овошје по избор)", price: 150, categoryId: "cat-granola" },
  { id: "prod-7", name: "Овесен оброк", description: "(овес, млеко, бадеми, мед, овошје по избор)", price: 140, categoryId: "cat-granola" },
  { id: "prod-8", name: "Кокосен Овес", description: "(овес, кокос, млеко, овошје по избор)", price: 140, categoryId: "cat-granola" },
  { id: "prod-9", name: "Мусли Јогурт", description: "(грчки јогурт, овошје, мусли)", price: 170, categoryId: "cat-granola" },
  // Топчиња
  { id: "prod-10", name: "Pistachio", description: "(лешник, бадеми, ф'стак, овесно брашно, урми)", price: 40, categoryId: "cat-topcinja" },
  { id: "prod-11", name: "Ferrero Rocher", description: "(лешник, какао, цимет, овесно брашно, урми)", price: 40, categoryId: "cat-topcinja" },
  { id: "prod-12", name: "Golden Ball", description: "(лешник, кокосово масло, овес, бело протеинско чоколадо)", price: 40, categoryId: "cat-topcinja" },
  { id: "prod-13", name: "Snickers", description: "(кикирики, плазма, путер, протеинско чоколадо)", price: 40, categoryId: "cat-topcinja" },
  { id: "prod-14", name: "Twix Bars", description: "(овесно брашно, бадем, сируп од урма, црно чоколадо)", price: 40, categoryId: "cat-topcinja" },
  // Палачинки
  { id: "prod-15", name: "Американски Палачинки", description: "(овесно брашно, јајца, млеко, протеин, банана, чоколадо, овошје по избор)", price: 150, categoryId: "cat-palacinki" },
  { id: "prod-16", name: "Salt American", description: "(солени палачинки, фета сирење, јајце на око, пилешко чадено филе, кашкавал, домат, краставица)", price: 170, categoryId: "cat-palacinki" },
  // Кафе
  { id: "prod-17", name: "Еспресо", description: "", price: 70, categoryId: "cat-kafe" },
  { id: "prod-18", name: "Макијато", description: "", price: 70, categoryId: "cat-kafe" },
  { id: "prod-19", name: "Капучино", description: "", price: 70, categoryId: "cat-kafe" },
  { id: "prod-20", name: "Фредо Еспресо", description: "", price: 80, categoryId: "cat-kafe" },
  { id: "prod-21", name: "Фредо Капучино", description: "", price: 80, categoryId: "cat-kafe" },
  { id: "prod-22", name: "Нес Кафе", description: "", price: 70, categoryId: "cat-kafe" },
  { id: "prod-23", name: "Фрапе", description: "", price: 70, categoryId: "cat-kafe" },
  { id: "prod-24", name: "Латте", description: "", price: 80, categoryId: "cat-kafe" },
  // Цедени сокови
  { id: "prod-25", name: "Цеден Портокал 0.25", description: "", price: 120, categoryId: "cat-cedeni-sokovi" },
  { id: "prod-26", name: "Цедена Јаболка 0.25", description: "", price: 120, categoryId: "cat-cedeni-sokovi" },
  { id: "prod-27", name: "Цеден Лимон 0.25", description: "", price: 120, categoryId: "cat-cedeni-sokovi" },
  { id: "prod-28", name: "Додаток", description: "(ѓумбир, малина, калинка)", price: 30, categoryId: "cat-cedeni-sokovi" },
  // Смути
  { id: "prod-29", name: "Blueberry Protein", description: "(млеко, банана, боровинки, протеин)", price: 120, categoryId: "cat-smuti" },
  { id: "prod-30", name: "Banana Chocolate", description: "(млеко, банана, какао, плазма)", price: 100, categoryId: "cat-smuti" },
  { id: "prod-31", name: "Green Smoothie", description: "(вода, спанаќ, мача, авокадо, зелено јаболко)", price: 120, categoryId: "cat-smuti" },
  { id: "prod-32", name: "Golden Bee Smoothie", description: "(банана, ананас, млеко, манго)", price: 120, categoryId: "cat-smuti" },
  // Пијалоци
  { id: "prod-33", name: "Роса 0.5", description: "", price: 60, categoryId: "cat-pijaloci" },
  { id: "prod-34", name: "Добра Вода 0.5", description: "", price: 70, categoryId: "cat-pijaloci" },
  { id: "prod-35", name: "Кока Кола 0.33", description: "", price: 70, categoryId: "cat-pijaloci" },
  // Мача
  { id: "prod-36", name: "Мача чај", description: "", price: 100, categoryId: "cat-maca" },
  { id: "prod-37", name: "Мача Латте (топло/ладно)", description: "", price: 120, categoryId: "cat-maca" },
  // Омлет
  { id: "prod-38", name: "Golden Bee Омлет", description: "(3 јајца, фета сирење, домат, краставица, маслинка, интегрален леб)", price: 160, categoryId: "cat-omlet" },
  // Чиа
  { id: "prod-39", name: "Чиа", description: "(чиа, млеко, мед, овошје по избор)", price: 150, categoryId: "cat-chia" },
  { id: "prod-40", name: "Чоко Чиа", description: "(чиа, млеко, какао, мед, овошје по избор)", price: 150, categoryId: "cat-chia" },
  // ДОДАТОК
  { id: "prod-41", name: "Путер од кикирики", description: "", price: 20, categoryId: "cat-dodatoc" },
  { id: "prod-42", name: "Путер од бадем", description: "", price: 30, categoryId: "cat-dodatoc" },
  { id: "prod-43", name: "Путер од лешник", description: "", price: 30, categoryId: "cat-dodatoc" },
];
