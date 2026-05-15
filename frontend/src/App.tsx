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
  
  const [statusText, setStatusText] = useState("Waiting data from agents");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const ws = useRef<WebSocket | null>(null);

  const getYPos = (nodesList: Node[]) => nodesList.length * 120 + 50;

  useEffect(() => {
    
    const isExtension = window.location.protocol === 'chrome-extension:';
    
   
    let wsUrl = '';
    if (import.meta.env.DEV || isExtension) {
      wsUrl = 'ws://localhost:8000/ws/debug';
    } else {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${wsProtocol}//${window.location.host}/ws/debug`;
    }

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => setStatusText("🟢 Listening port. Launch Python script!");
    ws.current.onclose = () => setStatusText("🔴 Disconnected from server");
    ws.current.onerror = () => setStatusText("🔴 Error connection");
    
    ws.current.onmessage = (event) => {
      const data: WsMessage = JSON.parse(event.data);

      if (data.type === 'node_added' && data.id && data.label) {
        setStatusText("🟡 Agent in work");
        setNodes((nds: Node[]) => [
          ...nds,
          { 
            id: data.id!, 
            position: { x: 250, y: getYPos(nds) }, 
            data: { label: data.label, inputs: data.inputs, outputs: "Waiting..." },
            style: { background: '#ffcc00', color: '#000', border: '2px solid #222', width: 250 }
          }
        ]);
      } else if (data.type === 'node_updated' && data.id) {
        setNodes((nds: Node[]) =>
          nds.map((n) => {
            if (n.id === data.id) {
              setSelectedNode((prevSelected) => {
                if (prevSelected?.id === data.id) {
                  return { ...n, data: { ...n.data, outputs: data.outputs } };
                }
                return prevSelected;
              });

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
      }
    };

    return () => ws.current?.close();
  }, [setNodes, setEdges]); 
  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setStatusText("🟢 Listening port. Launch Python script!");
  }

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      
      <div style={{ flexGrow: 1, position: 'relative' }}>
        {/* Control Panel */}
        <div className="control-panel" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(30, 30, 30, 0.9)', padding: '15px 20px', borderRadius: '8px', border: '1px solid #444' }}>
          <h3 style={{marginTop: 0, color: 'white'}}>AI Flow Monitor</h3>
          <p style={{color:"#4CAF50", fontWeight:"bold", margin: '5px 0'}}>{statusText}</p>
          <button onClick={clearGraph} style={{marginTop: '10px', padding: '8px 12px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: '#4a90e2', color: 'white', fontWeight: 'bold'}}>
            Clear screen
          </button>
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
        <div className="side-panel" style={{ width: '400px', background: '#1e1e1e', color: 'white', padding: '20px', borderLeft: '1px solid #333', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Step Details</h2>
            <button className="close-btn" onClick={() => setSelectedNode(null)} style={{cursor: 'pointer', background: 'transparent', color: '#aaa', border: 'none', fontSize: '18px'}}>
              ✖
            </button>
          </div>
          
          <h3 style={{ color: '#4a90e2', marginBottom: '20px' }}>{selectedNode.data.label}</h3>
          
          <div className="data-box" style={{ background: '#2a2a2a', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #333' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '0.9rem' }}>📥 Enter data (Input):</h4>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, fontSize: '0.85rem', color: '#ddd' }}>
              {selectedNode.data.inputs || "No data"}
            </pre>
          </div>

          <div className="data-box" style={{ background: '#2a2a2a', padding: '15px', borderRadius: '6px', border: '1px solid #333' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '0.9rem' }}>📤 Result (Output):</h4>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, fontSize: '0.85rem', color: '#ddd' }}>
              {selectedNode.data.outputs || "Wait..."}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
