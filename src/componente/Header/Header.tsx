'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configuracao/Firebase/firebaseConf';
import { useRouter } from 'next/navigation';
import CartDrawer from './sacola/cartDrawer';

interface Category {
  id: string;
  name: string;
}

interface SubcategoryDoc {
  name: string;
  parentCategory: string[];
}

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const suggestions = useMemo(
    () =>
      ['Vestidos', 'Vestido Lilica', 'Vestido Longo'].filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const [menuOpenMobile, setMenuOpenMobile] = useState(false);
  const [menuOpenDesktop, setMenuOpenDesktop] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subMap, setSubMap] = useState<Record<string, string[]>>({});

  const router = useRouter();
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function loadCategoriesAndSubs() {
      // fetch all categories
      const catSnap = await getDocs(collection(db, 'categories'));
      const cats: Category[] = catSnap.docs.map((d) => ({
        id: d.id,
        name: (d.data().name as string) || '',
      }));
      setCategories(cats);

      // fetch all subcategories in one go
      const subSnap = await getDocs(collection(db, 'subcategories'));
      const map: Record<string, string[]> = {};
      subSnap.docs.forEach((d) => {
        const data = d.data() as SubcategoryDoc;
        (data.parentCategory || []).forEach((catId) => {
          if (!map[catId]) map[catId] = [];
          map[catId].push(data.name);
        });
      });
      setSubMap(map);
    }
    loadCategoriesAndSubs();
  }, []);

  const {
    femininoSubcategories,
    masculinoSubcategories,
    plusSizeSubcategories,
    marcasSubcategories,
    novidadesSubcategories,
    promocoesSubcategories,
  } = useMemo(() => {
    const get = (name: string) => {
      const cat = categories.find((c) => c.name === name);
      return (cat && subMap[cat.id]) || [];
    };
    return {
      femininoSubcategories: get('Feminino'),
      masculinoSubcategories: get('Masculino'),
      plusSizeSubcategories: get('Plus Size'),
      marcasSubcategories: get('Marcas'),
      novidadesSubcategories: get('Novidades'),
      promocoesSubcategories: get('Promoções'),
    };
  }, [categories, subMap]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleUserClickMobile = useCallback(() => {
    if (!user) {
      router.push('/login');
    } else {
      setMenuOpenMobile((open) => !open);
    }
  }, [user, router]);

  const handleUserClickDesktop = useCallback(() => {
    if (!user) {
      router.push('/login');
    } else {
      setMenuOpenDesktop((open) => !open);
    }
  }, [user, router]);

  const handleLogout = useCallback(async () => {
    await logout();
    setMenuOpenMobile(false);
    setMenuOpenDesktop(false);
  }, [logout]);

  const handleCategoryClick = useCallback(
    (categoryName: string, subcategoryName?: string) => {
      const base = `/categoria/${categoryName.toLowerCase()}`;
      const url = subcategoryName
        ? `${base}?subcategoria=${subcategoryName.toLowerCase()}`
        : base;
      router.push(url);
    },
    [router]
  );

  const handleCartClick = useCallback(() => setIsCartOpen(true), []);
  const handleCartClose = useCallback(() => setIsCartOpen(false), []);

  const totalPrice = useMemo(() => {
    const sum = cart.reduce((acc, item) => {
      const raw = item.promotion?.trim()
        ? item.promotion
        : item.price;
      let str = raw.replace('R$', '').trim();
      if (str.includes(',')) {
        str = str.replace(/\./g, '').replace(',', '.');
      }
      const val = parseFloat(str);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    return sum.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [cart]);

  return (
    <header className="bg-black text-white">
      {/* Barra de notificação */}
      <div className="bg-red-400 text-black text-center py-1 text-sm">
        Frete Grátis R$99* Sul e Sudeste - Cupom HOJESIM
      </div>

      {/* Header Mobile */}
      <div className="flex justify-between items-center px-4 py-2 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <FiMenu size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Categorias</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => handleCategoryClick(c.name)}
              >
                {c.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Feminino</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {femininoSubcategories.map((sub, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => handleCategoryClick('Feminino', sub)}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Masculino</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {masculinoSubcategories.map((sub, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => handleCategoryClick('Masculino', sub)}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Plus Size</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {plusSizeSubcategories.map((sub, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => handleCategoryClick('Plus Size', sub)}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Marcas</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {marcasSubcategories.map((sub, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => handleCategoryClick('Marcas', sub)}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Novidades</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {novidadesSubcategories.map((sub, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => handleCategoryClick('Novidades', sub)}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Promoções</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {promocoesSubcategories.map((sub, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => handleCategoryClick('Promoções', sub)}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/" className="flex-1 text-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={50}
            className="mx-auto"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {!user ? (
            <Button variant="ghost" onClick={handleUserClickMobile}>
              <FiUser size={20} />
            </Button>
          ) : (
            <DropdownMenu
              open={menuOpenMobile}
              onOpenChange={setMenuOpenMobile}
            >
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
                <DropdownMenuItem onClick={handleLogout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost">
            <FiHeart size={20} />
          </Button>
          <Button variant="ghost" onClick={handleCartClick}>
            <FiShoppingBag size={20} />
          </Button>
        </div>
      </div>

      {/* Search Mobile */}
      <div className="flex items-center rounded-full px-4 py-1 mx-4 mb-4 md:hidden">
        <Input
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow bg-white text-black rounded-full outline-none"
        />
      </div>

      {/* Header Desktop */}
      <div className="hidden md:flex flex-col items-center p-4">
        <div className="flex justify-between w-full max-w-screen-xl items-center">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={50}
            />
          </Link>
          <div className="flex items-center gap-4 flex-grow max-w-[600px]">
            <div className="flex-grow relative">
              <Input
                placeholder="O que você procura?"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white text-black w-full rounded-full px-4 py-2"
              />
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <FiSearch size={20} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!user && (
              <Button variant="ghost" onClick={handleUserClickDesktop}>
                <FiUser size={20} />
              </Button>
            )}
            {user && (
              <DropdownMenu
                open={menuOpenDesktop}
                onOpenChange={setMenuOpenDesktop}
              >
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
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost">
              <FiHeart size={20} />
            </Button>
            <Button variant="ghost" onClick={handleCartClick}>
              <FiShoppingBag size={20} />
              <span className="ml-1">{`R$ ${totalPrice}`}</span>
            </Button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="mt-2 flex justify-center gap-6 flex-wrap md:justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Categorias</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {categories.map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => handleCategoryClick(c.name)}
                >
                  {c.name}
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
                  {femininoSubcategories.map((sub, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => handleCategoryClick('Feminino', sub)}
                      className="text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {sub}
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
                  {masculinoSubcategories.map((sub, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => handleCategoryClick('Masculino', sub)}
                      className="text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {sub}
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
                  {plusSizeSubcategories.map((sub, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => handleCategoryClick('Plus Size', sub)}
                      className="text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {sub}
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
              {marcasSubcategories.map((sub, i) => (
                <DropdownMenuItem key={i} asChild>
                  <Link href={`/marcas/${sub.toLowerCase()}`}>{sub}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Novidades</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {novidadesSubcategories.map((sub, i) => (
                <DropdownMenuItem key={i} asChild>
                  <Link href={`/novidades/${sub.toLowerCase()}`}>{sub}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Promoções</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-full md:min-w-[200px]">
              {promocoesSubcategories.map((sub, i) => (
                <DropdownMenuItem key={i} asChild>
                  <div className="flex justify-between items-center">
                    <span>{sub}</span>
                    <Image
                      src="/images/Banner/banner3.png"
                      alt={sub}
                      width={50}
                      height={50}
                    />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
    </header>
  );
};

export default React.memo(Header);