const { execSync } = require('child_process');
const TelegramBot = require('node-telegram-bot-api');

// Reemplaza 'YOUR_TELEGRAM_BOT_TOKEN' con el token de tu bot
const token = '7450739029:AAH2lBQfX4VQJIIZrp9Kq8pohY6WigbB5Tk';

const bot = new TelegramBot(token, { polling: true });

let isScriptRunning = false;

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Elige una opción:', {
        reply_markup: {
            keyboard: [
                [{ text: 'Ejecutar script' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === 'Ejecutar script') {
        if (isScriptRunning) {
            bot.sendMessage(chatId, 'El script ya está en ejecución. Por favor, espera a que termine.');
            return;
        }

        isScriptRunning = true;
        bot.sendMessage(chatId, 'Ejecutando script...');

        try {
            // Ejecutar el script shell de forma síncrona
            const result = execSync('/home/juanma/script_test.sh');

            // Convertir el resultado a una cadena de texto
            const output = result.toString();
            // Imprimir el resultado
            console.log(output);

            // Enviar mensaje de éxito al bot de Telegram
            bot.sendMessage(chatId, `Script ejecutado con éxito. Resultado:\n${output}`);
        } catch (error) {
            // Manejar cualquier error que ocurra durante la ejecución del script
            console.error('Error:', error.message);
            console.error('Código de salida:', error.status);

            // Enviar mensaje de error al bot de Telegram
            bot.sendMessage(chatId, `Error al ejecutar el script. Mensaje de error: ${error.message}`);
        } finally {
            isScriptRunning = false;
        }
    }
});

console.log('Bot de Telegram iniciado');