import FinanceRequestList from "@/components/admin/Finance/FinanceRequestList";

export default function Page() {
  return (
    <FinanceRequestList
      variant="deposits"
      defaultStatus="PENDING"
      title="Deposit Requests"
      description="Only pending deposit requests are shown here. Approve credits the user's wallet; a rejected request leaves it unchanged."
    />
  );
}