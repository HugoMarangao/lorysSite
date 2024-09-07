'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { collection, getDocs, query, where, Query } from 'firebase/firestore';
import { db } from '../../../Configuracao/Firebase/firebaseConf';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import Header from '@/componente/Header/Header';
import BannerPrincipal from '@/componente/BannerPrincipal/BannerPrincipal';

// Interface para os produtos
interface Product {
  id: string;
  name: string;
  price: string;
  promotion: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description: string;
  selectedCategories: string[];
  selectedSubcategories: string[];
}

// Interface para os banners
interface Banner {
  id: string;
  link: string;
  image: string;
}

const CategoriaPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoria = pathname.split('/').pop()?.toLowerCase() || ''; // Normaliza para minúsculas
  const subcategoria = searchParams.get('subcategoria')?.toLowerCase(); // Normaliza para minúsculas

  // Função para buscar produtos do Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productsQuery: Query = query(
          collection(db, 'products'),
          where('selectedCategories', 'array-contains-any', [categoria, categoria.charAt(0).toUpperCase() + categoria.slice(1)])
        );

        if (subcategoria) {
          productsQuery = query(
            productsQuery,
            where('selectedSubcategories', 'array-contains-any', [subcategoria, subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1)])
          );
        }

        const querySnapshot = await getDocs(productsQuery);
        const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(productsList);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, [categoria, subcategoria]);

  // Função para buscar banners do Firestore
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerSnapshot = await getDocs(collection(db, 'banners'));
        const bannersData = bannerSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            link: data.link || '',
            image: data.image || ''
          };
        }) as Banner[];
        setBanners(bannersData);
      } catch (error) {
        console.error("Erro ao buscar banners:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div>
      <Header />
      <BannerPrincipal banners={banners} />
      {/* Filtros e Ordenar no topo para mobile, layout flexível para desktop */}
      <div className="flex flex-col md:flex-row">
        {/* Dropdown de filtros e botão de ordenar no mobile */}
        <div className="p-4 md:hidden flex justify-between items-center border-b">
          {/* Dropdown de Ordenar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Ordenar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Ordenar por</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['MAIS VENDIDOS', 'OFERTAS', 'MENOR PREÇO', 'MAIOR PREÇO'].map((label, index) => (
                    <DropdownMenuItem key={index}>
                      <Checkbox id={`ordenar-${index}`} />
                      <label htmlFor={`ordenar-${index}`} className="ml-2 text-sm">{label}</label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu> 

          {/* Dropdown de Filtrar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Coleções</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['COLECAO ABRIL - MASCARAS', 'COLECAO NOVEMBRO 2020', 'CONTEMPORANIA', 'CORPORE LIFE'].map((label, index) => (
                    <DropdownMenuItem key={index}>
                      <Checkbox id={`colecao-${index}`} />
                      <label htmlFor={`colecao-${index}`} className="ml-2 text-sm">{label}</label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Gêneros</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['ACESSÓRIOS', 'ATIVA', 'CAMISA', 'CONTA PAI', 'FEMININO', 'INFANTIL'].map((label, index) => (
                    <DropdownMenuItem key={index}>
                      <Checkbox id={`genero-${index}`} />
                      <label htmlFor={`genero-${index}`} className="ml-2 text-sm">{label}</label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Categorias</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['BATA', 'BERMUDA', 'BLAZER', 'BLUSA', 'CALÇA', 'CAMISA'].map((label, index) => (
                    <DropdownMenuItem key={index}>
                      <Checkbox id={`categoria-${index}`} />
                      <label htmlFor={`categoria-${index}`} className="ml-2 text-sm">{label}</label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Tamanhos</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Checkbox id="tamanho-1" />
                    <label htmlFor="tamanho-1" className="ml-2 text-sm">UG MLT1343638RG10245/56638G1</label>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Cores</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Button variant="link" size="sm">Mais Cores</Button>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Preços</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['DE R$0,00 A R$25,00', 'DE R$25,00 A R$50,00', 'DE R$50,00 A R$75,00'].map((label, index) => (
                    <DropdownMenuItem key={index}>
                      <Checkbox id={`preco-${index}`} />
                      <label htmlFor={`preco-${index}`} className="ml-2 text-sm">{label}</label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filtros à esquerda no desktop */}
        <div className="hidden md:block md:w-64 p-4 border-r border-gray-200">
          <Accordion type="single" collapsible>
            {/* Coleções */}
            <AccordionItem value="colecoes">
              <AccordionTrigger>Coleções</AccordionTrigger>
              <AccordionContent>
                {['COLECAO ABRIL - MASCARAS', 'COLECAO NOVEMBRO 2020', 'CONTEMPORANIA', 'CORPORE LIFE'].map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`colecao-${index}`} />
                    <label htmlFor={`colecao-${index}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Gêneros */}
            <AccordionItem value="generos">
              <AccordionTrigger>Gêneros</AccordionTrigger>
              <AccordionContent>
                {['ACESSÓRIOS', 'ATIVA', 'CAMISA', 'CONTA PAI', 'FEMININO', 'INFANTIL'].map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`genero-${index}`} />
                    <label htmlFor={`genero-${index}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Categorias */}
            <AccordionItem value="categorias">
              <AccordionTrigger>Categorias</AccordionTrigger>
              <AccordionContent>
                {['BATA', 'BERMUDA', 'BLAZER', 'BLUSA', 'CALÇA', 'CAMISA'].map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`categoria-${index}`} />
                    <label htmlFor={`categoria-${index}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Tamanhos */}
            <AccordionItem value="tamanhos">
              <AccordionTrigger>Tamanhos</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tamanho-1" />
                  <label htmlFor="tamanho-1" className="text-sm">UG MLT1343638RG10245/56638G1</label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Cores */}
            <AccordionItem value="cores">
              <AccordionTrigger>Cores</AccordionTrigger>
              <AccordionContent>
                <Button variant="link" size="sm">Mais Cores</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Preços */}
            <AccordionItem value="precos">
              <AccordionTrigger>Preços</AccordionTrigger>
              <AccordionContent>
                {['DE R$0,00 A R$25,00', 'DE R$25,00 A R$50,00', 'DE R$50,00 A R$75,00', 'DE R$75,00 A R$100,00', 'ACIMA DE R$100,00'].map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`preco-${index}`} />
                    <label htmlFor={`preco-${index}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            {/* Ordenar */}
            <AccordionItem value="ordenar">
              <AccordionTrigger>Ordenar</AccordionTrigger>
              <AccordionContent>
                {['MAIS VENDIDOS', 'OFERTAS', 'MENOR PREÇO', 'MAIOR PREÇO'].map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`ordenar-${index}`} />
                    <label htmlFor={`ordenar-${index}`} className="text-sm">{label}</label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          
          </Accordion>
          
        </div>

        {/* Lista de produtos à direita no desktop, abaixo dos filtros em mobile */}
        <div className="flex-1 p-4">
          {/* Ajuste do grid para 2 colunas em mobile */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="border p-4 rounded-md">
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                  <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                  {product.promotion ? (
                    <>
                      <p className="text-gray-500 line-through">R$ {parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-red-500 font-bold">R$ {parseFloat(product.promotion).toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">R$ {parseFloat(product.price).toFixed(2)}</p>
                  )}
                  <div className="flex space-x-1 mt-2">
                    {product.colors.map((color, index) => (
                      <span key={index} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></span>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {product.sizes.map((size, index) => (
                      <span key={index} className="text-sm border px-2 py-1 rounded">{size}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriaPage;