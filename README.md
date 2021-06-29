1. Клонируем репу в папку `%APP_DIR%` (например */home/pi/maxreader*)
2. Прописываем автозапуск и автообновление сервера с указанием адреса сервера 1С `%SERVER_1S_URL_WITH_PORT%` (например *http://192.168.1.163:3003*):
    
    Запускаем `sudo nano /etc/rc.local`
    
    Для автообновления сначала пишем:
    ```
    git -C %APP_DIR% pull &
    ```
    Для автозапуска сервера пишем:
    ```
        sudo node %APP_DIR%/maxreader.js %SERVER_1S_URL_WITH_PORT% &
    ```
      
3. Прописываем автозапуск браузера:
    Запускаем `sudo nano ~/.config/autostart/chromium.desktop` (при необходимости создать директории)
      Пишем:
      ```
      [Desktop Entry]
        Encoding=UTF-8
        Name=Connect
        Comment=Checks internet connectivity
        Exec=/usr/bin/chromium-browser -incognito --noerrdialogs --kiosk http://localhost:3003
      ```
