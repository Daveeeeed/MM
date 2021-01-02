#!/usr/bin/env node

const app = require("../app");
const https = require("https");

const port = "8000";

app.listen(port, function () {
    console.log("Server running on port 8000!");
});
