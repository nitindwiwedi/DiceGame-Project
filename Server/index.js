const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

let balance = 1000;

function generateFairRoll(clientSeed, serverSeed) {
  const hash = crypto.createHash("sha256").update(clientSeed + serverSeed).digest("hex");
  const roll = (parseInt(hash.substring(0, 8), 16) % 6) + 1;
  return { roll, hash };
}

app.post("/roll-dice", function (req, res) {
  const bet = req.body.bet;
  const clientSeed = req.body.clientSeed;

  if (!bet || bet <= 0 || bet > balance) {
    return res.status(400).json({ error: "Invalid bet amount" });
  }

  const serverSeed = crypto.randomBytes(16).toString("hex");
  const result = generateFairRoll(clientSeed, serverSeed);

  if (result.roll >= 4) {
    balance += bet;
  } else {
    balance -= bet;
  }

  res.json({ roll: result.roll, newBalance: balance, hash: result.hash, serverSeed });
});

app.listen(PORT, function () {
  console.log("Server running on port" + PORT);
});
