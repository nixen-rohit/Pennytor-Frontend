 

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  initials: string;
  countryCode: string;
}

export const testimonialsData: Testimonial[] = [
  { 
    id: 1, 
    name: "Abdur Rashid", 
    role: "Stock Investor • Mumbai", 
    content: "Best platform for stock trading. Very transparent and professional. Their advisory team is excellent.!", 
    rating: 5, 
    initials: "A", 
    countryCode: "IN" 
  },
  { 
    id: 2, 
    name: "Sarah Mitchell", 
    role: "SIP Investor • Bangalore", 
    content: "Started my SIP journey here. The process is smooth and returns are great. Customer support is very responsive.", 
    rating: 5, 
    initials: "S", 
   countryCode: "IN"  
  },
  { 
    id: 3, 
    name: "Ahmed Al Farsi", 
    role: "Loan Customer • Bangalore", 
    content: "Got my loan approved in 3 days. Excellent support team and best interest rates. Highly recommended!", 
    rating: 5, 
    initials: "A", 
   countryCode: "IN" 
  },
  { 
    id: 4, 
    name: "Abdur Rashid", 
    role: "Stock Investor • Mumbai", 
    content: "Best platform for stock trading. Very transparent and professional. Their advisory team is excellent.!", 
    rating: 5, 
    initials: "A", 
    countryCode: "IN" 
  },
  { 
    id: 5, 
    name: "Sarah Mitchell", 
    role: "SIP Investor • Bangalore", 
    content: "Started my SIP journey here. The process is smooth and returns are great. Customer support is very responsive.", 
    rating: 5, 
    initials: "S", 
   countryCode: "IN"  
  },
  { 
    id: 6, 
    name: "Ahmed Al Farsi", 
    role: "Loan Customer • Bangalore", 
    content: "Got my loan approved in 3 days. Excellent support team and best interest rates. Highly recommended!", 
    rating: 5, 
    initials: "A", 
   countryCode: "IN" 
  },
  
   
];