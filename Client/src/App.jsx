import { useState } from "react";

export default function DiceGame() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [roll, setRoll] = useState(null);
  const [result, setResult] = useState("");

  const handleRoll = async () => {
    if (bet <= 0 || bet > balance) {
      alert("Invalid bet amount");
      return;
    }

    const clientSeed = Math.random().toString(36).substring(2, 10);
    const response = await fetch("https://dicegame-project.onrender.com/roll-dice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bet, clientSeed }),
    });

    const data = await response.json();
    setRoll(data.roll);

    if (data.roll >= 4) {
      setBalance(balance + bet);
      setResult("🎉 You won!");
    } else {
      setBalance(balance - bet);
      setResult("😞 You lost!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center border border-gray-700">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Provably Fair Dice Game 🎲</h1>
        <p className="text-lg">Balance: <span className="text-green-400">${balance}</span></p>
        <input
          type="number"
          placeholder="Enter bet amount"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="w-full mt-4 p-2 border border-gray-600 rounded-md text-white"
        />
        <button
          onClick={handleRoll}
          className="w-full mt-4 p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
        >
          🎲 Roll Dice
        </button>
        {roll !== null && (
          <p className="mt-4 text-lg font-semibold text-yellow-300">Dice Roll: {roll}</p>
        )}
        {result && (
          <p className={`mt-2 text-lg font-bold ${result.includes('won') ? 'text-green-400' : 'text-red-400'}`}>{result}</p>
        )}
      </div>
    </div>
  );
}
