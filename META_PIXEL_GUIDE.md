# 🌌 BhagyaRekha: Ultimate Meta Pixel & Conversions API (CAPI) Integration Guide

This guide provides a comprehensive overview of how visitor and conversion tracking is currently implemented in **Bhagyarekha**, and how to scale it to **Enterprise-Grade Bulletproof Tracking** using **Meta Advanced Matching** and the **Server-Side Conversions API (CAPI)**.

By combining browser-side tracking (Meta Pixel) and server-side tracking (Conversions API), you will ensure **100% conversion attribution**, bypass iOS 14.5+ privacy limitations, overcome ad-blockers, and dramatically lower your Facebook Ads Cost-Per-Acquisition (CPA).

---

## 🧭 Directory of Files Referenced
* 🖥️ **HTML Root**: [index.html](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/index.html) (Meta Pixel base tag loader)
* ⚛️ **React Router App**: [src/App.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/App.tsx) (Dynamic route tracking / `PageView`)
* 🏠 **Landing Page / Form**: [src/pages/Home.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/pages/Home.tsx) (Lead capture / `Lead`)
* 💳 **Checkout & Payment**: [src/pages/Payment.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/pages/Payment.tsx) (Checkout load & Razorpay success / `InitiateCheckout`, `Purchase`)
* ⚙️ **Express Server**: [server/index.ts](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/server/index.ts) (Backend order & payment verification / Server CAPI entrypoint)

---

## 📊 1. Current Tracking Architecture

Your codebase already includes a clean, high-performance base implementation of the Meta Pixel. Here is a breakdown of how it is currently wired:

### A. Base Pixel Loader
* **File Location**: [index.html](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/index.html)
* **Pixel ID**: `942046828830165`
* **Mechanics**: Initializes the global `fbq` tracker and fires a fallback `noscript` image pixel for browsers without JavaScript enabled.

### B. Dynamic PageView Tracker
* **File Location**: [src/App.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/App.tsx)
* **Mechanics**: Because BhagyaRekha is a Single Page Application (SPA) using React Router, standard page reloads don't happen. The `PixelPageViewTracker` hook listens to client-side path changes via `useLocation` and automatically fires a new `PageView` event:
  ```typescript
  useEffect(() => {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'PageView');
    }
  }, [location]);
  ```

### C. Lead Conversion Tracker
* **File Location**: [src/pages/Home.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/pages/Home.tsx)
* **Event**: `Lead`
* **Trigger**: Fired when a user successfully submits their name, email, phone, and birth details on the landing page, right before routing to their unique payment page.
  ```typescript
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Lead', {
      content_name: 'Soulmate Sketch Form Submission',
      status: 'success'
    });
  }
  ```

### D. Initiate Checkout Tracker
* **File Location**: [src/pages/Payment.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/pages/Payment.tsx)
* **Event**: `InitiateCheckout`
* **Trigger**: Fired once when the customized payment options load for a valid `orderId`.
  ```typescript
  useEffect(() => {
    if (order && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: totalPrice,
        currency: 'INR',
        content_name: 'Soulmate Sketch & Reading',
        content_ids: [orderId],
        content_type: 'product'
      });
    }
  }, [order]);
  ```

### E. Purchase Success Tracker
* **File Location**: [src/pages/Payment.tsx](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/src/pages/Payment.tsx)
* **Event**: `Purchase`
* **Trigger**: Fired inside the Razorpay `handler` callback immediately after the backend successfully verifies the payment signature.
  ```typescript
  if (verifyData.success) {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Purchase', {
        value: totalPrice,
        currency: 'INR',
        content_name: 'Soulmate Sketch & Reading',
        content_ids: [orderId],
        content_type: 'product'
      });
    }
  }
  ```

---

## 🚀 2. Advanced Matching (Maximize Match Quality)

By default, the pixel tracks conversions anonymously. **Advanced Matching** allows you to securely send hashed customer identifiers (like email, phone number, and city) to Meta alongside the events. This increases your **Event Match Quality** score, enabling Meta to match your website visitors back to their Facebook/Instagram accounts even if they are using different devices or safari browsers.

### How to Implement Client-Side Advanced Matching in React

When the user enters their details, you have access to their raw email, phone, and name. We can pass these to the `fbq('init')` or directly as third-parameter user data in standard pixel calls.

