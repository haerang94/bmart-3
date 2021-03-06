import {
  getProducts,
  getProductById,
  getProductsByCategoryId,
  getPagedProductsByChildCategoryId,
  getPagedProductsByParentCategoryId,
  getNewRelease,
  getPopularItems,
  getRandItems,
  getTimeSaleItems,
  toggleLiked,
  getSearchProducts,
  getLiked,
} from '../product';
import { getOrderlistByUserId } from '../orderlist';
import { getCategoriesParent, getCategoriesChild } from '../category';
import { addCart, getCart, removeCart, updateCart, submitOrder } from '../cart';

export default async function () {
  return {
    Query: {
      Products: async () => await getProducts(),
      Product: async (_, { id }) => await getProductById(id),
      ProductsByCategoryId: async (_, { categoryId, limit }) => await getProductsByCategoryId(categoryId, limit),
      PagedProductsByChildCategoryId: async (_, { categoryId, id, cursor, ordertype, limit, direction }) =>
        await getPagedProductsByChildCategoryId(categoryId, id, cursor, ordertype, limit, direction),
      PagedProductsByParentCategoryId: async (_, { categoryId, id, cursor, ordertype, limit, direction }) =>
        await getPagedProductsByParentCategoryId(categoryId, id, cursor, ordertype, limit, direction),
      CategoriesParent: async () => {
        const categoriesParent = await getCategoriesParent();
        return categoriesParent.map(async (categoryParent) => {
          categoryParent.categoriesChild = await getCategoriesChild(categoryParent.id);
          return categoryParent;
        });
      },
      GetOrderlistByUserId: async (_, { userId }) => await getOrderlistByUserId(userId),
      CategoriesChild: async (_, { parentId }) => await getCategoriesChild(parentId),
      GetNewRelease: async (_, { limit }) => await getNewRelease(limit),
      GetPopularItems: async (_, { limit }) => await getPopularItems(limit),
      GetRandItems: async (_, { limit }) => await getRandItems(limit),
      GetTimeSaleItems: async (_, { limit }) => await getTimeSaleItems(limit),
      GetSearchProducts: async (_, { keyword, limit }) => await getSearchProducts(keyword, limit),
      GetCart: async (_, { userId }) => await getCart(userId),
      GetLiked: async (_, { userId }) => await getLiked(userId),
    },
    Mutation: {
      ToggleLiked: async (_, { userId, id, liked }) => await toggleLiked(userId, id, liked),
      AddCart: async (_, { userId, productId, count }) => await addCart(userId, productId, count),
      RemoveCart: async (_, { userId, productId }) => await removeCart(userId, productId),
      UpdateCart: async (_, { userId, productId, count }) => await updateCart(userId, productId, count),
      SubmitOrder: async (_, { userId }) => await submitOrder(userId),
    },
  };
}
