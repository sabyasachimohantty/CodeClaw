# CODE HERE #

nums = list(map(int, input().split(',')))
target = int(input())
res = twoSum(nums, target)
res.sort()
print(res)