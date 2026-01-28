import streamlit as st
import pymongo
import pandas as pd
import plotly.express as px  # 🔥 NEW: For beautiful interactive charts

# --- 1. PAGE CONFIGURATION ---
st.set_page_config(
    page_title="Srinidhi Retail Dashboard",
    page_icon="🥦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS to make it look nicer
st.markdown("""
<style>
    .block-container {padding-top: 1rem;}
    div[data-testid="stMetricValue"] {font-size: 24px;}
</style>
""", unsafe_allow_html=True)

# --- 2. CONNECT TO DATABASE ---
MONGO_URI = "mongodb+srv://siddarth:siddarth@cluster0.r3pfzhf.mongodb.net/vegetableShop"

@st.cache_data(ttl=60)
def load_data():
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client["vegetableShop"]
        collection = db["vegetables"]
        data = list(collection.find())
        
        if data:
            df = pd.DataFrame(data)
            if '_id' in df.columns:
                df['_id'] = df['_id'].astype(str)
            return df
        else:
            return pd.DataFrame()
    except Exception as e:
        st.error(f"DB Error: {e}")
        return pd.DataFrame()

# --- 3. LOAD & PREPARE DATA ---
df = load_data()

# Sidebar Styling
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/3082/3082060.png", width=100)
st.sidebar.title("🥦 Srinidhi Admin")
st.sidebar.write("Real-time Inventory Intelligence")

if df.empty:
    st.info("Waiting for data connection...")
    st.stop()

# --- 4. MAIN DASHBOARD ---
st.title("🚀 Inventory Performance Dashboard")
st.markdown("Live view of stock levels, pricing, and category distribution.")

# Create TABS for better organization
tab1, tab2 = st.tabs(["📊 Executive Overview", "📋 Detailed Inventory"])

with tab1:
    # --- TOP ROW: KPI CARDS ---
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("📦 Total Items", len(df), delta="Active SKUs")
    with col2:
        in_stock_count = len(df[df['inStock'] == True])
        st.metric("✅ In Stock", in_stock_count, delta="Available for Order")
    with col3:
        out_stock_count = len(df[df['inStock'] == False])
        st.metric("🚨 Out of Stock", out_stock_count, delta_color="inverse", delta="- Lost Sales Risk")
    with col4:
        avg_price = df['price'].mean()
        st.metric("💰 Avg. Price", f"₹{avg_price:.0f}", delta="Market Rate")

    st.divider()

    # --- MIDDLE ROW: INTERACTIVE CHARTS ---
    c1, c2 = st.columns([1, 1])

    with c1:
        st.subheader("Inventory Distribution")
        # 🔥 Interactive Donut Chart
        stock_counts = df['inStock'].map({True: 'In Stock', False: 'Out of Stock'}).value_counts().reset_index()
        stock_counts.columns = ['Status', 'Count']
        
        fig_donut = px.pie(
            stock_counts, 
            names='Status', 
            values='Count', 
            hole=0.5, # Makes it a donut
            color='Status',
            color_discrete_map={'In Stock': '#2ecc71', 'Out of Stock': '#e74c3c'}
        )
        st.plotly_chart(fig_donut, use_container_width=True)

    with c2:
        st.subheader("Price Analysis by Category")
        if 'category' in df.columns:
            cat_avg = df.groupby('category')['price'].mean().reset_index().sort_values(by='price', ascending=True)
            
            # 🔥 Interactive Bar Chart
            fig_bar = px.bar(
                cat_avg, 
                x='price', 
                y='category', 
                orientation='h', 
                text='price',
                color='price',
                color_continuous_scale='Blues'
            )
            fig_bar.update_traces(texttemplate='₹%{text:.0f}', textposition='outside')
            st.plotly_chart(fig_bar, use_container_width=True)

with tab2:
    st.subheader("📋 Search & Filter Inventory")
    
    # Advanced Filtering
    search = st.text_input("🔍 Search Vegetable Name", "")
    
    if search:
        filtered_df = df[df['name'].str.contains(search, case=False)]
    else:
        filtered_df = df

    # Display Data with "Price Bar" visualization
    st.dataframe(
        filtered_df[['name', 'category', 'price', 'unit', 'inStock']],
        column_config={
            "price": st.column_config.ProgressColumn(
                "Price Level",
                help="Price relative to other items",
                format="₹%f",
                min_value=0,
                max_value=300,
            ),
            "inStock": st.column_config.CheckboxColumn(
                "Availability",
                help="Is the item currently in stock?"
            )
        },
        use_container_width=True,
        hide_index=True
    )