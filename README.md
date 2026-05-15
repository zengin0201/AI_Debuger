```markdown
## 🛠 Быстрый старт

Для запуска проекта у вас должны быть установлены **Node.js** (для фронтенда) и **Python** (для бэкенда).

### 1. Сборка фронтенда (UI)
Склонируйте репозиторий, установите зависимости React и соберите интерфейс:
```bash
git clone https://github.com/zengin0201/AI_Debugger.git
cd AI_Debugger

# Установка зависимостей и сборка React-приложения (создаст папку dist)
npm install
npm run build
```

***ПЕРЕНЕСИТЕ ПАПКУ DIST В ПАПКУ С BACKEND***

### 2. Запуск монитора (Сервера)
Перейдите в папку бэкенда и запустите сервер:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Откройте в браузере: **http://localhost:8000** (Там появится красивый дашборд с графом).

### 3. Подключение к вашему ИИ-агенту
Возьмите файл `callback.py` из папки `backend` и положите рядом со своим скриптом.

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
Запустите вашего бота, и его шаги мгновенно появятся на дашборде!
```bash
python test_bot.py
```
```
