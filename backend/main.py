from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
import asyncio

TOKEN = "8823363932:AAEVjbjEkqwqUCPhTNvk2Yzc73atpApFu1M"

bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def start_handler(message: Message):
await message.answer(
    "🏆 eFootball Champions League botiga xush kelibsiz!",
    reply_markup=keyboard
)


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())