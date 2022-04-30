import { DocumentNode, gql, useLazyQuery, useMutation } from '@apollo/client';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const ProductFindByIdQuery = gql`
  query productFindById($id: BigInt!) {
    productFindById(id: $id) {
      id
      name
      price
      remarks
      updatedAt
      createdAt
    }
  }
`;

const UpdateProductMutation = gql`
  mutation UpdateProduct(
    $id: BigInt!
    $name: String!
    $price: String!
    $remarks: String
  ) {
    updateProduct(id: $id, name: $name, price: $price, remarks: $remarks) {
      id
      name
      price
      remarks
    }
  }
`;

const UpdateProductModal: React.ForwardRefRenderFunction<
  {
    handleOpen: (productId: BigInt) => Promise<void>;
  },
  {
    AllProductQuery: DocumentNode;
    validationSchema: any;
  }
> = ({ AllProductQuery, validationSchema }, ref) => {
  const {
    register: updateRegister,
    handleSubmit: updateHandleSubmit,
    formState: { errors: updateProductValidateErrors },
    reset: resetUpdateForm,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: undefined,
    resolver: yupResolver(validationSchema),
  });

  // 親から呼ばれる関数を定義
  useImperativeHandle(ref, () => ({
    async handleOpen(productId: BigInt) {
      resetUpdateForm();
      resetProductUpdateFormData();
      console.log('productId: ', productId);
      const product = await productFindById({ variables: { id: productId } });
      console.log('productUpdateTarget: ', product);
      const updateTarget = product?.data?.productFindById;
      if (typeof updateTarget !== 'undefined') {
        const { id, name, price, remarks } = updateTarget;
        setProductUpdateFormData({
          id,
          name,
          price,
          remarks,
        });
      }
      setOpen(true);
    },
  }));

  const [
    productFindById,
    { data: productUpdateTarget, loading: productFindByIdLoading },
  ] = useLazyQuery(ProductFindByIdQuery);

  const [updateProductMutation, { error: updateProductError }] = useMutation(
    UpdateProductMutation,
    { refetchQueries: [AllProductQuery] }
  );

  const [open, setOpen] = useState(false);

  const [productUpdateFormData, setProductUpdateFormData] = useState({
    id: 0,
    name: '',
    price: '',
    remarks: '',
  });

  const resetProductUpdateFormData = () =>
    setProductUpdateFormData({
      id: 0,
      name: '',
      price: '',
      remarks: '',
    });

  const handleClose = () => {
    setOpen(false);
  };

  const updateProduct = async (_data: any) => {
    console.log(_data);

    const { id, name, price, remarks } = _data;
    if ([name, price, remarks].some((value) => typeof value === 'undefined')) {
      return;
    }
    await updateProductMutation({ variables: { id, name, price, remarks } });
  };

  /**
   * ステートの値を value にセットしてるから、この関数を使わないとフォームの値を変更できない
   * ・onChange イベントで、変わったフォームの name と value を取得
   * ・変わったフォームの name と value を使ってステートの値を更新
   * @param event
   */
  const updateHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changeObj = {} as any;
    changeObj[event.target.name] = event.target.value;
    setProductUpdateFormData({ ...productUpdateFormData, ...changeObj });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          width: 2 / 3,
          height: 'auto',
          margin: 'auto',
          padding: 10,
          borderRadius: 3,
        }}
      >
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          UPDATE
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          <form>
            <Input
              type='hidden'
              {...updateRegister('id' as never)}
              value={productUpdateFormData.id}
            ></Input>
            <TextField
              label='name'
              variant='outlined'
              value={productUpdateFormData.name}
              sx={{ width: 1, marginBottom: 1 }}
              {...updateRegister('name' as never, { max: 100 })}
              required
              error={'name' in updateProductValidateErrors}
              helperText={(updateProductValidateErrors as any).name?.message}
              onChange={updateHandleChange}
            ></TextField>
            <TextField
              label='price'
              variant='outlined'
              value={productUpdateFormData.price}
              sx={{ width: 1, marginBottom: 1 }}
              {...updateRegister('price' as never, { max: 50 })}
              required
              error={'price' in updateProductValidateErrors}
              helperText={(updateProductValidateErrors as any).price?.message}
              onChange={updateHandleChange}
            ></TextField>
            <TextField
              label='remarks'
              variant='outlined'
              value={productUpdateFormData.remarks}
              multiline
              rows={5}
              sx={{ width: 1, marginBottom: 1 }}
              {...updateRegister('remarks' as never, { max: 30000 })}
              error={'remarks' in updateProductValidateErrors}
              helperText={(updateProductValidateErrors as any).remarks?.message}
              onChange={updateHandleChange}
            ></TextField>
            <Button
              sx={{ float: 'right' }}
              variant='contained'
              onClick={updateHandleSubmit(updateProduct)}
            >
              UPDATE
            </Button>
          </form>
        </Typography>
      </Box>
    </Modal>
  );
};

export default forwardRef(UpdateProductModal);
