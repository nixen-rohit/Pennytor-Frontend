import FinanceRequestList from "@/components/admin/Finance/FinanceRequestList";

export default function Page() {
  return (
    <FinanceRequestList
      variant="withdrawals"
      defaultStatus="PENDING"
      title="Withdrawal Requests"
      description="Only pending withdrawal requests are shown here. Approve debits the user's wallet; a rejected request leaves it unchanged."
    />
  );
}