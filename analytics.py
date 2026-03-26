import streamlit as st
import pymongo
import pandas as pd
import plotly.express as px

# --- 1. PAGE CONFIGURATION ---
st.set_page_config(
    page_title="Srinidhi Retail Analytics",
    page_icon="🥦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for ultra-clean UI
st.markdown("""
<style>
    .block-container { padding-top: 2rem; padding-bottom: 2rem; }
    h1 { color: #2c3e50; font-weight: 800; }
    h3 { color: #34495e; font-weight: 600; }
    div[data-testid="stMetricValue"] { font-size: 32px !important; color: #27ae60; font-weight: 800; }
    div[data-testid="stMetricDelta"] { font-size: 16px !important; }
    .stTabs [data-baseweb="tab-list"] { gap: 24px; }
    .stTabs [data-baseweb="tab"] { font-size: 18px; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

# --- 2. CONNECT TO DATABASE ---
MONGO_URI = "mongodb+srv://siddarth:siddarth@cluster0.r3pfzhf.mongodb.net/vegetableShop"

@st.cache_resource(ttl=15) # Refreshes automatically every 15 seconds
def init_connection():
    return pymongo.MongoClient(MONGO_URI)

client = init_connection()
db = client["vegetableShop"]

def load_data():
    # Load Vegetables
    veg_data = list(db["vegetables"].find())
    veg_df = pd.DataFrame(veg_data) if veg_data else pd.DataFrame()
    if not veg_df.empty and '_id' in veg_df.columns:
        veg_df['_id'] = veg_df['_id'].astype(str)

    # Load Orders
    order_data = list(db["orders"].find())
    order_df = pd.DataFrame(order_data) if order_data else pd.DataFrame()
    if not order_df.empty and '_id' in order_df.columns:
        order_df['_id'] = order_df['_id'].astype(str)
        order_df['orderDate'] = pd.to_datetime(order_df['orderDate'])

    return veg_df, order_df

veg_df, order_df = load_data()

# --- SIDEBAR ---
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/3082/3082060.png", width=80)
st.sidebar.title("Srinidhi Admin")
st.sidebar.markdown("---")
st.sidebar.success("🟢 System Online")
st.sidebar.info("Data auto-refreshes every 15 seconds.")

# --- MAIN DASHBOARD ---
st.title("📈 Business Analytics Dashboard")
st.markdown("Live insights into your sales, customer preferences, and inventory levels.")

tab1, tab2 = st.tabs(["💰 Sales & Revenue", "🥦 Inventory Health"])

# ==========================================
# TAB 1: SALES & REVENUE
# ==========================================
with tab1:
    st.markdown("### Today's Performance")
    
    if order_df.empty:
        st.warning("No orders placed yet. Start selling to see analytics!")
    else:
        # Calculate KPIs
        today = pd.Timestamp.now().normalize()
        recent_orders = order_df[order_df['orderDate'] >= today]
        
        total_revenue = order_df[order_df['status'] != 'Pending']['totalAmount'].sum()
        today_revenue = recent_orders[recent_orders['status'] != 'Pending']['totalAmount'].sum()
        total_orders = len(order_df)
        pending_orders = len(order_df[order_df['status'] == 'Pending'])

        # Top KPI Cards
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Lifetime Revenue", f"₹{total_revenue:,.0f}", "Total Collected")
        c2.metric("Today's Revenue", f"₹{today_revenue:,.0f}", "Last 24h")
        c3.metric("Total Orders", total_orders, "All Time")
        c4.metric("Pending Deliveries", pending_orders, "Requires Action", delta_color="inverse")

        st.markdown("---")
        
        # Sales Charts
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### Payment Methods")
            pay_counts = order_df['paymentMode'].value_counts().reset_index()
            pay_counts.columns = ['Payment Mode', 'Count']
            fig_pay = px.pie(
                pay_counts, names='Payment Mode', values='Count', hole=0.5,
                color_discrete_sequence=['#27ae60', '#f39c12', '#2980b9']
            )
            fig_pay.update_traces(textposition='inside', textinfo='percent+label')
            fig_pay.update_layout(showlegend=False, margin=dict(t=0, b=0, l=0, r=0))
            st.plotly_chart(fig_pay, use_container_width=True)

        with col2:
            st.markdown("#### Order Status Distribution")
            status_counts = order_df['status'].value_counts().reset_index()
            status_counts.columns = ['Status', 'Count']
            fig_status = px.bar(
                status_counts, x='Status', y='Count', 
                color='Status',
                color_discrete_map={'Pending': '#f39c12', 'Packed': '#3498db', 'Delivered': '#27ae60'}
            )
            fig_status.update_layout(showlegend=False, margin=dict(t=20, b=0, l=0, r=0))
            st.plotly_chart(fig_status, use_container_width=True)

# ==========================================
# TAB 2: INVENTORY HEALTH
# ==========================================
with tab2:
    st.markdown("### Stock Overview")
    
    if veg_df.empty:
        st.error("No inventory data found.")
    else:
        total_skus = len(veg_df)
        in_stock = len(veg_df[veg_df['inStock'] == True])
        out_stock = total_skus - in_stock
        
        c1, c2, c3 = st.columns(3)
        c1.metric("Total Unique Items", total_skus)
        c2.metric("Items In Stock", in_stock)
        c3.metric("Out of Stock", out_stock, "- Restock Needed", delta_color="inverse")

        st.markdown("---")

        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### Products by Category")
            cat_counts = veg_df['category'].value_counts().reset_index()
            cat_counts.columns = ['Category', 'Product Count']
            fig_cat = px.bar(
                cat_counts, y='Category', x='Product Count', orientation='h',
                color='Product Count', color_continuous_scale='Greens'
            )
            fig_cat.update_layout(yaxis={'categoryorder':'total ascending'}, margin=dict(t=0, b=0, l=0, r=0))
            st.plotly_chart(fig_cat, use_container_width=True)

        with col2:
            st.markdown("#### In-Stock vs Out-of-Stock")
            stock_counts = veg_df['inStock'].map({True: 'In Stock', False: 'Out of Stock'}).value_counts().reset_index()
            stock_counts.columns = ['Status', 'Count']
            fig_stock = px.pie(
                stock_counts, names='Status', values='Count', hole=0.6,
                color='Status', color_discrete_map={'In Stock': '#27ae60', 'Out of Stock': '#e74c3c'}
            )
            fig_stock.update_layout(margin=dict(t=0, b=0, l=0, r=0))
            st.plotly_chart(fig_stock, use_container_width=True)
            
        st.markdown("#### Search Inventory")
        search = st.text_input("Type an item name...")
        if search:
            display_df = veg_df[veg_df['name'].str.contains(search, case=False)]
        else:
            display_df = veg_df
            
        st.dataframe(
            display_df[['name', 'category', 'price', 'unit', 'inStock']],
            column_config={
                "price": st.column_config.NumberColumn("Price (₹)", format="₹%d"),
                "inStock": st.column_config.CheckboxColumn("Available")
            },
            use_container_width=True,
            hide_index=True
        )