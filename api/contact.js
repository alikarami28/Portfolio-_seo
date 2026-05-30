export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { name, email, message } = req.body;

    const text = `
📩 پیام جدید از سایت

👤 نام: ${name}
📧 ایمیل: ${email}
📝 پیام: ${message}
    `;

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text
        })
      }
    );

    return res.status(200).json({ success: true });

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}
