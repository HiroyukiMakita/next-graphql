import { gql, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { Layout } from '../../components/Layout';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, TextareaAutosize, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

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
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: undefined,
  });
  const { data: products, loading: productsLoading } =
    useQuery(AllProductQuery);

  const [innerWidth, updateInnerWidth] = useState(0);

  useEffect(() => {
    const onResize = () => {
      updateInnerWidth(window.innerWidth);
    };
    window.onload = onResize;
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', description: '採番', width: 70 },
    {
      field: 'name',
      headerName: 'name',
      description: '名前',
      width: innerWidth / 7,
    },
    {
      field: 'price',
      headerName: 'price',
      description: '料金',
      width: innerWidth / 7,
    },
    {
      field: 'remarks',
      headerName: 'remarks',
      description: '備考',
      width: innerWidth / 7,
      sortable: false,
    },
    {
      field: 'createdAt',
      headerName: 'created_at',
      description: '作成日時',
      width: innerWidth / 7,
    },
    {
      field: 'updatedAt',
      headerName: 'updated_at',
      description: '更新日時',
      width: innerWidth / 7,
    },
    {
      field: 'nameAndPrice',
      headerName: 'name(price)',
      description: 'name and price',
      sortable: false,
      width: innerWidth / 7,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.name || ''} (${params.row.price || ''})`,
    },
  ];

  if (productsLoading) {
    return <div>loading</div>;
  }

  const rows = products.products.map((product: any) => {
    return {
      id: product.id,
      name: product.name,
      price: `¥${Number(product.price).toLocaleString('ja')}`,
      remarks: product.remarks,
      createdAt: dayjs(Number(product.createdAt)).format('YYYY-MM-DD'),
      updatedAt: dayjs(Number(product.updatedAt)).format('YYYY-MM-DD'),
    };
  });

  const addProduct = async () => {};

  console.log('products: ', products);
  return (
    <>
      <Layout>
        <h2>CREATE</h2>
        <div style={{ height: 400, width: '80vw' }}>
          <form onSubmit={handleSubmit(addProduct)}>
            <TextField
              label='name'
              variant='outlined'
              sx={{ width: 1, marginBottom: 1 }}
              {...register('name' as never, { max: 100 })}
              required
            ></TextField>
            <TextField
              label='price'
              variant='outlined'
              sx={{ width: 1, marginBottom: 1 }}
              {...register('price' as never, { max: 50 })}
              required
            ></TextField>
            <TextField
              label='price'
              variant='outlined'
              multiline
              rows={5}
              sx={{ width: 1, marginBottom: 1 }}
              {...register('price' as never, { max: 30000 })}
            ></TextField>
            <Button sx={{ float: 'right' }} variant='contained'>
              ADD
            </Button>
          </form>
        </div>
        <h2>READ</h2>
        <div style={{ height: 400, width: '80vw' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Layout>
    </>
  );
};

export default GraphQL;
