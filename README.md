
# 🚀 AI Visual Debugger (LangChain Chrome Extension)

Универсальный инструмент для визуализации и отладки работы ИИ-агентов в реальном времени. Позволяет увидеть, какие данные входят в нейросеть и какие выходят на каждом этапе цепочки (Chain), прямо в вашем браузере.

## 🌟 Как это работает?
Проект состоит из трех частей:
1. **Chrome Расширение (UI):** Отрисовывает красивый интерактивный граф.
2. **Сервер-мост (`main.py`):** Тихо работает в фоне и пересылает данные от ИИ в расширение.
3. **Плагин (`callback.py`):** Подключается к вашему LangChain агенту одной строчкой кода.

---

## 🛠 Быстрый старт (Только Python)

Для работы вам не нужно устанавливать сложные JS-фреймворки, нужен только **Python**.

### Шаг 1. Установка расширения в Chrome
Поскольку расширение пока не опубликовано в магазине, установим его локально:
1. Склонируйте этот репозиторий: `git clone https://github.com/zengin0201/AI_Debugger.git`
2. Откройте браузер Chrome и перейдите по адресу: `chrome://extensions/`
3. В правом верхнем углу включите **«Режим разработчика»** (Developer mode).
4. Нажмите кнопку **«Загрузить распакованное расширение»** (Load unpacked) в левом верхнем углу.
5. Выберите папку **`dist`** (она находится внутри скачанного проекта).
*Готово! На панели Chrome появится иконка расширения.*

### Шаг 2. Запуск сервера-моста
Перейдите в папку бэкенда, установите зависимости и запустите сервер. Он будет тихо висеть в фоне и ждать данных от вашей нейросети.
```bash
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```

### Шаг 3. Подключение к вашему ИИ-агенту
Скопируйте файл `callback.py` из папки `backend` и положите рядом со своим Python-скриптом.

Пример интеграции в ваш код (`test_bot.py`):
```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

# 1. Импортируем визуальный отладчик
from callback import RealUIDebuggerCallback

async def main():
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Напиши факт про: {topic}")
    chain = prompt | llm

    # 2. Инициализируем плагин
    ui_debugger = RealUIDebuggerCallback()
    
    # 3. Передаем его в config при запуске!
    response = await chain.ainvoke(
        {"topic": "Космос"}, 
        config={"callbacks": [ui_debugger]} 
    )
    print(response.content)

asyncio.run(main())
```

### Шаг 4. Смотрим магию! 🪄
1. Кликните на иконку расширения **AI Debugger** в Chrome (откроется окно мониторинга).
2. Запустите вашего бота в терминале:
```bash
python test_bot.py
```
Шаги агента, его мысли, входные и выходные данные мгновенно появятся на графе в браузере!
```
