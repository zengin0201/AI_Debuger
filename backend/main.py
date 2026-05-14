import os
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from callback import RealUIDebuggerCallback
app = FastAPI()

real_llm = ChatOllama(
    model="qwen2.5:1.5b", 
    temperature=0.7
)

prompt = PromptTemplate.from_template("Напиши один короткий, но очень интересный факт про: {topic}")

ai_chain = prompt | real_llm

@app.websocket("/ws/debug")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print(">>> Frontend React успешно подключен к WebSocket!")
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")
            
            if action == "start":
                topic_text = payload.get("new_prompt", "Космос") 
                print(f"\n---> Старт процесса ИИ (Тема: {topic_text})...")
                

                ui_debugger = RealUIDebuggerCallback(websocket)
                async def run_ai():
                    try:
                        res = await ai_chain.ainvoke(
                            {"topic": topic_text}, 
                            config={"callbacks": [ui_debugger]} 
                        )
                        print("\n" + "="*40)
                        print(f"ОТВЕТ НЕЙРОСЕТИ:\n{res.content}")
                        print("="*40 + "\n")
                    except Exception as e:
                        print(f"Ошибка при вызове LLM (Ollama запущена?): {e}")


                asyncio.create_task(run_ai())
                
    except WebSocketDisconnect:
         print(">>> Frontend React отключен от WebSocket")





BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")


if os.path.exists(DIST_DIR):
    print(">>> Папка dist найдена. UI интерфейс активирован!")
    

    assets_path = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")


    @app.get("/{catchall:path}")
    async def serve_react_app(catchall: str):
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

else:
    print("\n" + "!"*50)
    print("ВНИМАНИЕ: Папка 'dist' не найдена!")
    print("Чтобы появился красивый UI, выполните 'npm run build' в папке фронтенда")
    print("и скопируйте папку 'dist' рядом с этим файлом (main.py).")
    print("!"*50 + "\n")
    @app.get("/")
    async def fallback_no_ui():
        return {
            "error": "UI is not built",
            "message": "Please run 'npm run build' in your React folder and place the 'dist' folder next to main.py"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)