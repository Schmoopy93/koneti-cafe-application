import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Molimo postavite MONGO_URI, ADMIN_EMAIL i ADMIN_PASSWORD u .env fajlu");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB povezan"))
  .catch((err) => {
    console.error("Greška pri konekciji:", err);
    process.exit(1);
  });

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin već postoji.");
    } else {
      const admin = new Admin({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      });
      await admin.save();
      console.log("Admin kreiran.");
    }
    process.exit();
  } catch (err) {
    console.error("Greška pri kreiranju admina:", err);
    process.exit(1);
  }
};

seedAdmin();
