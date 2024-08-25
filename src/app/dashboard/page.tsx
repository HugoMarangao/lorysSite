'use client';
import React, { useState, useEffect } from 'react';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Sidebar from '@/componente/Dashboard/SideBar';
import { SketchPicker } from 'react-color';
import { db, storage } from '../../Configuracao/Firebase/firebaseConf';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import Image from 'next/image';
import { Edge } from 'react-flow-renderer';
import { Node } from 'react-flow-renderer'; 

interface NodeData {
  label: string;
  type: 'category' | 'subcategory';
  parentCategory?: string[];
}

type CustomNode = Node<NodeData>;

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <AddProduct />
          <AddCategory />
          <AddSubcategory />
          <AddBanner />
          <Link href="/categoriasmental">
          editar categoria
        </Link>
        </div>
      </div>
    </div>
  );
}

function AddCategory() {
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiPlusCircle size={24} className="text-gray-500" />
          <span className="text-lg font-medium text-gray-600">Nova Categoria</span>
        </div>
        <Dialog open={isCategoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            <DialogDescription>
              Preencha as informações para adicionar uma nova categoria ao seu catálogo.
            </DialogDescription>
            <CategoryForm />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

function AddBanner() {
  const [isBannerModalOpen, setBannerModalOpen] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiPlusCircle size={24} className="text-gray-500" />
          <span className="text-lg font-medium text-gray-600">Novo Banner</span>
        </div>
        <Dialog open={isBannerModalOpen} onOpenChange={setBannerModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogTitle>Adicionar Novo Banner</DialogTitle>
            <DialogDescription>
              Preencha as informações para adicionar um novo banner ao seu site.
            </DialogDescription>
            <BannerForm />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

function BannerForm() {
  const [bannerLink, setBannerLink] = useState('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerLink.trim() || !bannerImage) {
      setAlert({ message: 'O link e a imagem do banner são obrigatórios.', type: 'error' });
      return;
    }

    try {
      const bannerDoc = await addDoc(collection(db, 'banners'), { link: bannerLink });

      const storageRef = ref(storage, `banners/${bannerDoc.id}`);
      const snapshot = await uploadBytes(storageRef, bannerImage);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, 'banners', bannerDoc.id), { image: imageUrl });

      setAlert({ message: 'Banner adicionado com sucesso!', type: 'success' });
      setBannerLink('');
      setBannerImage(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Erro ao adicionar banner: ', error);
      setAlert({ message: 'Erro ao adicionar banner.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert.message && <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>{alert.message}</div>}
      <InputField label="Link do Banner" value={bannerLink} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setBannerLink(e.target.value)} />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Imagem do Banner</label>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-md h-auto flex items-center justify-center relative">
          <input type="file" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          {previewImage ? <Image src={previewImage} alt="Preview" className="w-full h-24 object-cover rounded-md" /> : <span className="text-gray-400">Clique ou arraste para adicionar uma imagem</span>}
        </div>
      </div>
      <div className="flex items-center justify-end mt-4">
        <Button type="submit" variant="default" className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md">
          Adicionar Banner
        </Button>
      </div>
    </form>
  );
}

function AddSubcategory() {
  const [isSubcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiPlusCircle size={24} className="text-gray-500" />
          <span className="text-lg font-medium text-gray-600">Nova Subcategoria</span>
        </div>
        <Dialog open={isSubcategoryModalOpen} onOpenChange={setSubcategoryModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogTitle>Adicionar Nova Subcategoria</DialogTitle>
            <DialogDescription>Preencha as informações para adicionar uma nova subcategoria ao seu catálogo.</DialogDescription>
            <SubcategoryForm />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

function CategoryForm() {
  const [categoryName, setCategoryName] = useState<string>('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setAlert({ message: 'O nome da categoria é obrigatório.', type: 'error' });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'categories'), { name: categoryName });

      // Crie o nó correspondente no mapa mental
      const newNode: CustomNode = {
        id: docRef.id,
        data: { label: categoryName, type: 'category' },
        position: { x: 100, y: Date.now() % 500 }, // Posição aleatória, você pode ajustar como necessário
      };

      // Aqui, você poderia salvar o nó em uma coleção "nodes" no Firestore ou atualizar o estado de algum contexto global, se aplicável.

      setAlert({ message: 'Categoria adicionada com sucesso!', type: 'success' });
      setCategoryName('');
    } catch (error) {
      console.error('Erro ao adicionar categoria: ', error);
      setAlert({ message: 'Erro ao adicionar categoria.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert.message && <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>{alert.message}</div>}
      <InputField label="Nome da Categoria" value={categoryName} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCategoryName(e.target.value)} />
      <div className="flex items-center justify-end mt-4">
        <Button type="submit" variant="default" className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md">
          Adicionar Categoria
        </Button>
      </div>
    </form>
  );
}


function SubcategoryForm() {
  const [subcategoryName, setSubcategoryName] = useState<string>('');
  const [parentCategory, setParentCategory] = useState<string>('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, 'categories'));
      const categoryList = categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as { name: string } }));
      setCategories(categoryList);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subcategoryName.trim() || !parentCategory.trim()) {
      setAlert({ message: 'Todos os campos são obrigatórios.', type: 'error' });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'subcategories'), { name: subcategoryName, parentCategory });

      // Crie o nó correspondente no mapa mental
      const newSubcategoryNode: CustomNode = {
        id: docRef.id,
        data: { label: subcategoryName, type: 'subcategory', parentCategory: [parentCategory] },
        position: { x: 300, y: Date.now() % 500 }, // Posição aleatória, você pode ajustar como necessário
      };

      // Crie a aresta conectando à categoria pai
      const newEdge: Edge = {
        id: `e-${parentCategory}-${docRef.id}`,
        source: parentCategory,
        target: docRef.id,
        animated: true,
      };

      // Aqui, você pode salvar o nó e a aresta no Firestore ou em um contexto global

      setAlert({ message: 'Subcategoria adicionada com sucesso!', type: 'success' });
      setSubcategoryName('');
      setParentCategory('');
    } catch (error) {
      console.error('Erro ao adicionar subcategoria: ', error);
      setAlert({ message: 'Erro ao adicionar subcategoria.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert.message && <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>{alert.message}</div>}
      <InputField label="Nome da Subcategoria" value={subcategoryName} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSubcategoryName(e.target.value)} />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Categoria Principal</label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-end mt-4">
        <Button type="submit" variant="default" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
          Adicionar Subcategoria
        </Button>
      </div>
    </form>
  );
}


function AddProduct() {
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; parentCategory: string }[]>([]);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      const categorySnapshot = await getDocs(collection(db, 'categories'));
      const subcategorySnapshot = await getDocs(collection(db, 'subcategories'));

      const categoryList = categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as { name: string } }));
      const subcategoryList = subcategorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as { name: string; parentCategory: string }
      }));

      setCategories(categoryList);
      setSubcategories(subcategoryList);
    };

    fetchCategoriesAndSubcategories();
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiPlusCircle size={24} className="text-gray-500" />
          <span className="text-lg font-medium text-gray-600">Novo Produto</span>
        </div>
        <Dialog open={isProductModalOpen} onOpenChange={setProductModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogDescription>Preencha as informações para adicionar um novo produto ao seu catálogo.</DialogDescription>
            <ProductForm categories={categories} subcategories={subcategories} />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

function ProductForm({ categories, subcategories }: { categories: { id: string; name: string }[]; subcategories: { id: string; name: string; parentCategory: string }[] }) {
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [promotion, setPromotion] = useState<string>('');
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [seoDescription, setSeoDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#fff');
  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleAddColor = () => {
    setColors([...colors, currentColor]);
    setDisplayColorPicker(false);
  };

  const handleRemoveColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleAddSize = (size: string) => {
    setSizes([...sizes, size]);
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !price.trim() || !category.trim() || !subcategory.trim() || !description.trim()) {
      setAlert({ message: 'Todos os campos obrigatórios devem ser preenchidos.', type: 'error' });
      return;
    }

    try {
      const productDoc = await addDoc(collection(db, 'products'), {
        name: productName,
        price,
        category,
        subcategory,
        promotion,
        seoTitle,
        seoDescription,
        description,
        colors,
        sizes,
      });

      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageBlob = await fetch(images[i]).then((r) => r.blob());
        const storageRef = ref(storage, `products/${productDoc.id}/${i}`);
        const snapshot = await uploadBytes(storageRef, imageBlob);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      await updateDoc(doc(db, 'products', productDoc.id), { images: imageUrls });

      setAlert({ message: 'Produto adicionado com sucesso!', type: 'success' });

      setProductName('');
      setPrice('');
      setCategory('');
      setSubcategory('');
      setPromotion('');
      setSeoTitle('');
      setSeoDescription('');
      setDescription('');
      setImages([]);
      setColors([]);
      setSizes([]);
    } catch (error) {
      console.error('Erro ao adicionar produto: ', error);
      setAlert({ message: 'Erro ao adicionar produto.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert.message && <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>{alert.message}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Imagens do Produto</label>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-md h-auto flex items-center justify-center relative">
          <input type="file" multiple onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          {images.length === 0 ? (
            <span className="text-gray-400">Clique ou arraste para adicionar imagens</span>
          ) : (
            <div className="grid grid-cols-3 gap-2 w-full">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt="Produto" className="w-full h-24 object-cover rounded-md" />
                  <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1" onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField label="Nome do Produto" value={productName} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setProductName(e.target.value)} />
        <InputField label="Preço" value={price} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPrice(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Categoria</label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Subcategoria</label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">Selecione uma subcategoria</option>
            {subcategories.filter((sub) => sub.parentCategory === category).map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField label="Promoção" value={promotion} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPromotion(e.target.value)} />
        <InputField label="Descrição" value={description} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Cores Disponíveis</label>
          <button type="button" onClick={() => setDisplayColorPicker(!displayColorPicker)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Escolher Cor
          </button>
          {displayColorPicker && (
            <div className="relative mt-2">
              <SketchPicker color={currentColor} onChangeComplete={(color) => setCurrentColor(color.hex)} />
              <Button onClick={handleAddColor} className="mt-2">
                Adicionar Cor
              </Button>
            </div>
          )}
          <div className="flex flex-wrap mt-2">
            {colors.map((color, index) => (
              <Badge key={index} style={{ backgroundColor: color }} className="text-white px-2 py-1 rounded-full mr-2 mb-2">
                {color}
                <button type="button" onClick={() => handleRemoveColor(color)} className="ml-2">
                  <FiTrash2 />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Tamanhos Disponíveis</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Adicionar Tamanho"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSize(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <div className="flex flex-wrap mt-2">
            {sizes.map((size, index) => (
              <Badge key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2">
                {size}
                <button type="button" onClick={() => handleRemoveSize(size)} className="ml-2">
                  <FiTrash2 />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField label="SEO Title" value={seoTitle} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSeoTitle(e.target.value)} />
        <TextareaField label="SEO Description" value={seoDescription} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSeoDescription(e.target.value)} />
      </div>

      <div className="flex items-center justify-end mt-4">
        <Button type="submit" variant="default" className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md">
          Adicionar Produto
        </Button>
      </div>
    </form>
  );
}

function InputField({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <Input {...props} />
    </div>
  );
}

function TextareaField({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <textarea {...props} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>
  );
}
