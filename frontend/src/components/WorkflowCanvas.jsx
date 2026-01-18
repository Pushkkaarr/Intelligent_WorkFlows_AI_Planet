import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import { X } from 'lucide-react';
import 'reactflow/dist/style.css';
import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowNode } from './WorkflowNode';

const nodeTypes = {
  workflow: WorkflowNode
};

export const WorkflowCanvas = () => {
  const { nodes: contextNodes, edges: contextEdges, setNodes: setContextNodes, setEdges: setContextEdges, addNode } = useWorkflow();
  const [nodesState, setNodesState] = useNodesState(contextNodes || []);
  const [edgesState, setEdgesState] = useEdgesState(contextEdges || []);
  const [showHelpWindow, setShowHelpWindow] = useState(true);
  const lastContextNodesRef = useRef(contextNodes);
  const lastContextEdgesRef = useRef(contextEdges);
  const reactFlowWrapperRef = useRef(null);

  // Sync context nodes to canvas when context actually changes
  useEffect(() => {
    if (contextNodes !== lastContextNodesRef.current) {
      console.log('[SYNC] Context nodes changed, updating canvas. New count:', contextNodes.length);
      setNodesState(contextNodes || []);
      lastContextNodesRef.current = contextNodes;
    }
  }, [contextNodes, setNodesState]);

  // Sync context edges to canvas when context actually changes
  useEffect(() => {
    if (contextEdges !== lastContextEdgesRef.current) {
      console.log('[SYNC] Context edges changed, updating canvas. New count:', contextEdges.length);
      setEdgesState(contextEdges || []);
      lastContextEdgesRef.current = contextEdges;
    }
  }, [contextEdges, setEdgesState]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const data = event.dataTransfer.getData('application/reactflow');

    if (data && reactFlowWrapperRef.current) {
      try {
        const node = JSON.parse(data);
        
        // Get the ReactFlow wrapper bounds
        const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
        
        // Calculate position - accounting for wrapper offset
        const position = {
          x: event.clientX - reactFlowBounds.left - 128,
          y: event.clientY - reactFlowBounds.top - 60
        };
        
        console.log('[DROP] Drop event with bounds:', {
          clientX: event.clientX,
          clientY: event.clientY,
          boundLeft: reactFlowBounds.left,
          boundTop: reactFlowBounds.top,
          calcX: position.x,
          calcY: position.y
        });

        const newNode = {
          ...node,
          position,
          type: 'workflow'
        };

        console.log('[DROP] Adding node with position:', newNode.position);
        // Add to context (which will trigger sync via useEffect)
        addNode(newNode);
      } catch (err) {
        console.error('Error parsing dropped node:', err);
      }
    }
  }, [addNode]);

  // Handle node changes from ReactFlow
  const onNodesChange = useCallback((changes) => {
    console.log('[CHANGE] Node changes:', changes);
    
    // Filter out removal changes - don't allow deleting via canvas
    const relevantChanges = changes.filter(change => change.type !== 'remove');
    
    if (relevantChanges.length === 0) {
      console.log('[CHANGE] No relevant changes, skipping');
      return;
    }
    
    // Update canvas state
    setNodesState(nds => {
      const updated = applyNodeChanges(relevantChanges, nds);
      console.log('[CHANGE] Canvas nodes after change:', updated);
      return updated;
    });
    
    // Sync position changes back to context
    const positionChanges = relevantChanges.filter(c => c.type === 'position');
    if (positionChanges.length > 0) {
      console.log('[CHANGE] Syncing position changes to context:', positionChanges);
      setContextNodes(current => {
        const updated = current.map(node => {
          const change = positionChanges.find(c => c.id === node.id);
          if (change && change.position) {
            // Ensure position is always within viewable bounds
            return {
              ...node,
              position: {
                x: change.position.x,
                y: change.position.y
              }
            };
          }
          return node;
        });
        console.log('[CHANGE] Context nodes after sync:', updated);
        return updated;
      });
    }
  }, [setContextNodes, setNodesState]);

  // Ignore edge changes
  const onEdgesChange = useCallback(() => {
    // Do nothing - edges managed via context only
  }, []);

  // Handle new edge connections
  const onConnect = useCallback((connection) => {
    const newEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}-${Date.now()}`,
      animated: true,
      style: { stroke: '#059669', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' },
      type: 'smoothstep'
    };
    const updatedEdges = addEdge(newEdge, edgesState);
    setEdgesState(updatedEdges);
    setContextEdges(updatedEdges);
  }, [edgesState, setContextEdges, addEdge]);

  return (
    <div 
      ref={reactFlowWrapperRef}
      className="flex-1 w-full h-full bg-gradient-to-br from-green-50 to-green-100 relative cursor-default" 
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
        <Background color="#059669" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {showHelpWindow && (
        <div className="absolute bottom-24 left-6 bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600 text-sm max-w-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-bold text-gray-900 flex items-center gap-2 flex-1">
            <span className="text-lg">🔗</span> How to Connect:
          </p>
          <button
            onClick={() => setShowHelpWindow(false)}
            className="text-gray-400 hover:text-gray-600 transition p-0.5"
            title="Close help window"
          >
            <X size={18} />
          </button>
        </div>
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
      )}
    </div>
  );
};
