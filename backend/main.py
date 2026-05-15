import os
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


active_connections = []

@app.websocket("/ws/debug")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    print(">>> Frontend React успешно подключен к мониторингу!")
    try:
        while True:

            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        print(">>> Frontend React отключен")


@app.post("/api/track")
async def track_agent_step(request: Request):
    data = await request.json()
    for connection in active_connections:
        await connection.send_text(json.dumps(data))
    return {"status": "ok"}



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
    print("Чтобы появился красивый UI, выполните 'npm run build' во фронтенде")
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
