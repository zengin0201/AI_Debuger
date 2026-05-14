
import { useEffect, useState, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  addEdge, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import type { Node, Edge } from 'reactflow'; 
import 'reactflow/dist/style.css';

import type { WsMessage } from './types';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [statusText, setStatusText] = useState("Ожидание запуска сервера...");
  const [promptInput, setPromptInput] = useState("Интересный факт про черные дыры");
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const ws = useRef<WebSocket | null>(null);

  const getYPos = (nodesList: Node[]) => nodesList.length * 120 + 50;

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws/debug');

    ws.current.onopen = () => setStatusText("Готов к запуску");
    ws.current.onclose = () => setStatusText("Отключен от сервера");
    ws.current.onerror = () => setStatusText("Ошибка соединения");
    
    ws.current.onmessage = (event) => {
      const data: WsMessage = JSON.parse(event.data);

      if (data.type === 'node_added' && data.id && data.label) {
        setStatusText("Агент работает...");
        setNodes((nds: Node[]) => [
          ...nds,
          { 
            id: data.id!, 
            position: { x: 250, y: getYPos(nds) }, 
            data: { label: data.label, inputs: data.inputs, outputs: "Загрузка..." },
            style: { background: '#ffcc00', color: '#000', border: '2px solid #222', width: 250 }
          }
        ]);
      } else if (data.type === 'node_updated' && data.id) {
        setNodes((nds: Node[]) =>
          nds.map((n) => {
            if (n.id === data.id) {
              if (selectedNode?.id === data.id) {
                setSelectedNode({ ...n, data: { ...n.data, outputs: data.outputs } });
              }
              return { 
                ...n, 
                data: { ...n.data, outputs: data.outputs || n.data.outputs },
                style: { ...n.style, background: data.status === 'success' ? '#4CAF50' : '#F44336', color: 'white' } 
              };
            }
            return n;
          })
        );
      } else if (data.type === 'edge_added' && data.source && data.target) {
        setEdges((eds: Edge[]) => 
          addEdge({ id: `e${data.source}-${data.target}`, source: data.source!, target: data.target!, animated: true }, eds)
        );
      } else if (data.type === 'agent_finished') {
        setStatusText("Выполнение завершено!");
      }
    };

    return () => ws.current?.close();
  }, [setNodes, setEdges, selectedNode]);

  const startAgent = () => {
    setNodes([]); 
    setEdges([]);
    setSelectedNode(null);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'start', new_prompt: promptInput }));
    }
  };


  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      
      {/* ЛЕВАЯ ЧАСТЬ: Граф */}
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <div className="control-panel">
          <h3 style={{marginTop: 0}}>AI UI Debugger ({statusText})</h3>
          <div style={{ marginBottom: '10px' }}>
            <input 
              value={promptInput} 
              onChange={(e) => setPromptInput(e.target.value)} 
              style={{ width: '300px' }}
            />
            <button onClick={startAgent}>🚀 Запустить агента</button>
            <p style={{color:"white",fontWeight:"bold",fontSize:"20px"}}>Кликните на блок чтобы увидеть ход ИИ</p>
          </div>
        </div>

        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onNodeClick={onNodeClick} 
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="side-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Детали шага</h2>
            <button className="close-btn" onClick={() => setSelectedNode(null)}>X</button>
          </div>
          
          <h3 style={{ color: '#4a90e2' }}>{selectedNode.data.label}</h3>
          
          <div className="data-box">
            <h4>📥 Входящие данные (Input):</h4>
            <pre>{selectedNode.data.inputs || "Нет данных"}</pre>
          </div>

          <div className="data-box">
            <h4>📤 Результат (Output):</h4>
            <pre>{selectedNode.data.outputs || "Ожидание..."}</pre>
          </div>
        </div>
      )}
    </div>
  );
}