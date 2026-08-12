import { render, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocationRedesignHub } from "../location-redesign-hub";
import { TOP_SHELL_BACK_INTERCEPT_EVENT } from "@/lib/utils/browser-navigation";
import { useRouter, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(() => "/one/location"),
  useSearchParams: vi.fn(),
}));

describe("LocationRedesignHub", () => {
  it("intercepts TOP_SHELL_BACK_INTERCEPT_EVENT and resets state cleanly", () => {
    const mockReplace = vi.fn();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ replace: mockReplace });
    const mockSearchParams = new URLSearchParams("?action=share");
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(mockSearchParams);

    const onResetShareComposer = vi.fn();
    const onResetRequestComposer = vi.fn();

    const mockVm = {
      userId: "user_123",
      canShare: true,
      busy: null,
      revokingGrantId: null,
      shareCompletedTick: 0,
      readiness: { tone: "ready", title: "Ready", description: "Location is ready" },
      permissionIsPrompt: false,
      locationEnabled: true,
      autoShareEnabled: false,
      locationPaused: false,
      locationAccuracyLimited: false,
      myLocationPoint: null,
      myLocationError: null,
      recipients: [],
      visibleRecipients: [],
      activeOwnerGrants: [],
      receivedGrants: [],
      pendingOwnerRequests: [],
      requestedByMe: [],
      latestActivePublicInvite: null,
      latestActiveCircleInvite: null,
      activityReceipts: [],
      recipientSearch: "",
      selectedRecipientIds: [],
      selectedRequestOwnerIds: [],
      shareDurationHours: "0.5",
      shareMessage: "",
      durationHours: "0.5",
      requestMessage: "",
      shareReviewOpen: false,
      publicInviteUrl: "",
      circleInviteUrl: "",
      setRecipientSearch: vi.fn(),
      setShareDurationHours: vi.fn(),
      setShareMessage: vi.fn(),
      setDurationHours: vi.fn(),
      setRequestMessage: vi.fn(),
      setShareReviewOpen: vi.fn(),
      onResetShareComposer,
      onResetRequestComposer,
      toggleShareRecipient: vi.fn(),
      toggleRequestOwner: vi.fn(),
      onShowMyLocation: vi.fn(),
      onHideMyLocation: vi.fn(),
      onResumeMyLocation: vi.fn(),
      onAutoShareChange: vi.fn(),
      onRequestPermission: vi.fn(),
      onOpenLocationSettings: vi.fn(),
      onSyncContacts: vi.fn(),
      onShareToContacts: vi.fn(),
      onViewActivity: vi.fn(),
      onViewGrant: vi.fn(),
      onStopGrant: vi.fn(),
      onStopAllGrants: vi.fn(),
      onUnwatchGrant: vi.fn(),
      onApproveRequest: vi.fn(),
      onDenyRequest: vi.fn(),
      onCancelRequest: vi.fn(),
      onDiscardPrivateCheckInOperation: vi.fn(),
      onCheckIn: vi.fn(),
      onDriveTo: vi.fn(),
      onAskReshare: vi.fn(),
      onRevokePublicInvite: vi.fn(),
      onCreatePublicInvite: vi.fn(),
      onCreateCircleInvite: vi.fn(),
      onRevokeCircleInvite: vi.fn(),
      onTrackSmsInviteTap: vi.fn(),
      sosActive: false,
      sosBusy: false,
      sosEmergency: null,
      sosEmergencyStatus: "idle",
      smsContactUserIds: [],
      smsContactCandidates: [],
      smsRecipients: [],
      onTriggerSos: vi.fn(),
      onAddSmsContact: vi.fn(),
      onRemoveSmsContact: vi.fn(),
      recipientLabel: vi.fn(),
      recipientSubtitle: vi.fn(),
      isRecipientShareReady: vi.fn(),
      isReadyCheckInRecipient: vi.fn(),
      decryptedPoints: {},
      myRecipientKey: null,
      publicInviteError: null,
    };

    render(
      <LocationRedesignHub
        vm={mockVm as any}
      />
    );

    act(() => {
      const event = new CustomEvent(TOP_SHELL_BACK_INTERCEPT_EVENT, { cancelable: true });
      window.dispatchEvent(event);
    });

    expect(onResetShareComposer).toHaveBeenCalled();
    expect(onResetRequestComposer).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/one/location", { scroll: false });
  });
});
