"""Binary search: find a value in a sorted list (demo code for the slides)."""


def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        middle = (low + high) // 2
        if items[middle] == target:
            return middle
        if items[middle] < target:
            low = middle + 1      # keep the right half
        else:
            high = middle - 1     # keep the left half
    return -1                     # not in the list


if __name__ == "__main__":
    numbers = [3, 8, 12, 17, 23, 31, 42, 56]
    print(binary_search(numbers, 23))
