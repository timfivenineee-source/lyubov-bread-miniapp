export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { branch, rating, improvements, comment } = req.body;

    if (!branch || !rating) {
      return res.status(400).json({ error: "Missing data" });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const TELEGRAM_ID = process.env.TELEGRAM_ID;

    const improvementsText =
      improvements?.length > 0
        ? improvements.map(i => `- ${i}`).join("\n")
        : "Не указано";

    const message = `
🍞 Любовь и Хлеб

📍 ${branch}
⭐ ${rating}/5

📉 Зона роста:
${improvementsText}

💡 Предложение:
${comment || "Не указано"}
`;

    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_ID,
          text: message,
        }),
      }
    );

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}
