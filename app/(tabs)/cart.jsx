import { FlatList, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as db from '../../db';

const CartItem = ({ item }) => (
  <View style={styles.cartItem}>
    <Image source={{ uri: product.image }} style={styles.cartImage} />
    <View>
      <Text>{item.title}</Text>
      <Text>${item.price.toFixed(2)} x {item.quantity}</Text>
    </View>
  </View>
);

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartItems = await db.getCartItems();
        setCartItems(cartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
        setDbError(error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (dbError) {
    return <Text>Database Error: {dbError.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  cartItem: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 },
  cartImage: { width: 80, height: 80, marginRight: 10 },
});