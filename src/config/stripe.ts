export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    quota: 10,
    pagesPerPdf: 5, // Changed property name to numPages
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: '',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 50,
    pagesPerPdf: 25, // Changed property name to numPages
    price: {
      amount: 499,
      priceIds: {
        test: '',
        production: 'price_1NztiuSB7QqTr0ciuCeNXclM',
      },
    },
  },
];

