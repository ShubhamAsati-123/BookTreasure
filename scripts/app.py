import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the dataset (update the file path)
try:
    df = pd.read_csv('dataset/books.csv', encoding='utf-8', on_bad_lines='skip')
    st.write("Dataset loaded successfully.")
except Exception as e:
    st.write(f"Error loading dataset: {e}")

# Data Cleaning
df['title'] = df['title'].str.strip().str.lower()
df['authors'] = df['authors'].str.strip().str.lower()
df = df.drop_duplicates(subset=['title']).dropna(subset=['title', 'authors'])

# Combine relevant features into one string
def combine_features(row):
    return f"{row['title']} {row['authors']}"

df['combined_features'] = df.apply(combine_features, axis=1)

# Text Vectorization
vectorizer = TfidfVectorizer(stop_words='english')
features = vectorizer.fit_transform(df['combined_features'])

# Cosine Similarity Calculation
def recommend_books(title, n=5):
    try:
        # Normalize the input title
        normalized_title = title.strip().lower()
        # Find the book index by checking for substring matches
        matches = df[df['title'].str.contains(normalized_title, na=False)]
        if matches.empty:
            return "Book not found in dataset."
        book_index = matches.index[0]
        # Calculate similarity
        cosine_sim = cosine_similarity(features[book_index], features).flatten()
        # Get top N similar books
        similar_books = cosine_sim.argsort()[-n-1:-1][::-1]
        return df.iloc[similar_books][['title', 'authors']]
    except Exception as e:
        return f"Error: {e}"

# Streamlit input box for book title
book_title = st.text_input("Enter book title:")

if book_title:
    recommendations = recommend_books(book_title)
    if isinstance(recommendations, pd.DataFrame):
        st.write(recommendations)
    else:
        st.write(recommendations)

