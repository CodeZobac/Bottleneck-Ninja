import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/auth-options";
import paypalService from "@/lib/paypal/paypal-service";

// Report price
const REPORT_PRICE = 5;

export async function POST() {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to create a payment" },
        { status: 401 }
      );
    }

    // Create a PayPal order
    const userId = session.user.id || session.user.email || 'user';
    const orderResponse = await paypalService.createOrder(REPORT_PRICE, userId);
    
    // Get the approval URL from PayPal response
    const approvalUrl = paypalService.getApprovalUrl(orderResponse);

    // Return the PayPal approval URL to redirect the user
    return NextResponse.json({ 
      success: true, 
      redirectUrl: approvalUrl,
      orderId: orderResponse.id
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}