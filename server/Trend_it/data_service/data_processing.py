import os
import sqlite3
import pandas as pd
import numpy as np
from scipy.stats import zscore
from tslearn.clustering import TimeSeriesKMeans

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASE_FILE = os.path.join(BASE_DIR, 'data_service', 'data_database.db')
TIME_SERIES_COLUMNS = [str(year) for year in range(2010, 2021)]
N_CLUSTERS = 30


def load_data_from_db():
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        df = pd.read_sql("SELECT * FROM data_table", conn)
        conn.close()
        return df
    except Exception as e:
        raise RuntimeError(f"Failed to load database: {str(e)}")


def normalize_data(df):
    time_series_data = df[TIME_SERIES_COLUMNS].values

    if np.isnan(time_series_data).any():
        valid_rows = ~np.isnan(time_series_data).any(axis=1)
        time_series_data = time_series_data[valid_rows]
        df = df.loc[valid_rows]

    smoothed_data = np.apply_along_axis(
        lambda row: pd.Series(row).rolling(window=3, min_periods=1).mean().values,
        axis=1,
        arr=time_series_data,
    )

    normalized_data = np.array([zscore(row, nan_policy="omit") for row in smoothed_data])

    valid_rows = ~np.isnan(normalized_data).any(axis=1)
    if not valid_rows.all():
        normalized_data = normalized_data[valid_rows]
        df = df.loc[valid_rows]

    df["Normalized_Data"] = [",".join(map(str, row)) for row in normalized_data]
    return df


def cluster_data(df):
    normalized_data_array = np.array(
        [list(map(float, row.split(","))) for row in df["Normalized_Data"]]
    ).reshape((df.shape[0], len(TIME_SERIES_COLUMNS), 1))

    kmeans_dtw = TimeSeriesKMeans(
        n_clusters=N_CLUSTERS, metric="dtw", verbose=False, random_state=42
    )
    df["Cluster"] = kmeans_dtw.fit_predict(normalized_data_array)
    return df


def save_data_to_db(df):
    conn = sqlite3.connect(DATABASE_FILE)
    df.to_sql("data_table", conn, if_exists="replace", index=False)
    conn.commit()
    conn.close()


def process_and_save_if_needed():
    df = load_data_from_db()

    needs_processing = False
    if "Normalized_Data" not in df.columns or df["Normalized_Data"].isna().all():
        print("No normalized data found. Normalizing...")
        df = normalize_data(df)
        needs_processing = True

    if "Cluster" not in df.columns or df["Cluster"].isna().all():
        print("No cluster data found. Clustering...")
        df = cluster_data(df)
        needs_processing = True

    if needs_processing:
        print("Saving updated data back to the database...")
        save_data_to_db(df)
        print("Data processing completed successfully.")

    return df