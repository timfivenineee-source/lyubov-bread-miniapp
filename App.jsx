import React, { useState } from "react";
import axios from "axios";

function App() {
  const [branch, setBranch] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const submitFeedback = async () => {
    if (!branch) {
      setStatus("Пожалуйста, выберите пекарню");
      return;
    }
    try {
      const response = await axios.post("/api/send-feedback", {
        branch,
        answers,
        comment,
      });
      console.log("Ответ сервера:", response.data);
      setStatus("Отзыв отправлен! Спасибо!");
      setAnswers(["", "", "", ""]);
      setComment("");
      setBranch("");
    } catch (err) {
      console.error("Ошибка при отправке:", err.response?.data || err.message);
      setStatus("Ошибка при отправке");
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "20px auto",
        padding: 20,
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#6b4226" }}>
        Отзыв о пекарне "Любовь и Хлеб"
      </h2>

      <div style={{ margin: "15px 0" }}>
        <label>
          <strong>Выберите пекарню:</strong>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{ marginLeft: 10, padding: 5 }}
          >
            <option value="">--Выберите--</option>
            <option value="ул.Советская">ул.Советская</option>
            <option value="ул.Н.Островского">ул.Н.Островского</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          1️⃣ Общее впечатление:
          <input
            type="text"
            placeholder="Например: Вкусно, уютно"
            value={answers[0]}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <label>
          2️⃣ Чего не хватает:
          <input
            type="text"
            placeholder="Например: больше кофе, новый десерт"
            value={answers[1]}
            onChange={(e) => handleAnswerChange(1, e.target.value)}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <label>
          3️⃣ За чем вернетесь:
          <input
            type="text"
            placeholder="Например: за круассанами"
            value={answers[2]}
            onChange={(e) => handleAnswerChange(2, e.target.value)}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <label>
          4️⃣ Дополнительно (необязательно):
          <input
            type="text"
            placeholder="Например: уютная атмосфера"
            value={answers[3]}
            onChange={(e) => handleAnswerChange(3, e.target.value)}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          💬 Комментарий:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Напишите свой комментарий"
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>
      </div>

      <button
        onClick={submitFeedback}
        style={{
          marginTop: 15,
          padding: "10px 20px",
          backgroundColor: "#c28f5c",
          border: "none",
          borderRadius: 6,
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Отправить
      </button>

      {status && (
        <div style={{ marginTop: 10, textAlign: "center", color: "#6b4226" }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default App;