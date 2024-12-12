import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import IndexScreen from './index';
import CartScreen from './cart';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'products') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'midnightblue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="products" component={IndexScreen} />
      <Tab.Screen name="cart" component={CartScreen}/>
    </Tab.Navigator>
  );
}