# ENGLISH

# 🚀 AI Visual Debugger

A versatile tool for real-time visualization and debugging of AI agents. It allows you to see exactly what data goes into the neural network and what comes out at each step of your Chain, right inside your browser.

## 🌟 How it works?
The project consists of three parts:
1. **Frontend (React UI):** Renders a beautiful interactive graph.
2. **Bridge Server (`main.py`):** Runs quietly in the background, receiving data from your AI and serving the UI.
3. **Plugin (`callback.py`):** Connects to your LangChain agent with just a single line of code.

---

## 🛠 Quick Start

To run this project from source, you will need **Node.js** (to build the frontend) and **Python** (for the backend).

### Step 1. Build the Frontend (UI)
First, we need to build the React application.
1. Clone this repository: `git clone https://github.com/zengin0201/AI_Debugger.git`
2. Navigate to the frontend folder, install dependencies, and build the app:
```bash
cd AI_Debugger/frontend
npm install
npm run build
```
3. **Crucial step:** After the build is complete, a `dist` folder will appear in the `frontend` directory. **Copy this `dist` folder and paste it into the `backend` folder.** The Python server needs it to render the dashboard!

*(Alternatively, you can load this `dist` folder in Chrome via `chrome://extensions/` -> "Load unpacked" to use it as a Chrome Extension).*

### Step 2. Run the Bridge Server
Navigate to the backend folder, install Python dependencies, and start the server.
```bash
cd ../backend
pip install -r requirements.txt
python main.py
```
Open your browser and go to **http://localhost:8000**. You should see the empty AI Flow graph waiting for data.

### Step 3. Connect to your AI Agent
Place the `callback.py` file (from the `backend` folder) next to your own Python script.

Example integration (`test_bot.py`):
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
Make sure the browser with the dashboard is open, then run your bot in a new terminal:
```bash
python test_bot.py
```
The agent's steps, thoughts, inputs, and outputs will instantly appear on the graph!



---
---



# RUSSIAN

# 🚀 AI Visual Debugger

Универсальный инструмент для визуализации и отладки работы ИИ-агентов в реальном времени. Позволяет увидеть, какие данные входят в нейросеть и какие выходят на каждом этапе цепочки (Chain), прямо в вашем браузере.

## 🌟 Как это работает?
Проект состоит из трех частей:
1. **Фронтенд (React UI):** Отрисовывает красивый интерактивный граф.
2. **Сервер-мост (`main.py`):** Тихо работает в фоне, получает данные от ИИ и раздает интерфейс.
3. **Плагин (`callback.py`):** Подключается к вашему LangChain агенту одной строчкой кода.

---

## 🛠 Быстрый старт

Для запуска проекта из исходников у вас должны быть установлены **Node.js** (для сборки фронтенда) и **Python** (для бэкенда).

### Шаг 1. Сборка фронтенда (UI)
Сначала нам нужно собрать React-приложение.
1. Склонируйте репозиторий: `git clone https://github.com/zengin0201/AI_Debugger.git`
2. Перейдите в папку фронтенда, установите зависимости и запустите сборку:
```bash
cd AI_Debugger/frontend
npm install
npm run build
```
3. **Важный шаг:** После сборки в папке `frontend` появится папка `dist`. **Скопируйте эту папку `dist` и поместите её в папку `backend`.** Она нужна Python-серверу, чтобы отрисовать интерфейс!

*(Как альтернатива: вы можете использовать эту папку `dist` как Chrome-расширение. Для этого откройте `chrome://extensions/`, включите Режим разработчика и нажмите "Загрузить распакованное расширение").*

### Шаг 2. Запуск сервера-моста
Перейдите в папку бэкенда, установите зависимости и запустите сервер:
```bash
cd ../backend
pip install -r requirements.txt
python main.py
```
Откройте браузер и перейдите по адресу **http://localhost:8000**. Вы увидите пустой граф, ожидающий данных.

### Шаг 3. Подключение к вашему ИИ-агенту
Скопируйте файл `callback.py` (из папки `backend`) и положите рядом со своим Python-скриптом.

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
Убедитесь, что у вас открыта вкладка с дашбордом, и запустите вашего бота в новом терминале:
```bash
python test_bot.py
```
Шаги агента, его мысли, входные и выходные данные мгновенно появятся на графе в браузере!
```
