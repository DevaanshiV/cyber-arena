// components/CtfChallengesDashboard.jsx
import React, { useState } from 'react';

const initialChallenges = [
  {
    id: 1,
    title: 'Sanity Check',
    description: 'Enter the welcome flag.',
    points: 50,
    flag: 'cyberArena{w3lc0m3}',
    solved: false,
  },
  {
    id: 2,
    title: 'Base64 Decoding',
    description: 'Decode this: Y3liZXJBcmVuYXtiNHNfNjR9',
    points: 100,
    flag: 'cyberArena{b4s3_64}',
    solved: false,
  },
  {
    id: 3,
    title: 'Simple XOR',
    description: 'The flag is XORed with 0x55. Encoded: 0x8b 0x9e 0x8c 0x8a 0x9f 0x8a 0x9b 0x9a 0x8d 0x8e 0x8b 0x9a 0x9d 0x8e 0x8b 0x9a 0x9d',
    points: 150,
    flag: 'cyberArena{x0r_m4g1c}',
    solved: false,
  },
  {
    id: 4,
    title: 'Hash Cracker',
    description: 'Crack the MD5 hash: 5f4dcc3b5aa765d61d8327deb882cf99 (hint: it\'s a common password)',
    points: 200,
    flag: 'cyberArena{p4ssw0rd}',
    solved: false,
  },
];

export default function CtfChallengesDashboard() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [inputs, setInputs] = useState({});

  const totalScore = challenges
    .filter((c) => c.solved)
    .reduce((sum, c) => sum + c.points, 0);

  const handleInputChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (id) => {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge || challenge.solved) return;

    const userFlag = inputs[id]?.trim() || '';
    if (userFlag === challenge.flag) {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, solved: true } : c
        )
      );
      // Clear input after solving (optional)
      setInputs((prev) => ({ ...prev, [id]: '' }));
    } else {
      alert('❌ Incorrect flag. Try again!');
    }
  };

  const resetAll = () => {
    setChallenges(initialChallenges.map((c) => ({ ...c, solved: false })));
    setInputs({});
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {/* Header with Scoreboard */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          🚩 CTF Challenges
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-5 py-2 rounded-lg border border-slate-700">
            <span className="text-sm text-slate-400">Total Score</span>
            <span className="ml-3 text-2xl font-bold text-cyan-400">
              {totalScore}
            </span>
          </div>
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`bg-slate-800/80 backdrop-blur-sm rounded-xl border ${
              challenge.solved ? 'border-emerald-500/50' : 'border-slate-700'
            } p-5 shadow-lg transition-all hover:border-slate-500`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">
                {challenge.title}
              </h3>
              <span
                className={`text-xs font-mono px-2 py-1 rounded ${
                  challenge.solved
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {challenge.points} pts
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              {challenge.description}
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter flag..."
                value={inputs[challenge.id] || ''}
                onChange={(e) =>
                  handleInputChange(challenge.id, e.target.value)
                }
                disabled={challenge.solved}
                className={`flex-1 bg-slate-900 border ${
                  challenge.solved
                    ? 'border-emerald-500/30 text-slate-500'
                    : 'border-slate-600 focus:border-cyan-500'
                } rounded-lg px-4 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition`}
              />
              <button
                onClick={() => handleSubmit(challenge.id)}
                disabled={challenge.solved}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  challenge.solved
                    ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20'
                }`}
              >
                {challenge.solved ? '✅ Solved' : 'Submit'}
              </button>
            </div>

            {challenge.solved && (
              <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                <span>✔️ Flag accepted</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state / footer */}
      {challenges.every((c) => c.solved) && (
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-lg">
            🎉 You’ve conquered all challenges! Great job!
          </p>
        </div>
      )}
    </div>
  );
}
