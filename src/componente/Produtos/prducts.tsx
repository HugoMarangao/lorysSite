// src/componente/Produtos/products.ts
export const products = [
  {
    id: 1,
    name: 'Calça (Jeans) Pantalona',
    price: 'R$ 139,99',
    images: ['/images/Banner/banner3.png', '/images/Banner/banner3.png', '/images/Banner/banner3.png'],
    colors: [
      { name: 'Jeans Branca', color: '#f5f5f5', image: '/images/Banner/banner3.png' },
      { name: 'Jeans Claro', color: '#d4e6f1', image: '/images/Banner/banner3.png' },
      { name: 'Jeans Escuro', color: '#5d6d7e', image: '/images/Banner/banner3.png' },
      { name: 'Jeans Preto', color: '#212f3d', image: '/images/Banner/banner3.png' },
    ],
    sizes: ['40', '20', '30'],
    description: 'Calça pantalona feita em jeans com bolsos frontais e traseiros. Cintura alta e modelagem ampla.',
    discount: 'R$ 159,99',
  },
  {
    id: 2,
    name: 'Calça (Jeans) Reta de Cintura Alta',
    price: 'R$ 159,99',
    images: ['/images/Banner/banner3.png', '/images/Banner/banner3.png', '/images/Banner/banner3.png'],
    colors: [
      { name: 'Jeans Branca', color: '#f5f5f5', image: '/images/Banner/banner3.png' },
      { name: 'Jeans Claro', color: '#d4e6f1', image: '/images/Banner/banner3.png' },
    ],
    sizes: ['40', '20', '30'],
    description: 'Calça reta de cintura alta feita em jeans com bolsos frontais e traseiros.',
  },
  {
    id: 3,
    name: 'Macaquinho (Floral) com Babado',
    price: 'R$ 39,99',
    discount: 'R$ 44,98',
    images: ['/images/Banner/banner3.png', '/images/Banner/banner3.png', '/images/Banner/banner3.png'],
    colors: [
      { name: 'Floral', color: '#ff69b4', image: '/images/colors/floral.png' },
    ],
    sizes: ['P', 'M', 'G'],
    description: 'Macaquinho floral com babado, perfeito para o verão.',
  },
  {
    id: 4,
    name: 'Blusa com Ombros Vazados (Preto)',
    price: 'R$ 39,99',
    images: ['/images/Banner/banner3.png', '/images/Banner/banner3.png', '/images/Banner/banner3.png'],
    colors: [
      { name: 'Preto', color: '#000000', image: '/images/Banner/banner3.png' },
    ],
    sizes: ['P', 'M', 'G'],
    description: 'Blusa preta com ombros vazados, estilo moderno e casual.',
  },
  {
    id: 5,
    name: 'Vestido (Preto e Marrom) com Torção',
    price: 'R$ 44,99',
    discount: 'R$ 59,99',
    images: ['/images/Banner/banner3.png', '/images/Banner/banner3.png', '/images/Banner/banner3.png'],
    colors: [
      { name: 'Preto', color: '#000000', image: '/images/Banner/banner3.png' },
      { name: 'Marrom', color: '#8b4513', image: '/images/Banner/banner3.png' },
    ],
    sizes: ['P', 'M', 'G'],
    description: 'Vestido preto e marrom com detalhe de torção na cintura.',
  },
];
