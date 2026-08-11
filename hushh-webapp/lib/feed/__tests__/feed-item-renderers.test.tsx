import { describe, expect, it } from "vitest";

import { presentFeedItem } from "../feed-item-renderers";
import type { FeedItem } from "@/lib/services/feed-service";

function createItem(eventType: string, metadata: Record<string, unknown> = {}): FeedItem {
  return {
    id: "test",
    source_domain: "location",
    event_type: eventType,
    actor_label: null,
    metadata,
    read: false,
    created_at: new Date().toISOString(),
  };
}

describe("presentFeedItem - Location Activity Identity Context", () => {
  describe("location_share_created", () => {
    it("identifies counterparty when counterpart_label is present", () => {
      const result = presentFeedItem(createItem("location_share_created", { counterpart_label: "Jhumma" }));
      expect(result.description).toBe("You shared live location with Jhumma.");
    });

    it("uses safe generic fallback when counterpart_label is missing", () => {
      const result = presentFeedItem(createItem("location_share_created", {}));
      expect(result.description).toBe("A live location share was started.");
    });

    it("uses safe generic fallback when counterpart_label is blank whitespace", () => {
      const result = presentFeedItem(createItem("location_share_created", { counterpart_label: "   " }));
      expect(result.description).toBe("A live location share was started.");
    });
  });

  describe("location_share_revoked", () => {
    it("identifies counterparty", () => {
      const result = presentFeedItem(createItem("location_share_revoked", { counterpart_label: "Jhumma" }));
      expect(result.description).toBe("You stopped sharing live location with Jhumma.");
    });

    it("uses safe generic fallback", () => {
      const result = presentFeedItem(createItem("location_share_revoked"));
      expect(result.description).toBe("A live location share was revoked.");
    });
  });

  describe("location_share_expired", () => {
    it("identifies counterparty", () => {
      const result = presentFeedItem(createItem("location_share_expired", { counterpart_label: "Jhumma" }));
      expect(result.description).toBe("Your live location share with Jhumma expired.");
    });

    it("uses safe generic fallback", () => {
      const result = presentFeedItem(createItem("location_share_expired"));
      expect(result.description).toBe("A live location share expired.");
    });
  });

  describe("location_access_request", () => {
    it("identifies counterparty", () => {
      const result = presentFeedItem(createItem("location_access_request", { counterpart_label: "Jhumma" }));
      expect(result.description).toBe("Jhumma requested access to your live location.");
    });

    it("uses safe generic fallback", () => {
      const result = presentFeedItem(createItem("location_access_request"));
      expect(result.description).toBe("Someone asked to see your location.");
    });
  });

  describe("location_access_approved", () => {
    it("identifies counterparty", () => {
      const result = presentFeedItem(createItem("location_access_approved", { counterpart_label: "Jhumma" }));
      expect(result.description).toBe("You approved Jhumma's location request.");
    });

    it("uses safe generic fallback", () => {
      const result = presentFeedItem(createItem("location_access_approved"));
      expect(result.description).toBe("A location access request was approved.");
    });
  });

  describe("location_access_denied", () => {
    it("identifies counterparty", () => {
      const result = presentFeedItem(createItem("location_access_denied", { counterpart_label: "Jhumma" }));
      expect(result.description).toBe("You denied Jhumma's location request.");
    });

    it("uses safe generic fallback", () => {
      const result = presentFeedItem(createItem("location_access_denied"));
      expect(result.description).toBe("A location access request was denied.");
    });
  });
});
