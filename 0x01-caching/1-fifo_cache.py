#!/usr/bin/env python3
"""
BasicCache
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    Defines a FIFO caching system
    """

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is not None or item is not None:
            if key in self.cache_data:
                self.cache_data[key] = item
            else:
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    first_key = self.order.pop(0)
                    del self.cache_data[first_key]
                    print(f"DISCARD: {first_key}")
                self.cache_data[key] = item
                self.order.append(key)

    def get(self, key):
        """ Get an item by key"""
        if key is not None or key not in self.cache_data:
            return None
        return self.cache_data[key]
