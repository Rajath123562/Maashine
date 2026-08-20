const mSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  update: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
};

// Mock Next.js cache revalidation
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock the Supabase server client
jest.mock("../app/lib/supabase/server", () => ({
  createClient: jest.fn(() => Promise.resolve(mSupabase)),
}));

import { updateJobStatus } from "../app/actions/staff";

describe("updateJobStatus Server Action Security", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject unauthenticated requests", async () => {
    mSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(
      updateJobStatus("assignment-123", "in_progress")
    ).rejects.toThrow(/Not authenticated/);
  });

  it("should reject an unauthorized user trying to modify another cleaner's assignment", async () => {
    const maliciousUser = { id: "user-attacker-uuid" };
    mSupabase.auth.getUser.mockResolvedValue({
      data: { user: maliciousUser },
      error: null,
    });

    // User is NOT an admin (just a standard user / different staff)
    mSupabase.single
      // 1st call: profile query
      .mockResolvedValueOnce({
        data: { role: "customer" },
        error: null,
      })
      // 2nd call: assignment query returning assigned cleaner with different profile_id
      .mockResolvedValueOnce({
        data: {
          id: "assignment-123",
          status: "assigned",
          staff: { profile_id: "user-legitimate-cleaner-uuid", full_name: "Ramesh" },
          cleaning_requests: { id: "req-1", status: "Confirmed" }
        },
        error: null,
      });

    await expect(
      updateJobStatus("assignment-123", "completed")
    ).rejects.toThrow(/Unauthorized: You are not assigned to this job/);
  });

  it("should allow the legitimately assigned staff member to update job status", async () => {
    const legitimateStaffUser = { id: "user-legitimate-cleaner-uuid" };
    mSupabase.auth.getUser.mockResolvedValue({
      data: { user: legitimateStaffUser },
      error: null,
    });

    mSupabase.single
      // 1st call: profile query
      .mockResolvedValueOnce({
        data: { role: "customer" },
        error: null,
      })
      // 2nd call: assignment query matching profile_id
      .mockResolvedValueOnce({
        data: {
          id: "assignment-123",
          status: "en_route",
          staff: { profile_id: "user-legitimate-cleaner-uuid", full_name: "Ramesh" },
          cleaning_requests: { id: "req-1", status: "Confirmed" }
        },
        error: null,
      });

    // Mock successful update
    mSupabase.update.mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await updateJobStatus("assignment-123", "in_progress", "Arrived at property");
    expect(result.success).toBe(true);
  });
});
