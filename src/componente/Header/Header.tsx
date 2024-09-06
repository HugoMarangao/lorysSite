'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FiUser, FiHeart, FiShoppingBag, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '../../Configuracao/Context/AuthContext';
import { useCart } from '../../Configuracao/Context/CartContext';
import Image from 'next/image';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Configuracao/Firebase/firebaseConf';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [femininoSubcategories, setFemininoSubcategories] = useState<string[]>([]);
  const [masculinoSubcategories, setMasculinoSubcategories] = useState<string[]>([]);
  const [plusSizeSubcategories, setPlusSizeSubcategories] = useState<string[]>([]);
  const [marcasSubcategories, setMarcasSubcategories] = useState<string[]>([]);
  const [novidadesSubcategories, setNovidadesSubcategories] = useState<string[]>([]);
  const [promocoesSubcategories, setPromocoesSubcategories] = useState<string[]>([]);

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

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
      return total + price;
    }, 0).toFixed(2).replace('.', ',');
  };

  return (
    <header className="bg-black text-white p-4 flex flex-col items-center">
      <div className="flex justify-between w-full max-w-screen-xl">
        <Link href="/">
          <Image src="/images/logo.png" alt="Logo" width={100} height={50} />
        </Link>
        <div className="flex items-center gap-4">
          <Input
            placeholder="O que você procura?"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white text-black"
          />
          <Button variant="ghost" className="ml-2">
            <FiSearch size={20} />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <FiUser size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/meus-dados">Meus Dados</Link>
                  </DropdownMenuItem>
                  {user.type == 'admin' ?  <DropdownMenuItem asChild>
                    <Link href="/relatorio">Dashboard</Link> 
                  </DropdownMenuItem> : <></>}
                  <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login">Entrar</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost">
            <FiHeart size={20} />
          </Button>
          <Button variant="ghost">
            <FiShoppingBag size={20} />
            <span className="ml-1">{`R$ ${getTotalPrice()}`}</span>
          </Button>
        </div>
      </div>
      <nav className="mt-2 flex justify-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Categorias</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link href={`/categoria/${category.name.toLowerCase()}`}>{category.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Feminino</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex min-w-[400px] p-4 bg-white shadow-lg rounded-lg">
              <div className="flex-1">
                <ul className="space-y-2">
                  {femininoSubcategories.map((subcategory, index) => (
                    <DropdownMenuItem key={index} className="text-sm hover:bg-gray-100">
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 pl-4">
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


        {/* Outros dropdowns para Masculino, Plus Size, Marcas, Novidades, Promoções */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Masculino</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex min-w-[400px] p-4 bg-white shadow-lg rounded-lg">
              <div className="flex-1">
                <ul className="space-y-2">
                  {masculinoSubcategories.map((subcategory, index) => (
                    <DropdownMenuItem key={index} className="text-sm hover:bg-gray-100">
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 pl-4">
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
              <Button variant="ghost">Plus Size</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex min-w-[400px] p-4 bg-white shadow-lg rounded-lg">
              <div className="flex-1">
                <ul className="space-y-2">
                  {plusSizeSubcategories.map((subcategory, index) => (
                    <DropdownMenuItem key={index} className="text-sm hover:bg-gray-100">
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 pl-4">
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
            <Button variant="ghost">Marcas</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
          <DropdownMenuContent>
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
          <DropdownMenuContent>
            {promocoesSubcategories.map((subcategory, index) => (
              <DropdownMenuItem key={index} asChild>
                 <div className="flex justify-between items-center">
                          <span>{subcategory}</span>
                          <Image src="/images/Banner/banner3.png" alt={subcategory} width={50} height={50} />
                        </div>              </DropdownMenuItem>
                ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
