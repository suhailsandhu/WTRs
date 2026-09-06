import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory + persisted database path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'wtr_database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const INITIAL_USERS = [
  {
    id: 'usr_suhail',
    username: 'suhail_s',
    displayName: 'Suhail Sandhu',
    hooperAlias: 'The Microwave',
    hideRealName: false,
    email: 'sandhu.suhail@gmail.com',
    phone: '(916) 555-0142',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    height: `6'1"`,
    weight: '185 lbs',
    position: 'Guard',
    experienceLevel: 'Adult Competitive',
    playStyle: 'Floor General / Playmaker',
    homeArea: 'Downtown Sacramento',
    favoriteCourtName: '24 Hour Fitness Fulton & Hurley',
    runsLoggedCount: 42,
    checkInsCount: 68,
    reliableEtaRate: 96,
    isAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_marcus',
    username: 'marcus_c',
    displayName: 'Marcus Chen',
    hooperAlias: 'Buckets Marcus',
    hideRealName: false,
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    height: `6'3"`,
    weight: '200 lbs',
    position: 'Wing',
    experienceLevel: 'College / Pro',
    playStyle: '3 & D Specialist',
    homeArea: 'Midtown Sacramento',
    favoriteCourtName: 'Roosevelt Park',
    runsLoggedCount: 56,
    checkInsCount: 89,
    reliableEtaRate: 98,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_jordan',
    username: 'jordan_k',
    displayName: 'Jordan Kelly',
    hooperAlias: 'Flash 916',
    hideRealName: false,
    email: 'jordan@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    height: `6'5"`,
    weight: '215 lbs',
    position: 'Forward',
    experienceLevel: 'College / Pro',
    playStyle: 'Slasher / High Flyer',
    homeArea: 'Downtown Sacramento',
    favoriteCourtName: 'In-Shape K St Rooftop',
    runsLoggedCount: 38,
    checkInsCount: 51,
    reliableEtaRate: 92,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_dlo',
    username: 'dlo_sac',
    displayName: `D'Angelo Brooks`,
    hooperAlias: 'D-Lo Range',
    hideRealName: true,
    email: 'dlo@example.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    height: `5'11"`,
    weight: '175 lbs',
    position: 'Guard',
    experienceLevel: 'High School Varsity',
    playStyle: 'Deep Range Shot Creator',
    homeArea: 'North Natomas',
    favoriteCourtName: 'In-Shape North Natomas',
    runsLoggedCount: 29,
    checkInsCount: 44,
    reliableEtaRate: 94,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_tyler',
    username: 'ty_hoops',
    displayName: 'Tyler Washington',
    hooperAlias: 'Lockdown Ty',
    hideRealName: false,
    email: 'tyler@example.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    height: `6'2"`,
    weight: '190 lbs',
    position: 'Wing',
    experienceLevel: 'Adult Competitive',
    playStyle: 'Lockdown Wing Stopper',
    homeArea: 'Roseville',
    favoriteCourtName: 'Maidu Regional Park',
    runsLoggedCount: 31,
    checkInsCount: 47,
    reliableEtaRate: 95,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_malik',
    username: 'malik_j',
    displayName: 'Malik Johnson',
    hooperAlias: 'The Anchor',
    hideRealName: true,
    email: 'malik@example.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    height: `6'6"`,
    weight: '225 lbs',
    position: 'Center',
    experienceLevel: 'College / Pro',
    playStyle: 'Paint Beast / Rim Protector',
    homeArea: 'Rocklin',
    favoriteCourtName: 'In-Shape Rocklin East Elite',
    runsLoggedCount: 47,
    checkInsCount: 62,
    reliableEtaRate: 97,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_COURTS = [
  {
    "id": "court_24_downtown",
    "name": "24 Hour Fitness",
    "subName": "Downtown Sacramento (1020 7th St)",
    "brand": "24 Hour Fitness",
    "address": "1020 7th St",
    "city": "Sacramento",
    "lat": 38.5816,
    "lng": -121.4944,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_24_downtown_primary.jpg",
    "additionalPhotos": [
      "/courts/24_downtown_img6.jpg",
      "/courts/24_downtown_img7.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "Mon-Fri 5:00 AM \u2013 11:00 PM, Sat-Sun 6:00 AM \u2013 8:00 PM",
    "description": "Full-size indoor regulation maple hardwood court on the 2nd floor of 24 Hour Fitness Super Sport at 1020 7th St in Downtown Sacramento, one block from Golden 1 Center and DOCO. Features glass backboards, perimeter safety padding, and fast-paced 5v5 pickup runs during weekday lunch (12\u20131 PM) and evenings (5:30\u20138 PM).",
    "courtSpecsNotice": "Full Court \u00b7 2nd Floor Hardwood \u00b7 Downtown Sacramento / DOCO \u00b7 Glass Backboards",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 15,
      "11": 35,
      "12": 70,
      "16": 45,
      "17": 80,
      "18": 95,
      "19": 90,
      "20": 65
    }
  },
  {
    "id": "court_24_fulton",
    "name": "24 Hour Fitness",
    "subName": "Fulton & Hurley (1250 Hurley Way)",
    "brand": "24 Hour Fitness",
    "address": "1250 Hurley Way",
    "city": "Sacramento",
    "lat": 38.5992,
    "lng": -121.4116,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_24_fulton_primary.jpg",
    "additionalPhotos": [
      "/courts/court_24_fulton_alt1.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 11:00 PM",
    "description": "Full-size indoor hardwood basketball court located at 1250 Hurley Way near Fulton Avenue in Arden-Arcade. Features high-traction hardwood, regulation three-point lines, and dual glass backboards with an established weeknight run schedule on Tuesday, Thursday, and Friday from 6:00 PM onward.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 Arden-Arcade (Fulton & Hurley) \u00b7 Glass Backboards",
    "isActive": true,
    "typicalBusyTime": "6:00 PM \u2013 8:30 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "6": 10,
      "12": 40,
      "17": 60,
      "18": 85,
      "19": 90,
      "20": 60
    }
  },
  {
    "id": "court_24_laguna",
    "name": "24 Hour Fitness",
    "subName": "Laguna / South Sacramento (8785 Center Pkwy)",
    "brand": "24 Hour Fitness",
    "address": "8785 Center Pkwy",
    "city": "Sacramento",
    "lat": 38.4682,
    "lng": -121.4285,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_24_laguna_primary.jpg",
    "additionalPhotos": [
      "/courts/court_24_laguna_alt1.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 11:00 PM",
    "description": "Full regulation hardwood court at 8785 Center Parkway near Bruceville Road, serving South Sacramento and Elk Grove hoopers. Features solid hardwood flooring with regulation key lines and glass backboards. Regular evening pickup games from 5:30 PM to 8:30 PM.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 South Sac / Elk Grove Border",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 15,
      "12": 35,
      "17": 75,
      "18": 90,
      "19": 85,
      "20": 55
    }
  },
  {
    "id": "court_24_roseville",
    "name": "24 Hour Fitness",
    "subName": "Roseville (336 N Sunrise Ave)",
    "brand": "24 Hour Fitness",
    "address": "336 N Sunrise Ave",
    "city": "Roseville",
    "lat": 38.7485,
    "lng": -121.2619,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_24_roseville_primary.jpg",
    "additionalPhotos": [
      "/courts/unsplash_5.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 11:00 PM",
    "description": "Full-size indoor hardwood basketball court located on North Sunrise Avenue near Douglas Boulevard in Roseville. Features polished hardwood flooring, bright gym lighting, and glass backboards. Draws hoopers for early morning shootarounds and weeknight 5v5 runs.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 Roseville \u00b7 Sunrise Location",
    "isActive": true,
    "typicalBusyTime": "6:00 PM \u2013 8:30 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "6": 20,
      "12": 35,
      "17": 65,
      "18": 85,
      "19": 80,
      "20": 50
    }
  },
  {
    "id": "court_24_citrus_heights",
    "name": "24 Hour Fitness",
    "subName": "Citrus Heights (6633 Auburn Blvd)",
    "brand": "24 Hour Fitness",
    "address": "6633 Auburn Blvd",
    "city": "Citrus Heights",
    "lat": 38.6881,
    "lng": -121.2942,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_24_citrus_heights_primary.jpg",
    "additionalPhotos": [
      "/courts/unsplash_7.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 11:00 PM",
    "description": "Full indoor regulation basketball court inside 24 Hour Fitness at 6633 Auburn Blvd in Citrus Heights. High gym ceilings, hardwood flooring with standard three-point arc and glass backboards, hosting afternoon and evening pickup runs.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 Citrus Heights \u00b7 Auburn Blvd",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 8:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 15,
      "12": 30,
      "17": 70,
      "18": 80,
      "19": 75,
      "20": 50
    }
  },
  {
    "id": "court_24_folsom",
    "name": "24 Hour Fitness",
    "subName": "Folsom (1006 Riley St)",
    "brand": "24 Hour Fitness",
    "address": "1006 Riley St",
    "city": "Folsom",
    "lat": 38.6678,
    "lng": -121.1645,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_24_folsom_primary.jpg",
    "additionalPhotos": [
      "/courts/unsplash_8.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 11:00 PM",
    "description": "Full-size indoor regulation hardwood basketball court in Folsom at 1006 Riley St near Glenn Drive. Clean hardwood court surface, glass backboards, and consistent weeknight pickup runs starting around 6:00 PM.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 Folsom \u00b7 Riley St",
    "isActive": true,
    "typicalBusyTime": "6:00 PM \u2013 8:00 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "6": 30,
      "12": 25,
      "17": 60,
      "18": 85,
      "19": 75,
      "20": 45
    }
  },
  {
    "id": "court_inshape_rocklin_complex",
    "name": "In-Shape Family Fitness",
    "subName": "Rocklin Sports Complex (2511 Warren Dr)",
    "brand": "In-Shape Family Fitness",
    "address": "2511 Warren Dr",
    "city": "Rocklin",
    "lat": 38.7909,
    "lng": -121.2384,
    "type": "Indoor Gym",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_inshape_rocklin_complex_primary.jpg",
    "additionalPhotos": [
      "/courts/court_inshape_greenhaven_primary.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 10:00 PM",
    "description": "Flagship multi-sport facility in South Placer County with dedicated indoor hardwood basketball courts, spectator areas, and full training equipment. High turnout for adult competitive 5v5 pickup runs, particularly between 5:30 PM and 8:30 PM.",
    "courtSpecsNotice": "2 Full Courts \u00b7 Hardwood \u00b7 Rocklin Sports Complex \u00b7 Glass Rims",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 8:00 PM",
    "bestTimeToday": "5:30 PM",
    "historicalActivityByHour": {
      "6": 20,
      "12": 50,
      "16": 60,
      "17": 85,
      "18": 95,
      "19": 90,
      "20": 60
    }
  },
  {
    "id": "court_inshape_midtown",
    "name": "In-Shape Family Fitness",
    "subName": "Midtown Sacramento (1301 19th St)",
    "brand": "In-Shape Family Fitness",
    "address": "1301 19th St",
    "city": "Sacramento",
    "lat": 38.5746,
    "lng": -121.4815,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_inshape_midtown_primary.jpg",
    "additionalPhotos": [
      "/courts/court_inshape_natomas_primary.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 10:00 PM",
    "description": "Prominent Midtown fitness center at 19th and J Street in Sacramento (formerly California Family Fitness). Features a dedicated indoor hardwood basketball court with regulation glass backboards, attracting downtown professionals and Midtown hoopers for 5v5 runs after 5:00 PM.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 Midtown (19th & J)",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:30 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 20,
      "12": 45,
      "17": 75,
      "18": 90,
      "19": 85,
      "20": 60
    }
  },
  {
    "id": "court_inshape_natomas",
    "name": "In-Shape Family Fitness",
    "subName": "Natomas (3880 Innovator Dr)",
    "brand": "In-Shape Family Fitness",
    "address": "3880 Innovator Dr",
    "city": "Sacramento",
    "lat": 38.6419,
    "lng": -121.5032,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_inshape_natomas_primary.jpg",
    "additionalPhotos": [
      "/courts/court_inshape_midtown_primary.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 10:00 PM",
    "description": "North Natomas fitness club located on Innovator Drive near Arena Boulevard. Features a full-size indoor hardwood basketball court with glass backboards, perimeter safety padding, and popular evening 5v5 pickup runs.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 North Natomas",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 15,
      "12": 35,
      "17": 70,
      "18": 85,
      "19": 80,
      "20": 55
    }
  },
  {
    "id": "court_inshape_greenhaven",
    "name": "In-Shape Family Fitness",
    "subName": "Greenhaven / Pocket (6300 Riverside Blvd)",
    "brand": "In-Shape Family Fitness",
    "address": "6300 Riverside Blvd",
    "city": "Sacramento",
    "lat": 38.5085,
    "lng": -121.5275,
    "type": "Indoor Gym",
    "courtSize": "Half Court",
    "hoopCount": 1,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_inshape_greenhaven_primary.jpg",
    "additionalPhotos": [
      "/courts/court_inshape_natomas_primary.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:30 AM \u2013 9:30 PM",
    "description": "Pocket and Greenhaven neighborhood club located at 6300 Riverside Blvd. Features an indoor hardwood basketball court setup with regulation glass backboard, ideal for shooting workouts, 1v1 practice, and 3v3 half-court games.",
    "courtSpecsNotice": "Half Court \u00b7 Indoor Hardwood \u00b7 3v3 / Shooting Practice \u00b7 Pocket Area",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 7:30 PM",
    "bestTimeToday": "5:30 PM",
    "historicalActivityByHour": {
      "6": 10,
      "12": 25,
      "17": 55,
      "18": 70,
      "19": 65,
      "20": 40
    }
  },
  {
    "id": "court_inshape_elkgrove_laguna",
    "name": "In-Shape Family Fitness",
    "subName": "Elk Grove Laguna (3443 Laguna Blvd)",
    "brand": "In-Shape Family Fitness",
    "address": "3443 Laguna Blvd",
    "city": "Elk Grove",
    "lat": 38.4235,
    "lng": -121.4385,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_inshape_elkgrove_laguna_primary.jpg",
    "additionalPhotos": [
      "/courts/court_inshape_natomas_primary.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 10:00 PM",
    "description": "West Elk Grove fitness club located at 3443 Laguna Blvd. Features an indoor regulation hardwood basketball court with glass backboards and consistent weeknight 5v5 pickup runs.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 West Elk Grove",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 15,
      "12": 30,
      "17": 70,
      "18": 85,
      "19": 80,
      "20": 50
    }
  },
  {
    "id": "court_inshape_elkgrove_bond",
    "name": "In-Shape Family Fitness",
    "subName": "Elk Grove Bond (8569 Bond Rd)",
    "brand": "In-Shape Family Fitness",
    "address": "8569 Bond Rd",
    "city": "Elk Grove",
    "lat": 38.4116,
    "lng": -121.3662,
    "type": "Indoor Gym",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "surface": "Hardwood",
    "rimType": "Regulation Glass Backboard",
    "primaryPhoto": "/courts/court_inshape_elkgrove_bond_primary.jpg",
    "additionalPhotos": [
      "/courts/court_inshape_natomas_primary.jpg"
    ],
    "indoor": true,
    "membershipRequired": true,
    "hours": "5:00 AM \u2013 10:00 PM",
    "description": "East Elk Grove fitness facility on Bond Road near Elk Grove Florin Road. Features an indoor hardwood basketball court with regulation glass backboards and community evening pickup games.",
    "courtSpecsNotice": "Full Court \u00b7 Indoor Hardwood \u00b7 East Elk Grove",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 7:30 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "6": 10,
      "12": 25,
      "17": 60,
      "18": 75,
      "19": 70,
      "20": 45
    }
  },
  {
    "id": "court_park_roosevelt",
    "name": "Roosevelt Park",
    "subName": "Downtown Sacramento (1615 9th St / 9th & P)",
    "brand": "Public Park",
    "address": "1615 9th St",
    "city": "Sacramento",
    "lat": 38.5728,
    "lng": -121.4984,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": true,
    "lightsSchedule": "Park lighting on until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Regulation Glass Backboard",
    "netType": "Heavy-Duty Anti-Whip Nylon",
    "cotwRating": 5.0,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/roosevelt-park/",
    "amenities": [
      "Kings Refurbished Purple Court",
      "Lighted until 10 PM",
      "Downtown Location",
      "Water Fountain"
    ],
    "bestRunTimes": "Midday 12:00 PM & Evenings 5:30 PM \u2013 9:30 PM",
    "primaryPhoto": "/courts/court_park_roosevelt_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_roosevelt_alt1.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "The crown jewel of Downtown Sacramento streetball, located at 9th and P Streets. Features two full outdoor courts refurbished in official Sacramento Kings royal purple and silver, complete with Kings center-court logos, regulation glass backboards, heavy-duty anti-whip nets, and overhead park lighting on until 10:00 PM every night.",
    "courtSpecsNotice": "COTW \u2605 5.0 \u00b7 2 Full Courts \u00b7 Kings Purple/Gray Surface \u00b7 Lit until 10 PM",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 9:30 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "9": 20,
      "12": 35,
      "16": 60,
      "17": 85,
      "18": 95,
      "19": 95,
      "20": 85,
      "21": 65
    }
  },
  {
    "id": "court_park_land",
    "name": "William Land Park",
    "subName": "Land Park (3800 S Land Park Dr)",
    "brand": "Public Park",
    "address": "3800 S Land Park Dr",
    "city": "Sacramento",
    "lat": 38.5446,
    "lng": -121.5034,
    "type": "Outdoor Park",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "hasLights": false,
    "lightsSchedule": "Daylight play only",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Streetball Standard)",
    "netType": "Heavy-Duty Chain Nets",
    "cotwRating": 4.9,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/william-land-park/",
    "amenities": [
      "Shaded Oak Tree Canopy",
      "Chain Nets",
      "Saturday Morning Runs",
      "Park Restrooms Nearby"
    ],
    "bestRunTimes": "Saturday Mornings 8:30 AM \u2013 12:00 PM & Summer Afternoons",
    "primaryPhoto": "/courts/court_park_land_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_land_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 Sunset",
    "description": "Iconic outdoor basketball court nestled in historic William Land Park beneath towering heritage valley oak trees near the Sacramento Zoo and Fairytale Town. The mature oak canopy provides natural shade on hot 95\u00b0+ Sacramento summer afternoons. Features outdoor asphalt surface, sturdy double rims, and legendary Saturday morning pickup runs starting at 8:30 AM.",
    "courtSpecsNotice": "COTW \u2605 4.9 \u00b7 Shaded Oak Canopy \u00b7 Saturday Morning Runs \u00b7 Chain Nets",
    "isActive": true,
    "typicalBusyTime": "Saturday Mornings & 5:00 PM",
    "bestTimeToday": "5:00 PM",
    "historicalActivityByHour": {
      "8": 30,
      "9": 80,
      "10": 95,
      "11": 90,
      "12": 60,
      "16": 45,
      "17": 70,
      "18": 65
    }
  },
  {
    "id": "court_park_southside",
    "name": "Southside Park",
    "subName": "Southside / Downtown (2115 6th St / 6th & T)",
    "brand": "Public Park",
    "address": "2115 6th St",
    "city": "Sacramento",
    "lat": 38.5694,
    "lng": -121.5042,
    "type": "Outdoor Park",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "hasLights": true,
    "lightsSchedule": "Night lights active until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Regulation Glass Backboard",
    "netType": "Heavy-Duty Anti-Whip Nylon",
    "cotwRating": 4.7,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/southside-park/",
    "amenities": [
      "Kings Branded Court",
      "Night Lights until 10 PM",
      "Lake Adjacent",
      "Urban Park"
    ],
    "bestRunTimes": "5:30 PM \u2013 9:00 PM Weekdays",
    "primaryPhoto": "/courts/court_park_southside_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_southside_alt1.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Renowned community court in Southside Park at 6th and T Streets, right by Southside Park lake. Features a custom Sacramento Kings Nike Grind court surface made from recycled athletic footwear, regulation glass backboards, Kings logos, and overhead night lighting active until 10:00 PM.",
    "courtSpecsNotice": "COTW \u2605 4.7 \u00b7 Full Court \u00b7 Lit until 10 PM \u00b7 Kings Branded Court",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:30 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "10": 25,
      "12": 30,
      "17": 65,
      "18": 85,
      "19": 80,
      "20": 70,
      "21": 40
    }
  },
  {
    "id": "court_park_mckinley",
    "name": "McKinley Park",
    "subName": "East Sacramento (601 Alhambra Blvd)",
    "brand": "Public Park",
    "address": "601 Alhambra Blvd",
    "city": "Sacramento",
    "lat": 38.5772,
    "lng": -121.4655,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": false,
    "lightsSchedule": "Daylight play only",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Durable)",
    "netType": "Heavy-Duty Nylon",
    "cotwRating": 4.8,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/mckinley-park/",
    "amenities": [
      "Historic East Sac Park",
      "Rose Garden Nearby",
      "2 Full Courts",
      "Weekend Pickup"
    ],
    "bestRunTimes": "Saturday & Sunday 9:00 AM \u2013 12:00 PM & Weekdays 5:00 PM",
    "primaryPhoto": "/courts/court_park_mckinley_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_mckinley_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 Sunset",
    "description": "Outdoor basketball courts in East Sacramento at 601 Alhambra Blvd, situated directly between the historic McKinley Park Rose Garden and the tennis courts. Shaded by majestic elm and oak trees, with two full courts and consistent weekend morning and weekday 5:00 PM pickup runs.",
    "courtSpecsNotice": "COTW \u2605 4.8 \u00b7 2 Full Courts \u00b7 East Sacramento \u00b7 Oak Shaded",
    "isActive": true,
    "typicalBusyTime": "Saturday Mornings & 5:00 PM",
    "bestTimeToday": "5:00 PM",
    "historicalActivityByHour": {
      "9": 45,
      "10": 75,
      "11": 80,
      "16": 50,
      "17": 70,
      "18": 65,
      "19": 40
    }
  },
  {
    "id": "court_park_tahoe",
    "name": "Tahoe Park",
    "subName": "Tahoe Park (3501 59th St / 11th Ave)",
    "brand": "Public Park",
    "address": "3501 59th St",
    "city": "Sacramento",
    "lat": 38.5441,
    "lng": -121.4398,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": false,
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Streetball Standard)",
    "netType": "Heavy-Duty Chain Nets",
    "cotwRating": 4.5,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/tahoe-park/",
    "amenities": [
      "Newly Resurfaced Blue/Green Court",
      "Chain Nets",
      "Community Pool Adjacent",
      "Park Gazebos"
    ],
    "bestRunTimes": "4:30 PM \u2013 7:30 PM",
    "primaryPhoto": "/courts/court_park_tahoe_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_tahoe_alt1.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 Sunset",
    "description": "Located at 3501 59th St and 11th Avenue in Tahoe Park next to the community swimming pool and baseball diamond. Recently repaved and resurfaced with a vibrant two-tone blue and emerald green acrylic court with crisp white regulation markings, reinforced double rims, and heavy-duty steel chain nets. Active neighborhood pickup every afternoon starting at 5:00 PM.",
    "courtSpecsNotice": "COTW \u2605 4.5 \u00b7 Newly Resurfaced Blue/Green \u00b7 Chain Nets \u00b7 Afternoon Pickup",
    "isActive": true,
    "typicalBusyTime": "4:30 PM \u2013 7:30 PM",
    "bestTimeToday": "5:00 PM",
    "historicalActivityByHour": {
      "10": 20,
      "12": 30,
      "16": 60,
      "17": 75,
      "18": 70,
      "19": 45
    }
  },
  {
    "id": "court_park_sutters_landing",
    "name": "Sutter's Landing Park",
    "subName": "Midtown / American River (20 28th St)",
    "brand": "Public Park",
    "address": "20 28th St",
    "city": "Sacramento",
    "lat": 38.5878,
    "lng": -121.4642,
    "type": "Outdoor Park",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "hasLights": false,
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Durable)",
    "netType": "Heavy-Duty Nylon",
    "cotwRating": 4.4,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/sutters-landing-park/",
    "amenities": [
      "American River Location",
      "Skate Park & Bike Trail Adjacent",
      "Dog Park Nearby"
    ],
    "bestRunTimes": "Cool Summer Evenings 5:30 PM \u2013 Dusk",
    "primaryPhoto": "/courts/court_park_sutters_landing_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_sutters_landing_alt1.png"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 Sunset",
    "description": "Scenic outdoor basketball court located at 20 28th Street where Midtown meets the American River, adjacent to the Sutter's Landing skate park and Two Rivers bike trail. Cool delta breezes keep the court comfortable on warm summer evenings.",
    "courtSpecsNotice": "COTW \u2605 4.4 \u00b7 River Breeze Court \u00b7 American River Trail Adjacent",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 Dusk",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "10": 15,
      "12": 25,
      "17": 60,
      "18": 75,
      "19": 70,
      "20": 40
    }
  },
  {
    "id": "court_park_north_natomas",
    "name": "North Natomas Regional Park",
    "subName": "North Natomas (2601 New Market Dr)",
    "brand": "Sports Complex",
    "address": "2601 New Market Dr",
    "city": "Sacramento",
    "lat": 38.6582,
    "lng": -121.5085,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": true,
    "lightsSchedule": "Push-button stadium lights until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Regulation Glass Backboard",
    "netType": "Heavy-Duty Anti-Whip Nylon",
    "cotwRating": 4.8,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/north-natomas-regional-park/",
    "amenities": [
      "2 Tournament Full Courts",
      "Stadium Push-Button Lights",
      "Ample Parking",
      "Restrooms & Water"
    ],
    "bestRunTimes": "5:30 PM \u2013 9:30 PM Daily",
    "primaryPhoto": "/courts/court_park_north_natomas_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_north_natomas_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Top-tier outdoor basketball facility in North Natomas next to Inderkum High School. Features two tournament-grade acrylic full courts enclosed with fencing, push-button stadium night lighting active until 10:00 PM, and high-energy evening runs.",
    "courtSpecsNotice": "COTW \u2605 4.8 \u00b7 2 Full Courts \u00b7 Stadium Lights until 10 PM \u00b7 Natomas Hub",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 9:30 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "10": 20,
      "12": 30,
      "16": 60,
      "17": 85,
      "18": 95,
      "19": 90,
      "20": 80,
      "21": 50
    }
  },
  {
    "id": "court_park_northgate",
    "name": "Northgate Park",
    "subName": "North Sacramento (2825 Mendel Way)",
    "brand": "Public Park",
    "address": "2825 Mendel Way",
    "city": "Sacramento",
    "lat": 38.6185,
    "lng": -121.4795,
    "type": "Outdoor Park",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "hasLights": true,
    "lightsSchedule": "Lit until 9:30 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Streetball Standard)",
    "netType": "Heavy-Duty Chain Nets",
    "cotwRating": 4.3,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/sacramento-ca/northgate-park/",
    "amenities": [
      "Fenced Court",
      "Night Lights",
      "Community Pickup",
      "Chain Nets"
    ],
    "bestRunTimes": "Evenings 5:00 PM \u2013 8:00 PM",
    "primaryPhoto": "/courts/court_park_northgate_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_northgate_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 9:30 PM (Lit)",
    "description": "Fenced outdoor full-court basketball facility in North Sacramento at 2825 Mendel Way. Features all-weather acrylic surface, heavy-duty chain nets, double rims, and overhead park lighting on until 9:30 PM.",
    "courtSpecsNotice": "COTW \u2605 4.3 \u00b7 Full Court \u00b7 Chain Nets \u00b7 Lit until 9:30 PM",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 8:00 PM",
    "bestTimeToday": "5:30 PM",
    "historicalActivityByHour": {
      "10": 15,
      "12": 25,
      "17": 60,
      "18": 75,
      "19": 70,
      "20": 45
    }
  },
  {
    "id": "court_park_oasis_elkgrove",
    "name": "Oasis Community Park",
    "subName": "Elk Grove (7010 Oasis Walk Way)",
    "brand": "Public Park",
    "address": "7010 Oasis Walk Way",
    "city": "Elk Grove",
    "lat": 38.3845,
    "lng": -121.3982,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": true,
    "lightsSchedule": "Push-button timer lights until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Regulation Glass Backboard",
    "netType": "Heavy-Duty Anti-Whip Nylon",
    "cotwRating": 4.9,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/elk-grove-ca/oasis-park/",
    "amenities": [
      "2 Blue Acrylic Courts",
      "Push-Button Lights until 10 PM",
      "Elk Grove Streetball Hub"
    ],
    "bestRunTimes": "5:30 PM \u2013 9:30 PM Daily",
    "primaryPhoto": "/courts/court_park_oasis_elkgrove_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_oasis_elkgrove_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Premier modern basketball destination in Elk Grove at 7010 Oasis Walk Way. Features two full-size sapphire blue acrylic courts with regulation three-point and free-throw lines, push-button timer sports lighting until 10:00 PM, and competitive 5v5 pickup every weekday evening.",
    "courtSpecsNotice": "COTW \u2605 4.9 \u00b7 2 Full Courts \u00b7 Blue Acrylic Surface \u00b7 Lit until 10 PM",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 9:30 PM",
    "bestTimeToday": "6:30 PM",
    "historicalActivityByHour": {
      "10": 20,
      "12": 35,
      "16": 55,
      "17": 80,
      "18": 95,
      "19": 90,
      "20": 80,
      "21": 50
    }
  },
  {
    "id": "court_park_morse_elkgrove",
    "name": "Morse Community Park",
    "subName": "South Elk Grove (5540 Bellaterra Dr)",
    "brand": "Public Park",
    "address": "5540 Bellaterra Dr",
    "city": "Elk Grove",
    "lat": 38.4022,
    "lng": -121.3785,
    "type": "Outdoor Park",
    "courtSize": "Full Court",
    "hoopCount": 2,
    "hasLights": true,
    "lightsSchedule": "Lit until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Durable)",
    "netType": "Heavy-Duty Nylon",
    "cotwRating": 4.6,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/elk-grove-ca/morse-park/",
    "amenities": [
      "Lit Court",
      "Adjacent Skatepark & Dog Park",
      "Family Atmosphere"
    ],
    "bestRunTimes": "5:00 PM \u2013 8:30 PM",
    "primaryPhoto": "/courts/court_park_morse_elkgrove_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_morse_elkgrove_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Full outdoor basketball court in South Elk Grove on Bellaterra Drive, adjacent to the Morse skatepark, dog park, and water spray ground. Equipped with sports lighting on until 10:00 PM and steady evening pickup games.",
    "courtSpecsNotice": "COTW \u2605 4.6 \u00b7 Full Court \u00b7 Night Lights \u00b7 Elk Grove Runs",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 8:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "10": 20,
      "12": 30,
      "17": 65,
      "18": 80,
      "19": 75,
      "20": 50
    }
  },
  {
    "id": "court_park_hughes_roseville",
    "name": "William \"Bill\" Hughes Park",
    "subName": "Roseville (2797 Alexandra Dr)",
    "brand": "Public Park",
    "address": "2797 Alexandra Dr",
    "city": "Roseville",
    "lat": 38.7965,
    "lng": -121.3215,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": true,
    "lightsSchedule": "Stadium lights on until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Regulation Glass Backboard",
    "netType": "Heavy-Duty Anti-Whip Nylon",
    "cotwRating": 4.8,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/roseville-ca/hughes-park/",
    "amenities": [
      "2 Full Courts",
      "Stadium Lighting",
      "Pristine Acrylic Surface",
      "Blue Oaks Community"
    ],
    "bestRunTimes": "5:00 PM \u2013 9:00 PM Daily",
    "primaryPhoto": "/courts/court_park_hughes_roseville_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_hughes_roseville_alt1.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Premier outdoor hoops facility in the Blue Oaks area of West Roseville at 2797 Alexandra Dr. Features full-size basketball courts with regulation lines, durable rims, and bright sports lighting on until 10:00 PM.",
    "courtSpecsNotice": "COTW \u2605 4.8 \u00b7 2 Full Courts \u00b7 Lit until 10 PM \u00b7 Blue Oaks",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 9:00 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "10": 25,
      "12": 35,
      "16": 60,
      "17": 85,
      "18": 90,
      "19": 85,
      "20": 70
    }
  },
  {
    "id": "court_park_maidu_roseville",
    "name": "Maidu Regional Park",
    "subName": "East Roseville (1550 Maidu Dr)",
    "brand": "Public Park",
    "address": "1550 Maidu Dr",
    "city": "Roseville",
    "lat": 38.7368,
    "lng": -121.2514,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": true,
    "lightsSchedule": "Lit courts until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Durable)",
    "netType": "Heavy-Duty Chain Nets",
    "cotwRating": 4.7,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/roseville-ca/maidu-park/",
    "amenities": [
      "2 Full Courts",
      "Chain Nets",
      "Lighted until 10 PM",
      "Placer County Hoops Hub"
    ],
    "bestRunTimes": "5:30 PM \u2013 8:30 PM",
    "primaryPhoto": "/courts/court_park_maidu_roseville_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_maidu_roseville_alt1.png"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Flagship 152-acre regional sports park in East Roseville on Maidu Drive. Features full-size outdoor basketball courts with chain nets, evening park lighting until 10:00 PM, and regular after-work pickup games.",
    "courtSpecsNotice": "COTW \u2605 4.7 \u00b7 2 Full Courts \u00b7 Chain Nets \u00b7 Lighted \u00b7 East Roseville",
    "isActive": true,
    "typicalBusyTime": "5:30 PM \u2013 8:30 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "10": 20,
      "12": 30,
      "17": 65,
      "18": 80,
      "19": 75,
      "20": 55
    }
  },
  {
    "id": "court_park_rusch_citrus",
    "name": "Rusch Community Park",
    "subName": "Citrus Heights (7801 Auburn Blvd)",
    "brand": "Public Park",
    "address": "7801 Auburn Blvd",
    "city": "Citrus Heights",
    "lat": 38.7052,
    "lng": -121.2985,
    "type": "Outdoor Park",
    "courtSize": "Multiple Full Courts",
    "hoopCount": 4,
    "hasLights": true,
    "lightsSchedule": "Lit until 10:00 PM",
    "surface": "All-Weather Acrylic Asphalt",
    "rimType": "Double Rim (Durable)",
    "netType": "Heavy-Duty Chain Nets",
    "cotwRating": 4.5,
    "cotwVerified": true,
    "cotwUrl": "https://www.courtsoftheworld.com/united-states/citrus-heights-ca/rusch-park/",
    "amenities": [
      "2 Full Courts",
      "Lighted until 10 PM",
      "Chain Nets",
      "Historic Community Park"
    ],
    "bestRunTimes": "5:00 PM \u2013 8:30 PM",
    "primaryPhoto": "/courts/court_park_rusch_citrus_primary.jpg",
    "additionalPhotos": [
      "/courts/court_park_rusch_citrus_primary.jpg"
    ],
    "indoor": false,
    "membershipRequired": false,
    "hours": "Sunrise \u2013 10:00 PM (Lit)",
    "description": "Historic community park in Citrus Heights at 7801 Auburn Blvd, located next to the Rusch Community Center and pool. Features two full lighted outdoor basketball courts with chain nets and dusk-to-10 PM park lighting.",
    "courtSpecsNotice": "COTW \u2605 4.5 \u00b7 2 Full Courts \u00b7 Chain Nets \u00b7 Lit until 10 PM \u00b7 Auburn Blvd",
    "isActive": true,
    "typicalBusyTime": "5:00 PM \u2013 8:30 PM",
    "bestTimeToday": "6:00 PM",
    "historicalActivityByHour": {
      "10": 20,
      "12": 30,
      "17": 60,
      "18": 80,
      "19": 75,
      "20": 55
    }
  }
];

