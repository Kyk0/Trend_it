import numpy as np
from tslearn.metrics import soft_dtw

def parse_attributes(attributes):
    return set(attr.strip().lower() for attr in attributes.split(','))

def has_common_attributes(attrs1, attrs2):
    return bool(attrs1 & attrs2)

def find_nearest_neighbor_with_heuristics(df, random_row_index):
    random_row = df.iloc[random_row_index]
    random_cluster = random_row["Cluster"]
    random_attributes = parse_attributes(random_row["Attributes"])
    random_series_normalized = np.array(
        list(map(float, random_row["Normalized_Data"].split(',')))
    )

    cluster_data = df[(df["Cluster"] == random_cluster) & (df.index != random_row_index)]
    candidates = cluster_data[
        ~cluster_data["Attributes"].apply(
            lambda x: has_common_attributes(random_attributes, parse_attributes(x))
        )
    ]

    if candidates.empty:
        return None, None

    best_candidate = None
    best_score = float("inf")

    for candidate_index, candidate_row in candidates.iterrows():
        candidate_series_normalized = np.array(
            list(map(float, candidate_row["Normalized_Data"].split(',')))
        )
        score = soft_dtw(random_series_normalized, candidate_series_normalized, gamma=1.0)
        if score < best_score:
            best_score = score
            best_candidate = candidate_row

    return random_row, best_candidate

def get_two_rows(df):
    random_index = np.random.randint(len(df))
    random_row, nearest_row = find_nearest_neighbor_with_heuristics(df, random_index)
    if nearest_row is None:
        return None, None
    return random_row.to_dict(), nearest_row.to_dict()