Here are the recommended drop-in code updates to add Advanced Matching to your components:

#### 1. In `src/pages/Home.tsx` (Form Submit / Lead Event)
Before navigating, re-initialize the pixel with the customer's data so the `Lead` event is immediately tied to their identity. Meta's client SDK automatically hashes these values locally on the user's browser using SHA-256 before transmitting them.

Update the `handleSubmit` tracking block:

```diff
-      // Track Lead / Form Submission in Meta Pixel
-      if (typeof (window as any).fbq === 'function') {
-        (window as any).fbq('track', 'Lead', {
-          content_name: 'Soulmate Sketch Form Submission',
-          status: 'success'
-        });
-      }
+      // Track Lead with Advanced Matching (SHA-256 hashing is handled by Meta's library)
+      if (typeof (window as any).fbq === 'function') {
+        // Re-initialize with user details to load Advanced Matching context
+        (window as any).fbq('init', '942046828830165', {
+          em: formData.email.trim().toLowerCase(),
+          ph: formData.phone.trim().replace(/\D/g, ''), // Keep numbers only
+          fn: formData.name.trim().split(' ')[0].toLowerCase(), // First Name
+          ct: formData.pobCity.trim().toLowerCase(),
+          st: formData.pobState.trim().toLowerCase()
+        });
+        
+        (window as any).fbq('track', 'Lead', {
+          content_name: 'Soulmate Sketch Form Submission',
+          status: 'success'
+        });
+      }
```

#### 2. In `src/pages/Payment.tsx` (InitiateCheckout & Purchase Events)
When your page loads, the order data is fetched from the backend `/api/orders/${orderId}`, which contains `order.email`, `order.phone`, and `order.name`. You can leverage this to feed Advanced Matching into `InitiateCheckout` and `Purchase`!

Update the `InitiateCheckout` effect:
```diff
  // Track InitiateCheckout in Meta Pixel once when order is successfully loaded
  useEffect(() => {
    if (order && typeof (window as any).fbq === 'function') {
+     // Feed user profile data into the tracker
+     (window as any).fbq('init', '942046828830165', {
+       em: order.email.trim().toLowerCase(),
+       ph: order.phone.trim().replace(/\D/g, ''),
+       fn: order.name.trim().split(' ')[0].toLowerCase()
+     });
+
      (window as any).fbq('track', 'InitiateCheckout', {
        value: totalPrice,
        currency: 'INR',
        content_name: 'Soulmate Sketch & Reading',
        content_ids: [orderId],
        content_type: 'product'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);
```

Update the Razorpay success callback (`handler` function):
```diff
            if (verifyData.success) {
              // Track Purchase in Meta Pixel
              if (typeof (window as any).fbq === 'function') {
+               // Re-confirm matching details
+               (window as any).fbq('init', '942046828830165', {
+                 em: order.email.trim().toLowerCase(),
+                 ph: order.phone.trim().replace(/\D/g, ''),
+                 fn: order.name.trim().split(' ')[0].toLowerCase()
+               });
+
                (window as any).fbq('track', 'Purchase', {
                  value: totalPrice,
                  currency: 'INR',
                  content_name: 'Soulmate Sketch & Reading',
                  content_ids: [orderId],
                  content_type: 'product'
                });
              }
```

---

## 🔌 3. Server-Side Conversions API (CAPI)

Browser tracking alone misses **20% to 40%** of conversions due to:
* 🚫 Ad-blockers (such as uBlock Origin or Brave Shield) blocking Facebook scripts.
* 🛡️ iOS 14+ Apple App Tracking Transparency (ATT) policies.
* 🍪 Discarded third-party cookies by browsers like Safari and Firefox.

The **Meta Conversions API (CAPI)** fixes this by sending conversion events directly from your Node.js/Express server to Meta’s servers.

### 🛡️ Core Rules for CAPI Integration
1. **Deduplication**: When sending the same event (e.g. `Purchase`) from both the Browser Pixel and CAPI, you must pass an identical `event_id` (your unique Supabase order ID) so Meta knows to merge them rather than double-count them.
2. **Server Hashing**: Unlike the browser pixel which hashes automatically, your server **MUST** manually hash the `email`, `phone`, and other personal data to SHA-256 before sending it to Meta.

