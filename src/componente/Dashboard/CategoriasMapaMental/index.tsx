'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  OnConnect,
  Position,
  Handle,
} from 'react-flow-renderer';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../Configuracao/Firebase/firebaseConf';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import Sidebar from '@/componente/Dashboard/SideBar';

interface NodeData {
  label: string;
  type: 'category' | 'subcategory';
  parentCategory?: string[];
}

interface CustomNode extends Node<NodeData> {}

const initialNodes: CustomNode[] = [];
const initialEdges: Edge[] = [];

function CategoryMindMap() {
  const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [categoryName, setCategoryName] = useState('');
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [editingNode, setEditingNode] = useState<CustomNode | null>(null);
  const [newNodeLabel, setNewNodeLabel] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, 'categories'));
      const subcategorySnapshot = await getDocs(collection(db, 'subcategories'));

      const categoryList = categorySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        data: { label: doc.data().name, type: 'category' } as NodeData,
        position: { x: 100, y: index * 150 },
      }));

      const subcategoryList = subcategorySnapshot.docs.map((doc, index) => {
        const parentCategories = Array.isArray(doc.data().parentCategory)
          ? doc.data().parentCategory
          : [doc.data().parentCategory];

        const position = { x: 300, y: index * 150 };

        return {
          id: doc.id,
          data: { label: doc.data().name, type: 'subcategory', parentCategory: parentCategories } as NodeData,
          position,
        };
      });

      const edgesData = subcategoryList.flatMap((subcategory) =>
        subcategory.data.parentCategory!.map((parentCategory) => ({
          id: `e-${parentCategory}-${subcategory.id}`,
          source: parentCategory,
          target: subcategory.id,
          animated: true,
        }))
      );

      setNodes([...categoryList, ...subcategoryList]);
      setEdges(edgesData);
    };

    fetchCategories();
  }, []);

  const onConnect: OnConnect = async (params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));

    const targetNode = nodes.find((node) => node.id === params.target);
    if (targetNode && targetNode.data.type === 'subcategory') {
      const newParentCategory = params.source;

      await updateDoc(doc(db, 'subcategories', targetNode.id), {
        parentCategory: arrayUnion(newParentCategory),
      });

      const updatedNodes = nodes.map((node) =>
  node.id === targetNode.id
    ? { 
        ...node, 
        data: { 
          ...node.data, 
          parentCategory: [...(node.data.parentCategory?.filter((category) => category !== null) || []), newParentCategory] as string[]
        } 
      }
    : node
);

setNodes(updatedNodes as CustomNode[]);

    }
  };

  const handleNodeClick = (event: MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  };

  const handleNodeDoubleClick = (event: MouseEvent, node: CustomNode) => {
    setEditingNode(node);
    setNewNodeLabel(node.data.label);
  };

  const handleEditNode = async () => {
    if (!editingNode) return;

    const updatedNodes = nodes.map((node) =>
      node.id === editingNode.id ? { ...node, data: { ...node.data, label: newNodeLabel } } : node
    );

    if (editingNode.data.type === 'category') {
      await updateDoc(doc(db, 'categories', editingNode.id), { name: newNodeLabel });
    } else if (editingNode.data.type === 'subcategory') {
      await updateDoc(doc(db, 'subcategories', editingNode.id), { name: newNodeLabel });
    }

    setNodes(updatedNodes);
    setEditingNode(null);
  };

  const handleAddCategory = async () => {
    if (categoryName.trim() === '') return;

    const newNode: CustomNode = {
      id: `${Date.now()}`,
      data: { label: categoryName, type: 'category' },
      position: { x: 100, y: nodes.length * 150 },
    };

    const docRef = await addDoc(collection(db, 'categories'), { name: categoryName });
    newNode.id = docRef.id;

    setNodes((nds) => [...nds, newNode]);
    setCategoryName('');
  };

  const handleDeleteNode = async () => {
    if (!selectedNode) return;

    if (selectedNode.data.type === 'category') {
      await deleteDoc(doc(db, 'categories', selectedNode.id));
    } else if (selectedNode.data.type === 'subcategory') {
      await deleteDoc(doc(db, 'subcategories', selectedNode.id));
    }

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
  };

  const handleAddSubcategory = async (categoryId: string) => {
    const subcategoryName = prompt('Nome da subcategoria:');
    if (!subcategoryName) return;

    const newSubcategory: CustomNode = {
      id: `${Date.now()}`,
      data: { label: subcategoryName, type: 'subcategory', parentCategory: [categoryId] },
      position: { x: 300, y: nodes.findIndex((node) => node.id === categoryId) * 150 },
    };

    const docRef = await addDoc(collection(db, 'subcategories'), { name: subcategoryName, parentCategory: [categoryId] });
    newSubcategory.id = docRef.id;

    setNodes((nds) => [...nds, newSubcategory]);
    setEdges((eds) => [...eds, { id: `e-${categoryId}-${newSubcategory.id}`, source: categoryId, target: newSubcategory.id, animated: true }]);
  };

  const onNodeDragStop = async (_: MouseEvent, node: CustomNode) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
    );
    const collectionName = node.data.type === 'category' ? 'categories' : 'subcategories';
    await updateDoc(doc(db, collectionName, node.id), {
      position: node.position,
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <ReactFlowProvider>
        <div style={{ height: '100%', width: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onNodeDragStop={onNodeDragStop}
            fitView
            nodeTypes={{
              default: ({ data }) => (
                <div>
                  <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
                  <div>{data.label}</div>
                  <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
                  <Handle type="source" position={Position.Left} style={{ background: '#555' }} />
                  <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
                </div>
              ),
            }}
            connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
            snapToGrid
            snapGrid={[15, 15]}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <div className="controls" style={{ padding: '10px' }}>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nome da Categoria"
          />
          <Button onClick={handleAddCategory} variant="default">
            Adicionar Categoria
          </Button>
          {selectedNode && selectedNode.data.type === 'category' && (
            <Button onClick={() => handleAddSubcategory(selectedNode.id)} variant="secondary">
              Adicionar Subcategoria
            </Button>
          )}
          <Button onClick={handleDeleteNode} variant="default" disabled={!selectedNode}>
            Excluir
          </Button>
        </div>
        {editingNode && (
          <div className="edit-modal">
            <h3>Editando: {editingNode.data.label}</h3>
            <Input
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="Novo nome"
            />
            <Button onClick={handleEditNode} variant="default">
              Salvar
            </Button>
            <Button onClick={() => setEditingNode(null)} variant="secondary">
              Cancelar
            </Button>
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
}

export default CategoryMindMap;
