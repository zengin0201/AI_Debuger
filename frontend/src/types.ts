export interface WsMessage {
  type: 'node_added' | 'node_updated' | 'edge_added' | 'agent_paused' | 'agent_finished';
  id?: string;
  label?: string;
  status?: 'running' | 'success' | 'error';
  source?: string;
  target?: string;
  message?: string;
  inputs?: string;  
  outputs?: string; 
}