---

### 💻 Step-by-Step Backend CAPI Implementation for `server/index.ts`

Here is a ready-to-use CAPI module you can drop into your server to handle server-side event tracking.

#### Step 1: Install a helper or use native fetch (Recommended)
You can call Meta's Graph API directly using native `fetch` (which is already built into Node 18+).

#### Step 2: Add CAPI Utility Code to `server/index.ts`
Create a helper function at the top of your [server/index.ts](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/server/index.ts):

```typescript
import crypto from 'crypto';

// Helper to SHA-256 hash personal data for Meta compliance
function sha256Hash(value: string | undefined): string | null {
  if (!value) return null;
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

// Main Conversions API Sender Function
async function sendMetaCapiEvent(params: {
  eventName: 'Lead' | 'InitiateCheckout' | 'Purchase';
  eventId: string; // Crucial for Deduplication (pass orderId)
  userData: {
    email: string;
    phone: string;
    name: string;
    ipAddress?: string;
    userAgent?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
  };
}) {
  const PIXEL_ID = process.env.META_PIXEL_ID || '942046828830165';
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN; // Set this in your .env

  if (!ACCESS_TOKEN) {
    console.warn('⚠️ Meta CAPI Access Token is missing. Server tracking skipped.');
    return;
  }

  // Meta requires phone numbers to have country codes and no symbols (e.g., "919999999999")
  let cleanPhone = params.userData.phone.trim().replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone; // Add India country code as default if 10 digits
  }

  const payload = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId, // Matches browser client event_id for deduplication
        event_source_url: `https://bhagyarekha.online/payment/${params.eventId}`,
        action_source: 'website',
        user_data: {
          em: [sha256Hash(params.userData.email)],
          ph: [sha256Hash(cleanPhone)],
          fn: [sha256Hash(params.userData.name.trim().split(' ')[0])],
          client_ip_address: params.userData.ipAddress,
          client_user_agent: params.userData.userAgent,
        },
        custom_data: params.customData ? {
          value: params.customData.value,
          currency: params.customData.currency || 'INR',
          content_name: params.customData.content_name,
        } : undefined,
      },
    ],
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const result: any = await response.json();
    if (result.error) {
      console.error('❌ Meta CAPI Error Response:', result.error);
    } else {
      console.log(`✅ Meta CAPI: Successfully logged server-side [${params.eventName}] for order ${params.eventId}`);
    }
  } catch (error) {
    console.error('❌ Failed to dispatch Meta CAPI event:', error);
  }
}
```

#### Step 3: Trigger Server CAPI `Lead` Event
Inside the `/api/orders` post handler of [server/index.ts](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/server/index.ts#L96), right after inserting the pending order into Supabase:

```typescript
    // Insert into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select();

    if (error) {
       // ... error handle
    }

    const orderId = data[0].id;

    // Trigger Server CAPI Lead in background
    sendMetaCapiEvent({
      eventName: 'Lead',
      eventId: orderId,
      userData: {
        email: orderData.email,
        phone: orderData.phone,
        name: orderData.name,
        ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
        userAgent: req.headers['user-agent']
      },
      customData: {
        content_name: 'Soulmate Sketch Form Submission'
      }
    });
```

#### Step 4: Trigger Server CAPI `Purchase` Event
Inside the `/api/orders/:id/verify-payment` route of [server/index.ts](file:///c:/Users/Bhupendra%20singh/OneDrive/Documents/GitHub/2jj/server/index.ts#L189), trigger the CAPI Purchase server-side when the payment is verified:

```typescript
    if (verifyData.success) {
      // Trigger Server CAPI Purchase event
      sendMetaCapiEvent({
        eventName: 'Purchase',
        eventId: id, // Must match the orderId used as client-side event_id
        userData: {
          email: data.email,
          phone: data.phone,
          name: data.name,
          ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
          userAgent: req.headers['user-agent']
        },
        customData: {
          value: totalPrice,
          currency: 'INR',
          content_name: 'Soulmate Sketch & Reading'
        }
      });
      
      // ... Proceed with sending success email ...
    }
