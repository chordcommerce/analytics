export interface Cart {
  /**
   * Cart ID
   */
  cart_id?: string
  /**
   * Currency code of the transaction (for example, "USD")
   */
  currency?: string
  /**
   * Products in the cart
   */
  products: LineItem[]
  /**
   * Revenue ($) with discounts and coupons added in
   */
  value?: number
}

export interface IdentifyTraits {
  /**
   * Street address of a user.
   */
  address?: {
    city?: string
    country?: string
    postalCode?: string
    state?: string
    street?: string
    [property: string]: any
  }
  /**
   * Age of a user
   */
  age?: number
  /**
   * URL to an avatar image for the user
   */
  avatar?: string
  /**
   * User’s birthday. Segment recommends using ISO-8601 date strings.
   */
  birthday?: string
  /**
   * Company the user represents
   */
  company?: {
    name?: string
    id?: string | number
    industry?: string
    employeeCount?: number
    plan?: string
    [property: string]: any
  }
  /**
   * Date the user’s account was first created. Segment recommends using ISO-8601 date strings.
   */
  createdAt?: string
  /**
   * Description of the user
   */
  description?: string
  /**
   * Email address of a user
   */
  email?: string
  /**
   * First name of a user
   */
  firstName?: string
  /**
   * Gender of a user
   */
  gender?: string
  /**
   * Unique ID in your database for a user
   */
  id?: string
  /**
   * Last name of a user
   */
  lastName?: string
  /**
   * Full name of a user. If you only pass a first and last name Segment automatically fills in the full name for you.
   */
  name?: string
  /**
   * Phone number of a user
   */
  phone?: string
  /**
   * Title of a user, usually related to their position at a specific company. Example: “VP of Engineering”
   */
  title?: string
  /**
   * User’s username. This should be unique to each user, like the usernames of Twitter or GitHub.
   */
  username?: string
  /**
   * Website of a user
   */
  website?: string
  /**
   * Additional custom user traits.
   */
  [property: string]: any
}

export interface LineItem extends Product {
  /**
   * Coupon code associated with a product (for example, "MAY_DEALS_3")
   */
  coupon?: string
  /**
   * Database ID of the line item
   */
  line_item_id?: string
  /**
   * Quantity of the product
   */
  quantity: number
}

export interface Order {
  /**
   * Store or affiliation from which this transaction occurred (for example, "Google Store")
   */
  affiliation?: string
  /**
   * Order metadata "campaign_id"
   */
  campaign_id?: number
  /**
   * Channel where order was placed (for example, "chord")
   */
  channel?: string
  /**
   * Checkout provider (for example, "stripe")
   */
  checkout_type?: string
  /**
   * Transaction coupon redeemed with the transaction
   */
  coupon?: string
  /**
   * Currency code of the transaction (for example, "USD")
   */
  currency?: string
  /**
   * Total discount associated with the transaction
   */
  discount?: number
  /**
   * Email address associated with the order
   */
  email?: string
  /**
   * First name in the shipping address for the order
   */
  first_name?: string
  /**
   * Order contains a subscription
   */
  has_subscription?: boolean
  /**
   * Order contains a subscription
   */
  is_recurring?: boolean
  /**
   * Last name in the shipping address for the order
   */
  last_name?: string
  /**
   * Metadata of the order
   */
  metadata?: {
    [k: string]: unknown
  }
  /**
   * Date and time order was placed
   */
  order_date?: string
  /**
   * Order/transaction ID
   */
  order_id?: string
  /**
   * Phone number associated with the order
   */
  phone?: string
  /**
   * Products in the order
   */
  products?: (LineItem & {
    /**
     * Number of SKUs in the bundle
     */
    bundle_size?: number
    /**
     * Quantity sold via cross-selling
     */
    cross_sold_quantity?: number
    /**
     * Metadata of the product variant
     */
    variant_metadata?: {
      [k: string]: unknown
    }
  })[]
  /**
   * URL for customer to share to receive referral credit
   */
  purl_link?: string
  /**
   * ID for referral that customer used to place the order
   */
  referral_identifier_id?: string
  /**
   * Revenue ($) associated with the transaction (excluding shipping and tax)
   */
  revenue?: number
  /**
   * Shipping cost associated with the transaction
   */
  shipping?: number
  /**
   * City in the shipping address for the order
   */
  shipping_city?: string
  /**
   * Country in the shipping address for the order
   */
  shipping_country?: string
  shipping_method_details?: {
    /**
     * Code of shipping method chosen for the order (for example, "standard_shipping")
     */
    shipping_code?: string
    /**
     * Name of shipping method chosen for the order (for example, "Standard Shipping")
     */
    shipping_method?: string
  }
  /**
   * State in the shipping address for the order
   */
  shipping_state?: string
  /**
   * Zipcode in the shipping address for the order
   */
  shipping_zipcode?: string
  /**
   * Total tax associated with the transaction
   */
  tax?: number
  /**
   * Order metadata "template_id"
   */
  template_id?: number
  /**
   * Revenue ($) with discounts and coupons added in.
   */
  total?: number
  /**
   * Tracking IDs for third party integrations
   */
  tracking_ids?: {
    [k: string]: unknown
  }
}

export interface Product {
  /**
   * Product affiliation to designate a supplying company or brick and mortar store location (for example, "Google Store")
   */
  affiliation?: string
  /**
   * Brand associated with the product
   */
  brand?: string
  /**
   * Product belongs to a bundle
   */
  bundle?: boolean
  /**
   * Product category
   */
  category?: string
  /**
   * Short description of the product
   */
  description?: string
  /**
   * Image URL of the product
   */
  image_url?: string
  /**
   * Name of the product
   */
  name: string
  /**
   * Option values of the product variant
   */
  option_values?: string[]
  /**
   * Position in the product list (for example, 3)
   */
  position?: number
  /**
   * Price ($) of the product
   */
  price: number
  /**
   * Database ID of the product
   */
  product_id: string
  /**
   * SKU of the product variant
   */
  sku: string
  /**
   * Slug of the product, often used in URLs (for example, "product-red")
   */
  slug?: string
  /**
   * URL of the product page
   */
  url?: string
  /**
   * Name of the product variant
   */
  variant?: string
}

export interface Checkout {
  /**
   * Store or affiliation from which this transaction occurred (for example, "Google Store")
   */
  affiliation?: string
  /**
   * Checkout provider (for example, "stripe")
   */
  checkout_type?: string
  /**
   * Transaction coupon redeemed with the transaction
   */
  coupon?: string
  /**
   * Currency code of the transaction (for example, "USD")
   */
  currency?: string
  /**
   * Total discount associated with the transaction
   */
  discount?: number
  /**
   * Order/transaction ID
   */
  order_id?: string
  /**
   * Order number (for example, "CHORD-000111222")
   */
  order_name?: string
  /**
   * Products in the checkout
   */
  products: LineItem[]
  /**
   * Revenue ($) associated with the transaction (excluding shipping and tax)
   */
  revenue?: number
  /**
   * Shipping cost associated with the transaction
   */
  shipping?: number
  /**
   * Total tax associated with the transaction
   */
  tax?: number
  /**
   * Revenue ($) with discounts and coupons added in
   */
  value?: number
}
