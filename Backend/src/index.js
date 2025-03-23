import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import  connectDB  from "./database/index.js";

try {
  connectDB().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });
} catch (error) {
  console.log("Error connecting to the database: ", error);
}
