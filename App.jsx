import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [branch, setBranch] = useState("");
  const [rating, setRating] = useState(0);
  const [improvements, setImprovements] = useState([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const options = [
    "Скорость обслуживания",
    "Качество кофе",
    "Выпечка",
    "Чистота",
    "Персонал",
    "Атмосфера",
  ];

  const toggleOption = (opt) => {
    setImprovements((prev) =>
      prev.includes(opt)
        ? prev.filter((o) => o !== opt)
        : [...prev, opt]
    );
  };

  const submit = async () => {
    if (!branch || rating === 0) {
      setStatus("Выберите локацию и поставьте оценку");
      return;
    }

    try {
      await axios.post("/api/send-feedback", {
        branch,
        rating,
        improvements,
        comment,
      });

      setStatus("Спасибо ❤️");
      setRating(0);
      setBranch("");
      setImprovements([]);
      setComment("");
    } catch {
      setStatus("Ошибка соединения");
    }
  };

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h2>🍞 Любовь и Хлеб</h2>

      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="">Выберите кофейню</option>
        <option>Советская</option>
        <option>Н.Островского</option>
      </select>

      <h3>Оценка</h3>
      <div style={{ fontSize: 30 }}>
        {[1,2,3,4,5].map((n) => (
          <span
            key={n}
            onClick={() => setRating(n)}
            style={{
              cursor: "pointer",
              color: n <= rating ? "orange" : "#ccc",
            }}
          >
            ★
          </span>
        ))}
      </div>

      <h3>Что улучшить?</h3>
      {options.map((o) => (
        <label key={o} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={improvements.includes(o)}
            onChange={() => toggleOption(o)}
          />
          {o}
        </label>
      ))}

      <textarea
        placeholder="Что нам улучшить в первую очередь?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", marginTop: 10, padding: 10 }}
      />

      <button
        onClick={submit}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 14,
          background: "#c28f5c",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        Отправить
      </button>

      <p>{status}</p>
    </div>
  );
}

