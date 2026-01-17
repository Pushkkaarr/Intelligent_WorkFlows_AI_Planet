import React, { useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
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

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const data = event.dataTransfer.getData('application/reactflow');

    if (data) {
      const node = JSON.parse(data);
      const position = {
        x: event.clientX - reactFlowBounds.left - 60,
        y: event.clientY - reactFlowBounds.top - 20
      };

      setNodesState(prev => [...prev, {
        ...node,
        position,
        type: 'workflow'
      }]);
      
      setNodes(prev => [...prev, {
        ...node,
        position,
        type: 'workflow'
      }]);
    }
  };

  const onNodesChange = (changes) => {
    setNodesState(prev => {
      const updated = prev.map(node => {
        const change = changes.find(c => c.id === node.id);
        if (change?.position) {
          return { ...node, position: change.position };
        }
        return node;
      });
      setNodes(updated);
      return updated;
    });
  };

  const onEdgesChange = (changes) => {
    setEdgesState(prev => {
      const updated = prev.filter(edge => !changes.find(c => c.id === edge.id && c.type === 'remove'));
      setEdges(updated);
      return updated;
    });
  };

  const onConnect = (connection) => {
    const newEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}`
    };
    setEdgesState(prev => addEdge(newEdge, prev));
    setEdges(prev => [...prev, newEdge]);
  };

  return (
    <div className="flex-1 h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
