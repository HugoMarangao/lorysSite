'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { FiUser, FiHeart, FiShoppingBag, FiSearch, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '../../Configuracao/Context/AuthContext';
import { useCart } from '../../Configuracao/Context/CartContext';
import Image from 'next/image';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Configuracao/Firebase/firebaseConf';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [femininoSubcategories, setFemininoSubcategories] = useState<string[]>([]);
  const [masculinoSubcategories, setMasculinoSubcategories] = useState<string[]>([]);
  const [plusSizeSubcategories, setPlusSizeSubcategories] = useState<string[]>([]);
  const [marcasSubcategories, setMarcasSubcategories] = useState<string[]>([]);
  const [novidadesSubcategories, setNovidadesSubcategories] = useState<string[]>([]);
  const [promocoesSubcategories, setPromocoesSubcategories] = useState<string[]>([]);
  const router = useRouter();
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const fetchCategories = async () => {
    const categoryCollection = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoryCollection);
    const categoryList = categorySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
    setCategories(categoryList);
  };

  const fetchSubcategories = async (categoryName: string, setSubcategories: React.Dispatch<React.SetStateAction<string[]>>) => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (category) {
      const subcategoryQuery = query(
        collection(db, 'subcategories'),
        where('parentCategory', 'array-contains', category.id)
      );
      const subcategorySnapshot = await getDocs(subcategoryQuery);
      const subcategoryList = subcategorySnapshot.docs.map((doc) => doc.data().name);
      setSubcategories(subcategoryList);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories('Feminino', setFemininoSubcategories);
    fetchSubcategories('Masculino', setMasculinoSubcategories);
    fetchSubcategories('Plus Size', setPlusSizeSubcategories);
    fetchSubcategories('Marcas', setMarcasSubcategories);
    fetchSubcategories('Novidades', setNovidadesSubcategories);
    fetchSubcategories('Promoções', setPromocoesSubcategories);
  }, [categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSuggestions(["Vestidos", "Vestido Lilica", "Vestido Longo"]); // Exemplo simplificado
  };

  const handleUserClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  const handleCategoryClick = (categoryName: string, subcategoryName?: string) => {
    const basePath = `/categoria/${categoryName.toLowerCase()}`;
    const url = subcategoryName ? `${basePath}?subcategoria=${subcategoryName.toLowerCase()}` : basePath;
    router.push(url);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
      return total + price;
    }, 0).toFixed(2).replace('.', ',');
  };

  return (
    <header className="bg-black text-white">
      {/* Barra de notificação */}
      <div className="bg-red-400 text-black text-center py-1 text-sm">
        Frete Grátis R$99* Sul e Sudeste - Cupom HOJESIM
      </div>
      
      {/* Header para mobile */}
      <div className="flex justify-between items-center px-4 py-2 md:hidden">
        {/* Menu Hamburger com Categorias */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <FiMenu size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Categorias</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} onClick={() => handleCategoryClick(category.name)}>
                {category.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Feminino</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {femininoSubcategories.map((subcategory, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCategoryClick('Feminino', subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Masculino</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {masculinoSubcategories.map((subcategory, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCategoryClick('Masculino', subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Plus Size</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {plusSizeSubcategories.map((subcategory, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCategoryClick('Plus Size', subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Marcas</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {marcasSubcategories.map((subcategory, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCategoryClick('Marcas', subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Novidades</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {novidadesSubcategories.map((subcategory, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCategoryClick('Novidades', subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Promoções</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {promocoesSubcategories.map((subcategory, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleCategoryClick('Promoções', subcategory)}
                  >
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo Centralizado */}
        <Link href="/" className="flex-1 text-center">
          <Image src="/images/logo.png" alt="Logo" width={100} height={50} className="mx-auto" />
        </Link>

        {/* Ícones do lado direito */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <Button variant="ghost" onClick={handleUserClick}>
              <FiUser size={20} />
            </Button>
          ) : (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <FiUser size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/meus-dados">Meus Dados</Link>
                </DropdownMenuItem>
                {user.type === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/relatorio">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost">
            <FiHeart size={20} />
          </Button>
          <Button variant="ghost">
            <FiShoppingBag size={20} />
          </Button>
        </div>
      </div>

      {/* Barra de Pesquisa para Mobile com espaçamento adicional */}
      <div className="flex items-center rounded-full px-4 py-1 mx-4 mb-4 md:hidden">
        <Input
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow bg-white text-black rounded-full outline-none"
        />
      </div>

      {/* Layout para desktop */}
      <div className="hidden md:flex flex-col items-center p-4">
        <div className="flex justify-between w-full max-w-screen-xl items-center">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={100} height={50} />
          </Link>
          <div className="flex items-center gap-4 flex-grow max-w-[600px]">
            <div className="flex-grow relative">
              <Input
                placeholder="O que você procura?"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white text-black w-full rounded-full px-4 py-2"
              />
              <Button variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <FiSearch size={20} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!user && (
              <Button variant="ghost" onClick={handleUserClick}>
                <FiUser size={20} />
              </Button>
            )}
            {user && (
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <FiUser size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/meus-dados">Meus Dados</Link>
                  </DropdownMenuItem>
                  {user.type === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/relatorio">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost">
              <FiHeart size={20} />
            </Button>
            <Button variant="ghost">
              <FiShoppingBag size={20} />
              <span className="ml-1">{`R$ ${getTotalPrice()}`}</span>
            </Button>
          </div>
        </div>
        <nav className="mt-2 flex justify-center gap-6 flex-wrap md:justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Categorias</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} onClick={() => handleCategoryClick(category.name)}>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Feminino</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col md:flex-row min-w-full md:min-w-[400px] p-4 bg-white shadow-lg rounded-lg">
              <div className="flex-1">
                <ul className="space-y-2">
                  {femininoSubcategories.map((subcategory, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleCategoryClick('Feminino', subcategory)}
                      className="text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 pl-4 hidden md:block">
                <Image
                  src="/images/Banner/banner3.png"
                  alt="Moda Feminina"
                  width={350}
                  height={350}
                  className="rounded-lg object-cover"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Masculino</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col md:flex-row min-w-full md:min-w-[400px] p-4 bg-white shadow-lg rounded-lg">
              <div className="flex-1">
                <ul className="space-y-2">
                  {masculinoSubcategories.map((subcategory, index) => (
                    <DropdownMenuItem key={index} className="text-sm hover:bg-gray-100">
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 pl-4 hidden md:block">
                <Image 
                  src="/images/Banner/banner3.png" 
                  alt="Moda Masculina" 
                  width={350} 
                  height={350} 
                  className="rounded-lg object-cover"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Plus Size</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col md:flex-row min-w-full md:min-w-[400px] p-4 bg-white shadow-lg rounded-lg">
              <div className="flex-1">
                <ul className="space-y-2">
                  {plusSizeSubcategories.map((subcategory, index) => (
                    <DropdownMenuItem key={index} className="text-sm hover:bg-gray-100">
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 pl-4 hidden md:block">
                <Image 
                  src="/images/Banner/banner3.png" 
                  alt="Plus Size" 
                  width={350} 
                  height={350} 
                  className="rounded-lg object-cover"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Marcas</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {marcasSubcategories.map((subcategory, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link href={`/marcas/${subcategory.toLowerCase()}`}>{subcategory}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Novidades</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {novidadesSubcategories.map((subcategory, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link href={`/novidades/${subcategory.toLowerCase()}`}>{subcategory}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Promoções</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {promocoesSubcategories.map((subcategory, index) => (
                <DropdownMenuItem key={index} asChild>
                  <div className="flex justify-between items-center">
                    <span>{subcategory}</span>
                    <Image src="/images/Banner/banner3.png" alt={subcategory} width={50} height={50} />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;