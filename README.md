1. Клонируем репу в папку `%APP_DIR%` (например */home/pi/maxreader*)
2. Прописываем автозапуск сервера с указанием адреса сервера 1С (например *http://192.168.1.163:3003*):
    `sudo nano /etc/rc.local`
    ```
        sudo node %APP_DIR%/maxreader.js %SERVER_1S_URL_WITH_PORT% &
    ```
      
3. Прописываем автозапуск браузера:
    `sudo nano ~/.config/autostart/chromium.desktop` (при необходимости создать директории)
      
      ```
      [Desktop Entry]
        Encoding=UTF-8
        Name=Connect
        Comment=Checks internet connectivity
        Exec=/usr/bin/chromium-browser -incognito --noerrdialogs --kiosk http://localhost:3003
      ```
