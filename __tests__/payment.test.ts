const mSupabase: any = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: "admin-uuid" } },
      error: null
    }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  insert: jest.fn().mockResolvedValue({ error: null }),
  update: jest.fn().mockReturnThis(),
};

// Mock Supabase and Next.js cache
jest.mock("../app/lib/supabase/server", () => ({
  createClient: jest.fn(() => Promise.resolve(mSupabase)),
}));

jest.mock("../lib/notifications", () => ({
  sendNotification: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

import { submitPaymentClaim, reviewPayment } from "../app/actions/payment";
import { revalidatePath } from "next/cache";

describe("Payment Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "admin-uuid" } },
      error: null
    });
    mSupabase.insert.mockResolvedValue({ error: null });
    mSupabase.update.mockReturnValue(mSupabase);
  });

  describe("submitPaymentClaim", () => {
    it("should reject claim if amount does not match database invoice", async () => {
      // Mock DB returning actual price of 1500
      mSupabase.single.mockResolvedValueOnce({
        data: { service_id: "srv-1", services: { price: "1500.00" } },
        error: null,
      });

      await expect(
        submitPaymentClaim("booking-123", "UTR123", 1000)
      ).rejects.toThrow(/Amount mismatch/);

      expect(mSupabase.insert).not.toHaveBeenCalled();
    });

    it("should securely submit claim when amounts match", async () => {
      mSupabase.single.mockResolvedValueOnce({
        data: { service_id: "srv-1", services: { price: "1500.00" } },
        error: null,
      });
      mSupabase.insert.mockResolvedValueOnce({ error: null });

      const result = await submitPaymentClaim("booking-123", "UTR123", 1500);

      expect(result.success).toBe(true);
      expect(mSupabase.insert).toHaveBeenCalledWith({
        booking_id: "booking-123",
        amount: 1500,
        upi_transaction_id: "UTR123",
        status: "submitted"
      });
    });
  });

  describe("reviewPayment", () => {
    it("should update status and write to audit_logs", async () => {
      // 1. profile check
      mSupabase.single.mockResolvedValueOnce({
        data: { role: "admin" },
        error: null,
      });
      // 2. payment lookup
      mSupabase.single.mockResolvedValueOnce({
        data: { id: "claim-1", request_id: "req-1", amount: 1500, status: "Verification Pending", customer_id: "cust-1" },
        error: null,
      });
      // 3. request lookup for notification
      mSupabase.single.mockResolvedValueOnce({
        data: { request_number: "MS-101", profiles: { email: "cust@example.com" } },
        error: null,
      });

      const result = await reviewPayment({
        payment_id: "00000000-0000-0000-0000-000000000001",
        action: "verify"
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/payments");
    });
  });
});

