const fs = require('fs');

const chatLog = `
Usuario: como puedo manejar que rechace mensajes mientras se ejecuta ese primer mensaje?
GitHub Copilot: Para manejar la situación en la que el bot rechaza mensajes mientras se está ejecutando el script, puedes usar una variable de estado para indicar si el script está en ejecución. Aquí tienes cómo puedes modificar tu código para lograr esto:

1. **Agregar una variable de estado**: Usa una variable para rastrear si el script está en ejecución.
2. **Rechazar mensajes mientras el script está en ejecución**: Verifica el estado antes de procesar nuevos mensajes.

Aquí tienes el código modificado:

\`\`\`javascript
const { execSync } = require('child_process');
const TelegramBot = require('node-telegram-bot-api');

// Reemplaza 'YOURLEGRAM_BOT_TOKEN' con el token de tu bot
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

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
            bot.sendMessage(chatId, \`Script ejecutado con éxito. Resultado:\n\${output}\`);
        } catch (error) {
            // Manejar cualquier error que ocurra durante la ejecución del script
            console.error('Error:', error.message);
            console.error('Código de salida:', error.status);

            // Enviar mensaje de error al bot de Telegram
            bot.sendMessage(chatId, \`Error al ejecutar el script. Mensaje de error: \${error.message}\`);
        } finally {
            isScriptRunning = false;
        }
    }
});
\`\`\`

Usuario: en linux como puedo montar esta app como un servicio para que se ejecute como superusuario o root ya que podria cambiar a leer rutas no permitidas solo por root?
GitHub Copilot: Para montar tu aplicación Node.js como un servicio en Linux y ejecutarla con privilegios de superusuario (root), puedes usar \`systemd\`, que es un sistema de inicialización y gestión de servicios en muchas distribuciones de Linux. Aquí tienes los pasos para hacerlo:

1. **Crear un archivo de servicio \`systemd\`**:
   - Crea un archivo de servicio en \`/etc/systemd/system/\` con un nombre descriptivo, por ejemplo, \`telegram-bot.service\`.

   \`\`\`sh
   sudo nano /etc/systemd/system/telegram-bot.service
   \`\`\`

2. **Configurar el archivo de servicio**:
   - Añade la siguiente configuración al archivo. Asegúrate de ajustar las rutas y el usuario según sea necesario.

   \`\`\`ini
   [Unit]
   Description=Telegram Bot Service
   After=network.target

   [Service]
   ExecStart=/usr/bin/node /ruta/a/tu/app.js
   WorkingDirectory=/ruta/a/tu
   StandardOutput=inherit
   StandardError=inherit
   Restart=always
   User=root
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   \`\`\`

   - Reemplaza \`/ruta/a/tu/app.js\` con la ruta completa a tu archivo \`app.js\`.

3. **Recargar \`systemd\` para reconocer el nuevo servicio**:

   \`\`\`sh
   sudo systemctl daemon-reload
   \`\`\`

4. **Iniciar el servicio**:

   \`\`\`sh
   sudo systemctl start telegram-bot.service
   \`\`\`

5. **Habilitar el servicio para que se inicie automáticamente al arrancar el sistema**:

   \`\`\`sh
   sudo systemctl enable telegram-bot.service
   \`\`\`

6. **Verificar el estado del servicio**:

   \`\`\`sh
   sudo systemctl status telegram-bot.service
   \`\`\`

### Explicación de la configuración:

- **[Unit]**: Define la descripción del servicio y las dependencias.
- **[Service]**:
  - \`ExecStart\`: Especifica el comando para iniciar tu aplicación.
  - \`WorkingDirectory\`: El directorio de trabajo para tu aplicación.
  - \`StandardOutput\` y \`StandardError\`: Configura la salida estándar y el error estándar para heredar del proceso principal.
  - \`Restart\`: Configura el servicio para que se reinicie automáticamente si falla.
  - \`User\`: Especifica el usuario con el que se ejecutará el servicio. En este caso, \`root\`.
  - \`Environment\`: Establece variables de entorno necesarias para tu aplicación.
- **[Install]**: Define el objetivo para el cual se habilita el servicio.

Con estos pasos, tu aplicación Node.js se ejecutará como un servicio \`systemd\` con privilegios de superusuario, permitiéndole acceder a rutas y realizar operaciones que requieren permisos de root.

Usuario: Excerpt from active file app.js, lines 19 to 49:
\`\`\`javascript
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
            bot.sendMessage(chatId, \`Script ejecutado con éxito. Resultado:\n\${output}\`);
        } catch (error) {
            // Manejar cualquier error que ocurra durante la ejecución del script
\`\`\`
`;

fs.writeFileSync('chat_log.txt', chatLog);
console.log('Chat log saved to chat_log.txt');