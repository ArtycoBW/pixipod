import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Добавьте TELEGRAM_BOT_TOKEN в server/.env.');
  process.exit(1);
}

const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const payload = await response.json();
if (!response.ok || !payload.ok) {
  console.error('Telegram API не вернул обновления. Проверьте новый токен.');
  process.exit(1);
}

const chats = new Map();
for (const update of payload.result) {
  const chat = update.message?.chat || update.channel_post?.chat || update.callback_query?.message?.chat;
  if (chat) chats.set(String(chat.id), chat);
}

if (!chats.size) {
  console.log('Напишите боту /start, затем снова выполните npm run find:chat.');
} else {
  for (const [id, chat] of chats) {
    console.log(`${id} — ${chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || 'чат'}`);
  }
}
