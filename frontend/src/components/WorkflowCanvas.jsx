import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowNode } from './WorkflowNode';

const nodeTypes = {
  workflow: WorkflowNode
};

export const WorkflowCanvas = () => {
  const { nodes, edges, setNodes, setEdges, addEdge: addEdgeToContext } = useWorkflow();
  const [nodesState, setNodesState] = useNodesState(nodes);
  const [edgesState, setEdgesState] = useEdgesState(edges);

  React.useEffect(() => {
    setNodesState(nodes);
  }, [nodes]);

  React.useEffect(() => {
    setEdgesState(edges);
  }, [edges]);

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
          x: event.clientX - reactFlowBounds.left - 100,
          y: event.clientY - reactFlowBounds.top - 40
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
  }, [setNodes]);

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
  }, [setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdgesState(prev => {
      const updated = prev.filter(edge => !changes.find(c => c.id === edge.id && c.type === 'remove'));
      setEdges(updated);
      return updated;
    });
  }, [setEdges]);

  const onConnect = useCallback((connection) => {
    const newEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}-${Date.now()}`,
      animated: true,
      style: { stroke: '#059669', strokeWidth: 2 },
      type: 'smoothstep'
    };
    setEdgesState(prev => addEdge(newEdge, prev));
    setEdges(prev => [...prev, newEdge]);
    addEdgeToContext(newEdge);
  }, [addEdgeToContext, setEdges]);

  return (
    <div className="flex-1 w-full h-full bg-gray-50" onDragOver={onDragOver} onDrop={onDrop}>
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
    </div>
  );
};
