import { gql, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { Layout } from '../../components/Layout';

const AllProductQuery = gql`
  query {
    products {
      id
      name
      price
      remarks
      updatedAt
      createdAt
    }
  }
`;

const GraphQL: NextPage = () => {
  const { data: products, loading: productsLoading } =
    useQuery(AllProductQuery);
  if (productsLoading) {
    return <div>loading</div>;
  }
  console.log('products: ', products);
  return (
    <Layout>
      {products.products.map((product: any) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </Layout>
  );
};

export default GraphQL;
