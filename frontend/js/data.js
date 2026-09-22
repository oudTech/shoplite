const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 25000,
    category: "Electronics",
    image: "https://via.placeholder.com/300x300?text=Headphones",
    stock: 12,
  },
  {
    id: 2,
    name: "Power bank",
    price: 10000,
    category: "Electronics",
    image: "https://via.placeholder.com/300x300?text=powerbank",
    stock: 8,
  },
  {
    id: 3,
    name: "Charger",
    price: 5000,
    category: "Electronics",
    image: "https://via.placeholder.com/300x300?text=charger",
    stock: 2,
  },
];
const formatPrice = (n) => `₦${n.toLocaleString()}`;
console.log(formatPrice(25000));