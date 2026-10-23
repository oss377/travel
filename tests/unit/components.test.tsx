import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  getPaginationItems,
} from "@/components/ui/pagination";
import { ScrollRail } from "@/components/ui/scroll-rail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("buttons and links", () => {
  it("renders an accessible button with an optional asChild link", () => {
    const { rerender } = render(<Button>Save changes</Button>);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();

    rerender(
      <Button asChild variant="outline">
        <a href="/en/about">About us</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "About us" });
    expect(link).toHaveAttribute("href", "/en/about");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("marks a disabled button as unavailable", () => {
    render(<Button disabled>Unavailable</Button>);
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
});

describe("form primitives", () => {
  it("associates labels with text inputs", () => {
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" aria-describedby="email-help" />
        <p id="email-help">We only use this for account notices.</p>
      </>,
    );

    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAccessibleDescription(
      "We only use this for account notices.",
    );
  });

  it("exposes checkbox state to assistive technology", async () => {
    const user = userEvent.setup();
    render(
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">I accept the rules</Label>
      </div>,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "I accept the rules",
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});

describe("layout primitives", () => {
  it("renders an empty state with a heading and description", () => {
    render(
      <EmptyState
        title="Nothing here yet"
        description="Published content will appear here."
        action={<Button>Go home</Button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Nothing here yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Published content will appear here."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go home" })).toBeInTheDocument();
  });

  it("announces badges as text", () => {
    render(<Badge variant="gold">Coming soon</Badge>);
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });
});

describe("pagination", () => {
  it("creates a stable page window with ellipses", () => {
    expect(getPaginationItems(1, 10)).toEqual([
      1,
      2,
      "ellipsis-end",
      10,
    ]);
    expect(getPaginationItems(5, 10)).toEqual([
      1,
      "ellipsis-start",
      4,
      5,
      6,
      "ellipsis-end",
      10,
    ]);
  });

  it("marks the current page and exposes previous/next links", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        buildHref={(page) => `/en/destinations?page=${page}`}
        labels={{
          navigation: "Pagination",
          previous: "Previous",
          next: "Next",
          page: (page) => `Page ${page}`,
        }}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Page 2")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "rel",
      "prev",
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "rel",
      "next",
    );
  });
});

describe("scroll rail", () => {
  it("is a labelled, keyboard-focusable region with scroll controls", () => {
    render(
      <ScrollRail
        ariaLabel="Experience categories"
        previousLabel="Previous"
        nextLabel="Next"
      >
        <div>Religious and spiritual</div>
        <div>Culture and heritage</div>
      </ScrollRail>,
    );

    const region = screen.getByRole("region", {
      name: "Experience categories",
    });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });
});

describe("dialog and tabs", () => {
  it("opens a labelled dialog and closes it from the accessible close button", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open details</Button>
        </DialogTrigger>
        <DialogContent closeLabel="Close dialog">
          <DialogTitle>Travel plan details</DialogTitle>
          <DialogDescription>
            Review the full price before continuing.
          </DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open details" }));

    expect(
      await screen.findByRole("dialog", { name: "Travel plan details" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("supports tab selection with the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="en">
        <TabsList aria-label="Language preview">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="am">አማርኛ</TabsTrigger>
        </TabsList>
        <TabsContent value="en">See the full price.</TabsContent>
        <TabsContent value="am">ሙሉ ዋጋውን ይመልከቱ።</TabsContent>
      </Tabs>,
    );

    const englishTab = screen.getByRole("tab", { name: "English" });
    const amharicTab = screen.getByRole("tab", { name: "አማርኛ" });
    englishTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(amharicTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("ሙሉ ዋጋውን ይመልከቱ።")).toBeInTheDocument();
  });
});
