# Mini Project: House Price Prediction using Linear Regression

# Step 1: Import Libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Step 2: Create Dataset
data = {
    "Size_sqft": [500, 800, 1000, 1200, 1500, 1800, 2000, 2200],
    "Price_lakhs": [50, 80, 100, 120, 150, 180, 200, 220]
}

df = pd.DataFrame(data)

# Step 3: Define Features (X) and Target (y)
X = df[["Size_sqft"]]
y = df["Price_lakhs"]

# Step 4: Train Model
model = LinearRegression()
model.fit(X, y)

# Step 5: Predictions
predictions = model.predict(X)

# Step 6: Evaluate Model
print("Slope (m):", model.coef_[0])
print("Intercept (c):", model.intercept_)
print("Mean Squared Error:", mean_squared_error(y, predictions))
print("R2 Score:", r2_score(y, predictions))

# Step 7: Predict New House Price
new_size = np.array([[2500]])
predicted_price = model.predict(new_size)
print("Predicted price for 2500 sqft house:", predicted_price[0], "lakhs")

# Step 8: Visualization
plt.scatter(X, y, color="blue", label="Actual Data")
plt.plot(X, predictions, color="red", label="Regression Line")
plt.xlabel("House Size (sqft)")
plt.ylabel("Price (lakhs)")
plt.title("Linear Regression - House Price Prediction")
plt.legend()
plt.show()