
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
  // 2024 Samples
  "2024-10-31": { tithi: "Amavasya", paksha: "Krishna", month: "Ashvin", name: "Deepavali" },
  "2024-11-01": { tithi: "Pratipada", paksha: "Shukla", month: "Kartik", name: "Bali Pratipada" },
  
  // 2026 Full Data
  "2026-01-06": { name: "Sakat Chauth", tithi: "Chaturthi", paksha: "Krishna", month: "Magh" },
  "2026-01-13": { name: "Shattila Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Magh" },
  "2026-01-20": { name: "Putrada Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Paush" },
  "2026-01-21": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Magh" },
  "2026-01-28": { name: "Jaya Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Magh" },
  
  "2026-02-04": { name: "Dwijapriya Sankashti", tithi: "Chaturthi", paksha: "Krishna", month: "Phalgun" },
  "2026-02-12": { name: "Vijaya Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Phalgun" },
  "2026-02-13": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Phalgun" },
  "2026-02-27": { name: "Amalaki Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Phalgun" },
  "2026-02-28": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Phalgun" },

  "2026-03-06": { name: "Bhalachandra Sankashti", tithi: "Chaturthi", paksha: "Krishna", month: "Chaitra" },
  "2026-03-14": { name: "Papamochani Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Chaitra" },
  "2026-03-15": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Chaitra" },
  "2026-03-28": { name: "Kamada Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Chaitra" },
  "2026-03-30": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Chaitra" },

  "2026-04-05": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Vaishakh" },
  "2026-04-13": { name: "Varuthini Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Vaishakh" },
  "2026-04-15": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Vaishakh" },
  "2026-04-16": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Vaishakh" },
  "2026-04-27": { name: "Mohini Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Vaishakh" },
  "2026-04-28": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Vaishakh" },

  "2026-05-05": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Jyeshtha" },
  "2026-05-13": { name: "Apara Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Jyeshtha" },
  "2026-05-14": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Jyeshtha" },
  "2026-05-15": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Jyeshtha" },
  "2026-05-16": { name: "Vat Savitri Vrat", tithi: "Amavasya", paksha: "Krishna", month: "Jyeshtha" },
  "2026-05-27": { name: "Padmini Ekadashi (Adhika)", tithi: "Ekadashi", paksha: "Shukla", month: "Adhika Jyeshtha" },
  "2026-05-28": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Adhika Jyeshtha" },
  "2026-05-31": { name: "Purnima Vrat", tithi: "Purnima", paksha: "Shukla", month: "Adhika Jyeshtha" },

  "2026-06-03": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Ashadh" },
  "2026-06-11": { name: "Parama Ekadashi (Adhika)", tithi: "Ekadashi", paksha: "Krishna", month: "Adhika Jyeshtha" },
  "2026-06-12": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Adhika Jyeshtha" },
  "2026-06-13": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Adhika Jyeshtha" },
  "2026-06-25": { name: "Nirjala Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Jyeshtha" },
  "2026-06-27": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Jyeshtha" },
  "2026-06-29": { name: "Vat Purnima", tithi: "Purnima", paksha: "Shukla", month: "Jyeshtha" },

  "2026-07-10": { name: "Yogini Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Ashadh" },
  "2026-07-25": { name: "Devshayani Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Ashadh" },

  "2026-08-02": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Shravan" },
  "2026-08-09": { name: "Kamika Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Shravan" },
  "2026-08-10": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Shravan" },
  "2026-08-11": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Shravan" },
  "2026-08-23": { name: "Shravana Putrada Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Shravan" },
  "2026-08-25": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Shravan" },
  "2026-08-28": { name: "Shravana Purnima", tithi: "Purnima", paksha: "Shukla", month: "Shravan" },
  "2026-08-31": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Bhadrapada" },

  "2026-09-07": { name: "Aja Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Bhadrapada" },
  "2026-09-14": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Bhadrapada" },
  "2026-09-15": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Bhadrapada" },
  "2026-09-22": { name: "Parsva Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Bhadrapada" },

  "2026-10-01": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Ashvin" },
  "2026-10-07": { name: "Indira Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Ashvin" },
  "2026-10-14": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Ashvin" },
  "2026-10-15": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Ashvin" },
  "2026-10-18": { name: "Karwa Chauth", tithi: "Chaturthi", paksha: "Krishna", month: "Kartik" },
  "2026-10-21": { name: "Pasankusa Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Ashvin" },
  "2026-10-29": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Ashvin" },

  "2026-11-01": { name: "Sankashti Chaturthi", tithi: "Chaturthi", paksha: "Krishna", month: "Margashirsha" },
  "2026-11-05": { name: "Rama Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Kartik" },
  "2026-11-13": { name: "Pradosh Vrat (Krishna)", tithi: "Trayodashi", paksha: "Krishna", month: "Kartik" },
  "2026-11-14": { name: "Masik Shivaratri", tithi: "Chaturdashi", paksha: "Krishna", month: "Kartik" },
  "2026-11-20": { name: "Devutthana Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Kartik" },
  "2026-11-29": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Kartik" },
  "2026-11-30": { name: "Kartik Purnima", tithi: "Purnima", paksha: "Shukla", month: "Kartik" },

  "2026-12-05": { name: "Utpanna Ekadashi", tithi: "Ekadashi", paksha: "Krishna", month: "Margashirsha" },
  "2026-12-20": { name: "Mokshada Ekadashi", tithi: "Ekadashi", paksha: "Shukla", month: "Margashirsha" },
  "2026-12-29": { name: "Pradosh Vrat (Shukla)", tithi: "Trayodashi", paksha: "Shukla", month: "Margashirsha" }
};
