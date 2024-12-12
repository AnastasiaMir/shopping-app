import { FlatList, View, Text, Pressable, ActivityIndicator, RefreshControl, StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as dbModule from '../../db';

const ProductCard = ({ product, addToCart }) => (
  <View style={styles.productCard}>
    
    <View style={styles.productUpperContainer}>
    <Image source={{ uri: product.image }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{product.title}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
    </View>
    </View>
    <Pressable onPress={() => addToCart(product)} style={styles.addToCartButton}>
      <Text style={styles.addToCartButtonText}>Add to Cart</Text>
    </Pressable>
  </View>
);

export default function IndexScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbInstance, setDbInstance] = useState(null);
  const [dbError, setDbError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
          const database = await dbModule.initDB();
          setDbInstance(database);
      } catch (error) {
          console.error("DB Init Error:", error);
          setDbError(error);
      }
    };

    


    initApp();
    fetchProducts();

    return () => dbModule.closeDB();
  }, []);

  const addToCart = async (product) => {
    if (!dbInstance) return; 
    try {
      await dbModule.addToCart(product); 
    } catch (error) {
      console.error("Error in addToCart:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (dbError) {
    return <Text>Database Error: {dbError.message}</Text>;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} addToCart={addToCart} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  productCard: { flexDirection: 'column', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  productUpperContainer: {flexDirection: 'row'},
  productImage: { width: 100, height: 100, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold' },
  productPrice: { color: 'green' },
  productDescription: { fontSize: 12 },
  addToCartButton: { backgroundColor: 'midnightblue', marginLeft: 150, padding: 5, borderRadius: 5, marginTop: 10, width: '60%', justifyContent: 'center', flexDirection: 'row-reverse'},
  addToCartButtonText: { color: 'white' },
});