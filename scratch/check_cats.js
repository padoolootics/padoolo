
async function checkCategories() {
  const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products/categories?consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&per_page=100`;
  const res = await fetch(url);
  const data = await res.json();
  data.forEach(c => console.log(`ID: ${c.id}, Name: ${c.name}, Count: ${c.count}`));
}
checkCategories();
