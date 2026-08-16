import FinanceRequestList from "@/components/admin/Finance/FinanceRequestList";

export default function FinanceReportPage() {
  return (
    <FinanceRequestList
      variant="report"
      showFundColumn
      showTypeFilter
      title="Finance Report"
      description="Every deposit and withdrawal — pending, approved and rejected — merged in one feed, ordered by date. The Fund column marks each request as a deposit (incoming) or withdrawal (outgoing)."
    />
  );
}