function getInitialDB() {
  const now = Date.now();
  const twentyMinsAgo = new Date(now - 20 * 60 * 1000).toISOString();
  const twoHoursFromNow = new Date(now + 2 * 60 * 60 * 1000).toISOString();
  const twentyMinsFromNow = new Date(now + 20 * 60 * 1000).toISOString();
  const tenMinsFromNow = new Date(now + 10 * 60 * 1000).toISOString();

  // Initial active check-ins (12 confirmed hooping at Downtown Rooftop, 6 at Natomas, 8 at Rocklin, 4 at Elk Grove)
  const checkIns = [
    // Downtown Rooftop (12 hooping)
    { id: 'chk_1', courtId: 'court_24_downtown', userId: 'usr_marcus', username: 'marcus_c', displayName: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_2', courtId: 'court_24_downtown', userId: 'usr_jordan', username: 'jordan_k', displayName: 'Jordan Kelly', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_3', courtId: 'court_24_downtown', userId: 'seed_u3', username: 'kobe_fan916', displayName: 'Andre Wilson', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_4', courtId: 'court_24_downtown', userId: 'seed_u4', username: 'devin_b', displayName: 'Devin Bell', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_5', courtId: 'court_24_downtown', userId: 'seed_u5', username: 'jay_curry', displayName: 'Jalen Ward', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_6', courtId: 'court_24_downtown', userId: 'seed_u6', username: 'zion_sac', displayName: 'Trevor Vance', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_7', courtId: 'court_24_downtown', userId: 'seed_u7', username: 'ray_allen3', displayName: 'Raymond Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_8', courtId: 'court_24_downtown', userId: 'seed_u8', username: 'brandon_916', displayName: 'Brandon Scott', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_9', courtId: 'court_24_downtown', userId: 'seed_u9', username: 'sammy_buckets', displayName: 'Sammy Odom', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_10', courtId: 'court_24_downtown', userId: 'seed_u10', username: 'charlie_g', displayName: 'Charles Green', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_11', courtId: 'court_24_downtown', userId: 'seed_u11', username: 'quinn_ball', displayName: 'Quinn Miller', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_12', courtId: 'court_24_downtown', userId: 'seed_u12', username: 'tyrese_d', displayName: 'Tyrese Dixon', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    // Natomas (6 hooping)
    { id: 'chk_13', courtId: 'court_inshape_natomas', userId: 'usr_dlo', username: 'dlo_sac', displayName: `D'Angelo Brooks`, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_14', courtId: 'court_inshape_natomas', userId: 'seed_u14', username: 'ant_man', displayName: 'Anthony Ross', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_15', courtId: 'court_inshape_natomas', userId: 'seed_u15', username: 'chris_cross', displayName: 'Chris Paulson', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_16', courtId: 'court_inshape_natomas', userId: 'seed_u16', username: 'leo_floater', displayName: 'Leo Hayes', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_17', courtId: 'court_inshape_natomas', userId: 'seed_u17', username: 'kahlil_b', displayName: 'Kahlil Brown', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_18', courtId: 'court_inshape_natomas', userId: 'seed_u18', username: 'josh_point', displayName: 'Josh Turner', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    // Rocklin (8 hooping)
    { id: 'chk_19', courtId: 'court_inshape_rocklin_complex', userId: 'usr_malik', username: 'malik_j', displayName: 'Malik Johnson', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_20', courtId: 'court_inshape_rocklin_complex', userId: 'seed_u20', username: 'rocklin_sniper', displayName: 'Caleb Evans', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    // Roosevelt Park Downtown (Sacramento streetball central - 10 hooping)
    { id: 'chk_21', courtId: 'court_park_roosevelt', userId: 'usr_marcus', username: 'marcus_c', displayName: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_22', courtId: 'court_park_roosevelt', userId: 'usr_jordan', username: 'jordan_k', displayName: 'Jordan Kelly', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_23', courtId: 'court_park_roosevelt', userId: 'seed_u21', username: 'sac_handles', displayName: 'Darius Cole', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow },
    { id: 'chk_24', courtId: 'court_park_roosevelt', userId: 'seed_u22', username: 'court_general', displayName: 'Trevon Harris', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', status: 'CONFIRMED_HOOPER', checkedInAt: twentyMinsAgo, expiresAt: twoHoursFromNow }
  ];

  // Initial Heading There
  const headingThere = [
    { id: 'hd_1', courtId: 'court_park_roosevelt', userId: 'usr_tyler', username: 'ty_hoops', displayName: 'Tyler Washington', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', startedAt: new Date(now - 5 * 60 * 1000).toISOString(), expiresAt: twentyMinsFromNow, etaMinutes: 12 },
    { id: 'hd_2', courtId: 'court_24_downtown', userId: 'seed_h2', username: 'derrick_916', displayName: 'Derrick Moore', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', startedAt: new Date(now - 8 * 60 * 1000).toISOString(), expiresAt: twentyMinsFromNow, etaMinutes: 8 },
    { id: 'hd_3', courtId: 'court_inshape_rocklin_complex', userId: 'seed_h3', username: 'gabe_handle', displayName: 'Gabriel Soto', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200', startedAt: new Date(now - 12 * 60 * 1000).toISOString(), expiresAt: tenMinsFromNow, etaMinutes: 5 }
  ];

  // Friendships: Suhail is friends with Marcus, Jordan, Tyler, and D'Angelo
  const friendships = [
    { id: 'fr_1', userA: 'usr_suhail', userB: 'usr_marcus', status: 'accepted', requestedBy: 'usr_marcus', createdAt: twentyMinsAgo },
    { id: 'fr_2', userA: 'usr_suhail', userB: 'usr_jordan', status: 'accepted', requestedBy: 'usr_suhail', createdAt: twentyMinsAgo },
    { id: 'fr_3', userA: 'usr_suhail', userB: 'usr_dlo', status: 'accepted', requestedBy: 'usr_dlo', createdAt: twentyMinsAgo },
    { id: 'fr_4', userA: 'usr_suhail', userB: 'usr_tyler', status: 'accepted', requestedBy: 'usr_tyler', createdAt: twentyMinsAgo },
    { id: 'fr_5', userA: 'usr_suhail', userB: 'usr_malik', status: 'pending', requestedBy: 'usr_malik', createdAt: twentyMinsAgo }
  ];

  // Planned runs
  const plannedRuns = [
    {
      id: 'run_1',
      courtId: 'court_park_southside',
      courtName: 'Southside Park',
      courtSubName: 'Downtown / Southside (6th & T)',
      title: 'Sunset 5v5 Full Court Run',
      date: new Date().toISOString().split('T')[0],
      time: '5:00 PM',
      startTimestamp: now + 3 * 60 * 60 * 1000,
      creatorId: 'usr_marcus',
      creatorUsername: 'marcus_c',
      creatorDisplayName: 'Marcus Chen',
      notes: 'Calling our own fouls, losers off, 1s and 2s to 15. We got balls and cones.',
      maxSpots: 15,
      rsvps: [
        { userId: 'usr_marcus', username: 'marcus_c', displayName: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'usr_jordan', username: 'jordan_k', displayName: 'Jordan Kelly', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'usr_tyler', username: 'ty_hoops', displayName: 'Tyler Washington', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'seed_u4', username: 'devin_b', displayName: 'Devin Bell', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'seed_u5', username: 'jay_curry', displayName: 'Jalen Ward', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'seed_u6', username: 'zion_sac', displayName: 'Trevor Vance', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'seed_u7', username: 'ray_allen3', displayName: 'Raymond Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'seed_u8', username: 'brandon_916', displayName: 'Brandon Scott', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo }
      ],
      createdAt: twentyMinsAgo
    },
    {
      id: 'run_2',
      courtId: 'court_24_downtown',
      courtName: '24 Hour Fitness',
      courtSubName: 'Downtown Sacramento (1020 7th St)',
      title: 'Saturday Morning Downtown 5v5',
      date: new Date(now + 86400000).toISOString().split('T')[0],
      time: '9:00 AM',
      startTimestamp: now + 20 * 60 * 60 * 1000,
      creatorId: 'usr_jordan',
      creatorUsername: 'jordan_k',
      creatorDisplayName: 'Jordan Kelly',
      notes: 'Morning run before afternoon rush. High tempo indoor hardwood pickup.',
      maxSpots: 20,
      rsvps: [
        { userId: 'usr_jordan', username: 'jordan_k', displayName: 'Jordan Kelly', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'usr_marcus', username: 'marcus_c', displayName: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo },
        { userId: 'usr_dlo', username: 'dlo_sac', displayName: `D'Angelo Brooks`, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', joinedAt: twentyMinsAgo }
      ],
      createdAt: twentyMinsAgo
    }
  ];

  const notifications = [
    {
      id: 'notif_1',
      userId: 'usr_suhail',
      type: 'FRIEND_HOOPING',
      title: 'Marcus is Hooping',
      body: 'Marcus Chen just checked in at 24 Hour Fitness Downtown. Run is active with 12 players.',
      courtId: 'court_24_downtown',
      timestamp: twentyMinsAgo,
      read: false
    },
    {
      id: 'notif_2',
      userId: 'usr_suhail',
      type: 'HEADING_THERE',
      title: 'Tyler is Heading to Downtown',
      body: 'Tyler Washington is heading to 24 Hour Fitness Downtown (ETA 12m).',
      courtId: 'court_24_downtown',
      timestamp: new Date(now - 5 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'notif_3',
      userId: 'usr_suhail',
      type: 'RUN_REMINDER',
      title: 'Sunset 5v5 Run Today',
      body: 'Sunset 5v5 Full Court Run starts at 5:00 PM at Southside Park. 8 players confirmed.',
      courtId: 'court_park_southside',
      runId: 'run_1',
      timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
      read: true
    }
  ];

  return {
    users: INITIAL_USERS,
    courts: INITIAL_COURTS,
    checkIns,
    headingThere,
    friendships,
    plannedRuns,
    notifications
  };
}

let db: any = getInitialDB();

// Try to load persisted DB from file
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
    console.log('[WTR DB] Loaded persisted database from disk.');
    // Always keep courts up to date with verified Sacramento courts, photos, and specs
    db.courts = INITIAL_COURTS;
    saveDB();
  } catch (e) {
    console.error('[WTR DB] Error parsing database file, using seed data.', e);
  }
} else {
  saveDB();
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('[WTR DB] Failed to save DB to disk', e);
  }
}

// Auto-clean expired heading-there records (25 mins lifetime) and check-ins (2 hrs)
setInterval(() => {
  const now = Date.now();
  let changed = false;

  const initialHtCount = db.headingThere.length;
  db.headingThere = db.headingThere.filter(h => new Date(h.expiresAt).getTime() > now);
  if (db.headingThere.length !== initialHtCount) changed = true;

  const initialCiCount = db.checkIns.length;
  db.checkIns = db.checkIns.filter(c => new Date(c.expiresAt).getTime() > now);
  if (db.checkIns.length !== initialCiCount) changed = true;

  if (changed) {
    saveDB();
  }
}, 10000);

// Distance calculation helper (Haversine formula in miles)
function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Current user session & auth
app.get('/api/auth/me', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === userId) || db.users[0];
  res.json({ user });
});

app.post('/api/auth/switch', (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.post('/api/auth/login', (req, res) => {
  const { provider, email, phone, username } = req.body;
  let user = db.users.find(u =>
    (email && u.email === email) ||
    (phone && u.phone === phone) ||
    (username && u.username.toLowerCase() === username.toLowerCase())
  );

  if (!user) {
    // If logging in with Apple/Google/Phone and user doesn't exist, create automatically
    const newId = `usr_${Date.now()}`;
    const nameFromEmail = email ? email.split('@')[0] : 'Sac Baller';
    user = {
      id: newId,
      username: username || `baller_${Math.floor(1000 + Math.random() * 9000)}`,
      displayName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: email || '',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      height: `6'0"`,
      weight: '180 lbs',
      position: 'Guard',
      experienceLevel: 'Adult Competitive',
      homeArea: 'Sacramento',
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    saveDB();
  }

  res.json({ user });
});

app.post('/api/auth/signup', (req, res) => {
  const { username, displayName, email, phone, height, weight, position, experienceLevel, homeArea } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) return res.status(400).json({ error: 'Username is already taken' });

  const newUser = {
    id: `usr_${Date.now()}`,
    username,
    displayName: displayName || username,
    email: email || '',
    phone: phone || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    height: height || `6'1"`,
    weight: weight || '185 lbs',
    position: position || 'Guard',
    experienceLevel: experienceLevel || 'Adult Competitive',
    homeArea: homeArea || 'Downtown Sacramento',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB();
  res.json({ user: newUser });
});

app.put('/api/users/profile', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const index = db.users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  db.users[index] = { ...db.users[index], ...req.body };
  saveDB();
  res.json({ user: db.users[index] });
});

app.get('/api/users', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase();
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';

  const results = db.users
    .filter(u => u.id !== currentUserId && (
      u.username.toLowerCase().includes(query) ||
      u.displayName.toLowerCase().includes(query)
    ))
    .map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatar: u.avatar,
      height: u.height,
      position: u.position,
      homeArea: u.homeArea
    }));

  res.json({ users: results });
});

// 2. Ranked Courts Feed — "Where should I hoop right now?"
app.get('/api/courts', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  // User simulated/real coordinates (default: Downtown Sacramento 38.5816, -121.4944)
  const userLat = parseFloat(req.query.lat as string) || 38.5816;
  const userLng = parseFloat(req.query.lng as string) || -121.4944;

  const now = Date.now();

  // Find user's accepted friends IDs
  const friendIds = db.friendships
    .filter(f => f.status === 'accepted' && (f.userA === currentUserId || f.userB === currentUserId))
    .map(f => f.userA === currentUserId ? f.userB : f.userA);

  const courtsWithRank = db.courts
    .filter(c => c.isActive)
    .map(court => {
      const distanceMiles = calculateDistanceMiles(userLat, userLng, court.lat, court.lng);

      // Active check-ins
      const activeCheckIns = db.checkIns.filter(
        c => c.courtId === court.id && new Date(c.expiresAt).getTime() > now
      );
      const confirmedPlayers = activeCheckIns.filter(c => c.status === 'CONFIRMED_HOOPER');
      const venuePresence = activeCheckIns.filter(c => c.status === 'VENUE_PRESENCE');

      // Active heading-there
      const activeHeadingThere = db.headingThere.filter(
        h => h.courtId === court.id && new Date(h.expiresAt).getTime() > now
      );

      // Friends here & heading
      const friendsHere = confirmedPlayers
        .filter(c => friendIds.includes(c.userId))
        .map(c => db.users.find(u => u.id === c.userId))
        .filter(Boolean);

      const friendsHeading = activeHeadingThere
        .filter(h => friendIds.includes(h.userId))
        .map(h => db.users.find(u => u.id === h.userId))
        .filter(Boolean);

      // Upcoming planned runs at this court in next 24h
      const nextPlannedRun = db.plannedRuns
        .filter(r => r.courtId === court.id && r.startTimestamp > now && r.startTimestamp < now + 24 * 3600 * 1000)
        .sort((a, b) => a.startTimestamp - b.startTimestamp)[0] || null;

      // Status labels based on live activity
      let activityStatusLabel: 'RUN ACTIVE' | 'GETTING ACTIVE' | 'QUIET RIGHT NOW' | 'RUN STARTING SOON' = 'QUIET RIGHT NOW';
      let activityDetailLabel = '';
      let isLiveConfirmed = false;

      if (confirmedPlayers.length >= 8) {
        activityStatusLabel = 'RUN ACTIVE';
        activityDetailLabel = `${confirmedPlayers.length} hooping`;
        isLiveConfirmed = true;
      } else if (confirmedPlayers.length > 0 || activeHeadingThere.length >= 3) {
        activityStatusLabel = 'GETTING ACTIVE';
        const parts = [];
        if (confirmedPlayers.length > 0) parts.push(`${confirmedPlayers.length} hooping`);
        if (activeHeadingThere.length > 0) parts.push(`${activeHeadingThere.length} heading there`);
        activityDetailLabel = parts.join(' · ');
        isLiveConfirmed = confirmedPlayers.length > 0;
      } else if (nextPlannedRun && nextPlannedRun.startTimestamp - now < 3 * 3600 * 1000) {
        activityStatusLabel = 'RUN STARTING SOON';
        activityDetailLabel = `${nextPlannedRun.rsvps.length} players joined · ${nextPlannedRun.time}`;
      } else {
        activityStatusLabel = 'QUIET RIGHT NOW';
        activityDetailLabel = court.typicalBusyTime || 'Usually active around 6 PM';
      }

      // WTR Ranking Algorithm:
      // - Confirmed Hoopers: 10 points each (most authoritative)
      // - Heading There: 4 points each (forming momentum)
      // - Friends there: 15 points bonus per friend!
      // - Friends heading: 8 points bonus
      // - Run starting soon (<2 hrs): 12 points
      // - Distance penalty: -1.5 points per mile (so active run 5 miles away easily beats a dead court 0.5 mi away)
      const rankingScore =
        (confirmedPlayers.length * 10) +
        (activeHeadingThere.length * 4) +
        (friendsHere.length * 15) +
        (friendsHeading.length * 8) +
        (nextPlannedRun ? 8 : 0) -
        (distanceMiles * 1.5);

      return {
        ...court,
        distanceMiles,
        confirmedPlayersCount: confirmedPlayers.length,
        headingThereCount: activeHeadingThere.length,
        venuePresenceCount: venuePresence.length,
        friendsHere,
        friendsHeading,
        activityStatusLabel,
        activityDetailLabel,
        isLiveConfirmed,
        rankingScore,
        nextPlannedRun,
        activeCheckIns,
        activeHeadingThere
      };
    })
    .sort((a, b) => b.rankingScore - a.rankingScore);

  res.json({
    courts: courtsWithRank,
    userLocation: { lat: userLat, lng: userLng }
  });
});

app.get('/api/courts/:id', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const court = db.courts.find(c => c.id === req.params.id);
  if (!court) return res.status(404).json({ error: 'Court not found' });

  const now = Date.now();
  const activeCheckIns = db.checkIns.filter(
    c => c.courtId === court.id && new Date(c.expiresAt).getTime() > now
  );
  const activeHeadingThere = db.headingThere.filter(
    h => h.courtId === court.id && new Date(h.expiresAt).getTime() > now
  );

  const plannedRuns = db.plannedRuns.filter(
    r => r.courtId === court.id && r.startTimestamp > now - 2 * 3600 * 1000
  ).sort((a, b) => a.startTimestamp - b.startTimestamp);

  const myCheckIn = activeCheckIns.find(c => c.userId === currentUserId);
  const myHeadingThere = activeHeadingThere.find(h => h.userId === currentUserId);

  res.json({
    court,
    activeCheckIns,
    activeHeadingThere,
    plannedRuns,
    myCheckIn: myCheckIn || null,
    myHeadingThere: myHeadingThere || null
  });
});

// Admin Court Creation & Updates
app.post('/api/courts', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Only administrators can add courts.' });
  }

  const { name, subName, brand, address, city, lat, lng, type, primaryPhoto, indoor, membershipRequired, hours, description } = req.body;
  if (!name || !address) return res.status(400).json({ error: 'Name and address required' });

  const newCourt = {
    id: `court_${Date.now()}`,
    name,
    subName: subName || name,
    brand: brand || 'Other',
    address,
    city: city || 'Sacramento',
    lat: parseFloat(lat) || 38.5816,
    lng: parseFloat(lng) || -121.4944,
    type: type || 'Indoor Gym',
    primaryPhoto: primaryPhoto || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200',
    additionalPhotos: [],
    indoor: indoor !== false,
    membershipRequired: !!membershipRequired,
    hours: hours || '6:00 AM – 10:00 PM',
    description: description || 'Pickup basketball court.',
    isActive: true,
    typicalBusyTime: 'Usually active 6:00 PM',
    bestTimeToday: '6:00 PM',
    historicalActivityByHour: { 17: 60, 18: 80, 19: 75, 20: 50 }
  };

  db.courts.push(newCourt);
  saveDB();
  res.json({ court: newCourt });
});

