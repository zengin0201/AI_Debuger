```markdown
# 🚀 AI Visual Debugger (Chrome Extension)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)

**ENGLISH** | [РУССКИЙ](#-ai-visual-debugger-chrome-расширение-ru)

A lightweight Chrome Extension and local tool for real-time visualization and debugging of LangChain AI agents. Stop reading messy console logs — watch your data flow through Prompts, LLMs, and Parsers in a beautiful interactive graph right in your browser.

## 🌟 How it works
1. **Chrome Extension (React UI):** A popup in your browser that renders the interactive flow graph.
2. **Bridge Server (`main.py`):** A lightweight FastAPI backend that runs quietly, receiving data from your AI and streaming it to the extension.
3. **Plugin (`callback.py`):** Connects to your LangChain agent with just a single line of code.

---

## 🛠 Prerequisites
- **Node.js** (to build the extension)
- **Python 3.8+** (for the bridge server and your AI scripts)
- *(Optional)* **Ollama** installed locally (if you want to run the provided test script).

---

## 🚀 Quick Start Guide

### Step 1: Build the Chrome Extension
First, we need to compile the React application into a Chrome Extension.
```bash
git clone https://github.com/zengin0201/AI_Debugger.git
cd AI_Debugger/frontend

npm install
npm run build
```
After the build, a `dist` folder will appear inside the `frontend/` directory. **This folder is your Chrome Extension.**

### Step 2: Install it in Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** (toggle in the top right corner).
3. Click the **Load unpacked** button in the top left corner.
4. Select the `dist` folder you just built (`AI_Debugger/frontend/dist`).
5. *Done!* Pin the extension to your toolbar and click its icon to open the AI Flow Monitor.

### Step 3: Run the Bridge Server
The extension needs a bridge to talk to your Python code. Open a terminal, navigate to the backend, and start the server:
```bash
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```
*(Bonus: The server also hosts a web version of the dashboard at **http://localhost:8000** if you prefer not to use the extension).*

### Step 4: Test with the provided Bot
We included a ready-to-use test bot. Make sure [Ollama](https://ollama.com/) is running on your machine with the model `qwen2.5:1.5b` (or change the model in `test_bot.py`).

Open a *second* terminal and run:
```bash
cd AI_Debugger/backend
python test_bot.py
```
Click the extension icon in Chrome — you will instantly see the agent's pipeline being drawn!

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

<a name="-ai-visual-debugger-chrome-расширение-ru"></a>

# 🚀 AI Visual Debugger (Chrome-расширение) (RU)

Легковесное расширение для Chrome и локальный инструмент для отладки ИИ-агентов (LangChain) в реальном времени. Хватит читать нечитаемые логи в консоли — смотрите, как данные проходят через промпты, нейросеть и парсеры на красивом графе прямо по клику на иконку в браузере.

## 🌟 Как это работает
1. **Chrome Расширение (React UI):** Отрисовывает красивый интерактивный граф в всплывающем окне браузера.
2. **Сервер-мост (`main.py`):** Тихо работает в фоне, получает данные от ИИ и пересылает их в расширение.
3. **Плагин (`callback.py`):** Подключается к вашему LangChain агенту одной строчкой кода.

---

## 🛠 Требования
- **Node.js** (для сборки расширения)
- **Python 3.8+** (для сервера-моста и ваших ИИ-скриптов)
- *(Опционально)* Установленная **Ollama** (если хотите запустить тестовый скрипт).

---

## 🚀 Пошаговая инструкция

### Шаг 1: Сборка Chrome-расширения
Сначала скомпилируем React-приложение в готовое расширение.
```bash
git clone https://github.com/zengin0201/AI_Debugger.git
cd AI_Debugger/frontend

npm install
npm run build
```
После сборки в папке `frontend/` появится папка `dist`. **Эта папка `dist` и есть ваше готовое Chrome-расширение.**

### Шаг 2: Установка в Chrome
1. Откройте Google Chrome и перейдите по адресу `chrome://extensions/`.
2. Включите **Режим разработчика** (переключатель в правом верхнем углу).
3. Нажмите кнопку **Загрузить распакованное расширение** (в левом верхнем углу).
4. Выберите папку `dist`, которую мы только что собрали (`AI_Debugger/frontend/dist`).
5. *Готово!* Закрепите расширение на панели задач. При клике на него откроется монитор AI Flow.

### Шаг 3: Запуск сервера-моста
Чтобы расширение получало данные от Python-кода, нужен сервер-мост. Откройте новый терминал, перейдите в папку бэкенда и запустите его:
```bash
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```
*(Бонус: этот сервер также отдает веб-версию дашборда по адресу **http://localhost:8000**, если скопировать туда папку dist).*

### Шаг 4: Тест готового бота
Мы подготовили тестового бота. Убедитесь, что у вас запущена локальная [Ollama](https://ollama.com/) с моделью `qwen2.5:1.5b` (или измените модель внутри `test_bot.py`).

Откройте *второй* терминал и запустите скрипт:
```bash
cd AI_Debugger/backend
python test_bot.py
```
Кликните на иконку расширения в Chrome — шаги агента, его входы и выходы мгновенно отрисуют красивый пайплайн!

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

> ⚠️ **ОЧЕНЬ ВАЖНО:** Дебаггер работает асинхронно через WebSockets. Для запуска ваших цепочек вы **обязательно** должны использовать метод `.ainvoke()` вместо `.invoke()`, иначе данные не поступят в расширение!
```
