import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowNode } from './WorkflowNode';

const nodeTypes = {
  workflow: WorkflowNode
};

export const WorkflowCanvas = () => {
  const { nodes, edges, setNodes, setEdges } = useWorkflow();
  const [nodesState, setNodesState] = useNodesState(nodes);
  const [edgesState, setEdgesState] = useEdgesState(edges);

  React.useEffect(() => {
    setNodesState(nodes);
  }, [nodes, setNodesState]);

  React.useEffect(() => {
    setEdgesState(edges);
  }, [edges, setEdgesState]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const data = event.dataTransfer.getData('application/reactflow');

    if (data) {
      try {
        const node = JSON.parse(data);
        const position = {
          x: event.clientX - reactFlowBounds.left - 128,
          y: event.clientY - reactFlowBounds.top - 60
        };

        const newNode = {
          ...node,
          position,
          type: 'workflow'
        };

        setNodesState(prev => [...prev, newNode]);
        setNodes(prev => [...prev, newNode]);
      } catch (err) {
        console.error('Error parsing dropped node:', err);
      }
    }
  }, [setNodes, setNodesState]);

  const onNodesChange = useCallback((changes) => {
    setNodesState(prev => {
      const updated = prev.map(node => {
        const change = changes.find(c => c.id === node.id);
        if (change?.position) {
          return { ...node, position: change.position };
        }
        if (change?.type === 'remove') {
          return null;
        }
        return node;
      }).filter(Boolean);
      setNodes(updated);
      return updated;
    });
  }, [setNodes, setNodesState]);

  const onEdgesChange = useCallback((changes) => {
    setEdgesState(prev => {
      const updated = prev.filter(edge => !changes.find(c => c.id === edge.id && c.type === 'remove'));
      setEdges(updated);
      return updated;
    });
  }, [setEdges, setEdgesState]);

  const onConnect = useCallback((connection) => {
    const newEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}-${Date.now()}`,
      animated: true,
      style: { stroke: '#059669', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' },
      type: 'smoothstep'
    };
    setEdgesState(prev => addEdge(newEdge, prev));
    setEdges(prev => [...prev, newEdge]);
  }, [setEdges, setEdgesState]);

  return (
    <div 
      className="flex-1 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 relative cursor-default" 
      onDragOver={onDragOver} 
      onDrop={onDrop}
      style={{ touchAction: 'none' }}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div className="absolute bottom-24 left-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600 text-sm max-w-xs">
        <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-lg">🔗</span> How to Connect:
        </p>
        <ul className="text-xs text-gray-700 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span>Click on <strong>green handles</strong> at top (Input) or bottom (Output)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span>Drag from Output handle of one node</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span>Drop on Input handle of another node</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
