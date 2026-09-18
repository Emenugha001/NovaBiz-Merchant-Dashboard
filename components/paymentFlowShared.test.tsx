import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountNairaInput, PinStep, SubmitFailedStep, SuccessStep } from "./paymentFlowShared";

describe("AmountNairaInput", () => {
  it("parses kobo entered as decimals, not just whole Naira", async () => {
    const user = userEvent.setup();
    const onChangeAmountKobo = vi.fn();

    function Harness() {
      const [amountKobo, setAmountKobo] = useState(0);
      return (
        <AmountNairaInput
          amountKobo={amountKobo}
          onChangeAmountKobo={(kobo) => {
            setAmountKobo(kobo);
            onChangeAmountKobo(kobo);
          }}
        />
      );
    }

    render(<Harness />);
    await user.type(screen.getByRole("textbox"), "5000.70");

    expect(onChangeAmountKobo).toHaveBeenLastCalledWith(500_070);
    expect(screen.getByText("₦5,000.70")).toBeInTheDocument();
  });

  it("keeps only one decimal point and caps it at two decimal digits", async () => {
    const user = userEvent.setup();
    const onChangeAmountKobo = vi.fn();
    render(<AmountNairaInput amountKobo={0} onChangeAmountKobo={onChangeAmountKobo} />);

    await user.type(screen.getByRole("textbox"), "12.345.67");

    expect(screen.getByRole("textbox")).toHaveValue("12.34");
    expect(onChangeAmountKobo).toHaveBeenLastCalledWith(1_234);
  });
});

describe("PinStep", () => {
  it("calls onPinComplete once four digits are entered", async () => {
    const user = userEvent.setup();
    const onPinComplete = vi.fn();
    render(<PinStep onBack={vi.fn()} onPinComplete={onPinComplete} errorMessage={null} attempt={0} />);

    for (const digit of ["1", "2", "3", "4"]) {
      await user.click(screen.getByRole("button", { name: digit }));
    }

    expect(onPinComplete).toHaveBeenCalledTimes(1);
    expect(onPinComplete).toHaveBeenCalledWith("1234");
  });

  it("clears previously entered digits once the attempt counter changes (wrong PIN)", async () => {
    const user = userEvent.setup();
    const onPinComplete = vi.fn();
    const { rerender } = render(
      <PinStep onBack={vi.fn()} onPinComplete={onPinComplete} errorMessage={null} attempt={0} />
    );

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));

    rerender(
      <PinStep
        onBack={vi.fn()}
        onPinComplete={onPinComplete}
        errorMessage="Incorrect PIN. Please try again."
        attempt={1}
      />
    );
    expect(screen.getByText("Incorrect PIN. Please try again.")).toBeInTheDocument();

    for (const digit of ["3", "4", "1", "2"]) {
      await user.click(screen.getByRole("button", { name: digit }));
    }

    // If the old "12" hadn't been cleared, this would either complete early on the
    // 2nd click here or produce "1234" instead of the digits entered after the reset.
    expect(onPinComplete).toHaveBeenCalledTimes(1);
    expect(onPinComplete).toHaveBeenCalledWith("3412");
  });

  it("backspace removes the last digit", async () => {
    const user = userEvent.setup();
    const onPinComplete = vi.fn();
    render(<PinStep onBack={vi.fn()} onPinComplete={onPinComplete} errorMessage={null} attempt={0} />);

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    for (const digit of ["9", "8", "7"]) {
      await user.click(screen.getByRole("button", { name: digit }));
    }

    expect(onPinComplete).toHaveBeenCalledTimes(1);
    expect(onPinComplete).toHaveBeenCalledWith("1987");
  });
});

describe("SuccessStep", () => {
  it("renders the title/detail and calls onDone", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<SuccessStep title="Transfer successful" detail="₦50,000.00 was sent to Jane Doe" onDone={onDone} />);

    expect(screen.getByText("Transfer successful")).toBeInTheDocument();
    expect(screen.getByText("₦50,000.00 was sent to Jane Doe")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe("SubmitFailedStep", () => {
  it("invokes onRetry and onClose from their respective buttons", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onClose = vi.fn();
    render(<SubmitFailedStep title="Transfer didn't go through" onRetry={onRetry} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
