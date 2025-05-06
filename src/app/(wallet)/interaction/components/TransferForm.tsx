// components/TransferForm.tsx
"use client";
import { useState } from "react";
import { Button, Input, Toast, SpinLoading } from "antd-mobile";

interface TransferFormProps {
  onSend: (amount: string) => Promise<void>;
  isPending?: boolean;
  error?: Error | null;
  isSuccess?: boolean;
}

export function TransferForm({
  onSend,
  isPending = false,
  error,
  isSuccess,
}: TransferFormProps) {
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAmount = (value: string) => {
    if (!value) return "Amount is required";
    if (isNaN(Number(value))) return "Invalid number format";
    if (Number(value) <= 0) return "Amount must be greater than 0";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateAmount(amount);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await onSend(amount);
      Toast.show({
        content: "Transaction Submitted",
      });
      setAmount("");
      setLocalError(null);
    } catch (err) {
      console.error("Transfer failed:", err);
      setLocalError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <span>Amount</span>
        <Input
          className="border border-gray-300 rounded-md p-2 mt-2 "
          id="amount"
          type="number"
          step="0.0001"
          placeholder="Enter amount to transfer"
          value={amount}
          onChange={(val) => {
            setAmount(val);
            setLocalError(null);
          }}
          disabled={isPending}
        />
      </div>

      {localError && <p className="text-sm text-red-500">{localError}</p>}

      {error && (
        <p className="text-sm text-red-500">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {isSuccess && (
        <p className="text-sm text-green-500">
          Transfer completed successfully!
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <SpinLoading className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Transfer Now"
        )}
      </Button>
    </form>
  );
}
