/**
 * Utility functions for product extraction
 */

/**
 * Clean and normalize text content
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\t+/g, ' ') // Replace tabs with spaces
    .trim();
}

/**
 * Extract price from text
 */
function extractPrice(text) {
  if (!text) return null;
  
  // Remove common currency symbols and clean up
  const cleaned = text.replace(/[^\d.,]/g, '');
  
  // Look for price patterns
  const pricePatterns = [
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, // $1,234.56
    /(\d+\.\d{2})/, // 123.45
    /(\d+)/ // 123
  ];
  
  for (const pattern of pricePatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extract dimensions from text
 */
function extractDimensions(text) {
  if (!text) return null;
  
  const dimensionPatterns = [
    /(\d+(?:\.\d+)?)\s*["']?\s*x\s*(\d+(?:\.\d+)?)\s*["']?\s*x\s*(\d+(?:\.\d+)?)\s*["']?/i, // 10" x 8" x 2"
    /(\d+(?:\.\d+)?)\s*["']?\s*×\s*(\d+(?:\.\d+)?)\s*["']?\s*×\s*(\d+(?:\.\d+)?)\s*["']?/i, // 10" × 8" × 2"
    /(\d+(?:\.\d+)?)\s*["']?\s*by\s*(\d+(?:\.\d+)?)\s*["']?\s*by\s*(\d+(?:\.\d+)?)\s*["']?/i // 10" by 8" by 2"
  ];
  
  for (const pattern of dimensionPatterns) {
    const match = text.match(pattern);
    if (match) {
      return `${match[1]}" x ${match[2]}" x ${match[3]}"`;
    }
  }
  
  return null;
}

/**
 * Extract weight from text
 */
function extractWeight(text) {
  if (!text) return null;
  
  const weightPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)/i, // 2.5 lbs
    /(\d+(?:\.\d+)?)\s*(?:kg|kilograms?)/i, // 1.2 kg
    /(\d+(?:\.\d+)?)\s*(?:oz|ounces?)/i, // 16 oz
    /(\d+(?:\.\d+)?)\s*(?:g|grams?)/i // 500 g
  ];
  
  for (const pattern of weightPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}

/**
 * Extract material from text
 */
function extractMaterial(text) {
  if (!text) return null;
  
  const materials = [
    'cotton', 'polyester', 'leather', 'metal', 'plastic', 'wood', 'glass',
    'ceramic', 'stainless steel', 'aluminum', 'brass', 'copper', 'silver',
    'gold', 'titanium', 'carbon fiber', 'silicone', 'rubber', 'foam',
    'fabric', 'denim', 'silk', 'wool', 'cashmere', 'linen', 'canvas'
  ];
  
  const foundMaterials = [];
  const lowerText = text.toLowerCase();
  
  for (const material of materials) {
    if (lowerText.includes(material)) {
      foundMaterials.push(material);
    }
  }
  
  return foundMaterials.length > 0 ? foundMaterials.join(', ') : null;
}

/**
 * Extract brand from title or text
 */
function extractBrand(text) {
  if (!text) return null;
  
  const commonBrands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Microsoft', 'Google',
    'Amazon', 'Dell', 'HP', 'Lenovo', 'Asus', 'Canon', 'Nikon', 'Bose',
    'JBL', 'Beats', 'Gucci', 'Louis Vuitton', 'Chanel', 'Prada', 'Versace',
    'Armani', 'Calvin Klein', 'LG', 'Panasonic', 'Philips', 'Whirlpool',
    'GE', 'KitchenAid', 'Dyson', 'Shark', 'iRobot', 'Roomba', 'Fitbit',
    'Garmin', 'Polar', 'Suunto', 'Oakley', 'Ray-Ban', 'Prada', 'Burberry'
  ];
  
  const lowerText = text.toLowerCase();
  
  for (const brand of commonBrands) {
    if (lowerText.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  
  return null;
}

/**
 * Extract category from URL or text
 */
function extractCategory(url, title) {
  if (!url && !title) return 'General';
  
  const categoryMappings = {
    'electronics': ['phone', 'laptop', 'tablet', 'headphone', 'speaker', 'camera', 'tv', 'computer'],
    'clothing': ['shirt', 'pants', 'dress', 'shoes', 'jacket', 'hat', 'sock', 'underwear'],
    'home': ['furniture', 'bed', 'chair', 'table', 'lamp', 'couch', 'sofa', 'desk'],
    'kitchen': ['appliance', 'cookware', 'utensil', 'knife', 'pan', 'pot', 'microwave', 'oven'],
    'sports': ['fitness', 'gym', 'running', 'basketball', 'football', 'soccer', 'tennis'],
    'beauty': ['makeup', 'skincare', 'perfume', 'shampoo', 'lotion', 'cosmetic'],
    'books': ['book', 'novel', 'textbook', 'magazine', 'journal', 'manual'],
    'toys': ['toy', 'game', 'puzzle', 'doll', 'action figure', 'board game'],
    'automotive': ['car', 'tire', 'battery', 'oil', 'brake', 'engine', 'automotive'],
    'garden': ['plant', 'seed', 'soil', 'pot', 'garden', 'outdoor', 'lawn']
  };
  
  const searchText = `${url} ${title}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryMappings)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return category.charAt(0).toUpperCase() + category.slice(1);
      }
    }
  }
  
  return 'General';
}

/**
 * Extract availability status from text
 */
function extractAvailability(text) {
  if (!text) return 'Unknown';
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('in stock') || lowerText.includes('available')) {
    return 'In Stock';
  }
  
  if (lowerText.includes('out of stock') || lowerText.includes('unavailable')) {
    return 'Out of Stock';
  }
  
  if (lowerText.includes('limited') || lowerText.includes('few left')) {
    return 'Limited Stock';
  }
  
  if (lowerText.includes('pre-order') || lowerText.includes('coming soon')) {
    return 'Pre-Order';
  }
  
  return 'Unknown';
}

/**
 * Extract condition from text
 */
function extractCondition(text) {
  if (!text) return 'New';
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('new') || lowerText.includes('brand new')) {
    return 'New';
  }
  
  if (lowerText.includes('used') || lowerText.includes('pre-owned')) {
    return 'Used';
  }
  
  if (lowerText.includes('refurbished') || lowerText.includes('reconditioned')) {
    return 'Refurbished';
  }
  
  if (lowerText.includes('open box') || lowerText.includes('open-box')) {
    return 'Open Box';
  }
  
  return 'New';
}

/**
 * Extract colors from text or elements
 */
function extractColors(text, elements = []) {
  const colors = [];
  
  // Common color names
  const colorNames = [
    'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple',
    'pink', 'brown', 'gray', 'grey', 'silver', 'gold', 'navy', 'maroon',
    'beige', 'tan', 'cream', 'ivory', 'charcoal', 'burgundy', 'crimson',
    'turquoise', 'teal', 'lime', 'olive', 'khaki', 'coral', 'salmon'
  ];
  
  const searchText = `${text} ${elements.join(' ')}`.toLowerCase();
  
  for (const color of colorNames) {
    if (searchText.includes(color) && !colors.includes(color)) {
      colors.push(color.charAt(0).toUpperCase() + color.slice(1));
    }
  }
  
  return colors.length > 0 ? colors : ['Default'];
}

/**
 * Extract sizes from text or elements
 */
function extractSizes(text, elements = []) {
  const sizes = [];
  
  // Common size patterns
  const sizePatterns = [
    /(\d+)\s*(?:GB|TB)/i, // 128GB, 1TB
    /(\d+)\s*(?:inch|in|")/i, // 13 inch, 13"
    /(XS|S|M|L|XL|XXL|XXXL)/i, // Clothing sizes
    /(\d+)\s*(?:mm|cm)/i, // 50mm, 10cm
    /(\d+(?:\.\d+)?)\s*(?:oz|ml)/i // 16oz, 500ml
  ];
  
  const searchText = `${text} ${elements.join(' ')}`;
  
  for (const pattern of sizePatterns) {
    const matches = searchText.match(new RegExp(pattern.source, 'gi'));
    if (matches) {
      matches.forEach(match => {
        if (!sizes.includes(match)) {
          sizes.push(match);
        }
      });
    }
  }
  
  return sizes.length > 0 ? sizes : ['One Size'];
}

/**
 * Validate and clean image URL
 */
function cleanImageUrl(url) {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Convert relative URLs to absolute
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    if (url.startsWith('/')) {
      return `${urlObj.protocol}//${urlObj.host}${url}`;
    }
    
    return url;
  } catch {
    return '';
  }
}

/**
 * Extract product ID from URL
 */
function extractProductId(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Amazon ASIN
    if (urlObj.hostname.includes('amazon')) {
      const asinMatch = pathname.match(/\/dp\/([A-Z0-9]{10})/);
      if (asinMatch) return asinMatch[1];
    }
    
    // eBay item ID
    if (urlObj.hostname.includes('ebay')) {
      const itemMatch = pathname.match(/\/itm\/(\d+)/);
      if (itemMatch) return itemMatch[1];
    }
    
    // Generic product ID extraction
    const idMatch = pathname.match(/\/(\d+)(?:\/|$)/);
    if (idMatch) return idMatch[1];
    
    return null;
  } catch {
    return null;
  }
}

module.exports = {
  cleanText,
  extractPrice,
  extractDimensions,
  extractWeight,
  extractMaterial,
  extractBrand,
  extractCategory,
  extractAvailability,
  extractCondition,
  extractColors,
  extractSizes,
  cleanImageUrl,
  extractProductId
};
