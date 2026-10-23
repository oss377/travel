import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DestinationSearchForm } from "@/components/marketing/destination-search-form";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const props = {
  locale: "en" as const,
  label: "Search destinations",
  placeholder: "City, region, or experience",
  submitLabel: "Search",
  hint: "Published destinations only.",
  errorShort: "Enter at least 2 characters.",
  errorLong: "Keep your search under 80 characters.",
};

describe("DestinationSearchForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("validates an empty submission before navigating", async () => {
    const user = userEvent.setup();
    render(<DestinationSearchForm {...props} />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(
      await screen.findByText("Enter at least 2 characters."),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navigates to the localized destination search", async () => {
    const user = userEvent.setup();
    render(<DestinationSearchForm {...props} />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search destinations" }),
      "Lalibela",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/en/destinations?q=Lalibela",
      );
    });
  });

  it("keeps the Amharic interface and destination path localized", async () => {
    const user = userEvent.setup();
    render(
      <DestinationSearchForm
        {...props}
        locale="am"
        label="መዳረሻዎችን ፈልግ"
        submitLabel="ፈልግ"
        errorShort="ቢያንስ 2 ፊደላት ያስገቡ።"
      />,
    );

    await user.type(
      screen.getByRole("searchbox", { name: "መዳረሻዎችን ፈልግ" }),
      "ላሊበላ",
    );
    await user.click(screen.getByRole("button", { name: "ፈልግ" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        `/am/destinations?q=${encodeURIComponent("ላሊበላ")}`,
      );
    });
  });
});
