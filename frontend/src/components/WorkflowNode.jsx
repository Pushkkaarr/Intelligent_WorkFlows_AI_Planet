import React from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export const WorkflowNode = ({ data, id }) => {
  const { removeNode } = useWorkflow();

  return (
    <div className="rounded-lg shadow-lg p-4 min-w-max">
      <div className="flex justify-between items-center gap-2">
        <div>
          <div className="font-bold text-sm">{data.label}</div>
          <div className="text-xs text-gray-600">{data.type}</div>
        </div>
        <button
          onClick={() => removeNode(id)}
          className="text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {data.type !== 'user_query' && (
        <Handle type="target" position={Position.Top} />
      )}
      
      {data.type !== 'output' && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
};
