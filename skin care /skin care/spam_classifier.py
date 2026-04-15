# spam_classifier.py

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Training data
emails = [
    "Win money now",
    "Limited offer just for you",
    "Meeting at 10 am",
    "Project deadline tomorrow",
    "Earn cash fast",
    "Let's discuss work"
]

labels = [1, 1, 0, 0, 1, 0]  # 1 = spam, 0 = not spam

# Convert text to numbers
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

# Train model
model = MultinomialNB()
model.fit(X, labels)

# Test
while True:
    msg = input("\nEnter email: ")
    if msg == "exit":
        break

    msg_vec = vectorizer.transform([msg])
    prediction = model.predict(msg_vec)

    print("Spam 🚫" if prediction[0] == 1 else "Not Spam ✅")