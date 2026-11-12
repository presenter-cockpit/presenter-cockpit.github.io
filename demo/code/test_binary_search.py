"""Run with: python3 -m unittest test_binary_search"""
import unittest

from binary_search import binary_search


class BinarySearchTest(unittest.TestCase):
    numbers = [3, 8, 12, 17, 23, 31, 42, 56]

    def test_found(self):
        self.assertEqual(binary_search(self.numbers, 23), 4)

    def test_first_and_last(self):
        self.assertEqual(binary_search(self.numbers, 3), 0)
        self.assertEqual(binary_search(self.numbers, 56), 7)

    def test_missing(self):
        self.assertEqual(binary_search(self.numbers, 5), -1)
        self.assertEqual(binary_search([], 5), -1)


if __name__ == "__main__":
    unittest.main()
