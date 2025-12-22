
import { Festival, Category } from './types';

export const MAJOR_FESTIVALS: Festival[] = [
  {
    id: 'diwali',
    name: 'Diwali',
    description: 'The Festival of Lights celebrating the victory of light over darkness.',
    tithi: { month: 'Ashvin', paksha: 'Krishna', tithi: 'Amavasya' },
    standardMonth: 10,
    standardDay: 31
  },
  {
    id: 'holi',
    name: 'Holi',
    description: 'The festival of colors marking the arrival of spring.',
    tithi: { month: 'Phalguna', paksha: 'Shukla', tithi: 'Purnima' },
    standardMonth: 2,
    standardDay: 25
  },
  {
    id: 'gudhipadwa',
    name: 'Gudhi Padwa',
    description: 'The Marathi New Year.',
    tithi: { month: 'Chaitra', paksha: 'Shukla', tithi: 'Pratipada' },
    standardMonth: 3,
    standardDay: 9
  }
];

export const CATEGORIES: Category[] = ['Festival', 'Puja', 'Marriage', 'Death / Shraddha', 'Other'];

export const MARATHI_MONTHS = [
  'Chaitra', 'Vaishakh', 'Jyeshtha', 'Ashadh', 'Shravan', 'Bhadrapada', 
  'Ashvin', 'Kartik', 'Margashirsha', 'Paush', 'Magh', 'Phalgun'
];

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 
  'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'
];

export const PANCHANG_DATA_MAP: Record<string, any> = {
  "2024-10-31": { tithi: "Amavasya", paksha: "Krishna", month: "Ashvin", name: "Deepavali" },
  "2024-11-01": { tithi: "Pratipada", paksha: "Shukla", month: "Kartik", name: "Bali Pratipada" },
};
