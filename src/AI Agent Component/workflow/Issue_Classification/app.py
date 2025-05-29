import streamlit as st
import pandas as pd
import time
import random  # For demo API simulation - replace with actual API calls
import unicodedata
import requests

st.set_page_config(layout="wide", page_title="Issue Classification")

# Set up the sidebar
with st.sidebar:
    st.title("Issue Classification")
    
    uploaded_file = st.file_uploader("Upload your CSV file", type=["csv"])
    
    process_button = st.button("Process with AI", disabled=uploaded_file is None)
    
    progress_container = st.container()

# Main area setup
main_container = st.container()

# Function to clean text by handling encoding issues
def clean_text(text):
    if isinstance(text, str):
        # Replace common problematic characters
        text = text.replace("�", "'")
        # Normalize unicode characters
        text = unicodedata.normalize('NFKD', text)
        return text
    return text

def call_webhook_api(text, human_label):
    try:
        # Prepare the payload
        payload = {
            "text": text,
            "human_label": human_label
        }
        
        # Make the API call
        response = requests.post("https://n8n.forwen.com/webhook/24b3d90f-9f0d-42c9-adf1-4153cc43d3ff", json=payload)
        
        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            return result.get("ai_label", ""), result.get("match", False)
        else:
            st.error(f"API Error: {response.status_code} - {response.text}")
            return "Error", False
    except Exception as e:
        st.error(f"API Call Failed: {str(e)}")
        return "Error", False

# Process the data
if uploaded_file is not None:
    # Read the CSV file with encoding options
    try:
        # Try different encodings if needed
        try:
            df = pd.read_csv(uploaded_file, encoding='utf-8')
        except UnicodeDecodeError:
            df = pd.read_csv(uploaded_file, encoding='latin-1')
        
        # Clean the text column to fix encoding issues
        if "text" in df.columns:
            df["text"] = df["text"].apply(clean_text)
        
        # Check if required columns exist
        required_columns = ["text", "human_label"]
        if not all(col in df.columns for col in required_columns):
            st.error("CSV must contain 'text' and 'human_label' columns.")
        else:
            # Add AI label and match columns if they don't exist
            if "ai_label" not in df.columns:
                df["ai_label"] = ""
            if "match" not in df.columns:
                df["match"] = ""
            
            # Display initial table with empty AI labels
            with main_container:
                st.subheader("Label Comparison Results")
                table_placeholder = st.empty()
                
                # Use st.table instead of st.dataframe for better display without truncation
                table_placeholder.table(df[["text", "human_label", "ai_label", "match"]])
            
            # Process rows when button is clicked
            if process_button:
                with progress_container:
                    progress_bar = st.progress(0)
                    status_text = st.empty()
                    
                    # Process each row
                    for i, row in enumerate(df.itertuples()):
                        # Update status
                        progress_value = (i + 1) / len(df)
                        progress_bar.progress(progress_value)
                        status_text.text(f"Processing row {i+1} of {len(df)}...")
                        
                         # Call the webhook API
                        ai_label, match = call_webhook_api(row.text, row.human_label)
                        
                        # Update dataframe
                        df.at[i, "ai_label"] = ai_label
                        df.at[i, "match"] = match
                        
                        # Update display after each row
                        display_df = df.copy()
                        display_df["match"] = display_df["match"].apply(
                            lambda x: "✓" if x is True else ("✗" if x is False else "")
                        )
                        table_placeholder.table(display_df[["text", "human_label", "ai_label", "match"]])
                    
                    # Complete
                    status_text.text("Processing complete!")
                    
                    # Calculate and display statistics
                    match_count = df["match"].sum()
                    match_percentage = (match_count / len(df)) * 100
                    
                    with main_container:
                        st.success(f"Processed {len(df)} rows")
                        col1, col2, col3 = st.columns(3)
                        
                        with col1:
                            st.metric("AI-Human Agreement", f"{match_percentage:.1f}%", f"{match_count}/{len(df)} rows")
                        with col2:
                            st.metric("Mismatches", f"{len(df) - match_count}", f"{100 - match_percentage:.1f}%")
                        with col3:
                            csv = df.to_csv(index=False).encode('utf-8')
                            st.download_button(
                                label="Download Results as CSV",
                                data=csv,
                                file_name="label_comparison_results.csv",
                                mime="text/csv"
                            )
                   
    except Exception as e:
        st.error(f"Error processing file: {e}")
else:
    # Display instructions when no file is uploaded
    with main_container:
        st.info("👈 Please upload a CSV file with 'text' and 'human_label' columns to begin.")
        st.write("This demo will process each row and compare human labels with AI-generated labels.")