import dotenv from 'dotenv';
dotenv.config();
// seedDummy.js
import mongoose from 'mongoose';
import LearnSign from './models/LearnSign.model.js';

const modules = [
  { number: 1, name: "Greetings & Basic Communication" },
  { number: 2, name: "Family & People" },
  { number: 3, name: "Home & Everyday Life" },
  { number: 4, name: "Food & Drinks" },
  { number: 5, name: "Education & Work" },
  { number: 6, name: "Numbers, Time & Calendar" },
  { number: 7, name: "Travel, Places & Directions" },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await LearnSign.deleteMany({}); // Clear old test data

  const dummySigns = [];

  modules.forEach(mod => {
    for (let i = 1; i <= 25; i++) { // 5 placeholder signs per module
      dummySigns.push({
        moduleNumber: mod.number,
        moduleName: mod.name,
        signName: `Demo Sign ${i} (M${mod.number})`,
        meaning: `Placeholder meaning for sign ${i}`,
        usage: `Placeholder usage sentence for sign ${i}`,
        videoUrl: null, // Add Cloudinary URLs later
      });
    }
  });

  await LearnSign.insertMany(dummySigns);
  console.log("Seeded dummy signs successfully!");
  process.exit(0);
};

// seed();