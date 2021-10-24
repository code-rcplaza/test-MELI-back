const express = require("express");
const router = require("./router");
const cors = require("cors");
const middlewares = require("./middleware");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.options("*", cors());
app.use(middlewares.authorSignature);
app.use("/api/items", router);
app.use(middlewares.notFound);
app.use(middlewares.handleError);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Houston we have a problem", err);
    return;
  }
  console.log(`Server running on port: ${PORT}`);
});
