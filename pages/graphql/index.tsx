import { gql, useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { Layout } from '../../components/Layout';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, TextareaAutosize, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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

const CreateProductMutation = gql`
  mutation CreateProduct($name: String!, $price: String!, $remarks: String) {
    createProduct(name: $name, price: $price, remarks: $remarks) {
      id
      name
      price
      remarks
    }
  }
`;

const errorMessages = {
  required: (attribute: string) => `${attribute}は必須項目です`,
  max: (attribute: string, max: number) =>
    `${attribute}は${max}文字以下で入力してください`,
};
const validationSchema = yup.object({
  name: yup
    .string()
    .required(errorMessages.required('name'))
    .max(100, errorMessages.max('price', 100)),
  price: yup
    .string()
    .required(errorMessages.required('price'))
    .max(50, errorMessages.max('price', 50)),
  remarks: yup.string().max(30000, errorMessages.max('remarks', 30000)),
});

const GraphQL: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: addProductValidateErrors },
    reset,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: undefined,
    resolver: yupResolver(validationSchema),
  });
  const { data: products, loading: productsLoading } =
    useQuery(AllProductQuery);

  const [createProduct, { error: addProductError }] = useMutation(
    CreateProductMutation,
    { refetchQueries: [AllProductQuery] }
  );

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

  const addProduct = async (_data: any) => {
    console.log(_data);

    const { name, price, remarks } = _data;
    if ([name, price, remarks].some((value) => typeof value === 'undefined')) {
      return;
    }
    await createProduct({ variables: { name, price, remarks } });
  };

  console.log('products: ', products);
  return (
    <>
      <Layout>
        <h2>CREATE</h2>
        <div style={{ height: 400, width: '80vw' }}>
          <form>
            <TextField
              label='name'
              variant='outlined'
              sx={{ width: 1, marginBottom: 1 }}
              {...register('name' as never, { max: 100 })}
              required
              error={'name' in addProductValidateErrors}
              helperText={(addProductValidateErrors as any).name?.message}
            ></TextField>
            <TextField
              label='price'
              variant='outlined'
              sx={{ width: 1, marginBottom: 1 }}
              {...register('price' as never, { max: 50 })}
              required
              error={'price' in addProductValidateErrors}
              helperText={(addProductValidateErrors as any).price?.message}
            ></TextField>
            <TextField
              label='remarks'
              variant='outlined'
              multiline
              rows={5}
              sx={{ width: 1, marginBottom: 1 }}
              {...register('remarks' as never, { max: 30000 })}
              error={'remarks' in addProductValidateErrors}
              helperText={(addProductValidateErrors as any).remarks?.message}
            ></TextField>
            <Button
              sx={{ float: 'right' }}
              variant='contained'
              onClick={handleSubmit(addProduct)}
            >
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
