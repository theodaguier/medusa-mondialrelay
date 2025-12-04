# @theodaguier/medusa-fulfillment-mondialrelay

[![npm version](https://img.shields.io/npm/v/@theodaguier/medusa-fulfillment-mondialrelay.svg)](https://www.npmjs.com/package/@theodaguier/medusa-fulfillment-mondialrelay)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **Medusa v2** fulfillment provider plugin for [Mondial Relay](https://www.mondialrelay.fr/) shipping services. Supports both Point Relais (pickup point) and Home Delivery options with dynamic pricing.

## Features

- 🏪 **Point Relais** - Pickup point delivery with interactive selector
- 🏠 **Home Delivery** - Door-to-door delivery with separate pricing
- 💰 **Dynamic Pricing** - Weight-based shipping cost calculation
- 🏷️ **Label Generation** - PDF shipping label creation
- 📦 **Shipment Tracking** - Tracking number generation
- 🖨️ **Admin Widget** - Print labels directly from order details

## Requirements

- **Medusa v2.0+**
- **Node.js 18+**
- **Mondial Relay API credentials** (contact Mondial Relay for API access)

## Installation

```bash
npm install @theodaguier/medusa-fulfillment-mondialrelay
```

## Configuration

### 1. Add the plugin to medusa-config.ts

```typescript
// medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  // ... other config
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@theodaguier/medusa-fulfillment-mondialrelay/providers/mondialrelay",
            id: "mondialrelay-fulfillment",
            options: {
              login: process.env.MONDIAL_RELAY_LOGIN,
              password: process.env.MONDIAL_RELAY_PASSWORD,
              customerId: process.env.MONDIAL_RELAY_CUSTOMER_ID,
              culture: process.env.MONDIAL_RELAY_CULTURE || "fr-FR",
              apiBaseUrl: process.env.MONDIAL_RELAY_API_URL || "https://api.mondialrelay.com/Web_Services.asmx",
              businessAddress: {
                title: "M",
                firstname: process.env.BUSINESS_FIRSTNAME,
                lastname: process.env.BUSINESS_LASTNAME,
                streetname: process.env.BUSINESS_STREET,
                countryCode: process.env.BUSINESS_COUNTRY || "FR",
                postCode: process.env.BUSINESS_POSTCODE,
                city: process.env.BUSINESS_CITY,
                email: process.env.BUSINESS_EMAIL,
                mobileNo: process.env.BUSINESS_PHONE,
              },
            },
          },
        ],
      },
    },
  ],
})
```

### 2. Environment Variables

Create or update your `.env` file:

```env
# Mondial Relay API Credentials
MONDIAL_RELAY_LOGIN=your_login
MONDIAL_RELAY_PASSWORD=your_password
MONDIAL_RELAY_CUSTOMER_ID=your_customer_id
MONDIAL_RELAY_CULTURE=fr-FR
MONDIAL_RELAY_API_URL=https://api.mondialrelay.com/Web_Services.asmx

# Business Address (sender)
BUSINESS_FIRSTNAME=John
BUSINESS_LASTNAME=Doe
BUSINESS_STREET=123 Main Street
BUSINESS_POSTCODE=75001
BUSINESS_CITY=Paris
BUSINESS_COUNTRY=FR
BUSINESS_EMAIL=contact@yourstore.com
BUSINESS_PHONE=0612345678
```

### 3. Create Shipping Options

In the Medusa Admin, create shipping options:

#### Point Relais Option
1. Go to **Settings → Locations & Shipping**
2. Select your location and add a shipping option
3. Set:
   - **Name**: `Mondial Relay - Point Relais`
   - **Price Type**: `Calculated`
   - **Fulfillment Provider**: `mondialrelay-fulfillment`

#### Home Delivery Option
1. Create another shipping option
2. Set:
   - **Name**: `Mondial Relay - Livraison à Domicile`
   - **Price Type**: `Calculated`
   - **Fulfillment Provider**: `mondialrelay-fulfillment`

> **Note**: The plugin detects home delivery by looking for "domicile" in the option name, or you can set `{"type": "home"}` in the option's Data field.

## Pricing

The plugin calculates shipping prices based on package weight:

### Point Relais Prices (default)

| Weight | Price |
|--------|-------|
| 0-1 kg | €4.95 |
| 1-3 kg | €5.95 |
| 3-5 kg | €6.95 |
| 5-10 kg | €8.95 |
| 10+ kg | €12.95 |

### Home Delivery Prices

| Weight | Price |
|--------|-------|
| 0-1 kg | €7.95 |
| 1-3 kg | €8.95 |
| 3-5 kg | €9.95 |
| 5-10 kg | €12.95 |
| 10+ kg | €16.95 |

> **Note**: Prices can be customized by modifying the plugin source or using a custom pricing module.

## Storefront Integration

### Point Relais Selector

For Point Relais delivery, you need to integrate a pickup point selector in your storefront. The plugin expects the following data when setting the shipping method:

```typescript
await setShippingMethod({
  cartId: cart.id,
  shippingMethodId: selectedOptionId,
  data: {
    shipping_option_name: "Mondial Relay - Point Relais",
    parcel_shop_id: "020340", // Pickup point ID
    parcel_shop_name: "Relay Shop Name",
    parcel_shop_address: "123 Shop Street",
    parcel_shop_city: "Paris",
    parcel_shop_postcode: "75001",
  }
})
```

### Recommended: @frontboi/mondial-relay

For a ready-to-use Point Relais selector widget:

```bash
npm install @frontboi/mondial-relay
```

```tsx
import { ParcelShopSelector } from "@frontboi/mondial-relay"

<ParcelShopSelector
  postalCode="75001"
  countryCode="FR"
  brandIdAPI={process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND_ID}
  onParcelShopSelected={(shop) => {
    // Handle selection
  }}
/>
```

### Home Delivery

For home delivery, just pass the shipping option name:

```typescript
await setShippingMethod({
  cartId: cart.id,
  shippingMethodId: selectedOptionId,
  data: {
    shipping_option_name: "Mondial Relay - Livraison à Domicile",
  }
})
```

## Admin Features

### Label Printing Widget

The plugin adds a widget to the order details page in Medusa Admin. For orders fulfilled with Mondial Relay, you'll see:

- ✅ Tracking number
- ✅ Pickup point name (if applicable)
- 🖨️ "Print Label" button to download the shipping label PDF

## API Reference

### Provider Methods

| Method | Description |
|--------|-------------|
| `validateOption()` | Validates shipping option configuration |
| `validateFulfillmentData()` | Validates fulfillment data before creation |
| `calculatePrice()` | Calculates shipping cost based on weight and delivery type |
| `createFulfillment()` | Creates a shipment and generates label |
| `cancelFulfillment()` | Cancels an existing shipment |
| `getFulfillmentDocuments()` | Retrieves shipping label PDF |

### Delivery Modes

| Mode | API Value | Description |
|------|-----------|-------------|
| Point Relais | `PR` | Pickup point delivery |
| Home Delivery | `HOM` | Door-to-door delivery |
| Locker | `LOCKER` | Parcel locker delivery |

## Troubleshooting

### "Le plan de tri est introuvable"

This error occurs when the pickup point ID format is incorrect. The plugin automatically prefixes the ID with the country code (e.g., `FR-020340`).

### Price shows as €495.00 instead of €4.95

Ensure you're using the latest version. Prices are returned in EUR (major unit), not cents.

### Widget not appearing in Admin

1. Clear the `.medusa` folder in your Medusa project
2. Restart the dev server: `npm run dev`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Théo Daguier](https://github.com/theodaguier)

## Support

- 📧 Email: theo.daguier@icloud.com
- 🐛 Issues: [GitHub Issues](https://github.com/theodaguier/medusa-fulfillment-mondialrelay/issues)
