1. Клонируем репу в папку `%APP_DIR%` (например */home/pi/maxreader*) `git clone https://github.com/alegorn-github/maximum.git %APP_DIR%`
2. Прописываем автозапуск и автообновление сервера с указанием адреса сервера 1С `%SERVER_1S_URL_WITH_PORT%` (например *http://192.168.1.163:3003*):
    
    Запускаем `sudo nano /etc/rc.local`
    
    Для автообновления сначала пишем:
    ```
    git -C %APP_DIR% pull &
    ```
    **Для работы автообновления в Raspberry Configuration необходимо включить флаг "Network on boot"**
    
    Для автозапуска сервера пишем (указываем адрес сервера, логин и пароль):
    ```
        sudo node %APP_DIR%/maxreader.js -s %SERVER_1S_URL_WITH_PORT% -u %USER_NAME% -p %USER_PASSWORD% &
    ```
    В последней строчке должно стоять
    ```
        exit 0
    ```
    Если эта строчка встречается раньше - убрать.
      
3. Прописываем автозапуск браузера:
    Запускаем `sudo nano ~/.config/autostart/chromium.desktop` (при необходимости нужно создать директории с помощью `mkdir`)
      Пишем:
      ```
      [Desktop Entry]
        Encoding=UTF-8
        Name=Connect
        Comment=Checks internet connectivity
        Exec=/usr/bin/chromium-browser -incognito --noerrdialogs --kiosk http://localhost:3003
      ```
