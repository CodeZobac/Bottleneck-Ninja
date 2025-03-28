/**
 * PayPal Service for creating and handling payment orders
 */

interface CreateOrderResponse {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.baseUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
    
    if (!this.clientId || !this.clientSecret) {
      console.error('PayPal credentials are not configured properly');
    }
  }

  /**
   * Create a payment order in PayPal
   * @param amount Amount to charge in USD
   * @param userId User ID for reference
   */
  async createOrder(amount: number, userId: string): Promise<CreateOrderResponse> {
    const accessToken = await this.getAccessToken();
    
    const url = `${this.baseUrl}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
            description: "AI Personalized Computer Build Report",
            custom_id: userId,
          },
        ],
        application_context: {
          brand_name: "Bottleneck Ninja",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/builds`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PayPal API Error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  }

  /**
   * Get an access token from PayPal
   */
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PayPal Authentication Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Get redirect URL from PayPal order response
   */
  getApprovalUrl(orderResponse: CreateOrderResponse): string {
    const approveLink = orderResponse.links.find(link => link.rel === "approve");
    if (!approveLink) {
      throw new Error("No approval URL found in PayPal response");
    }
    return approveLink.href;
  }
}

// Export singleton instance
const paypalService = new PayPalService();
export default paypalService;