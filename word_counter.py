import collections

text = input()

words = text.split()

wordsCount = collections.Counter(words)

print("\n",wordsCount)

frequent_words = {word: count for word, count in wordsCount.items() if count >= 4 and len(word)>=3}

print("\n",frequent_words)
