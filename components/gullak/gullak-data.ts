export interface PresetScheme {
  id: string;

  dailyDeposit: string;
  years: string;
  annualRatePercent: string;
  investmentAmount: string;
  finalAmount: string;
  netProfit: string;
}
export const Gullak_SCHEMES: PresetScheme[] = [
  {
    id: "1",
    dailyDeposit: "Rs.100/-",
    years: "5 years",
    annualRatePercent: "15%",
    investmentAmount: "₹ 1,80,000/",
    finalAmount: "₹ 2,70,000/",
    netProfit: "₹ 90,000",
  },
   {
    id: "2",
    dailyDeposit: "Rs.200/-",
    years: "5 years",
    annualRatePercent: "15%",
    investmentAmount: "₹ 3,60,000/",
    finalAmount: "₹ 5,38,000/",
    netProfit: "₹ 1,78,000",
  },
   {
    id: "3",
    dailyDeposit: "Rs.500/-",
    years: "5 years",
    annualRatePercent: "15%",
    investmentAmount: "₹ 9,00,000/",
    finalAmount: "₹ 13,45,000/",
    netProfit: "₹ 1,78,000",
  },
 
];
