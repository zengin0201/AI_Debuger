# ENGLISH

# 🚀 AI Visual Debugger (LangChain Chrome Extension)

A versatile tool for real-time visualization and debugging of AI agents. It allows you to see exactly what data goes into the neural network and what comes out at each step of your Chain, right inside your browser.

## 🌟 How it works?
The project consists of three parts:
1. **Chrome Extension (UI):** Renders a beautiful interactive graph.
2. **Bridge Server (`main.py`):** Runs quietly in the background and forwards data from your AI to the extension.
3. **Plugin (`callback.py`):** Connects to your LangChain agent with just a single line of code.

---

## 🛠 Quick Start (Python Only)

You don't need to install complex JS frameworks to make it work; all you need is **Python**.

### Step 1. Install the Chrome Extension
Since the extension is not yet published in the Web Store, let's install it locally:
1. Clone this repository: `git clone https://github.com/zengin0201/AI_Debugger.git`
2. Open Google Chrome and go to: `chrome://extensions/`
3. Enable **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left corner.
5. Select the **`dist`** folder (located inside the downloaded project).
*Done! The extension icon will appear in your Chrome toolbar.*

### Step 2. Run the bridge server
Navigate to the backend folder, install dependencies, and start the server. It will run in the background, waiting for data from your neural network.
```bash
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```

### Step 3. Connect to your AI Agent
Copy the `callback.py` file from the `backend` folder and place it next to your Python script.

Example integration into your code (`test_bot.py`):
```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

# 1. Import the visual debugger
from callback import RealUIDebuggerCallback

async def main():
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Write a fun fact about: {topic}")
    chain = prompt | llm

    # 2. Initialize the plugin
    ui_debugger = RealUIDebuggerCallback()
    
    # 3. Pass it to the config when running!
    response = await chain.ainvoke(
        {"topic": "Space"}, 
        config={"callbacks": [ui_debugger]} 
    )
    print(response.content)

asyncio.run(main())
```

### Step 4. See the magic! 🪄
1. Click the **AI Debugger** extension icon in Chrome (the monitoring window will open).
2. Run your bot in the terminal:
```bash
python test_bot.py
```
The agent's steps, thoughts, inputs, and outputs will instantly appear on the graph in your browser!
```












```

#RUSSIAN

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
