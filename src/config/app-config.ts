import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Bubbly Day Nursery",
  version: packageJson.version,
  copyright: `© ${currentYear} Bubbly Day Nursery Limited. All rights reserved.`,
  meta: {
    title: "Bubbly Day Nursery - Early Years Education & Nursery Portal",
    description:
      "Bubbly Day Nursery is an Ofsted-registered Early Years nursery in London. Providing warm, stimulating, and child-centric childcare for babies, toddlers, and preschool children with EYFS alignment.",
  },
};
