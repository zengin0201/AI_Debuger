 🚀 AI Visual Debugger

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)

**ENGLISH** | [РУССКИЙ](#-ai-visual-debugger-ru)

A lightweight, local tool for real-time visualization and debugging of LangChain AI agents. Stop reading messy console logs — watch your data flow through Prompts, LLMs, and Parsers in a beautiful interactive graph right in your browser.

## 🌟 How it works
1. **Frontend (React UI):** Renders an interactive flow graph.
2. **Bridge Server (`main.py`):** A FastAPI backend that runs quietly, receiving data from your AI and serving the UI.
3. **Plugin (`callback.py`):** Connects to your LangChain agent with just a single line of code.

---

## 🛠 Prerequisites
- **Node.js** (to build the UI)
- **Python 3.8+** (for the backend and your AI scripts)
- *(Optional)* **Ollama** installed locally (if you want to run the provided test script).

---

## 🚀 Quick Start Guide

### Step 1: Build the UI (Frontend)
First, compile the React application.
```bash
git clone https://github.com/zengin0201/AI_Debugger.git
cd AI_Debugger/frontend

npm install
npm run build
```
⚠️ **CRUCIAL:** After the build, a `dist` folder will appear inside `frontend/`. **Copy this `dist` folder and paste it into the `backend/` directory.** The Python server needs it to render the dashboard!

*(Alternatively, you can load this `dist` folder in Chrome via `chrome://extensions/` -> "Load unpacked" to use it as a standalone Chrome Extension).*

### Step 2: Run the Monitor Server
Open a new terminal, navigate to the backend, install dependencies, and start the server:
```bash
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```
👉 Open **http://localhost:8000** in your browser. You should see the empty dashboard waiting for data. Keep this terminal running!

### Step 3: Test with the provided Bot
We included a ready-to-use test bot. Make sure [Ollama](https://ollama.com/) is running on your machine with the model `qwen2.5:1.5b` (or change the model in `test_bot.py`).

Open a *second* terminal and run:
```bash
cd AI_Debugger/backend
python test_bot.py
```
Watch your browser: the agent's steps, inputs, and outputs will instantly draw a beautiful pipeline!

---

## 💻 How to use it in YOUR project
Want to debug your own LangChain project? It takes 3 lines of code.

1. Copy the `callback.py` file from the `backend` folder and place it next to your Python script.
2. Import and initialize the debugger.
3. Pass it to the `config` when invoking your chain.

```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Import the visual debugger
from callback import RealUIDebuggerCallback

async def main():
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Write a fun fact about: {topic}")
    parser = StrOutputParser()
    
    chain = prompt | llm | parser

    # 2. Initialize the plugin
    ui_debugger = RealUIDebuggerCallback()
    
    # 3. Pass it to the config when running!
    response = await chain.ainvoke(
        {"topic": "Space"}, 
        config={"callbacks": [ui_debugger]} 
    )
    print(response)

asyncio.run(main())
```

> ⚠️ **IMPORTANT:** The debugger works asynchronously via WebSockets. You **must** use `.ainvoke()` instead of `.invoke()` to run your chains, otherwise the data won't be streamed to the UI!


<br><br><br>

---
---

<a name="-ai-visual-debugger-ru"></a>

# 🚀 AI Visual Debugger (RU)

Легковесный локальный инструмент для визуализации и отладки работы ИИ-агентов на базе LangChain в реальном времени. Хватит читать нечитаемые логи в консоли — смотрите, как данные проходят через промпты, нейросеть и парсеры на красивом интерактивном графе прямо в браузере.

## 🌟 Как это работает
1. **Фронтенд (React UI):** Отрисовывает красивый интерактивный граф.
2. **Сервер-мост (`main.py`):** FastAPI бэкенд, который тихо работает в фоне, получает данные от ИИ и раздает интерфейс.
3. **Плагин (`callback.py`):** Подключается к вашему LangChain агенту одной строчкой кода.

---

## 🛠 Требования
- **Node.js** (для сборки фронтенда)
- **Python 3.8+** (для бэкенда и ваших ИИ-скриптов)
- *(Опционально)* Установленная **Ollama** (если хотите запустить тестовый скрипт из репозитория).

---

## 🚀 Пошаговая инструкция

### Шаг 1: Сборка интерфейса (Фронтенд)
Сначала соберем React-приложение.
```bash
git clone https://github.com/zengin0201/AI_Debugger.git
cd AI_Debugger/frontend

npm install
npm run build
```
⚠️ **ВАЖНО:** После сборки в папке `frontend/` появится папка `dist`. **Скопируйте эту папку `dist` и поместите её в папку `backend/`.** Она нужна Python-серверу, чтобы отрисовать интерфейс!

*(Альтернатива: вы можете загрузить эту папку `dist` как Chrome-расширение. Откройте `chrome://extensions/`, включите Режим разработчика и нажмите "Загрузить распакованное расширение").*

### Шаг 2: Запуск сервера мониторинга
Откройте новый терминал, перейдите в папку бэкенда, установите зависимости и запустите сервер:
```bash
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```
👉 Откройте браузер по адресу **http://localhost:8000**. Вы увидите пустой дашборд. Не закрывайте этот терминал!

### Шаг 3: Тест готового бота
Мы подготовили тестового бота. Убедитесь, что у вас запущена локальная [Ollama](https://ollama.com/) с моделью `qwen2.5:1.5b` (или измените модель внутри `test_bot.py`).

Откройте *второй* терминал и запустите скрипт:
```bash
cd AI_Debugger/backend
python test_bot.py
```
Посмотрите в браузер: шаги агента, его входы и выходы мгновенно отрисуют красивый пайплайн!

---

## 💻 Как внедрить это в ВАШ проект
Хотите дебажить собственный LangChain код? Это займет 3 строчки.

1. Скопируйте файл `callback.py` (из папки `backend`) и положите рядом со своим Python-скриптом.
2. Импортируйте и инициализируйте дебаггер.
3. Передайте его в `config` при запуске цепочки.

```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Импортируем визуальный отладчик
from callback import RealUIDebuggerCallback

async def main():
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Напиши факт про: {topic}")
    parser = StrOutputParser()
    
    chain = prompt | llm | parser

    # 2. Инициализируем плагин
    ui_debugger = RealUIDebuggerCallback()
    
    # 3. Передаем его в config при запуске!
    response = await chain.ainvoke(
        {"topic": "Космос"}, 
        config={"callbacks": [ui_debugger]} 
    )
    print(response)

asyncio.run(main())
```

> ⚠️ **ОЧЕНЬ ВАЖНО:** Дебаггер работает асинхронно через WebSockets. Для запуска ваших цепочек вы **обязательно** должны использовать метод `.ainvoke()` вместо `.invoke()`, иначе данные не поступят в монитор!
