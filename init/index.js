if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // initData.data = initData.data.map((obj)=>({...obj, owner: "683ab0d23b9a4cf1ef667705"})); (for local)
  initData.data = initData.data.map((obj)=>({...obj, owner: "683f198d6e4a3fa5b8533995"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();