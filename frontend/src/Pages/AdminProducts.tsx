import { useState } from "react";
import AdminAddProductForm from "../components/AdminAddProductForm";
import { Button } from "../components/ui/button";
import { useGetProducts } from "../hooks/useGetProducts";
import Loader from "../components/Loader";
import AdminProductCard from "../components/AdminProductCard";
import axios from "axios";
import { backendUrl } from "../App";

const AdminProducts = () => {
  const {
    isLoading: isProductsLoading,
    products,
    setProducts,
  } = useGetProducts();
  const [isAddProduct, setIsAddProduct] = useState<boolean>(false);

  const removeProduct = async (productId: string) => {
    const oldProducts = products;
    try {
      const newProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(newProducts);
      await axios.delete(`${backendUrl}/api/product/${productId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
      setProducts(oldProducts);
    }
  };

  return (
    <>
      <div className="mx-10">
        <Button
          className="text-lg text-gray-600"
          onClick={() => setIsAddProduct((prev) => !prev)}
          variant="link"
        >
          {!isAddProduct ? "Add product" : "Cancel"}
        </Button>
        {isAddProduct && <AdminAddProductForm setProducts={setProducts} />}
      </div>
      {isProductsLoading && (
        <div className="flex justify-center my-4 items-center">
          <Loader height="80" width="80" color="black" />
          <span className="text-lg font-semibold">Loading products...</span>
        </div>
      )}
      {!isProductsLoading && products.length !== 0 && (
        <div className="flex flex-wrap mx-10 my-4 gap-2 p-2">
          {products.map((product) => {
            return (
              <AdminProductCard
                key={product._id}
                product={product}
                removeProduct={removeProduct}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdminProducts;
