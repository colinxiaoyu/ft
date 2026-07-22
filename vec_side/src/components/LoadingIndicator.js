import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { pubSub } from '../utils/pubsub';

const LoadingIndicator = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showLoading = () => setLoading(true);

    const hideLoading = () => setLoading(false);

    pubSub.subscribe('SHOW_LOADING', showLoading);
    pubSub.subscribe('HIDE_LOADING', hideLoading);

    return () => {
      pubSub.unsubscribe('SHOW_LOADING', showLoading);
      pubSub.unsubscribe('HIDE_LOADING', hideLoading);
    };
  }, []);

  if (!loading) return null;

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    zIndex: 9999,
  },
});

export default LoadingIndicator;
