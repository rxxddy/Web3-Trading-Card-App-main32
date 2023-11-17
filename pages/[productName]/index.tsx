// pages/[productName]/index.tsx
import { useRouter } from 'next/router';
import ProductPage from '../../components/ProductPage';

const DynamicProductPage = () => {
  const router = useRouter();
  console.log('Router query:', router.query);

  return <ProductPage />;
};

export default DynamicProductPage;