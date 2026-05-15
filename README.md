
# 🚀 AI Visual Debugger (LangChain)

Универсальный инструмент для визуализации и отладки работы ИИ-агентов в реальном времени. Позволяет увидеть, какие данные входят в нейросеть и какие выходят на каждом этапе цепочки (Chain).


## 🌟 Как это работает?
Проект состоит из двух частей:
1. **Дашборд (Сервер + UI):** Отображает граф работы ИИ в браузере.
2. **Плагин (Callback):** Подключается к вашему LangChain агенту одной строчкой кода и транслирует его шаги на дашборд.

---

## 🛠 Быстрый старт

### 1. Запуск монитора (Дашборда)
Склонируйте репозиторий и запустите сервер:
```bash
git clone https://github.com/zengin0201/AI_Debugger.git
cd AI_Debugger/backend
pip install -r requirements.txt
python main.py
```
Откройте в браузере: **http://localhost:8000**

### 2. Подключение к вашему ИИ-агенту
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
```
