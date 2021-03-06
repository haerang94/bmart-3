import React, { useState, useEffect, useContext, forwardRef, createRef } from 'react';
import styled from 'styled-components';
import { ArrowBack } from '@styled-icons/boxicons-regular/ArrowBack';
import { Plus } from '@styled-icons/boxicons-regular/Plus';
import { Minus } from '@styled-icons/boxicons-regular/Minus';
import { Link, useHistory } from 'react-router-dom';
import { ToggleProductBuyContext } from 'context/ToggleProductBuyContext';
import { addCommaToNumber } from 'component/share/util';
import { AuthContext } from 'context/AuthContext';

const CartContainer = styled.div`
  background: ${(props) => props.theme.color.gray};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const BackIcon = styled(ArrowBack)`
  width: 30px;
  height: 30px;
  color: ${(props) => props.theme.color.icon};
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  padding: 10px;
  flex-direction: column;
  margin-bottom: 10px;
  background: #fff;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  background: #fff;
`;

const BigTitle = styled.div`
  font-size: ${(props) => props.theme.size.mmd};
  font-weight: bold;
`;

const EachCartItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 8px 0;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Input = (props) => {
  return <input type="checkbox" {...props} />;
};

const StyledInput = styled(Input)`
  display: block;
  cursor: pointer;
  border-radius: 5px;
  padding: 0 5px;
  margin-left: 0;

  & + label:before {
    border: 0.1em solid mediumseagreen;
    border-radius: 0.2em;
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 0.2em;
    vertical-align: bottom;
    color: transparent;
    transition: 0.2s;
    font-size: 0.8em;
    padding: 0.1em;
  }

  & + label:active:before {
    transform: scale(0);
    border: 1px solid mediumseagreen;
  }

  &:checked + label:before {
    background-color: MediumSeaGreen;
    color: #fff;
  }
`;

const Label = styled.label`
  display: block;
  cursor: pointer;
  font-size: ${(props) => props.theme.size.mmd};
`;

const HeaderTitle = styled.h1`
  font-size: ${(props) => props.theme.size.md};
`;

const EmptyBtn = styled.button`
  background: none;
  border: none;
  font-size: ${(props) => props.theme.size.mmd};
`;

const ItemHeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const DeleteBtn = styled.button`
  border: none;
  background: none;
`;

const ItemContainer = styled.div`
  width: 100%;
  display: flex;
`;

const Img = styled.img`
  height: 100px;
  width: 100px;
  margin-right: 10px;
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  & > div > div {
    margin: 3px 0;
  }
`;

const Price = styled.div`
  color: gray;
  font-size: ${(props) => props.theme.size.smd};
`;
const TotalPrice = styled.div`
  font-size: ${(props) => props.theme.size.mmd};
`;

const AmountBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.color.darkGray};
  border-radius: 12px;
  height: 30px;
  width: 80px;
`;
const StyledPlus = styled(Plus)`
  height: 14px;
  width: 15px;
`;
const StyledMinus = styled(Minus)`
  height: 14px;
  width: 15px;
  color: ${(props) => (props.isOne ? '#ddd' : 'black')};
`;

const OrderBtn = styled.button`
  position: fixed;
  bottom: 30px;
  width: 95%;
  height: 35px;
  background: ${(props) => props.theme.color.middlePink};
  color: #fff;
  border: none;
  border-radius: 5px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Cart = ({ content }) => {
  const [
    ,
    ,
    cartItem,
    setCartItem,
    getCartQuery,
    addCartQuery,
    removeCartQuery,
    updateCartQuery,
    submitOrderQuery,
  ] = useContext(ToggleProductBuyContext);
  const [userInfo] = useContext(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAll, setSelectedAll] = useState(false);
  const selectedRef = {};

  const handleMinusClick = (productId) => {
    if (cartItem[productId].count > 1) {
      const count = cartItem[productId].count - 1;
      updateCartQuery({ variables: { userId: userInfo.id, productId, count } });
    }
  };

  const handlePlusClick = (productId) => {
    const count = cartItem[productId].count + 1;
    updateCartQuery({ variables: { userId: userInfo.id, productId, count } });
  };

  const handleSelectAll = () => {
    console.log(selectedRef);
    if (selectedAll) {
      for (const [key, value] of Object.entries(selectedRef)) {
        console.log(value);
      }
      setSelectedAll(false);
    } else {
      for (const [key, value] of Object.entries(selectedRef)) {
        console.log(value);
      }
      setSelectedAll(true);
    }
  };

  const handleDeleteItem = (productId) => {
    removeCartQuery({ variables: { userId: userInfo.id, productId } });
  };

  const handleSubmitOrder = (userId) => {
    submitOrderQuery({ variables: { userId: userInfo.id } });
  };

  useEffect(() => {
    if (cartItem) {
      const cartItems = [];
      for (const [_, value] of Object.entries(cartItem)) {
        cartItems.push(value);
      }
      let totalPrice = 0;
      const cartProducts = cartItems.map((product) => {
        totalPrice += product.price * product.count;
        selectedRef[product.id] = createRef();
        return (
          <EachCartItem key={`cart-product-${product.id}`}>
            <ItemHeaderRow>
              <LabelContainer>
                <StyledInput name="authorization" value="쓰기권한" />
                <BigTitle>{product.name}</BigTitle>
              </LabelContainer>
              <DeleteBtn onClick={() => handleDeleteItem(product.id)}>삭제</DeleteBtn>
            </ItemHeaderRow>
            <ItemContainer>
              <Img src={product.img_url} />
              <PriceBox>
                <div>
                  <Price>{`${addCommaToNumber(product.price)}`}원</Price>
                  <TotalPrice>합계 {`${addCommaToNumber(product.price * product.count)}`}원</TotalPrice>
                </div>
                <AmountBox>
                  <StyledMinus
                    onClick={() => handleMinusClick(product.id)}
                    isOne={product.count === 1 ? true : false}
                  />
                  {product.count}
                  <StyledPlus onClick={() => handlePlusClick(product.id)} />
                </AmountBox>
              </PriceBox>
            </ItemContainer>
          </EachCartItem>
        );
      });
      setTotalPrice(totalPrice);
      setCartProducts(cartProducts);
    }
  }, [cartItem]);

  const history = useHistory();
  const handleArrowBackIconClick = () => {
    history.goBack();
  };
  return (
    <CartContainer>
      <Header>
        <HeaderRow>
          <BackIcon onClick={handleArrowBackIconClick} />

          <HeaderTitle>장바구니</HeaderTitle>
          <BackIcon style={{ visibility: 'hidden' }} />
        </HeaderRow>
        <HeaderRow>
          <LabelContainer>
            <StyledInput name="authorization" value="쓰기권한" onClick={handleSelectAll} />
            <Label htmlFor="authorization">선택 해제</Label>
          </LabelContainer>
          <EmptyBtn>선택 비우기</EmptyBtn>
        </HeaderRow>
      </Header>
      <Section>{cartProducts}</Section>
      <OrderBtn onClick={() => handleSubmitOrder(userInfo.id)}>{totalPrice}원 배달 주문하기</OrderBtn>
    </CartContainer>
  );
};

export default Cart;