app.patch('/api/courts/:id', (req, res) => {
  const index = db.courts.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Court not found' });

  db.courts[index] = { ...db.courts[index], ...req.body };
  saveDB();
  res.json({ court: db.courts[index] });
});

app.put('/api/courts/:id', (req, res) => {
  const index = db.courts.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Court not found' });

  db.courts[index] = { ...db.courts[index], ...req.body };
  saveDB();
  res.json({ court: db.courts[index] });
});

app.delete('/api/courts/:id', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const court = db.courts.find(c => c.id === req.params.id);
  if (court) {
    court.isActive = false;
    saveDB();
  }
  res.json({ success: true });
});

// 3. Live Check-in & Checkout System
app.post('/api/check-ins', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { courtId, status } = req.body; // 'CONFIRMED_HOOPER' or 'VENUE_PRESENCE'
  const court = db.courts.find(c => c.id === courtId);
  if (!court) return res.status(404).json({ error: 'Court not found' });

  // Remove any existing check-in or heading-there for this user
  db.checkIns = db.checkIns.filter(c => c.userId !== currentUserId);
  db.headingThere = db.headingThere.filter(h => h.userId !== currentUserId);

  const now = Date.now();
  const expiresAt = new Date(now + 2.5 * 3600 * 1000).toISOString(); // 2.5 hours active check-in

  const checkIn = {
    id: `chk_${Date.now()}`,
    courtId,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    status: status === 'VENUE_PRESENCE' ? 'VENUE_PRESENCE' : 'CONFIRMED_HOOPER',
    checkedInAt: new Date(now).toISOString(),
    expiresAt
  };

  db.checkIns.push(checkIn);

  // Notify friends that user started hooping if confirmed hooper
  if (checkIn.status === 'CONFIRMED_HOOPER') {
    const friendIds = db.friendships
      .filter(f => f.status === 'accepted' && (f.userA === currentUserId || f.userB === currentUserId))
      .map(f => f.userA === currentUserId ? f.userB : f.userA);

    friendIds.forEach(fid => {
      db.notifications.push({
        id: `notif_${Date.now()}_${fid}`,
        userId: fid,
        type: 'FRIEND_HOOPING',
        title: `${user.displayName} is Hooping`,
        body: `${user.displayName} just checked in at ${court.name} (${court.subName}).`,
        courtId: court.id,
        timestamp: new Date().toISOString(),
        read: false
      });
    });
  }

  saveDB();
  res.json({ checkIn });
});

