import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

const tg = window.Telegram?.WebApp;

function App() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [branch, setBranch] = useState("");
  const [userName, setUserName] = useState("");

  // Инициализация Telegram
  useEffect(() => {
    if (!tg) return;

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (user) {
      setUserName(user.first_name || "");
    }

    tg.MainButton.setText("Отправить отзыв");
  }, []);

  // Управление кнопкой и актуальными данными
  useEffect(() => {
    if (!tg) return;

    if (rating > 0 && branch) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }

    tg.MainButton.onClick(sendFeedback);

    return () => {
      tg.MainButton.offClick(sendFeedback);
    };
  }, [rating, branch, comment]);

  const sendFeedback = async () => {
    if (!rating || !branch) {
      tg.showAlert("Пожалуйста, выберите кофейню и поставьте оценку ⭐");
      return;
    }

    try {
      const response = await axios.post(
        "https://lyubov-bread-miniapp.vercel.app/api/send-feedback",
        {
          rating,
          comment,
          branch,
          userName,
        }
      );

      if (response.data.success) {
        tg.showAlert("Спасибо за отзыв ❤️");
        tg.close();
      } else {
        tg.showAlert("Ошибка отправки");
      }
    } catch (error) {
      console.error(error);
      tg.showAlert("Ошибка соединения");
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>🍞 Любовь и Хлеб</h2>

      {userName && (
        <p style={hello}>
          Спасибо, {userName} ❤️
        </p>
      )}

      {/* Локация */}
      <div style={section}>
        <p style={label}>Выберите кофейню:</p>

        <button
          style={branch === "Советская" ? branchActive : branchButton}
          onClick={() => setBranch("Советская")}
        >
          ул. Советская
        </button>

        <button
          style={branch === "Островского" ? branchActive : branchButton}
          onClick={() => setBranch("Островского")}
        >
          ул. Н. Островского
        </button>
      </div>

      {/* Звезды */}
      <div style={section}>
        <p style={label}>Оцените нас:</p>

        <div style={starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                fontSize: 40,
                cursor: "pointer",
                transition: "0.2s",
                transform: star === rating ? "scale(1.2)" : "scale(1)",
                color: star <= rating ? "#f5b301" : "#ddd",
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Комментарий */}
      <div style={section}>
        <textarea
          placeholder="Что улучшить? Какой продукт добавить?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={textarea}
        />
      </div>
    </div>
  );
}

/* Стили */

const container = {
  padding: 20,
  fontFamily: "Arial",
  minHeight: "100vh",
  background: "linear-gradient(180deg, #fff8f0 0%, #ffffff 100%)",
};

const title = {
  textAlign: "center",
  marginBottom: 10,
  color: "#6b4226",
};

const hello = {
  textAlign: "center",
  marginBottom: 20,
  fontSize: 14,
};

const section = {
  marginBottom: 25,
};

const label = {
  marginBottom: 10,
  fontWeight: "bold",
};

const branchButton = {
  width: "100%",
  padding: 12,
  marginBottom: 10,
  borderRadius: 12,
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  fontSize: 15,
};

const branchActive = {
  ...branchButton,
  backgroundColor: "#c28f5c",
  color: "#fff",
  border: "1px solid #c28f5c",
};

const starsContainer = {
  display: "flex",
  justifyContent: "center",
  gap: 15,
};

const textarea = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 15,
  minHeight: 100,
  resize: "none",
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);