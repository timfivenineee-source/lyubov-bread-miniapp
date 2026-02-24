import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается" });
  }

  const { branch, answers, comment } = req.body;

  if (!branch || !answers || answers.length < 3) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const TELEGRAM_ID = process.env.TELEGRAM_ID;

  const message = `
Новый отзыв о пекарне «Любовь и Хлеб» (${branch})

1. Общее впечатление: ${answers[0]}
2. Чего не хватает: ${answers[1]}
3. За чем готовы вернуться: ${answers[2]}
4. Дополнительно: ${answers[3] || "Не указано"}

Комментарий:
${comment || "Не указан"}
`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_ID,
        text: message,
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Ошибка отправки в Telegram" });
  }
}