app.post('/api/check-ins/leave', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  db.checkIns = db.checkIns.filter(c => c.userId !== currentUserId);
  saveDB();
  res.json({ success: true });
});

// 4. Heading There System (25 minutes auto-expiry)
app.post('/api/heading-there', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { courtId, etaMinutes = 15 } = req.body;
  const court = db.courts.find(c => c.id === courtId);
  if (!court) return res.status(404).json({ error: 'Court not found' });

  // Remove existing heading-there records for this user
  db.headingThere = db.headingThere.filter(h => h.userId !== currentUserId);

  const now = Date.now();
  const expiresAt = new Date(now + 25 * 60 * 1000).toISOString(); // 25-minute strict countdown

  const headingItem = {
    id: `hd_${Date.now()}`,
    courtId,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    startedAt: new Date(now).toISOString(),
    expiresAt,
    etaMinutes: Math.min(etaMinutes, 25)
  };

  db.headingThere.push(headingItem);
  saveDB();
  res.json({ headingThere: headingItem });
});

app.delete('/api/heading-there', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  db.headingThere = db.headingThere.filter(h => h.userId !== currentUserId);
  saveDB();
  res.json({ success: true });
});

// 5. Planned Runs System
app.get('/api/runs', (req, res) => {
  const now = Date.now();
  const upcomingRuns = db.plannedRuns
    .filter(r => r.startTimestamp > now - 2 * 3600 * 1000)
    .sort((a, b) => a.startTimestamp - b.startTimestamp);

  res.json({ runs: upcomingRuns });
});