```

---

## 🔗 4. The Deduplication Engine (Zero Double-Counting)

When you deploy Conversions API, **Meta receives two copies of the same transaction**:
1. One from the user's web browser (`fbq('track', 'Purchase')`).
2. One from your Express server (`sendMetaCapiEvent`).

If not deduplicated, **your dashboard will show double conversions**. Meta prevents this by looking for the `event_name` and the `event_id` parameters. If both match within 48 hours, Meta discards the server event and uses it purely to reinforce accuracy.

### Action Plan: Pass `event_id` in React
To enable deduplication, modify the browser standard events to pass the Supabase `orderId` as the `event_id` (the 4th parameter of the pixel call):

#### For `Lead` event (in `Home.tsx`):
Since the order ID is returned by your API call, trigger the pixel **after** the API call has succeeded:
```typescript
const result = await response.json();
if (response.ok) {
  // Track Lead with event_id deduplication (uses result.orderId)
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', 'Lead', {
      content_name: 'Soulmate Sketch Form Submission',
      status: 'success'
    }, {
      eventID: result.orderId // <-- Deduplication key!
    });
  }
  navigate(`/payment/${result.orderId}`);
}
```

#### For `InitiateCheckout` event (in `Payment.tsx`):
```typescript
(window as any).fbq('track', 'InitiateCheckout', {
  value: totalPrice,
  currency: 'INR',
  content_name: 'Soulmate Sketch & Reading',
  content_ids: [orderId],
  content_type: 'product'
}, {
  eventID: orderId // <-- Deduplication key!
});
```

#### For `Purchase` event (in `Payment.tsx`):
```typescript
(window as any).fbq('track', 'Purchase', {
  value: totalPrice,
  currency: 'INR',
  content_name: 'Soulmate Sketch & Reading',
  content_ids: [orderId],
  content_type: 'product'
}, {
  eventID: orderId // <-- Deduplication key!
});
```

---

## 🛠️ 5. Testing & Verification Checklist

Before running paid campaigns, verify the integrity of your tracking using these 3 industry-standard methods:

### 1️⃣ Browser Verification (Meta Pixel Helper Chrome Extension)
1. Install the official **Meta Pixel Helper** Chrome extension.
2. Visit your homepage `http://localhost:3000`. Click the extension icon.
3. You should see a green checkmark next to `PageView`.
4. Fill out the form. Upon clicking "Submit", open the helper. You should see a `Lead` event with matching custom parameters.
5. In the checkout page, look for the `InitiateCheckout` event.
6. Trigger a payment. Once verified, look for the `Purchase` event.

### 2️⃣ Network Inspections (Chrome DevTools)
1. Press `F12` on your landing page and open the **Network Tab**.
2. Filter the requests by entering `facebook.com/tr` or `fbevents`.
3. Fill out the form and submit. 
4. Check the outgoing request payload. You should see parameters like `ev: Lead` along with base64 encoded hashed user fields (`em`, `ph`) under the query parameters.

### 3️⃣ Real-Time Server Verification (Meta Events Manager)
1. Go to your **Facebook Business Manager** -> **Events Manager**.
2. Click on **Data Sources** and select your Pixel (`942046828830165`).
3. Navigate to the **Test Events** tab.
4. For client testing, enter your site URL and trigger events. You'll see them pop up instantly under the log as **"Browser"** events.
5. For CAPI testing, copy the **Test Event Code** (e.g., `TEST12345`) from this console.
6. In your `.env` or temporary CAPI code, pass `test_event_code: "TEST12345"` inside the payload to force your server requests to appear in the Test Events console. You will see these appear labeled as **"Server"**.
7. Ensure they show **"Deduplicated"** under the status column, proving that your browser `eventID` matches your server `event_id` perfectly.

---

## 📝 6. Meta Developer Credentials Setup
To activate CAPI, you must generate a Meta System User Access Token:
1. Open **Events Manager** -> **Settings**.
2. Scroll down to **Conversions API** -> Click **Generate access token**.
3. Copy this token and add it to your server's `.env` file:
   ```env
   META_ACCESS_TOKEN=your_copied_system_user_token
   META_PIXEL_ID=942046828830165
   ```
4. Restart your backend dev server (`npm run dev`).

---

🌌 **Congratulations!** By implementing these strategies, your tracking will be incredibly resilient, giving your Meta ad account the highest quality feedback loop to scale BhagyaRekha profitably!
