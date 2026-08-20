const mSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  rpc: jest.fn(),
};

// Mock the Supabase server client
jest.mock("../app/lib/supabase/server", () => ({
  createClient: jest.fn(() => Promise.resolve(mSupabase)),
}));

import { submitBooking } from "../app/actions/booking";

describe("submitBooking Server Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should securely reject a manipulated frontend price", async () => {
    // Mock the DB returning an actual price of 150
    mSupabase.single.mockResolvedValue({
      data: { price: "150.00" },
      error: null,
    });

    const manipulatedFrontendPrice = 100.00;

    // Expect the action to throw an error due to price mismatch
    await expect(
      submitBooking("service-123", "2026-08-20T10:00:00Z", manipulatedFrontendPrice)
    ).rejects.toThrow(/Price manipulation detected/);

    // Ensure RPC is never called
    expect(mSupabase.rpc).not.toHaveBeenCalled();
  });

  it("should successfully call the RPC if prices match", async () => {
    // Mock the DB returning an actual price of 150
    mSupabase.single.mockResolvedValue({
      data: { price: "150.00" },
      error: null,
    });

    // Mock successful RPC
    mSupabase.rpc.mockResolvedValue({
      data: "booking-456",
      error: null,
    });

    const validPrice = 150.00;

    const result = await submitBooking("service-123", "2026-08-20T10:00:00Z", validPrice);
    
    expect(result.success).toBe(true);
    expect(result.bookingId).toBe("booking-456");
    expect(mSupabase.rpc).toHaveBeenCalledWith("create_booking", {
      p_service_id: "service-123",
      p_booking_time: "2026-08-20T10:00:00Z"
    });
  });
});