app.post('/api/runs', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { courtId, title, date, time, notes, maxSpots } = req.body;
  const court = db.courts.find(c => c.id === courtId);
  if (!court) return res.status(400).json({ error: 'Valid court required' });
  if (!title || !date || !time) return res.status(400).json({ error: 'Title, date, and time required' });

  // Calculate approximate start timestamp
  const dateParts = date.split('-');
  const [year, month, day] = dateParts.map(Number);
  let hour = 18;
  let minute = 0;
  if (time.includes(':')) {
    const timeParts = time.replace(/(AM|PM)/i, '').trim().split(':');
    hour = parseInt(timeParts[0], 10);
    minute = parseInt(timeParts[1], 10) || 0;
    if (time.toUpperCase().includes('PM') && hour < 12) hour += 12;
    if (time.toUpperCase().includes('AM') && hour === 12) hour = 0;
  }
  const runDate = new Date(year, month - 1, day, hour, minute);

  const newRun = {
    id: `run_${Date.now()}`,
    courtId: court.id,
    courtName: court.name,
    courtSubName: court.subName,
    title,
    date,
    time,
    startTimestamp: runDate.getTime(),
    creatorId: user.id,
    creatorUsername: user.username,
    creatorDisplayName: user.displayName,
    notes: notes || '',
    maxSpots: maxSpots ? Number(maxSpots) : undefined,
    rsvps: [
      {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        joinedAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };

  db.plannedRuns.push(newRun);
  saveDB();
  res.json({ run: newRun });
});

app.post('/api/runs/:id/rsvp', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const run = db.plannedRuns.find(r => r.id === req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found' });

  const existingIndex = run.rsvps.findIndex(r => r.userId === currentUserId);
  let joined = false;

  if (existingIndex > -1) {
    // Leave run
    run.rsvps.splice(existingIndex, 1);
    joined = false;
  } else {
    // Join run
    if (run.maxSpots && run.rsvps.length >= run.maxSpots) {
      return res.status(400).json({ error: 'This run is full.' });
    }
    run.rsvps.push({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      joinedAt: new Date().toISOString()
    });
    joined = true;

    // Notify run creator if someone else joined
    if (run.creatorId !== user.id) {
      db.notifications.push({
        id: `notif_${Date.now()}`,
        userId: run.creatorId,
        type: 'RUN_JOINED',
        title: `${user.displayName} Joined Your Run`,
        body: `${user.displayName} joined "${run.title}" at ${run.courtName}.`,
        courtId: run.courtId,
        runId: run.id,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }

  saveDB();
  res.json({ run, joined });
});

app.delete('/api/runs/:id', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const user = db.users.find(u => u.id === currentUserId);
  const run = db.plannedRuns.find(r => r.id === req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found' });

  if (run.creatorId !== currentUserId && !user?.isAdmin) {
    return res.status(403).json({ error: 'You can only delete runs you created.' });
  }

  db.plannedRuns = db.plannedRuns.filter(r => r.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// 6. Friends System
app.get('/api/friends', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const now = Date.now();

  const myFriendships = db.friendships.filter(
    f => f.userA === currentUserId || f.userB === currentUserId
  );

  const acceptedFriendIds = myFriendships
    .filter(f => f.status === 'accepted')
    .map(f => f.userA === currentUserId ? f.userB : f.userA);

  const pendingRequestsReceived = myFriendships
    .filter(f => f.status === 'pending' && f.requestedBy !== currentUserId)
    .map(f => {
      const sender = db.users.find(u => u.id === f.requestedBy);
      return { friendshipId: f.id, sender };
    })
    .filter(item => Boolean(item.sender));

  const friends = acceptedFriendIds.map(fid => {
    const friend = db.users.find(u => u.id === fid);
    if (!friend) return null;

    // Check if friend is currently hooping or heading anywhere
    const activeCheckIn = db.checkIns.find(
      c => c.userId === fid && new Date(c.expiresAt).getTime() > now && c.status === 'CONFIRMED_HOOPER'
    );
    const activeHeading = db.headingThere.find(
      h => h.userId === fid && new Date(h.expiresAt).getTime() > now
    );

    let statusDescription = 'Offline';
    let activeCourtName = null;

    if (activeCheckIn) {
      const court = db.courts.find(c => c.id === activeCheckIn.courtId);
      statusDescription = `Hooping at ${court?.name || 'court'}`;
      activeCourtName = court?.name;
    } else if (activeHeading) {
      const court = db.courts.find(c => c.id === activeHeading.courtId);
      statusDescription = `Heading to ${court?.name || 'court'}`;
      activeCourtName = court?.name;
    }

    return {
      ...friend,
      statusDescription,
      activeCourtName,
      isLive: !!activeCheckIn,
      isHeading: !!activeHeading
    };
  }).filter(Boolean);

  res.json({ friends, pendingRequests: pendingRequestsReceived });
});

app.post('/api/friends/request', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const target = db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!target) return res.status(404).json({ error: 'No player found with that username.' });
  if (target.id === currentUserId) return res.status(400).json({ error: 'Cannot friend yourself.' });

  const existing = db.friendships.find(
    f => (f.userA === currentUserId && f.userB === target.id) ||
         (f.userB === currentUserId && f.userA === target.id)
  );

  if (existing) {
    return res.status(400).json({ error: 'Friendship or request already exists.' });
  }

  const friendship = {
    id: `fr_${Date.now()}`,
    userA: currentUserId,
    userB: target.id,
    status: 'pending' as const,
    requestedBy: currentUserId,
    createdAt: new Date().toISOString()
  };

  db.friendships.push(friendship);
  saveDB();
  res.json({ success: true, friendship });
});

app.post('/api/friends/respond', (req, res) => {
  const { friendshipId, action } = req.body; // 'accept' | 'decline'
  const index = db.friendships.findIndex(f => f.id === friendshipId);
  if (index === -1) return res.status(404).json({ error: 'Request not found' });

  if (action === 'accept') {
    db.friendships[index].status = 'accepted';
  } else {
    db.friendships.splice(index, 1);
  }

  saveDB();
  res.json({ success: true });
});

app.delete('/api/friends/:friendId', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const { friendId } = req.params;

  db.friendships = db.friendships.filter(
    f => !(
      (f.userA === currentUserId && f.userB === friendId) ||
      (f.userB === currentUserId && f.userA === friendId)
    )
  );
  saveDB();
  res.json({ success: true });
});

// 7. Notifications
app.get('/api/notifications', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  const userNotifs = db.notifications
    .filter(n => n.userId === currentUserId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({ notifications: userNotifs });
});

app.post('/api/notifications/read', (req, res) => {
  const currentUserId = (req.headers['x-user-id'] as string) || 'usr_suhail';
  db.notifications.forEach(n => {
    if (n.userId === currentUserId) n.read = true;
  });
  saveDB();
  res.json({ success: true });
});

// 8. Reset to Pristine Demo State
app.post('/api/simulate/reset', (req, res) => {
  db = getInitialDB();
  saveDB();
  res.json({ success: true, message: 'Database reset to initial Sacramento seed state.' });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER START
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WTR Server] Ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
